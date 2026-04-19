'use client';

import { useState, useRef, useEffect } from 'react';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface HeroNowPlayingProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
  otherStories?: Array<{ source: string; tease: string }>;
  showExtras?: boolean;  // default true; when false, hides upnext + subscribe
  showHeader?: boolean;  // default true; when false, hides the eyebrow row
}

export default function HeroNowPlaying({ latestEpisode, recentEpisodes, otherStories, showExtras = true, showHeader = true }: HeroNowPlayingProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentEpisode = recentEpisodes[selectedIndex] || latestEpisode;
  const paused = !isPlaying;

  // Compute date parts for artwork
  const publishDate = new Date(currentEpisode.date + 'T12:00:00');
  const dayAbbr = publishDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase().slice(0, 3);
  const monthAbbr = publishDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = String(publishDate.getDate()).padStart(2, "0");
  const year = publishDate.getFullYear();
  const isoDate = currentEpisode.date;

  // Headline from lead story
  const headline = currentEpisode.deepDive?.title || "Today's AI News for Higher Ed";

  // Story count and duration
  const storyCount = 1 + (currentEpisode.quickHits?.length || 0);
  const durationDisplay = duration > 0 ? formatTime(duration) : currentEpisode.audioDuration;

  // Episode number (count from oldest)
  const episodeNumber = recentEpisodes.length - selectedIndex;

  // Dynamic waveform generation based on container width
  useEffect(() => {
    const container = waveformRef.current;
    if (!container) return;

    const generate = () => {
      container.innerHTML = "";
      const width = container.offsetWidth;
      if (width === 0) return;
      const barPlusGap = 3; // 2px bar + 1px gap
      const numBars = Math.max(40, Math.floor(width / barPlusGap));
      const frag = document.createDocumentFragment();
      for (let i = 0; i < numBars; i++) {
        const bar = document.createElement("div");
        bar.className = "wf-bar";
        const h1 = 0.12 + Math.random() * 0.65;
        const h2 = Math.min(1, h1 + 0.1 + Math.random() * 0.55);
        bar.style.setProperty("--h1", h1.toFixed(3));
        bar.style.setProperty("--h2", h2.toFixed(3));
        bar.style.animationDuration = (1 + Math.random() * 1.6).toFixed(2) + "s";
        bar.style.animationDelay = (Math.random() * 2.2).toFixed(2) + "s";
        if (Math.random() > 0.78) bar.classList.add("wf-accent");
        frag.appendChild(bar);
      }
      container.appendChild(frag);
    };

    generate();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(generate, 150); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t); };
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEpisode]);

  // Reload audio when episode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentEpisode?.audioUrl) {
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [currentEpisode?.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 15);
    }
  };

  const handlePrev = () => {
    if (selectedIndex < recentEpisodes.length - 1) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex > 0) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <section className={`np-hero ${paused ? "np-paused" : ""}`}>
      {currentEpisode.audioUrl && (
        <audio ref={audioRef} src={currentEpisode.audioUrl} preload="metadata" />
      )}

      {showHeader && (
        <div className="np-hero-header">
          <div className="np-brand">The Innovation Pulse</div>
          <div className="np-now">
            <span className="np-dot" />
            Now Playing · Today&apos;s Broadcast
          </div>
        </div>
      )}

      <div className="np-card">
        <div className="np-artwork">
          {/* IHE logo — top-left inside cover */}
          <img
            src="/images/ihe-logo.png"
            alt="Innovating Higher Ed"
            className="np-art-logo"
          />

          {/* Mic illustration — LEFT side, NOT flipped (nozzle points right toward title) */}
          <img
            src="/images/mic03.png"
            alt=""
            className="np-art-mic"
            aria-hidden="true"
          />

          {/* Kicker + Title — RIGHT side, right-aligned */}
          <div className="np-art-right-stack">
            <div className="np-art-kicker">DAILY AI NEWS FOR ED ◂</div>
            <div className="np-art-show-title">
              The<br />Innovation<br />Pulse
            </div>
          </div>

          {/* Date band — full-width bottom */}
          <div className="np-art-date-band">
            <div className="np-art-date-row">
              <div className="np-art-date-year">{year}</div>
              <div className="np-art-date-main">
                {dayAbbr}<span className="np-art-date-sep">·</span>{monthAbbr} {dayNum}
              </div>
            </div>
            <div className="np-art-date-tag">— 5 MIN · COMMUTE · LUNCH · DRIVE HOME —</div>
          </div>
        </div>

        <div className="np-player">
          <div className="np-kicker">Today&apos;s AI News for Higher Ed</div>
          <h1 className="np-title">{headline}</h1>
          <div className="np-meta">
            <strong>Episode {episodeNumber}</strong>
            <span className="np-meta-dot">●</span>
            <span>{storyCount} Stories</span>
            <span className="np-meta-dot">●</span>
            <span>{durationDisplay}</span>
          </div>

          <div className="np-scrubber">
            <span className="np-time np-time-current">{formatTime(currentTime)}</span>
            <div className="np-waveform" ref={waveformRef} />
            <span className="np-time np-time-total">{durationDisplay}</span>
          </div>

          <div className="np-transport">
            <button className="np-ctrl" aria-label="Skip back 15 seconds" type="button" onClick={handleSkipBack}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V2L6 6l6 4V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/>
                <text x="9" y="15" fontSize="7" fontFamily="monospace" fontWeight="bold" fill="currentColor">15</text>
              </svg>
            </button>
            <button className="np-ctrl" aria-label="Previous" type="button" onClick={handlePrev}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6z"/>
              </svg>
            </button>
            <button className="np-play-main" aria-label={paused ? "Play" : "Pause"} type="button" onClick={togglePlay}>
              <span className="np-play-icon" />
            </button>
            <button className="np-ctrl" aria-label="Next" type="button" onClick={handleNext}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
            <button className="np-ctrl" aria-label="Skip forward 15 seconds" type="button" onClick={handleSkipForward}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V2l6 4-6 4V7c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8z"/>
                <text x="9" y="15" fontSize="7" fontFamily="monospace" fontWeight="bold" fill="currentColor">15</text>
              </svg>
            </button>
            <div className="np-transport-meta">
              <span className="np-kbd">Space</span>
              <span>to play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Also in this episode strip */}
      {showExtras && otherStories && otherStories.length > 0 && (
        <div className="np-upnext">
          <div className="np-upnext-label">Also in this episode</div>
          <div className="np-upnext-stories">
            {otherStories.map((s, i) => (
              <span key={i}>
                {i > 0 && <span className="np-upnext-dot">● </span>}
                <strong>{s.source}</strong> {s.tease}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inline subscribe strip */}
      {showExtras && (
        <div className="np-subscribe">
          <div className="np-sub-copy">
            <strong>Never miss an episode.</strong>{" "}
            <span className="np-sub-muted">
              Delivered to your inbox every weekday — listen on the drive in, at lunch, or the drive home.
            </span>
          </div>
          <form className="np-sub-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.edu" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      )}
    </section>
  );
}
