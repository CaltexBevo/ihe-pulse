"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  attemptFeaturePlayback,
  formatFeatureAudioTime,
  installExclusiveAudioPlayback,
} from "@/lib/featureAudioPlayback";
import styles from "./FeatureAudioPlayer.module.css";

export default function FeatureAudioPlayer({
  audioUrl,
  audioTitle,
  sourceNote,
}: {
  audioUrl: string;
  audioTitle: string;
  sourceNote?: { text: string; url?: string };
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playRequestRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => installExclusiveAudioPlayback(document), []);

  const syncTime = useCallback(() => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.currentTime)) setCurrentTime(audio.currentTime);
  }, []);

  const syncDuration = useCallback(() => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      playRequestRef.current += 1;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const request = ++playRequestRef.current;
    const wasRetry = hasError;
    setHasError(false);
    const result = await attemptFeaturePlayback(audio, wasRetry);
    if (request !== playRequestRef.current) return;
    if (result === "unavailable") {
      setIsPlaying(false);
      setHasError(true);
    }
  };

  const seek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || duration <= 0) return;
    const nextTime = Number(event.currentTarget.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onTimeUpdate={syncTime}
        onLoadedMetadata={syncDuration}
        onDurationChange={syncDuration}
        onPlay={() => {
          setHasError(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          syncTime();
        }}
        onError={() => {
          setIsPlaying(false);
          setHasError(true);
        }}
      />
      <button
        type="button"
        className={styles.playButton}
        onClick={togglePlayback}
        aria-label={isPlaying ? `Pause ${audioTitle}` : `Listen to ${audioTitle}`}
      >
        <span className={styles.icon} aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
        <span>{isPlaying ? "Pause the Feature" : "Listen to the Feature"}</span>
      </button>
      <div className={styles.details}>
        <span className={styles.status} role="status" aria-live="polite">
          {hasError ? "Audio unavailable. Select play to try again." : "Narrated by Dr. Norma Jones"}
        </span>
        {duration > 0 && (
          <div className={styles.timeline}>
            <span className={styles.time}>{formatFeatureAudioTime(currentTime)}</span>
            <input
              className={styles.seek}
              type="range"
              min="0"
              max={duration}
              step="1"
              value={Math.min(currentTime, duration)}
              onChange={seek}
              aria-label="Seek in Feature audio"
              aria-valuetext={`${formatFeatureAudioTime(currentTime)} of ${formatFeatureAudioTime(duration, true)}`}
            />
            <span className={styles.time}>{formatFeatureAudioTime(duration, true)}</span>
          </div>
        )}
        {sourceNote && (
          <p className={styles.sourceNote}>
            Source note: {sourceNote.url ? <a href={sourceNote.url} target="_blank" rel="noopener noreferrer">{sourceNote.text}</a> : sourceNote.text}
          </p>
        )}
      </div>
    </div>
  );
}
