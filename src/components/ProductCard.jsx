import { Link } from 'react-router-dom';
import { BowlMark } from './Logo.jsx';
import { formatPrice } from '../lib/products.js';

export default function ProductCard({ product }) {
  const categoryName = product.categories?.name;
  const href = `/products/${product.slug || product.id}`;

  return (
    <article className="product-card">
      <Link to={href} className="product-thumb" aria-label={product.name}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <div className="thumb-placeholder">
            <BowlMark size={64} />
          </div>
        )}
      </Link>
      <div className="product-info">
        {categoryName && <span className="chip">{categoryName}</span>}
        <h3>
          <Link to={href}>{product.name}</Link>
        </h3>
        {product.description && (
          <p className="product-desc">
            {product.description.length > 90
              ? `${product.description.slice(0, 90).trim()}…`
              : product.description}
          </p>
        )}
        <div className="product-foot">
          <span className="price">₹{formatPrice(product.price)}</span>
          <Link to={href} className="btn btn-yellow btn-sm">
            View &amp; Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
