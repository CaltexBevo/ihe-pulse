'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatWeekCovered, isWeeklyEpisode } from '@/lib/data/innovation-pulse-types';
import NewsletterSignup from '@/components/NewsletterSignup';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface HeroNowPlayingProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
  otherStories?: Array<{ source: string; tease: string; headline?: string }>;
  showExtras?: boolean;  // default true; when false, hides upnext + subscribe
  showHeader?: boolean;  // default true; when false, hides the eyebrow row
  // Controlled mode props
  selectedEpisodeIndex?: number;
  onEpisodeChange?: (index: number, episode: InnovationPulseEpisode) => void;
  onAlsoInEpisodeClick?: () => void; // Called when "Also in this episode" item is clicked
  autoPlay?: boolean; // Auto-play when episode changes
}

export default function HeroNowPlaying({
  latestEpisode,
  recentEpisodes,
  otherStories,
  showExtras = true,
  showHeader = true,
  selectedEpisodeIndex,
  onEpisodeChange,
  onAlsoInEpisodeClick,
  autoPlay = false,
}: HeroNowPlayingProps) {
  // Support both controlled and uncontrolled mode
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = selectedEpisodeIndex !== undefined;
  const selectedIndex = isControlled ? selectedEpisodeIndex : internalIndex;

  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const prevIndexRef = useRef(selectedIndex);

  const currentEpisode = recentEpisodes[selectedIndex] || latestEpisode;
  const paused = !isPlaying;
  const hasAudio = Boolean(currentEpisode.audioUrl);

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
  const durationDisplay = !hasAudio
    ? "Audio coming soon"
    : audioError
    ? "Audio unavailable"
    : duration > 0
    ? formatTime(duration)
    : currentEpisode.audioDuration;

  // The numbered Innovation Pulse series began May 5, 2026. Derive the
  // sequence from the full ordered episode list so adding a new release
  // increments the number instead of leaving the newest card stuck at 16.
  const episodeNumber = recentEpisodes.filter(
    (episode) => episode.date >= '2026-05-05' && episode.date <= currentEpisode.date
  ).length;

  // Dynamic waveform generation based on container width
  useEffect(() => {
    const container = waveformRef.current;
    if (!container || !hasAudio) return;

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
  }, [hasAudio]);

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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
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
      setAudioError(false);

      // Auto-play when episode changes (if controlled and autoPlay or if different from prev)
      if (prevIndexRef.current !== selectedIndex && autoPlay) {
        const playTimer = setTimeout(() => {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch((err) => console.log('Autoplay blocked:', err));
        }, 300);
        return () => clearTimeout(playTimer);
      }
      prevIndexRef.current = selectedIndex;
    }
  }, [currentEpisode?.audioUrl, selectedIndex, autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // AbortError = play interrupted by pause (fast double-click) — not a
      // real failure, don't permanently disable the player.
      audio.play().catch((err: DOMException) => {
        if (err?.name !== "AbortError") setAudioError(true);
      });
    }
    // Don't call setIsPlaying — the event listeners handle it
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

  const setSelectedIndexWrapper = useCallback((newIndex: number) => {
    const episode = recentEpisodes[newIndex];
    if (isControlled && onEpisodeChange && episode) {
      onEpisodeChange(newIndex, episode);
    } else {
      setInternalIndex(newIndex);
    }
  }, [isControlled, onEpisodeChange, recentEpisodes]);

  const handlePrev = () => {
    if (selectedIndex < recentEpisodes.length - 1) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndexWrapper(selectedIndex + 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex > 0) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndexWrapper(selectedIndex - 1);
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/innovation-pulse/${currentEpisode.date}`;
    const shareData = {
      title: currentEpisode.deepDive?.title || 'The Innovation Pulse',
      text: `${hasAudio ? 'Listen to' : 'Read'} The Innovation Pulse: ${currentEpisode.deepDive?.title}`,
      url: shareUrl,
    };

    // Try Web Share API first (mobile)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or error - fall through to clipboard
        if ((err as Error).name !== 'AbortError') {
          console.log('Share failed:', err);
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.log('Copy failed:', err);
    }
  };

  // Handle "Also in this episode" click
  const handleAlsoInEpisodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to hero if not visible
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Start playing
    if (hasAudio && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Autoplay blocked:', err));
    }
    // Call external handler if provided
    if (onAlsoInEpisodeClick) {
      onAlsoInEpisodeClick();
    }
  };

  return (
    <section ref={heroRef} className={`np-hero ${paused ? "np-paused" : ""}`}>
      {currentEpisode.audioUrl && (
        <audio ref={audioRef} src={currentEpisode.audioUrl} preload="metadata" />
      )}

      {showHeader && (
        <div className="np-hero-header">
          <div className="np-brand">The Innovation Pulse</div>
          <div className="np-now">
            <span className="np-dot" />
            {hasAudio ? 'Now Playing · Today’s Broadcast' : 'Latest Briefing · Audio Coming Soon'}
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
            src="/images/mic03.webp"
            alt=""
            className="np-art-mic"
            aria-hidden="true"
          />

          {/* Kicker + Title — RIGHT side, right-aligned */}
          <div className="np-art-right-stack">
            <div className="np-art-kicker">{isWeeklyEpisode(currentEpisode) ? 'WEEKLY AI NEWS FOR ED ◂' : 'DAILY AI NEWS FOR ED ◂'}</div>
            <div className="np-art-show-title">
              The<br />Innovation<br />Pulse
            </div>
          </div>

          {/* Date band — full-width bottom (cadence-aware) */}
          <div className="np-art-date-band">
            <div className="np-art-date-row">
              <div className="np-art-date-year">{year}</div>
              <div className="np-art-date-main">
                {formatWeekCovered(currentEpisode)}
              </div>
            </div>
            <div className="np-art-date-tag">
              {hasAudio
                ? '— 5 MIN · COMMUTE · LUNCH · DRIVE HOME —'
                : '— AUDIO BRIEFING COMING SOON —'}
            </div>
          </div>

          {/* Mobile play overlay — hidden on desktop */}
          {hasAudio && (
            <button
              className="np-artwork-play-overlay"
              onClick={togglePlay}
              aria-label={paused ? "Play episode" : "Pause episode"}
              type="button"
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="32" height="32">
                  <rect x="6" y="4" width="4" height="16" fill="white" />
                  <rect x="14" y="4" width="4" height="16" fill="white" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="32" height="32" style={{ marginLeft: '3px' }}>
                  <polygon points="6,3 20,12 6,21" fill="white" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="np-player">
          <div className="np-kicker">{isWeeklyEpisode(currentEpisode) ? "This Week's AI News for Higher Ed" : "Today's AI News for Higher Ed"}</div>
          <h1 className="np-title">{headline}</h1>
          <div className="np-meta">
            <strong>Episode {episodeNumber}</strong>
            <span className="np-meta-dot">●</span>
            <span>{storyCount} Stories</span>
            <span className="np-meta-dot">●</span>
            <span>{durationDisplay}</span>
            <button
              className="np-share-btn"
              aria-label="Share episode"
              onClick={handleShare}
              type="button"
            >
              {showCopied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="np-share-icon">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="np-share-icon">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {hasAudio ? (
            <>
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
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="np-play-svg">
                  <rect x="6" y="4" width="4" height="16" fill="white" />
                  <rect x="14" y="4" width="4" height="16" fill="white" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="np-play-svg">
                  <polygon points="6,3 20,12 6,21" fill="white" />
                </svg>
              )}
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
            </>
          ) : (
            <div className="np-audio-pending" role="status">
              <span className="np-audio-pending-dot" />
              <span>
                <strong>Written briefing ready.</strong> Audio is still in final production.
              </span>
            </div>
          )}

        </div>

        {/* Also in this episode — full-width footer bar inside card */}
        {otherStories && otherStories.length > 0 && (
          <div className="np-also-in-episode">
            <span className="np-also-label">Also in this episode</span>
            <span className="np-also-stories">
              {otherStories.map((s, i) => (
                <span key={i}>
                  {i > 0 && <span className="np-also-sep">●</span>}
                  <button
                    type="button"
                    onClick={handleAlsoInEpisodeClick}
                    className="np-also-story"
                  >
                    {s.tease || s.headline}
                  </button>
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Inline subscribe strip (cadence-aware) */}
      {showExtras && (
        <div className="np-subscribe">
          <div className="np-sub-copy">
            <strong>Never miss an episode.</strong>{" "}
            <span className="np-sub-muted">
              {isWeeklyEpisode(currentEpisode)
                ? 'Delivered to your inbox every Friday — listen on the drive in, at lunch, or the drive home.'
                : 'Delivered to your inbox every weekday — listen on the drive in, at lunch, or the drive home.'}
            </span>
          </div>
          <NewsletterSignup variant="inline-strip" />
        </div>
      )}
    </section>
  );
}
