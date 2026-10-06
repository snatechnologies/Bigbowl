import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getCategoryBySlug, getProductsByCategory } from '../lib/products.js';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCategoryBySlug(slug), getProductsByCategory(slug)]).then(
      ([cat, prods]) => {
        setCategory(cat);
        setProducts(prods);
        setLoading(false);
      }
    );
  }, [slug]);

  if (loading) {
    return (
      <main className="section">
        <div className="container page-loading">Loading…</div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="section">
        <div className="container not-found">
          <p className="eyebrow">Category</p>
          <h1>Category not found.</h1>
          <p>The category you are looking for does not exist.</p>
          <Link className="btn btn-red" to="/categories">
            View all categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <header className="page-head page-head-yellow">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/categories">Categories</Link>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </nav>
          <span className="eyebrow">{category.tagline}</span>
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </header>

      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">
              <h2>Products coming soon</h2>
              <p>
                We are stocking this category. Call us and we will put together what you need.
              </p>
              <Link to="/contact" className="btn btn-red">
                Contact us
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
