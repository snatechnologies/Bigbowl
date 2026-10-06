import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BowlMark } from '../components/Logo.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import { getProductBySlug, formatPrice } from '../lib/products.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="section">
        <div className="container page-loading">Loading product…</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section">
        <div className="container not-found">
          <p className="eyebrow">Product</p>
          <h1>Product not found.</h1>
          <p>This product may have been removed or is not published yet.</p>
          <Link className="btn btn-red" to="/categories">
            Browse catalogue
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section product-detail-section">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/categories">Categories</Link>
          {product.categories && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/categories/${product.categories.slug}`}>{product.categories.name}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-detail-media">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="thumb-placeholder thumb-placeholder-large">
                <BowlMark size={120} />
              </div>
            )}
          </div>

          <div className="product-detail-info">
            {product.categories && <span className="chip">{product.categories.name}</span>}
            <h1>{product.name}</h1>
            <p className="product-detail-price">
              ₹{formatPrice(product.price)} <small>per unit · bulk pricing available</small>
            </p>
            <p className="product-detail-desc">{product.description}</p>
            <ul className="product-detail-points">
              <li>Custom branding with your company logo</li>
              <li>Bulk and scheduled deliveries across Chennai</li>
              <li>GST invoice for corporate orders</li>
            </ul>
            <div className="product-detail-actions">
              <a href="#enquire" className="btn btn-red">
                Enquire about this product
              </a>
            </div>
          </div>
        </div>

        <div id="enquire" className="product-detail-enquiry">
          <EnquiryForm product={product} heading="Enquire about this product" />
        </div>
      </div>
    </main>
  );
}
