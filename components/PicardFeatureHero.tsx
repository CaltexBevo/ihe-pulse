"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { attemptFeaturePlayback, formatFeatureAudioTime, installExclusiveAudioPlayback } from '@/lib/featureAudioPlayback';
import { PICARD_FEATURED_COVERAGE as feature } from '@/lib/data/featured-coverage-picard';
import styles from './PicardFeature.module.css';

export default function PicardFeatureHero({ home = false }: { home?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1300.172744);
  useEffect(() => installExclusiveAudioPlayback(document), []);
  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { requestRef.current++; audio.pause(); return; }
    const request = ++requestRef.current;
    const retry = error;
    setError(false);
    const result = await attemptFeaturePlayback(audio, retry);
    if (request === requestRef.current && result === 'unavailable') setError(true);
  }
  const Heading = home ? 'h2' : 'h1';
  return <section className={`${styles.stage} ${home ? styles.home : ''}`} aria-label="Special Feature: The Measure of a Man">
    <div className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.eyebrow}>Special Feature · Dr. Norma Jones</div>
        <Heading>The Measure<span className={styles.titleTail}>of a Man</span></Heading>
        <p className={styles.subtitle}>{feature.reportTitle}</p>
        {!home && <p className={styles.byline}>Written and narrated by <strong>Dr. Norma Jones</strong></p>}
        <p className={styles.intro}>{home ? feature.teaser : 'A personal reflection on the leadership, curiosity, and respect for difference that Star Trek helped us imagine, and what those qualities bring to our choices about AI.'}</p>
        <div className={styles.player} id="listen">
          <audio ref={audioRef} src={feature.audioUrl} preload="metadata"
            onLoadedMetadata={() => { const d = audioRef.current?.duration; if (d && Number.isFinite(d)) setDuration(d); }}
            onTimeUpdate={() => setTime(audioRef.current?.currentTime ?? 0)}
            onPlay={() => { setPlaying(true); setError(false); }} onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError(true); }} />
          <div className={styles.actions}>
            <button type="button" className={styles.listen} onClick={toggle} aria-label={playing ? 'Pause the Feature narration' : 'Play the Feature narration'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> {playing ? 'Pause the Feature' : 'Listen to the Feature'}</button>
            <a className={styles.read} href={home ? `/feature-coverage/${feature.slug}#read` : '#read'}>Read the Feature</a>
          </div>
          <input className={styles.seek} type="range" min="0" max={duration} step="0.1" value={Math.min(time,duration)} aria-label="Seek through The Measure of a Man" aria-valuetext={`${formatFeatureAudioTime(time)} of ${formatFeatureAudioTime(duration)}`} onChange={event => { if (audioRef.current) { audioRef.current.currentTime = Number(event.target.value); setTime(Number(event.target.value)); } }} />
          <div className={styles.time}><span>{formatFeatureAudioTime(time)}</span><span>{formatFeatureAudioTime(duration)}</span></div>
          <p className={styles.status} role="status" aria-live="polite">{error ? 'Audio unavailable. Select play to try again.' : 'Narrated by Dr. Norma Jones · Full 21:40 Feature'}</p>
          <a className={styles.download} href={feature.audioUrl} download>Download the narration</a>
        </div>
      </div>
      <div className={styles.artWrap}>
        <button type="button" className={styles.art} onClick={toggle} aria-label={playing ? 'Pause The Measure of a Man, narrated by Dr. Norma Jones' : 'Play The Measure of a Man, narrated by Dr. Norma Jones'}>
          <Image src={feature.imagePath!} alt={feature.imageAlt} width={1536} height={1024} priority sizes={home ? '(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) 51vw, 600px' : '(max-width: 760px) calc(100vw - 36px), (max-width: 1264px) 55vw, 650px'} />
        </button>
        {!home && <p className={styles.artNote}>Select the artwork to listen to the complete Feature.</p>}
      </div>
    </div>
  </section>;
}
