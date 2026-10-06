import EnquiryForm from '../components/EnquiryForm.jsx';
import { CONTACT } from '../data/contact.js';

export default function Contact() {
  return (
    <>
      <header className="page-head page-head-yellow">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Let’s talk about your requirement</h1>
          <p>Call us directly or send an enquiry — we usually respond within one business day.</p>
        </div>
      </header>

      <section className="section">
        <div className="container contact-grid">
          <aside className="contact-card">
            <h2>{CONTACT.person}</h2>
            <p className="contact-role">{CONTACT.role}</p>
            <span className="contact-underline" aria-hidden="true" />

            <ul className="contact-list">
              <li>
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
                  </svg>
                </span>
                <div>
                  <strong>Phone</strong>
                  <a href={CONTACT.phoneHref}>PH {CONTACT.phoneRaw}</a>
                </div>
              </li>
              <li>
                <span className="contact-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                </span>
                <div>
                  <strong>Address</strong>
                  <address>
                    {CONTACT.addressLines.map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </address>
                </div>
              </li>
              {CONTACT.email && (
                <li>
                  <span className="contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 7.9L5 7v10h14V7l-7 5.9Z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </div>
                </li>
              )}
            </ul>

            <div className="contact-hours">
              <strong>Business hours</strong>
              <p>Monday – Saturday, 9:30 AM – 7:00 PM IST</p>
            </div>
          </aside>

          <div className="contact-form-wrap">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
