import { BRANDS } from '../data/brands.js';
import { BowlMark } from './Logo.jsx';

/** Yellow band with a white card and red "BRANDS" pill — mirrors the card back. */
export default function BrandsBand() {
  return (
    <section className="brands-band">
      <div className="container">
        <div className="brands-card">
          <div className="brands-card-top">
            <BowlMark size={56} />
            <span className="brands-pill">BRANDS</span>
          </div>
          <ul className="brands-list">
            {BRANDS.map((brand) => (
              <li key={brand}>{brand}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
