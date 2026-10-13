import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoImage } from '../components/Logo.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import BrandsBand from '../components/BrandsBand.jsx';
import { getCategories, getFeaturedProducts } from '../lib/products.js';
import { CONTACT } from '../data/contact.js';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getFeaturedProducts().then(setFeatured);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-panel">
              <span className="eyebrow">Saiambro Bigbowl — Chennai</span>
              <h1>
                Big Deals. <span className="accent">Big Savings.</span>
              </h1>
              <p className="lede">
                Corporate gifts and office utilities your team will actually love — onboarding
                kits, festival hampers and everyday essentials from brands you already trust,
                at bulk prices.
              </p>
              <div className="hero-actions">
                <Link to="/categories" className="btn btn-red">
                  Browse Categories
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Enquire Now
                </Link>
              </div>
            </div>
            <div className="hero-logo">
              <LogoImage width={320} />
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>9+</strong>
              <span>Trusted partner brands</span>
            </div>
            <div className="hero-stat">
              <strong>3</strong>
              <span>Curated categories</span>
            </div>
            <div className="hero-stat">
              <strong>Bulk</strong>
              <span>Custom &amp; branded orders</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category highlights ── */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">What we supply</span>
            <h2>Shop by category</h2>
            <p>Three focused catalogues covering every corporate gifting and utility need.</p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="category-card"
              >
                <span className="category-icon">
                  <CategoryIcon slug={category.slug} size={30} />
                </span>
                <h3>{category.name}</h3>
                <p>{category.tagline}</p>
                <span className="category-link">Browse products →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className="section section-tinted">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Handpicked</span>
              <h2>Featured products</h2>
              <p>Popular picks our corporate customers keep reordering.</p>
            </div>
            <div className="product-grid">
              {featured.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/categories" className="btn btn-outline">
                View full catalogue
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Brands (mirrors the back of the visiting card) ── */}
      <BrandsBand />

      {/* ── CTA band ── */}
      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2>Planning bulk gifting for your team?</h2>
            <p>
              Talk to {CONTACT.person} ({CONTACT.role}) for quotes, custom branding and
              delivery schedules.
            </p>
          </div>
          <div className="cta-band-actions">
            <a href={CONTACT.phoneHref} className="btn btn-yellow">
              Call {CONTACT.phoneDisplay}
            </a>
            <Link to="/contact" className="btn btn-ghost">
              Send an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
