'use client';

import Link from 'next/link';
import { BookOpen, Building2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { INNOVATION_GRANT_JURISDICTIONS } from '@/lib/innovation-grants-directory';
import {
  INNOVATION_GRANTS_AREA_FILTERS,
  INNOVATION_GRANTS_AUDIENCE_FILTERS,
  type InnovationGrantArea,
  type InnovationGrantAudience,
  type InnovationGrantJurisdictionCode,
} from '@/lib/innovation-grants-shared';
import {
  consumeChallengeToken,
  FetchTimeoutError,
  nextChallengeReset,
  postNewsletter,
  readNewsletterReadiness,
} from '@/lib/newsletterClient';
import { trackEvent } from './EngagementAnalytics';
import TurnstileChallenge from './TurnstileChallenge';
import styles from './EmailSignup.module.css';

type SignupStep = 'profile' | 'criteria' | 'success';
type SignupStatus = 'idle' | 'loading' | 'error';
type Preferences = { pulse: boolean; grants: boolean };

type GrantCriteria = {
  audiences: InnovationGrantAudience[];
  locations: InnovationGrantJurisdictionCode[];
  areas: InnovationGrantArea[];
  minimumAwardUsd: number | null;
};

type EmailSignupPayload = {
  email: string;
  firstName: string;
  lastName: string;
  _gotcha: string;
  turnstileToken: string;
  preferences: Preferences;
  grantCriteria: GrantCriteria;
};

interface EmailSignupProps {
  variant?: 'compact' | 'portal';
  id?: string;
  className?: string;
  placement?: string;
}

const EMPTY_CRITERIA: GrantCriteria = {
  audiences: [],
  locations: [],
  areas: [],
  minimumAwardUsd: null,
};

function isAudience(value: string): value is InnovationGrantAudience {
  return value !== 'all' && INNOVATION_GRANTS_AUDIENCE_FILTERS.some((option) => option.id === value);
}

function isArea(value: string): value is InnovationGrantArea {
  return value !== 'all' && INNOVATION_GRANTS_AREA_FILTERS.some((option) => option.id === value);
}

function isLocation(value: string): value is InnovationGrantJurisdictionCode {
  return INNOVATION_GRANT_JURISDICTIONS.some((option) => option.code === value);
}

export default function EmailSignup({
  variant = 'compact',
  id: anchorId,
  className = '',
  placement = variant,
}: EmailSignupProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    void readNewsletterReadiness().then((value) => { if (active) setReady(value); });
    return () => { active = false; };
  }, []);
  // ThemeProvider mounts page content after the browser first resolves URL fragments.
  useEffect(() => {
    if (!anchorId || window.location.hash !== `#${anchorId}`) return;
    const frame = window.requestAnimationFrame(() => {
      if (window.location.hash !== `#${anchorId}`) return;
      const target = document.getElementById(anchorId);
      if (!target) return;
      const headerHeight = document.querySelector('header nav')?.getBoundingClientRect().height ?? 0;
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [anchorId]);
  const [step, setStep] = useState<SignupStep>('profile');
  const [preferences, setPreferences] = useState<Preferences>({ pulse: false, grants: false });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<SignupStatus>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeReset, setChallengeReset] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);
  const [audiences, setAudiences] = useState<InnovationGrantAudience[]>([]);
  const [location, setLocation] = useState<InnovationGrantJurisdictionCode | ''>('');
  const [areas, setAreas] = useState<InnovationGrantArea[]>([]);
  const [minimumAward, setMinimumAward] = useState('');
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(step);
  const instanceId = useId();
  const securityStatusId = instanceId + '-security';
  const errorStatusId = instanceId + '-error';
  const finalActionNeedsChallenge = step === 'criteria' || (step === 'profile' && !preferences.grants);
  const submitDisabled = status === 'loading' || (finalActionNeedsChallenge && (!ready || !turnstileToken));

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    titleRef.current?.focus();
  }, [step]);

  const setChoice = (key: keyof Preferences, checked: boolean) => {
    setPreferences((current) => ({ ...current, [key]: checked }));
    setError('');
    setStatus('idle');
  };

  const toggleAudience = (value: InnovationGrantAudience, checked: boolean) => {
    setAudiences((current) => checked
      ? [...current, value]
      : current.filter((item) => item !== value));
  };

  const toggleArea = (value: InnovationGrantArea, checked: boolean) => {
    setAreas((current) => checked
      ? [...current, value]
      : current.filter((item) => item !== value));
  };

  const goBack = () => {
    setStatus('idle');
    setError('');
    setStep('profile');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;
    setError('');
    setStatus('idle');

    if (!preferences.pulse && !preferences.grants) {
      setError('Choose at least one email to continue.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Enter your first and last name.');
      return;
    }

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    if (step === 'profile' && preferences.grants) {
      setStep('criteria');
      return;
    }

    // Draft navigation is local; only final enrollment requires service readiness.
    if (!ready) return;

    if (honeypot) return;

    if (!turnstileToken) {
      setError('Complete the security check before signing up.');
      return;
    }

    const amount = minimumAward.trim() === '' ? null : Number(minimumAward);
    if (step === 'criteria' && amount !== null && (!Number.isSafeInteger(amount) || amount <= 0 || amount > 1_000_000_000)) {
      setError('Enter a whole dollar amount from 1 to 1,000,000,000, or leave it blank.');
      return;
    }

    // Local builds and localhost previews never send entered PII to the API.
    const localHostname = typeof window !== 'undefined'
      && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
    if (process.env.NODE_ENV !== 'production' || localHostname) {
      setStatus('error');
      setError('Signup requests are disabled in this local preview. No information was sent.');
      return;
    }

    const challenge = consumeChallengeToken(turnstileToken);
    setTurnstileToken(challenge.remainingToken);
    const grantCriteria: GrantCriteria = preferences.grants
      ? {
          audiences: [...audiences],
          locations: location ? [location] : [],
          areas: [...areas],
          minimumAwardUsd: amount,
        }
      : { ...EMPTY_CRITERIA };
    const payload: EmailSignupPayload = {
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      _gotcha: honeypot,
      turnstileToken: challenge.submissionToken,
      preferences,
      grantCriteria,
    };

    setStatus('loading');
    trackEvent('newsletter_signup_attempt', { placement });

    try {
      const { response, data } = await postNewsletter(payload);
      if (response.ok && data.success === true) {
        trackEvent('newsletter_signup_success', { placement });
        setStatus('idle');
        setMessage(data.message || 'If this is a new subscription, check your inbox to confirm.');
        setStep('success');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPreferences({ pulse: false, grants: false });
        setAudiences([]);
        setLocation('');
        setAreas([]);
        setMinimumAward('');
      } else {
        setChallengeReset(nextChallengeReset);
        trackEvent('newsletter_signup_error', { placement, reason: 'service' });
        setStatus('error');
        setError(data.error || 'Signup could not be completed. Please try again.');
      }
    } catch (requestError) {
      setChallengeReset(nextChallengeReset);
      trackEvent('newsletter_signup_error', { placement, reason: 'network' });
      setStatus('error');
      setError(
        requestError instanceof FetchTimeoutError
          ? 'The request timed out. Please try again.'
          : 'Network error. Please try again.',
      );
    }
  };

  const turnstile = challengeActive ? (
    <div className={styles.securityRow}>
      <TurnstileChallenge
        active={challengeActive}
        onTokenChange={setTurnstileToken}
        resetSignal={challengeReset}
        statusId={securityStatusId}
      />
    </div>
  ) : null;
  const variantClass = variant === 'portal' ? styles.portalVariant : styles.compactVariant;
  const rootClassName = [styles.signup, variantClass, step === 'success' ? styles.success : '', className].filter(Boolean).join(' ');

  if (step === 'success') {
    return (
      <section id={anchorId} data-email-signup className={rootClassName} aria-labelledby={instanceId + '-success-heading'}>
        <div className={styles.portalArt} aria-hidden="true" />
        <div className={styles.panelGrid}>
          <div className={styles.confirmation} role="status" aria-live="polite">
            <h2 id={instanceId + '-success-heading'} ref={titleRef} tabIndex={-1}>Check your email to confirm.</h2>
            <p>{message}</p>
            <Link href="/email-preferences" className={styles.preferencesLink}>
              Already subscribed? Update preferences
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={anchorId} data-email-signup className={rootClassName} aria-labelledby={instanceId + '-step-heading'}>
      <div className={styles.portalArt} aria-hidden="true" />
      <div className={[styles.panelGrid, step === 'criteria' ? styles.criteriaPanel : styles.profilePanel].join(' ')}>
        {step === 'profile' ? (
          <>
            <div className={styles.profileTop}>
              <div className={styles.intro}>
                <h2 id={instanceId + '-step-heading'} ref={titleRef} tabIndex={-1}>
                  Your next grant is <span>calling.</span>
                </h2>
                <p className={styles.tagline}>Practical ideas. Funding that fits. Once a week.</p>
              </div>
              <fieldset className={styles.emailChoices} aria-label="Choose your emails">
                <legend className={styles.srOnly}>Choose your emails</legend>
                <label className={[styles.emailChoice, styles.pulseChoice, preferences.pulse ? styles.selected : ''].filter(Boolean).join(' ')}>
                  <input
                    type="checkbox"
                    checked={preferences.pulse}
                    onChange={(event) => setChoice('pulse', event.target.checked)}
                    disabled={status === 'loading'}
                  />
                  <span className={styles.choiceText}>
                    <strong>Innovation Pulse</strong>
                    <small>Weekly ideas you can use.</small>
                  </span>
                  <BookOpen className={styles.choiceIcon} aria-hidden="true" strokeWidth={1.8} />
                </label>
                <label className={[styles.emailChoice, styles.grantChoice, preferences.grants ? styles.selected : ''].filter(Boolean).join(' ')}>
                  <input
                    type="checkbox"
                    checked={preferences.grants}
                    onChange={(event) => setChoice('grants', event.target.checked)}
                    disabled={status === 'loading'}
                  />
                  <span className={styles.choiceText}>
                    <strong>Grant alerts</strong>
                    <small>Weekly grants that fit your interests.</small>
                  </span>
                  <Building2 className={styles.choiceIcon} aria-hidden="true" strokeWidth={1.8} />
                </label>
              </fieldset>
            </div>

            <form
              className={styles.form}
              onSubmit={handleSubmit}
              aria-label="Email signup"
              onFocusCapture={() => setChallengeActive(ready)}
              onPointerDownCapture={() => setChallengeActive(ready)}
            >
              <input
                className={styles.honeypot}
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className={styles.identityRow}>
                <label className={styles.field} htmlFor={instanceId + '-first-name'}>
                  <span>First name</span>
                  <input id={instanceId + '-first-name'} type="text" name="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" placeholder="First name" maxLength={80} required disabled={status === 'loading'} />
                </label>
                <label className={styles.field} htmlFor={instanceId + '-last-name'}>
                  <span>Last name</span>
                  <input id={instanceId + '-last-name'} type="text" name="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" placeholder="Last name" maxLength={80} required disabled={status === 'loading'} />
                </label>
                <label className={styles.field} htmlFor={instanceId + '-email'}>
                  <span>Email address</span>
                  <input id={instanceId + '-email'} type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@institution.edu" maxLength={254} required disabled={status === 'loading'} />
                </label>
                <button type="submit" className={styles.primaryButton} disabled={submitDisabled}>
                  {status === 'loading' ? 'Signing you up…' : preferences.grants ? 'Set my grant criteria →' : 'Sign me up →'}
                </button>
              </div>
              {turnstile}
              <div className={styles.formFooter}>
                <span role="status">{ready ? 'Weekly updates. Your choices, your connection.' : 'Signups are not open yet'}</span>
                <Link href="/email-preferences" className={styles.preferencesLink}>Already subscribed? Update preferences</Link>
              </div>
              {error && <p id={errorStatusId} className={styles.error} role="alert">{error}</p>}
            </form>
          </>
        ) : (
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            aria-label="Grant alert criteria"
            onFocusCapture={() => setChallengeActive(ready)}
            onPointerDownCapture={() => setChallengeActive(ready)}
          >
            <input
              className={styles.honeypot}
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className={styles.stepTopline}>
              <span className={styles.eyebrow}>Your grant connection · Step 2 of 2</span>
              <button type="button" className={styles.backButton} onClick={goBack} disabled={status === 'loading'}>
                <span aria-hidden="true">← </span>Back
              </button>
            </div>
            <div className={styles.criteriaIntro}>
              <h2 id={instanceId + '-step-heading'} ref={titleRef} tabIndex={-1}>
                Dial in what <span>fits you.</span>
              </h2>
              <p className={styles.tagline}>Set your interests. Get matching grants once a week.</p>
            </div>
            <div className={styles.criteriaGrid}>
              <fieldset className={[styles.criteriaField, styles.audienceField].join(' ')}>
                <legend>Who is applying?</legend>
                <p className={styles.fieldHelp}>Choose any that fit. Blank means any.</p>
                <div className={styles.audienceChoices}>
                  {INNOVATION_GRANTS_AUDIENCE_FILTERS.filter((option) => isAudience(option.id)).map((option) => (
                    <label key={option.id} className={[styles.criteriaChoice, audiences.includes(option.id as InnovationGrantAudience) ? styles.criteriaSelected : ''].filter(Boolean).join(' ')}>
                      <input
                        type="checkbox"
                        checked={audiences.includes(option.id as InnovationGrantAudience)}
                        onChange={(event) => toggleAudience(option.id as InnovationGrantAudience, event.target.checked)}
                        disabled={status === 'loading'}
                      />
                        <span>{option.label.replace(/\s*\/\s*/g, ' / ')}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className={[styles.criteriaField, styles.areaField].join(' ')}>
                <legend>What would you like to fund?</legend>
                <p className={styles.fieldHelp}>Choose any that fit. Blank means any.</p>
                <div className={styles.areaChoices}>
                  {INNOVATION_GRANTS_AREA_FILTERS.filter((option) => isArea(option.id)).map((option) => (
                    <label key={option.id} className={[styles.criteriaChoice, areas.includes(option.id as InnovationGrantArea) ? styles.criteriaSelected : ''].filter(Boolean).join(' ')}>
                      <input
                        type="checkbox"
                        checked={areas.includes(option.id as InnovationGrantArea)}
                        onChange={(event) => toggleArea(option.id as InnovationGrantArea, event.target.checked)}
                        disabled={status === 'loading'}
                      />
                        <span>{option.label.replace(/\s*\/\s*/g, ' / ')}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className={styles.criteriaBottom}>
              <label className={styles.field} htmlFor={instanceId + '-location'}>
                <span>Institution / applicant location</span>
                <select
                  id={instanceId + '-location'}
                  value={location}
                  onChange={(event) => setLocation(isLocation(event.target.value) ? event.target.value : '')}
                  disabled={status === 'loading'}
                >
                  <option value="">Any U.S. location</option>
                  <optgroup label="States and District of Columbia">
                    {INNOVATION_GRANT_JURISDICTIONS.filter(({ kind }) => kind === 'state-or-dc').map(({ code, label }) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="U.S. territories">
                    {INNOVATION_GRANT_JURISDICTIONS.filter(({ kind }) => kind === 'territory').map(({ code, label }) => (
                      <option key={code} value={code}>{label}</option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <label className={styles.field} htmlFor={instanceId + '-minimum-award'}>
                <span>Minimum award <small>· optional</small></span>
                <input
                  id={instanceId + '-minimum-award'}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="1000000000"
                  step="1"
                  value={minimumAward}
                  onChange={(event) => setMinimumAward(event.target.value)}
                  placeholder="Any amount"
                  aria-describedby={instanceId + '-minimum-help'}
                  disabled={status === 'loading'}
                />
                <small id={instanceId + '-minimum-help'} className={styles.fieldHint}>
                  Whole dollars per award. Unknown award amounts are omitted when a minimum is set.
                </small>
              </label>
            </div>
            {turnstile}
            <div className={styles.criteriaActions}>
              <button type="submit" className={styles.primaryButton} disabled={submitDisabled}>
                {status === 'loading' ? 'Activating your weekly alerts…' : 'Activate my weekly alerts →'}
              </button>
              <p className={styles.fieldHelp} role="status">{ready ? 'Blank filters keep your options open. You can change these later.' : 'Signups are not open yet'}</p>
            </div>
            {error && <p id={errorStatusId} className={styles.error} role="alert">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
