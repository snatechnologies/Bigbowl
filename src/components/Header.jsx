import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogoImage } from './Logo.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand-lockup" onClick={close} aria-label="Bigbowl home">
          <LogoImage height={54} />
        </Link>

        <button
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              onClick={close}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn-red btn-sm nav-cta" onClick={close}>
            Enquire Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
