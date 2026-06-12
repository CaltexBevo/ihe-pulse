'use client';

import { useState, type FormEvent } from 'react';

interface NewsletterSignupProps {
  variant?: 'card' | 'inline' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Honeypot check - bots fill hidden fields, humans don't
    if (honeypot) {
      // Silently "succeed" to not tip off bots
      setStatus('success');
      setMessage('You\'re in! Check your inbox to confirm.');
      return;
    }

    setStatus('loading');

    try {
      // Mailchimp integration - uses API route to avoid CORS
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _gotcha: honeypot }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('You\'re in! Check your inbox to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (variant === 'footer') {
    return (
      <div className={`${className}`} role="form" aria-label="Newsletter signup">
        <h4 className="font-sans text-[0.92rem] font-bold mb-3">Never Miss a Pulse</h4>
        <p className="text-[0.75rem] text-[var(--text-secondary)] mb-3">
          A.I. news for higher ed, delivered daily.
        </p>
        {status === 'success' ? (
          <p className="text-[0.78rem] text-[var(--green)]" role="status">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Honeypot field - hidden from humans, bots fill it */}
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@university.edu"
              aria-label="Email address"
              className="flex-1 px-3 py-2 text-[0.78rem] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="px-4 py-2 text-[0.72rem] font-semibold rounded-[8px] bg-[var(--cyan)] text-[var(--bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Go'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-[0.68rem] text-[var(--red)] mt-2" role="alert">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-[var(--surface-1)] border border-[var(--border)] rounded-[14px] p-6 ${className}`} role="form" aria-label="Newsletter signup">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-sans text-[1.1rem] font-bold mb-1">Never Miss a Pulse</h3>
            <p className="text-[0.82rem] text-[var(--text-secondary)]">
              A.I. news for higher ed — no fluff, no hype.
            </p>
          </div>
          {status === 'success' ? (
            <p className="text-[0.85rem] text-[var(--green)] font-medium" role="status">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              {/* Honeypot field - hidden from humans, bots fill it */}
              <input
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@university.edu"
                aria-label="Email address"
                className="w-[220px] px-4 py-2.5 text-[0.82rem] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe to newsletter"
                className="btn-primary"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
        {status === 'error' && (
          <p className="text-[0.75rem] text-[var(--red)] mt-2 md:text-right" role="alert">{message}</p>
        )}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-12 text-center relative overflow-hidden ${className}`} role="form" aria-label="Newsletter signup">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" aria-hidden="true" />

      <h2 className="font-sans text-[1.6rem] font-bold mb-2">
        Never Miss a Pulse
      </h2>
      <p className="text-[0.85rem] text-[var(--text-secondary)] max-w-[500px] mx-auto mb-6">
        Get the Innovation Pulse delivered to your inbox. Curated AI news for higher education — no fluff, no hype.
      </p>

      {status === 'success' ? (
        <div className="py-4">
          <div className="w-12 h-12 rounded-full bg-[var(--green-dim)] flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[var(--green)]" fill="none" strokeWidth="3" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-[0.92rem] text-[var(--green)] font-medium" role="status">{message}</p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto mb-2">
            {/* Honeypot field - hidden from humans, bots fill it */}
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@university.edu"
              aria-label="Email address"
              className="input flex-1"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe to newsletter"
              className="btn-primary whitespace-nowrap disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
            </button>
          </form>

          {status === 'error' && (
            <p className="text-[0.75rem] text-[var(--red)] mb-2" role="alert">{message}</p>
          )}

          <p className="text-[0.68rem] text-[var(--text-muted)]">
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  );
}
