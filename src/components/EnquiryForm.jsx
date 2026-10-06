import { useState } from 'react';
import { submitEnquiry } from '../lib/products.js';
import { CONTACT } from '../data/contact.js';

const INITIAL = { name: '', company: '', email: '', phone: '', message: '' };

/**
 * Shared enquiry form. When `product` is supplied the enquiry is linked to
 * that product in the back office.
 */
export default function EnquiryForm({ product = null, heading = 'Send an enquiry' }) {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | unconfigured | error

  const update = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const result = await submitEnquiry({
      ...form,
      productId: product?.id?.startsWith('sample-') ? null : product?.id || null,
    });
    setStatus(result.ok ? 'sent' : result.reason === 'unconfigured' ? 'unconfigured' : 'error');
  };

  if (status === 'sent') {
    return (
      <div className="enquiry-success">
        <h3>Thank you, {form.name.split(' ')[0] || 'there'}!</h3>
        <p>
          Your enquiry{product ? ` about “${product.name}”` : ''} has been received. Our team
          will reach out shortly. For anything urgent, call us on{' '}
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={onSubmit}>
      <h3>{heading}</h3>
      {product && (
        <p className="enquiry-product">
          Enquiring about: <strong>{product.name}</strong>
        </p>
      )}

      <div className="form-grid">
        <label>
          Your name *
          <input
            name="name"
            value={form.name}
            onChange={update}
            required
            placeholder="Full name"
            autoComplete="name"
          />
        </label>
        <label>
          Company
          <input
            name="company"
            value={form.company}
            onChange={update}
            placeholder="Company name"
            autoComplete="organization"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={update}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </label>
        <label>
          Phone *
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={update}
            required
            placeholder="Contact number"
            autoComplete="tel"
          />
        </label>
      </div>

      <label>
        Message *
        <textarea
          name="message"
          rows="4"
          value={form.message}
          onChange={update}
          required
          placeholder="Tell us quantities, timelines, branding needs…"
        />
      </label>

      <button type="submit" className="btn btn-red" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
      </button>

      {status === 'unconfigured' && (
        <p className="form-note">
          Our online enquiry desk is being set up. Meanwhile please call us directly on{' '}
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>.
        </p>
      )}
      {status === 'error' && (
        <p className="form-note form-note-error">
          Something went wrong while sending. Please try again or call{' '}
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>.
        </p>
      )}
    </form>
  );
}
