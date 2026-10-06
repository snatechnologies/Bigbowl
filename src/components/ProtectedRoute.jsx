import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

function SetupNotice() {
  return (
    <main className="section">
      <div className="container not-found">
        <p className="eyebrow">Back office</p>
        <h1>Connect Supabase to unlock the back office.</h1>
        <p>
          Add your project URL and anon key to <code>.env</code>, run{' '}
          <code>supabase/bootstrap.sql</code> in the Supabase SQL editor, then run{' '}
          <code>npm run bootstrap:supabase</code>. See <code>README.md</code> for the full
          setup.
        </p>
      </div>
    </main>
  );
}

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return undefined;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <main className="section">
        <div className="container page-loading">Checking access…</div>
      </main>
    );
  }

  if (!session) {
    return isSupabaseConfigured ? <Navigate to="/admin/login" replace /> : <SetupNotice />;
  }

  return children;
}
