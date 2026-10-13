import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js';
import { LogoImage } from '../../components/Logo.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured || busy) return;
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <main className="section">
      <div className="container admin-login-wrap">
        <form className="enquiry-form" onSubmit={onSubmit}>
          <div className="admin-login-logo">
            <LogoImage width={110} />
          </div>
          <h3>Bigbowl Back Office</h3>

          {!isSupabaseConfigured && (
            <p className="admin-message admin-message-error">
              Supabase is not configured yet. Add your credentials to <code>.env</code> and
              complete the setup in <code>README.md</code> before signing in.
            </p>
          )}
          {error && <p className="admin-message admin-message-error">{error}</p>}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@bigbowl.in"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="btn btn-red" disabled={!isSupabaseConfigured || busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="form-note">
            This area is restricted to the Bigbowl team. <Link to="/">Back to the website</Link>.
          </p>
        </form>
      </div>
    </main>
  );
}
