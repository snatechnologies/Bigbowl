import { Link } from 'react-router-dom';
import { LogoImage } from './Logo.jsx';
import { CONTACT } from '../data/contact.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <LogoImage height={64} variant="light" />
          </div>
          <p>
            Corporate gifts and office utilities from the brands your team already loves —
            curated, branded and delivered in bulk.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/categories/onboarding-gifts">Onboarding Gifts</Link>
          <Link to="/categories/festival-gifts">Festival Gifts</Link>
          <Link to="/categories/office-utilities">Office Utilities</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p className="footer-contact-person">
            {CONTACT.person} — {CONTACT.role}
          </p>
          <a href={CONTACT.phoneHref}>PH {CONTACT.phoneRaw}</a>
          <address>
            {CONTACT.addressLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
        </div>
      </div>

      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <span>© {new Date().getFullYear()} Saiambro Bigbowl. All rights reserved.</span>
          <Link to="/admin/login" className="footer-admin-link">
            Back Office
          </Link>
        </div>
      </div>
    </footer>
  );
}
