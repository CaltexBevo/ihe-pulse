'use client';
import { useEffect, useState } from 'react';
export default function StopSharedEmail() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
    setToken(value);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  async function confirm() {
    if (busy || !token || done) return;
    setBusy(true);
    try {
      const res = await fetch('/api/newsletter/share/stop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, confirm: true }), signal: AbortSignal.timeout(10000) });
      const result = await res.json();
      setMessage(res.ok && result.success === true ? result.message : result.error || 'Unable to confirm. Please try again.');
      if (res.ok && result.success === true) setDone(true);
    } catch { setMessage('Unable to confirm. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6">
    {!token && <p className="mb-4">Open the stop-sharing link from a shared email to use this control.</p>}
    <button onClick={confirm} disabled={!token || busy || done} className="rounded-xl px-6 py-4 text-xl font-bold text-[var(--bg)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] focus-visible:outline-offset-2" style={{ background: 'var(--brand-grad)' }}>{busy ? 'Confirming…' : done ? 'Shared emails blocked' : 'Block future shared newsletters'}</button>
    <p role="status" aria-live="polite" className="mt-5 text-[var(--cyan)]">{message}</p>
  </div>;
}
