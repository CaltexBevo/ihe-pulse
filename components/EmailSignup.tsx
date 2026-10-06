'use client';

import { ArrowLeft, ArrowRight, Check, ChevronDown, HandCoins, Mail, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { INNOVATION_GRANT_JURISDICTIONS } from '@/lib/innovation-grants-directory';
import { INNOVATION_GRANTS_AREA_FILTERS } from '@/lib/innovation-grants-shared';
import {
  changeReviewSelection, REVIEW_GRANT_TYPES,
  type ReviewCriteria, type ReviewCriterion, type ReviewEmailChoices,
} from '@/lib/emailSignupReview';
import styles from './EmailSignup.module.css';
import Link from 'next/link';
import TurnstileChallenge from './TurnstileChallenge';
import { consumeChallengeToken, FetchTimeoutError, nextChallengeReset, postNewsletter, readNewsletterReadiness } from '@/lib/newsletterClient';
import { trackEvent } from './EngagementAnalytics';

type Option = { id: string; label: string; shortLabel?: string };
type Step = 'identity' | 'criteria' | 'complete';

const ROLE_OPTIONS: Option[] = [
  { id: 'community-college', label: 'Community colleges' },
  { id: 'university', label: 'Four-year colleges & universities', shortLabel: 'Colleges & universities' },
  { id: 'faculty-researcher', label: 'Faculty / researcher' },
  { id: 'teaching-center', label: 'Teaching centers' },
  { id: 'student', label: 'Students / graduate researchers', shortLabel: 'Students / graduates' },
  { id: 'independent-scholar', label: 'Independent scholars' },
];
const INTEREST_OPTIONS: Option[] = INNOVATION_GRANTS_AREA_FILTERS
  .filter((option) => option.id !== 'all')
  .map((option) => ({ id: option.id, label: option.label }));
const LOCATION_OPTIONS: Option[] = INNOVATION_GRANT_JURISDICTIONS.map((option) => ({ id: option.code, label: option.label }));

const CRITERIA_FIELDS: { key: ReviewCriterion; label: string; empty: string; options: readonly Option[] }[] = [
  { key: 'roles', label: 'Institution or role', empty: 'Any institution or role', options: ROLE_OPTIONS },
  { key: 'types', label: 'Grant type', empty: 'Any grant type', options: REVIEW_GRANT_TYPES },
  { key: 'interests', label: 'Funding interests', empty: 'Any funding interest', options: INTEREST_OPTIONS },
  { key: 'locations', label: 'Location', empty: 'Any U.S. location', options: LOCATION_OPTIONS },
];

function EmailChoices({ choices, onChange, compact = false, disabled = false }: {
  choices: ReviewEmailChoices; onChange: (value: ReviewEmailChoices) => void; compact?: boolean; disabled?: boolean;
}) {
  return (
    <fieldset className={[styles.choices, compact ? styles.compactChoices : ''].join(' ')}>
      <legend className={styles.srOnly}>Weekly email subscriptions</legend>
      {([
        { key: 'pulse', title: 'Innovation Pulse', Icon: Mail },
        { key: 'grants', title: 'Grant Matches', Icon: HandCoins },
      ] as const).map(({ key, title, Icon }) => (
        <label key={key} className={[styles.choice, key === 'grants' ? styles.grantChoice : '', choices[key] ? styles.selected : ''].join(' ')}>
          <input type="checkbox" disabled={disabled} checked={choices[key]} onChange={(event) => onChange({ ...choices, [key]: event.target.checked })} />
          <Icon aria-hidden="true" />
          <span>{title}</span>
        </label>
      ))}
    </fieldset>
  );
}

function Checklist({ field, value, open, onOpen, onChange, triggerRef }: {
  field: typeof CRITERIA_FIELDS[number]; value: string[]; open: boolean;
  onOpen: (value: boolean) => void; onChange: (value: string[]) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const id = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const openHandlerRef = useRef(onOpen);
  useEffect(() => { openHandlerRef.current = onOpen; }, [onOpen]);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 280 });
  const selected = field.options.filter((option) => value.includes(option.id));
  const summary = selected.length === 0 ? field.empty
    : selected.length === 1 ? selected[0].shortLabel ?? selected[0].label
      : `${selected.length} selected`;

  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const bounds = triggerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const availableBelow = window.innerHeight - bounds.bottom - 12;
      const menuHeight = Math.min((popoverRef.current?.scrollHeight ?? 276) + 4, 280);
      const above = availableBelow < menuHeight && bounds.top > availableBelow;
      const available = above ? bounds.top - 12 : availableBelow;
      const height = Math.min(menuHeight, Math.max(120, available));
      setPosition({ left: bounds.left, top: above ? bounds.top - height - 6 : bounds.bottom + 6, width: bounds.width, maxHeight: height });
    };
    measure();
    popoverRef.current?.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !groupRef.current?.contains(event.target)) openHandlerRef.current(false);
    };
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    document.addEventListener('pointerdown', outside);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open, triggerRef]);

  const close = () => { onOpen(false); triggerRef.current?.focus(); };
  return (
    <div ref={groupRef} className={styles.criterion} data-criterion={field.key}
      onBlur={(event) => { if (open && event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) onOpen(false); }}>
      <span className={styles.criterionLabel} id={id + '-label'}><i aria-hidden="true" />{field.label}</span>
      <button type="button" ref={triggerRef} className={styles.trigger}
        aria-labelledby={id + '-label ' + id + '-value'} aria-expanded={open} aria-controls={open ? id + '-menu' : undefined}
        onClick={() => onOpen(!open)} onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); onOpen(true); } }}>
        <span id={id + '-value'}>{summary}</span><ChevronDown size={17} aria-hidden="true" />
      </button>
      <div className={styles.chips} aria-label={`${field.label} selections`}>
        {selected.slice(0, 2).map((option) => (
          <button key={option.id} type="button" className={styles.chip}
            aria-label={`Remove ${option.label}`} onClick={() => onChange(value.filter((item) => item !== option.id))}>
            {option.shortLabel ?? option.label}<X size={12} aria-hidden="true" />
          </button>
        ))}
        {selected.length > 2 && <span className={styles.more}>+{selected.length - 2} more</span>}
      </div>
      {open && (
        <div ref={popoverRef} id={id + '-menu'} role="group" aria-labelledby={id + '-label'}
          className={styles.popover} style={position}>
          <div className={styles.menuHeading}><span>Choose any that fit</span>
            <button type="button" onClick={() => onChange([])} disabled={value.length === 0}>Clear</button></div>
          <div className={styles.options}>
            {field.options.map((option) => (
              <label key={option.id} className={styles.option}>
                <input type="checkbox" checked={value.includes(option.id)}
                  onChange={(event) => onChange(changeReviewSelection(value, option.id, event.target.checked))} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <button type="button" className={styles.done} onClick={close}>Done</button>
        </div>
      )}
    </div>
  );
}

/** Aurora presentation with Pulse enrollment and unsaved grant criteria drafts. */
export default function EmailSignup({ id: anchorId, className = '', variant = 'compact', placement = variant }: { id?: string; className?: string; variant?: 'compact' | 'portal'; placement?: string }) {
  const id = useId();
  const [choices, setChoices] = useState<ReviewEmailChoices>({ pulse: false, grants: false });
  const [step, setStep] = useState<Step | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);
  const [honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeReset, setChallengeReset] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    void readNewsletterReadiness().then((value) => { if (active) setReady(value); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!anchorId || window.location.hash !== `#${anchorId}`) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(anchorId);
      if (!target || window.location.hash !== `#${anchorId}`) return;
      const headerHeight = document.querySelector('header nav')?.getBoundingClientRect().height ?? 0;
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [anchorId]);
  const [identity, setIdentity] = useState({ firstName: '', lastName: '', email: '' });
  const [criteria, setCriteria] = useState<ReviewCriteria>({ roles: [], types: [], interests: [], locations: [] });
  const [openField, setOpenField] = useState<ReviewCriterion | null>(null);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const roleRef = useRef<HTMLButtonElement>(null);
  const typeRef = useRef<HTMLButtonElement>(null);
  const interestRef = useRef<HTMLButtonElement>(null);
  const locationRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = { roles: roleRef, types: typeRef, interests: interestRef, locations: locationRef };
  const hasChoices = choices.pulse || choices.grants;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (step && dialog && !dialog.open) dialog.showModal();
    if (!step && dialog?.open) dialog.close();
    if (step) titleRef.current?.focus({ preventScroll: true });
    else openerRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (!step) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [step]);

  const close = () => { if (submitting.current) return; setOpenField(null); setError(''); setStep(null); };
  const open = (button: HTMLButtonElement) => {
    openerRef.current = button;
    if (!hasChoices) { setError('Select Innovation Pulse, Grant Matches, or both to continue.'); return; }
    setError(''); setStep('identity');
  };
  const identityNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    if (!hasChoices) { setError('Select at least one weekly email.'); return; }
    if (!identity.firstName.trim() || !identity.lastName.trim() || !identity.email.trim()) { setError('Enter your first name, last name and email address.'); return; }
    setError('');
    // The proposed grant schema is a local draft only, even if Pulse becomes ready.
    if (choices.grants) { setStep('criteria'); return; }
    if (!ready || honeypot) return;
    if (!turnstileToken) { setError('Complete the security check before signing up.'); return; }
    if (process.env.NODE_ENV !== 'production' || ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
      setError('Signup requests are disabled in this local preview. No information was sent.'); return;
    }
    submitting.current = true;
    setLoading(true);
    const challenge = consumeChallengeToken(turnstileToken);
    setTurnstileToken(challenge.remainingToken);
    trackEvent('newsletter_signup_attempt', { placement });
    try {
      const { response, data } = await postNewsletter({
        email: identity.email.trim(), firstName: identity.firstName.trim(), lastName: identity.lastName.trim(),
        _gotcha: honeypot, turnstileToken: challenge.submissionToken,
        preferences: { pulse: true, grants: false },
        grantCriteria: { audiences: [], locations: [], areas: [], minimumAwardUsd: null },
      });
      if (response.ok && data.success === true) {
        trackEvent('newsletter_signup_success', { placement });
        setMessage(data.message || 'If this is a new subscription, check your inbox to confirm.');
        setIdentity({ firstName: '', lastName: '', email: '' });
        setStep('complete');
      } else {
        setChallengeReset(nextChallengeReset);
        trackEvent('newsletter_signup_error', { placement, reason: 'service' });
        setError(data.error || 'Signup could not be completed. Please try again.');
      }
    } catch (requestError) {
      setChallengeReset(nextChallengeReset);
      trackEvent('newsletter_signup_error', { placement, reason: 'network' });
      setError(requestError instanceof FetchTimeoutError ? 'The request timed out. Please try again.' : 'Network error. Please try again.');
    } finally { submitting.current = false; setLoading(false); }
  };

  return (
    <>
      <section id={anchorId} data-email-signup className={[styles.surface, styles.banner, className].join(' ')} aria-labelledby={id + '-banner-title'}>
        <div className={styles.bannerArt} aria-hidden="true" />
        <div className={styles.bannerIntro}>
          <h2 id={id + '-banner-title'}>Innovation worth reading <span>Grants worth pursuing</span></h2>
          <p>Get our Innovation Pulse and/or relevant grant opportunities delivered to your inbox each week.</p>
        </div>
        <div className={styles.bannerActions}>
          <EmailChoices choices={choices} onChange={(value) => { setChoices(value); setError(''); }} compact disabled={loading} />
          <button type="button" className={styles.primary} onClick={(event) => open(event.currentTarget)}>Sign me up <ArrowRight size={18} aria-hidden="true" /></button>
          <Link className={styles.preferences} href="/email-preferences">Already subscribed? <u>Update preferences</u></Link>
          {!step && error && <p className={styles.error} role="alert">{error}</p>}
        </div>
      </section>
      {typeof document !== 'undefined' && createPortal(
        <dialog ref={dialogRef} className={[styles.surface, styles.dialog].join(' ')} data-signup-dialog
          aria-labelledby={id + '-dialog-title'} aria-describedby={id + '-dialog-description'}
          onCancel={(event) => { event.preventDefault(); if (openField) { triggerRefs[openField].current?.focus(); setOpenField(null); } else close(); }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && openField) {
              event.preventDefault(); event.stopPropagation(); triggerRefs[openField].current?.focus(); setOpenField(null);
            }
            if (event.key !== 'Tab') return;
            const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
            )).filter((control) => control.getClientRects().length > 0);
            const first = controls[0];
            const last = controls[controls.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && (active === first || !controls.includes(active as HTMLElement))) {
              event.preventDefault(); last?.focus();
            } else if (!event.shiftKey && active === last) {
              event.preventDefault(); first?.focus();
            }
          }}
          onClick={(event) => { if (event.target !== event.currentTarget) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); }}>
          <div className={styles.dialogContent}>
            <div className={styles.modalArt} aria-hidden="true" />
            <button type="button" className={styles.close} aria-label="Close signup" onClick={close}><X size={20} aria-hidden="true" /></button>
            <header className={styles.modalHeader}>
              <p className={styles.eyebrow}>{step === 'criteria' ? 'Grant Matches · Step 2 of 2' : step === 'complete' ? 'Innovation Pulse' : choices.grants ? 'Your weekly connection · Step 1 of 2' : 'Your weekly connection'}</p>
              <h2 id={id + '-dialog-title'} ref={titleRef} tabIndex={-1}>{step === 'criteria' ? <>Dial in what <span>fits you.</span></> : step === 'complete' ? <>Check your email <span>to confirm.</span></> : <>Stay connected. <span>Your way.</span></>}</h2>
              <p id={id + '-dialog-description'}>{step === 'criteria' ? 'Explore your grant criteria. Grant Matches signup is not open yet.' : step === 'complete' ? message : 'Choose what reaches your inbox.'}</p>
              {step === 'criteria' && <p className={styles.helper}>Choose any that fit. Leave blank for any.</p>}
            </header>
            {step === 'identity' && (
              <form onSubmit={identityNext} className={styles.identityForm} aria-label="Email signup">
                <input className={styles.srOnly} name="_gotcha" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <EmailChoices choices={choices} onChange={(value) => { setChoices(value); setError(''); }} disabled={loading} />
                <div className={styles.identityGrid}>
                  <label>First name<input name="firstName" disabled={loading} autoComplete="given-name" required maxLength={80} value={identity.firstName} onChange={(event) => setIdentity({ ...identity, firstName: event.target.value })} /></label>
                  <label>Last name<input name="lastName" disabled={loading} autoComplete="family-name" required maxLength={80} value={identity.lastName} onChange={(event) => setIdentity({ ...identity, lastName: event.target.value })} /></label>
                  <label className={styles.emailField}>Email address<input name="email" disabled={loading} type="email" autoComplete="email" required maxLength={254} placeholder="you@yourinstitution.edu" value={identity.email} onChange={(event) => setIdentity({ ...identity, email: event.target.value })} /></label>
                </div>
                {ready && choices.pulse && !choices.grants && <TurnstileChallenge active onTokenChange={setTurnstileToken} resetSignal={challengeReset} statusId={id + '-security'} />}
                {error && <p className={styles.error} role="alert">{error}</p>}
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.back} onClick={close}><ArrowLeft size={18} aria-hidden="true" /> Back</button>
                  <button className={styles.primary} type="submit" disabled={loading || (!choices.grants && (!ready || !turnstileToken))}>{loading ? 'Signing you up…' : choices.grants ? 'Set my grant criteria' : 'Sign me up'}<ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                <p className={styles.previewNote}>{choices.grants ? 'Grant criteria are a draft in this page only. Nothing is sent or saved.' : ready ? 'Check your inbox to confirm your subscription after signing up.' : 'Signups are not open yet. Nothing is sent or saved.'}</p>
              </form>
            )}
            {step === 'criteria' && (
              <>
                <div className={styles.criteriaGrid}>
                  {CRITERIA_FIELDS.map((field) => (
                    <Checklist key={field.key} field={field} value={criteria[field.key]} open={openField === field.key}
                      triggerRef={triggerRefs[field.key]} onOpen={(value) => setOpenField(value ? field.key : null)}
                      onChange={(value) => setCriteria((current) => ({ ...current, [field.key]: value }))} />
                  ))}
                </div>
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.back} onClick={() => { setOpenField(null); setStep('identity'); }}><ArrowLeft size={18} aria-hidden="true" /> Back</button>
                  <button type="button" className={styles.primary} disabled>Start my weekly matches<ArrowRight size={18} aria-hidden="true" /></button>
                </div>
                <p className={styles.footerHint}>Grant Matches signup is not open yet. Your selections are not saved.</p>
                <p className={styles.previewNote}>To sign up for Innovation Pulse when available, go Back and select Innovation Pulse only.</p>
              </>
            )}
            {step === 'complete' && (
              <div className={styles.completion}>
                <p className={styles.completeMark}><Check size={20} aria-hidden="true" />Request received</p>
                <p className={styles.completionNote}>Check your email for the next step.</p>
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.primary} onClick={close}>Done<Check size={18} aria-hidden="true" /></button>
                </div>
              </div>
            )}
          </div>
        </dialog>, document.body,
      )}
    </>
  );
}
