'use client';

import { useCallback, useId, useState, type FormEvent } from 'react';
import {
  consumeChallengeToken,
  FetchTimeoutError,
  nextChallengeReset,
  postNewsletter,
} from '@/lib/newsletterClient';
import { trackEvent } from './EngagementAnalytics';
import TurnstileChallenge from './TurnstileChallenge';

interface NewsletterSignupProps {
  variant?: 'card' | 'inline' | 'inline-strip' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeReset, setChallengeReset] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);
  const securityStatusId = useId();
  const formStatusId = `${securityStatusId}-form`;
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const activateChallenge = useCallback(() => setChallengeActive(true), []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setStatus('error');
      setMessage('Please enter your first and last name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    // Honeypot check - bots fill hidden fields, humans don't
    if (honeypot) {
      // Silently "succeed" to not tip off bots
      setStatus('success');
      setMessage('You\'re in! Check your inbox.');
      return;
    }

    if (!turnstileToken) {
      setStatus('error');
      setMessage('Please wait for the security check to complete.');
      return;
    }

    setStatus('loading');
    const consumed = consumeChallengeToken(turnstileToken);
    setTurnstileToken(consumed.remainingToken);
    trackEvent('newsletter_signup_attempt', { placement: variant });

    try {
      const { response, data } = await postNewsletter({
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        _gotcha: honeypot,
        turnstileToken: consumed.submissionToken,
      });

      if (response.ok) {
        trackEvent('newsletter_signup_success', { placement: variant });
        setStatus('success');
        setMessage(data.message || 'Check your inbox to confirm your subscription!');
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        setChallengeReset(nextChallengeReset);
        trackEvent('newsletter_signup_error', { placement: variant, reason: 'service' });
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setChallengeReset(nextChallengeReset);
      trackEvent('newsletter_signup_error', { placement: variant, reason: 'network' });
      setStatus('error');
      setMessage(
        error instanceof FetchTimeoutError
          ? 'The request timed out. Please try again.'
          : 'Network error. Please try again.',
      );
    }
  };

  const turnstileChallenge = (
    <TurnstileChallenge
      active={challengeActive}
      onTokenChange={handleTurnstileToken}
      resetSignal={challengeReset}
      statusId={securityStatusId}
    />
  );
  const submitDisabled = status === 'loading' || !turnstileToken;
  const submitDescription = status === 'error' ? `${securityStatusId} ${formStatusId}` : securityStatusId;
  const formInteractionProps = {
    onFocusCapture: activateChallenge,
    onPointerDownCapture: activateChallenge,
  };

  if (variant === 'inline-strip') {
    return (
      <div className={`${className}`}>
        {status === 'success' ? (
          <p className="text-[0.82rem] text-[var(--cyan)] font-medium np-sub-success" role="status">{message}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="np-sub-form flex-wrap"
            aria-label="Newsletter signup"
            {...formInteractionProps}
          >
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
            <div className="np-sub-name-row flex w-full gap-2 mb-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                aria-label="First name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="given-name"
                disabled={status === 'loading'}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                aria-label="Last name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="family-name"
                disabled={status === 'loading'}
              />
            </div>
            {turnstileChallenge}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.edu"
              aria-label="Email address"
              autoComplete="email"
              className="np-sub-email"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={submitDisabled}
              aria-label="Subscribe to newsletter"
              aria-describedby={submitDescription}
              className="np-sub-submit"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p id={formStatusId} className="text-[0.68rem] text-[var(--red)] mt-1" role="alert">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h4 className="font-sans text-[0.92rem] font-bold mb-3">Never Miss a Pulse</h4>
        <p className="text-[0.75rem] text-[var(--text-secondary)] mb-3">
          A.I. news for higher ed, delivered weekly.
        </p>
        {status === 'success' ? (
          <p className="text-[0.78rem] text-[var(--green)]" role="status">{message}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-col gap-2"
            aria-label="Newsletter signup"
            {...formInteractionProps}
          >
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
            <div className="flex min-w-0 gap-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                aria-label="First name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="given-name"
                className="min-w-0 flex-1 px-3 py-2 text-[0.78rem] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                disabled={status === 'loading'}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                aria-label="Last name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="family-name"
                className="min-w-0 flex-1 px-3 py-2 text-[0.78rem] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                disabled={status === 'loading'}
              />
            </div>
            {turnstileChallenge}
            <div className="flex min-w-0 gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@university.edu"
                aria-label="Email address"
                autoComplete="email"
                className="min-w-0 flex-1 px-3 py-2 text-[0.78rem] rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={submitDisabled}
                aria-label="Subscribe to newsletter"
                aria-describedby={submitDescription}
                className="px-4 py-2 text-[0.72rem] font-semibold rounded-[8px] bg-[var(--cyan)] text-[var(--bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === 'loading' ? '...' : 'Go'}
              </button>
            </div>
          </form>
        )}
        {status === 'error' && (
          <p id={formStatusId} className="text-[0.68rem] text-[var(--red)] mt-2" role="alert">{message}</p>
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
              A.I. news for higher ed, delivered weekly — no fluff, no hype.
            </p>
          </div>
          {status === 'success' ? (
            <p className="text-[0.85rem] text-[var(--green)] font-medium" role="status">{message}</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2"
              aria-label="Newsletter signup"
              {...formInteractionProps}
            >
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  aria-label="First name"
                  required
                  minLength={1}
                  maxLength={80}
                  autoComplete="given-name"
                  className="w-[110px] px-4 py-2.5 text-[0.82rem] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                  disabled={status === 'loading'}
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  aria-label="Last name"
                  required
                  minLength={1}
                  maxLength={80}
                  autoComplete="family-name"
                  className="w-[110px] px-4 py-2.5 text-[0.82rem] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                  disabled={status === 'loading'}
                />
              </div>
              {turnstileChallenge}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@university.edu"
                  aria-label="Email address"
                  autoComplete="email"
                  className="w-[220px] px-4 py-2.5 text-[0.82rem] rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--cyan)] placeholder:text-[var(--text-muted)]"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={submitDisabled}
                  aria-label="Subscribe to newsletter"
                  aria-describedby={submitDescription}
                  className="btn-primary"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
          )}
        </div>
        {status === 'error' && (
          <p id={formStatusId} className="text-[0.75rem] text-[var(--red)] mt-2 md:text-right" role="alert">{message}</p>
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
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 max-w-[400px] mx-auto mb-2"
            aria-label="Newsletter signup"
            {...formInteractionProps}
          >
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
            <div className="flex gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                aria-label="First name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="given-name"
                className="input flex-1"
                disabled={status === 'loading'}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                aria-label="Last name"
                required
                minLength={1}
                maxLength={80}
                autoComplete="family-name"
                className="input flex-1"
                disabled={status === 'loading'}
              />
            </div>
            {turnstileChallenge}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@university.edu"
                aria-label="Email address"
                autoComplete="email"
                className="input flex-1"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={submitDisabled}
                aria-label="Subscribe to newsletter"
                aria-describedby={submitDescription}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </div>
          </form>

          {status === 'error' && (
            <p id={formStatusId} className="text-[0.75rem] text-[var(--red)] mb-2" role="alert">{message}</p>
          )}

          <p className="text-[0.68rem] text-[var(--text-muted)]">
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  );
}
