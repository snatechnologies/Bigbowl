import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase, PRODUCT_IMAGE_BUCKET } from '../../lib/supabaseClient.js';

const EMPTY = {
  name: '',
  slug: '',
  category_id: '',
  price: '',
  description: '',
  image_url: '',
  is_published: false,
  is_featured: false,
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error' | 'ok', text }

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setCategories(data || []));

    if (isEditing) {
      supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) setMessage({ type: 'error', text: error.message });
          else if (data) {
            setForm({
              name: data.name || '',
              slug: data.slug || '',
              category_id: data.category_id || '',
              price: data.price ?? '',
              description: data.description || '',
              image_url: data.image_url || '',
              is_published: data.is_published,
              is_featured: data.is_featured,
            });
            if (data.image_url) setPreview(data.image_url);
          }
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'name' && !slugEdited) next.slug = slugify(value);
      return next;
    });
  };

  const onSlugChange = (event) => {
    setSlugEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }));
  };

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(form.image_url || '');
    }
  };

  const uploadImage = async (file, slug) => {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${slug}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);

    try {
      let imageUrl = form.image_url || null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, form.slug || slugify(form.name));
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        category_id: form.category_id || null,
        price: Number(form.price) || 0,
        description: form.description.trim(),
        image_url: imageUrl,
        is_published: form.is_published,
        is_featured: form.is_featured,
        updated_at: new Date().toISOString(),
      };

      const { error } = isEditing
        ? await supabase.from('products').update(payload).eq('id', id)
        : await supabase.from('products').insert(payload);

      if (error) throw error;
      navigate('/admin', { replace: true });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Could not save the product.' });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container page-loading">Loading product…</div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Back office</span>
            <h1>{isEditing ? 'Edit product' : 'Add product'}</h1>
          </div>
          <Link to="/admin" className="btn btn-outline btn-sm">
            ← Back to dashboard
          </Link>
        </div>

        <form className="admin-form" onSubmit={onSubmit}>
          {message && (
            <p className={`admin-message admin-message-${message.type}`}>{message.text}</p>
          )}

          <div className="admin-form-row">
            <label>
              Product name *
              <input name="name" value={form.name} onChange={update} required placeholder="e.g. Diwali Delight Hamper" />
            </label>
            <label>
              URL slug *
              <input name="slug" value={form.slug} onChange={onSlugChange} required placeholder="diwali-delight-hamper" />
            </label>
          </div>

          <div className="admin-form-row">
            <label>
              Category *
              <select name="category_id" value={form.category_id} onChange={update} required>
                <option value="">Select a category…</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price (₹, per unit) *
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={update}
                required
                min="0"
                step="1"
                placeholder="899"
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={update}
              placeholder="Short, customer-facing description of the product…"
            />
          </label>

          <label>
            Product image
            {preview && <img src={preview} alt="Product preview" className="image-preview" />}
            <input type="file" accept="image/*" onChange={onImageChange} />
          </label>

          <div className="admin-checks">
            <label className="admin-check">
              <input type="checkbox" name="is_published" checked={form.is_published} onChange={update} />
              Published (visible on the website)
            </label>
            <label className="admin-check">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={update} />
              Featured (shown on the homepage)
            </label>
          </div>

          <button type="submit" className="btn btn-red" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add product'}
          </button>
        </form>
      </div>
    </main>
  );
}
