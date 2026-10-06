import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient.js';
import ProductsTab from '../../components/admin/ProductsTab.jsx';
import EnquiriesTab from '../../components/admin/EnquiriesTab.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <span className="eyebrow">Back office</span>
            <h1>Product management</h1>
          </div>
          <div className="admin-actions">
            <Link to="/admin/products/new" className="btn btn-red btn-sm">
              + Add product
            </Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>

        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'products'}
            className={`admin-tab ${tab === 'products' ? 'is-active' : ''}`}
            onClick={() => setTab('products')}
          >
            Products
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'enquiries'}
            className={`admin-tab ${tab === 'enquiries' ? 'is-active' : ''}`}
            onClick={() => setTab('enquiries')}
          >
            Enquiries
          </button>
        </div>

        {tab === 'products' ? <ProductsTab /> : <EnquiriesTab />}
      </div>
    </main>
  );
}
