import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { getCategories } from '../lib/products.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <header className="page-head page-head-yellow">
        <div className="container">
          <span className="eyebrow">Catalogue</span>
          <h1>Browse our categories</h1>
          <p>
            Onboarding gifts, festival hampers and office utilities — curated for companies of
            every size.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="page-loading">Loading categories…</p>
          ) : (
            <div className="category-grid category-grid-large">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="category-card"
                >
                  <span className="category-icon">
                    <CategoryIcon slug={category.slug} size={34} />
                  </span>
                  <h3>{category.name}</h3>
                  <p>{category.description || category.tagline}</p>
                  <span className="category-link">Browse products →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
