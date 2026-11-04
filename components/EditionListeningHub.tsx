'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Pause, Play, Share2, Check } from 'lucide-react';
import { formatFeatureAudioTime } from '@/lib/featureAudioPlayback';
import { createListeningSession } from '@/lib/editionListeningSession';
import { PLATFORM_LINKS, PlatformIcon } from './PlatformLinks';
import styles from './EditionListeningHub.module.css';

export type EditionTrack = {
  id: 'weekly' | 'feature'; label: string; title: string; clock: string;
  seconds: number; audio: string; image: string; alt: string; peaks: readonly number[];
};

function TrackControls({ track, bindStop, playButton }: { track: EditionTrack; bindStop: (stop: (() => void) | null) => void; playButton: RefObject<HTMLButtonElement | null> }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(false);
  const [session] = useState(createListeningSession);
  const [duration, setDuration] = useState(track.seconds);
  useEffect(() => {
    const audio = audioRef.current!;
    const stop = () => session.stop(audio);
    bindStop(stop);
    return () => { stop(); bindStop(null); };
  }, [bindStop, session]);

  return <div className={styles.controls} data-track={track.id} data-waveform-status="verified">
    <audio ref={audioRef} src={track.audio} preload="metadata"
      onLoadedMetadata={e => { const seconds=e.currentTarget.duration; if(Number.isFinite(seconds)) setDuration(seconds); }}
      onPlay={() => { setPlaying(true); setError(false); }} onPause={() => setPlaying(false)}
      onTimeUpdate={e => setElapsed(e.currentTarget.currentTime)} onEnded={() => setPlaying(false)}
      onError={() => setError(true)} />
    <button ref={playButton} className={styles.play} type="button" aria-label={`${playing ? 'Pause' : 'Play'} ${track.title}`}
      onClick={async () => { const audio=audioRef.current; if (!audio) return; const result=await session.toggle(audio,error); if(result==='unavailable' && audio===audioRef.current) setError(true); }}>
      {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
    </button>
    <div className={styles.timeline}>
      <div className={styles.wave}>
        <svg viewBox="0 0 416 100" preserveAspectRatio="none" aria-hidden="true">
          {track.peaks.map((height,index) => <rect key={index} x={index*4} y={(100-height)/2} width="2.5" height={height} rx="1" className={index/track.peaks.length < elapsed/duration ? styles.played : ''}/>)}
        </svg>
        <input type="range" aria-label={`Seek through ${track.title}`} aria-valuetext={`${formatFeatureAudioTime(elapsed)} of ${track.clock}`}
          min={0} max={duration} step={1} value={elapsed} onChange={e => {
            const audio=audioRef.current; if(audio && Number.isFinite(audio.duration)) { audio.currentTime=Number(e.target.value); setElapsed(audio.currentTime); }
          }} />
      </div>
      <p className={styles.clock}>{formatFeatureAudioTime(elapsed)} <span>/</span> {track.clock}</p>
      {error && <p role="status">Audio could not load. Press play to try again.</p>}
    </div>
  </div>;
}

export default function EditionListeningHub({ tracks, readHref }: { tracks: [EditionTrack,EditionTrack]; readHref: string }) {
  const [index,setIndex] = useState(0);
  const [copied,setCopied] = useState(false);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const stop=useRef<(()=>void)|null>(null);
  const playButton=useRef<HTMLButtonElement>(null);
  const [bindStop]=useState(() => (fn:(()=>void)|null) => { stop.current=fn; });
  const track=tracks[index];
  function select(next:number) { if(next!==index) { stop.current?.(); setCopied(false); setIndex(next); } }
  function keys(e:KeyboardEvent<HTMLButtonElement>) {
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const next=e.key==='Home' ? 0 : e.key==='End' ? 1 : 1-index;
    select(next); buttons.current[next]?.focus();
  }
  async function share() {
    const url='https://www.innovatinghighered.com'+(track.id==='weekly' ? '/innovation-pulse/2026-10-23' : readHref);
    try {
      if(navigator.share) { await navigator.share({title:track.title,url}); return; }
      await navigator.clipboard.writeText(url); setCopied(true);
    } catch { /* The visitor can dismiss their platform's share sheet. */ }
  }
  const artwork=<Image src={track.image} alt={track.alt} fill priority sizes="(max-width: 1200px) 94vw, 1160px" />;
  return <section className={styles.hub} aria-label="Listen to this edition">
    <div className={styles.art}>{track.id==='feature'
      ? <button type="button" className={styles.artButton} aria-label="Play or pause The Measure of a Man narration" onClick={()=>playButton.current?.click()}>{artwork}</button>
      : artwork}</div>
    <div className={styles.selection}>
      <div role="tablist" aria-label="Choose a recording" className={styles.tabs}>
        {tracks.map((t,i) => <button key={t.id} type="button" role="tab" ref={el=>{buttons.current[i]=el;}}
          id={'listen-tab-'+t.id} aria-selected={i===index} aria-controls="edition-track-panel" tabIndex={i===index?0:-1}
          onClick={()=>select(i)} onKeyDown={keys}>{t.label}<span> · {t.clock}</span></button>)}
      </div>
      <Link className={styles.read} href={readHref}>Read The Measure of a Man <span aria-hidden="true">→</span></Link>
    </div>
    <div id="edition-track-panel" role="tabpanel" aria-labelledby={'listen-tab-'+track.id} className={styles.panel}>
      <TrackControls key={track.id} track={track} bindStop={bindStop} playButton={playButton}/>
      <div className={styles.follow}><span>Follow / share</span><div>{PLATFORM_LINKS.map(p=><a key={p.name} href={p.href} aria-label={p.accessibleLabel} target="_blank" rel="noopener noreferrer"><PlatformIcon name={p.name}/></a>)}
        <button type="button" aria-label={copied?'Recording link copied':'Share '+track.title} onClick={share}>{copied?<Check/>:<Share2/>}</button></div></div>
    </div>
  </section>;
}
