import { BRANDS } from '../data/brands.js';
import { LogoImage } from './Logo.jsx';

/** Yellow band with a white card and red "BRANDS" pill — mirrors the card back. */
export default function BrandsBand() {
  return (
    <section className="brands-band">
      <div className="container">
        <div className="brands-card">
          <div className="brands-card-top">
            <LogoImage width={116} />
            <span className="brands-pill">BRANDS</span>
          </div>
          <ul className="brands-list">
            {BRANDS.map((brand) => (
              <li key={brand.name}>
                <span className="brands-name">{brand.name}</span>
                <img
                  className="brands-logo"
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
