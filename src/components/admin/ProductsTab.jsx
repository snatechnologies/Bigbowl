import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient.js';
import { formatPrice } from '../../lib/products.js';
import { LogoImage } from '../Logo.jsx';

function Toggle({ checked, onChange, label }) {
  return (
    <label className="switch" title={label}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateFlag = async (product, field, value) => {
    // Optimistic update
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, [field]: value } : p)));
    const { error: updateError } = await supabase
      .from('products')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', product.id);
    if (updateError) {
      setError(updateError.message);
      load();
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) setError(deleteError.message);
    else setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  if (loading) return <p className="page-loading">Loading products…</p>;

  return (
    <>
      {error && <p className="admin-message admin-message-error">{error}</p>}
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Add your first product to start building the catalogue.</p>
          <Link to="/admin/products/new" className="btn btn-red">
            Add product
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Published</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-thumb">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="admin-thumb" />
                      ) : (
                        <LogoImage width={36} />
                      )}
                    </div>
                  </td>
                  <td className="admin-product-name">
                    {product.name}
                    <small>/{product.slug}</small>
                    <span
                      className={`badge ${product.is_published ? 'badge-published' : 'badge-draft'}`}
                    >
                      {product.is_published ? 'Published' : 'Draft'}
                    </span>
                    {product.is_featured && <span className="badge badge-featured">Featured</span>}
                  </td>
                  <td>{product.categories?.name || '—'}</td>
                  <td>₹{formatPrice(product.price)}</td>
                  <td>
                    <Toggle
                      label="Published"
                      checked={product.is_published}
                      onChange={(v) => updateFlag(product, 'is_published', v)}
                    />
                  </td>
                  <td>
                    <Toggle
                      label="Featured on homepage"
                      checked={product.is_featured}
                      onChange={(v) => updateFlag(product, 'is_featured', v)}
                    />
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link className="link-btn" to={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="link-btn link-btn-danger"
                        onClick={() => remove(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
