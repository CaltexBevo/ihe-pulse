'use client';
import { useCallback, useRef, useState, type FormEvent } from 'react';
import TurnstileChallenge from '@/components/TurnstileChallenge';

export default function ShareNewsletterForm({ available, edition = 'edition-21' }: { available: boolean; edition?: 'edition-20' | 'edition-21' }) {
  const [token, setToken] = useState('');
  const [active, setActive] = useState(false);
  const [reset, setReset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const requestId = useRef<string | null>(null);
  const onToken = useCallback((value: string) => setToken(value), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || done) return;
    if (!available) { setMessage('Full-newsletter sharing is temporarily unavailable. Please try again later.'); return; }
    if (!token) { setActive(true); setMessage('Please complete the security check.'); return; }
    const form = event.currentTarget;
    const fields = new FormData(form);
    requestId.current ||= crypto.randomUUID();
    const submission = { edition, email: fields.get('email'), name: fields.get('name'), note: fields.get('note'), _gotcha: fields.get('_gotcha'), requestId: requestId.current, turnstileToken: token };
    setBusy(true); setToken(''); setMessage('Sending the full newsletter…');
    try {
      const res = await fetch('/api/newsletter/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submission), signal: AbortSignal.timeout(25000) });
      const data = await res.json();
      setMessage(res.ok && data.success === true ? data.message : data.error || 'Delivery could not be confirmed. Please do not resend this request.');
      if (res.ok && data.success === true) { setDone(true); form.reset(); }
    } catch { setMessage('Delivery could not be confirmed. Please do not resend this request.'); }
    finally { setBusy(false); setReset(v => v + 1); }
  }
  const inputClass = 'w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg)] p-3 text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--cyan)] focus-visible:outline-offset-2';
  return <form onSubmit={submit} onFocus={() => setActive(true)} className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-5 sm:p-8 space-y-6" aria-describedby="share-privacy share-status">
    {!available && <p className="text-[var(--cyan)]" role="status">Full-newsletter sharing is temporarily unavailable.</p>}
    <div><label htmlFor="share-email" className="block mb-2 font-semibold">Friend’s email address <span className="text-[var(--text-secondary)] font-normal">(required)</span></label><input id="share-email" name="email" type="email" required maxLength={254} autoComplete="off" className={inputClass} disabled={busy || done} /></div>
    <div><label htmlFor="share-name" className="block mb-2 font-semibold">Your name <span className="text-[var(--text-secondary)] font-normal">(optional)</span></label><input id="share-name" name="name" maxLength={80} autoComplete="given-name" className={inputClass} disabled={busy || done} /></div>
    <div><label htmlFor="share-note" className="block mb-2 font-semibold">Add a short note <span className="text-[var(--text-secondary)] font-normal">(optional)</span></label><textarea id="share-note" name="note" maxLength={500} rows={4} className={inputClass} disabled={busy || done} /><p className="text-sm text-[var(--text-secondary)] mt-1">Up to 500 characters.</p></div>
    <div className="hidden" aria-hidden="true"><label htmlFor="share-gotcha">Website</label><input id="share-gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" /></div>
    <p id="share-privacy" className="text-sm leading-relaxed text-[var(--text-secondary)]">Your friend receives this edition once and will not be subscribed. Your name and note appear in the email. The recipient can block future shared emails. <a href="/privacy" className="text-[var(--cyan)] underline">Privacy policy</a></p>
    {available && <TurnstileChallenge action="newsletter_share" active={active} onTokenChange={onToken} resetSignal={reset} statusId="share-security" />}
    <button type="submit" disabled={busy || done} className="w-full rounded-xl px-5 py-4 text-xl font-bold text-[var(--bg)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[var(--cyan)] focus-visible:outline-offset-2" style={{ background: 'var(--brand-grad)' }}>{busy ? 'Sending…' : done ? 'Accepted for delivery' : 'Send the full newsletter'}</button>
    <p id="share-status" role="status" aria-live="polite" className="text-[var(--cyan)] leading-relaxed">{message}</p>
  </form>;
}
