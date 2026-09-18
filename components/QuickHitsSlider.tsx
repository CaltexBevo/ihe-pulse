'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useReducer, useRef, useState, type CSSProperties } from 'react';
import { mapToV4Category } from '@/lib/data/innovation-pulse-types';
import { getHomepageStoryHref, getHomepageStoryImage, type HomepageStory } from '@/lib/homepagePulse';
import { pillColorsFor } from '@/lib/categoryPalette';
import styles from './QuickHitsSlider.module.css';

const DWELL_MS = 3000;
const TRANSITION_MS = 600;
type Snapshot = { visible: number[]; slot: number; cursor: number };
type Pending = { slot: number; incoming: number; target: Snapshot; backwards: boolean };
type State = Snapshot & { history: Snapshot[]; pending: Pending | null };
type Action = { type: 'reset'; count: number; slots: number } | { type: 'next'; count: number; instant: boolean } | { type: 'previous'; instant: boolean } | { type: 'commit' };
function initial(count: number, slots = 3): State {
  const size = Math.min(slots, count);
  return { visible: Array.from({ length: size }, (_, i) => i), slot: 0, cursor: size % Math.max(1, count), history: [], pending: null };
}
function commit(state: State): State {
  if (!state.pending) return state;
  const { visible, slot, cursor } = state;
  return { ...state.pending.target, history: state.pending.backwards ? state.history.slice(0, -1) : [...state.history.slice(-99), { visible, slot, cursor }], pending: null };
}
function reducer(state: State, action: Action): State {
  if (action.type === 'reset') return initial(action.count, action.slots);
  if (action.type === 'commit') return commit(state);
  if (state.pending) return state;
  let pending: Pending;
  if (action.type === 'previous') {
    const target = state.history[state.history.length - 1];
    if (!target) return state;
    const slot = target.visible.findIndex((index, i) => index !== state.visible[i]);
    if (slot < 0) return state;
    pending = { slot, incoming: target.visible[slot], target, backwards: true };
  } else {
    if (action.count <= state.visible.length) return state;
    let incoming = state.cursor;
    while (state.visible.includes(incoming)) incoming = (incoming + 1) % action.count;
    pending = { slot: state.slot, incoming, backwards: false, target: { visible: state.visible.map((value, i) => i === state.slot ? incoming : value), slot: (state.slot + 1) % state.visible.length, cursor: (incoming + 1) % action.count } };
  }
  const next = { ...state, pending };
  return action.instant ? commit(next) : next;
}
function StoryFace({ story }: { story: HomepageStory }) {
  const category = story.category === 'Tool Spotlight' ? story.category : mapToV4Category(story.category);
  const pill = story.feature ? { text: 'var(--amber)' } : pillColorsFor(category);
  const image = getHomepageStoryImage(story);
  return <div className={styles.face}>
    <div className={styles.imageFrame}>{image ? <Image src={image} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw" className={styles.image} /> : <div className={styles.imageFallback}>Innovation Pulse story</div>}</div>
    <div className={styles.body}><h3 className={styles.title}>{story.title}</h3><div className={styles.category} style={{ color: pill.text }}><span className={styles.categoryDot} style={{ backgroundColor: pill.text }} />{story.feature ? 'Original Feature' : category}</div></div>
  </div>;
}
export default function QuickHitsSlider({ stories }: { stories: HomepageStory[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, stories.length, initial);
  const [manualPaused, setManualPaused] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const automaticPaused = manualPaused || pointerPaused || focusPaused || pageHidden || reducedMotion || !isInView;
  const canAdvance = stories.length > state.visible.length;
  useEffect(() => {
    let slots = 0;
    const updateViewport = () => {
      const next = window.innerWidth <= 680 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
      if (next !== slots) { slots = next; dispatch({ type: 'reset', count: stories.length, slots }); }
    };
    updateViewport(); window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [stories]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => { setReducedMotion(media.matches); if (media.matches) dispatch({ type: 'commit' }); };
    const visibility = () => { setPageHidden(document.hidden); if (document.hidden) dispatch({ type: 'commit' }); };
    motion(); visibility(); media.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility);
    return () => { media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setIsInView(Boolean(entry?.isIntersecting)), { threshold: .15 });
    observer.observe(slider); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!state.pending) return;
    const timer = window.setTimeout(() => dispatch({ type: 'commit' }), TRANSITION_MS + 100);
    return () => window.clearTimeout(timer);
  }, [state.pending]);
  useEffect(() => {
    if (automaticPaused || state.pending || !canAdvance) return;
    const timer = window.setTimeout(() => dispatch({ type: 'next', count: stories.length, instant: false }), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [automaticPaused, state.pending, state.slot, canAdvance, stories.length]);
  const move = (backwards: boolean) => dispatch(backwards ? { type: 'previous', instant: reducedMotion } : { type: 'next', count: stories.length, instant: reducedMotion });
  if (!stories.length) return null;
  return <div ref={sliderRef} className={styles.slider} aria-label="Innovation Pulse stories" onMouseEnter={() => { setPointerPaused(true); dispatch({ type: 'commit' }); }} onMouseLeave={() => setPointerPaused(false)} onFocusCapture={() => { setFocusPaused(true); dispatch({ type: 'commit' }); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }} data-carousel-paused={automaticPaused ? 'true' : 'false'}>
    <div className={styles.controls} aria-label="Innovation Pulse story navigation">
      <button type="button" className={styles.arrow} onClick={() => move(true)} disabled={!state.history.length || !!state.pending} aria-label="Restore previous story" aria-controls="innovation-pulse-stories-track"><span aria-hidden="true">←</span></button>
      <button type="button" className={styles.pauseButton} disabled={reducedMotion || !canAdvance} onClick={() => setManualPaused(value => !value)} aria-pressed={manualPaused || reducedMotion} aria-label={reducedMotion ? 'Automatic rotation disabled for reduced motion' : manualPaused ? 'Resume automatic story rotation' : 'Pause automatic story rotation'} aria-controls="innovation-pulse-stories-track"><span aria-hidden="true">{manualPaused || reducedMotion ? '▶' : 'Ⅱ'}</span><span className={styles.controlText}>{reducedMotion ? 'Manual' : manualPaused ? 'Resume' : 'Pause'}</span></button>
      <button type="button" className={styles.arrow} onClick={() => move(false)} disabled={!canAdvance || !!state.pending} aria-label="Show next story" aria-controls="innovation-pulse-stories-track"><span aria-hidden="true">→</span></button>
      <span className={styles.range} aria-live={automaticPaused ? 'polite' : 'off'}>Stories {state.visible.map(index => index + 1).join(', ')} of {stories.length}</span>
    </div>
    <ul id="innovation-pulse-stories-track" className={styles.track} style={{ '--story-slots': state.visible.length } as CSSProperties} tabIndex={0} onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft'); } }} aria-label="This week's Innovation Pulse stories" aria-roledescription="carousel">
      {state.visible.map((index, slot) => {
        const story = stories[index]; if (!story) return null;
        const pending = state.pending?.slot === slot ? state.pending : null;
        return <li key={slot} className={styles.item} aria-label={`${index + 1} of ${stories.length}`}>
          <Link href={getHomepageStoryHref(story)} className={styles.card} aria-label={`${story.feature ? 'Read original feature' : 'Read story'}: ${story.title}`} data-story-index={index} data-story-feature={story.feature ? 'true' : 'false'} onClick={event => { if (pending) event.preventDefault(); }}>
            <span className={styles.srOnly}>{story.title}</span>
            <div aria-hidden="true" inert className={styles.stationary}><StoryFace story={stories[pending ? pending.incoming : index]} /></div>
            {pending && <div key={`${index}-${pending.incoming}`} aria-hidden="true" inert className={styles.outgoing} onAnimationEnd={() => dispatch({ type: 'commit' })}><StoryFace story={story} /></div>}
          </Link>
        </li>;
      })}
    </ul>
  </div>;
}
