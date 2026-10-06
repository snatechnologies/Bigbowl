import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';

export default function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('enquiries')
      .select('*, products(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setEnquiries(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="page-loading">Loading enquiries…</p>;
  if (error) return <p className="admin-message admin-message-error">{error}</p>;

  if (enquiries.length === 0) {
    return (
      <div className="empty-state">
        <h2>No enquiries yet</h2>
        <p>Customer enquiries submitted on the website will appear here.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Product</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id}>
              <td>{new Date(enquiry.created_at).toLocaleDateString('en-IN')}</td>
              <td className="admin-product-name">
                {enquiry.name}
                <small>{enquiry.company}</small>
              </td>
              <td>
                {enquiry.phone && <div>{enquiry.phone}</div>}
                {enquiry.email && <small>{enquiry.email}</small>}
              </td>
              <td>{enquiry.products?.name || 'General'}</td>
              <td className="enquiry-card-message">{enquiry.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
