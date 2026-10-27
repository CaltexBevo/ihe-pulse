'use client';

import { memo, useEffect, useState, type RefObject } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { installHeroAudioDiagnostics, type HeroAudioDiagnosticsController, type PlaybackReport } from '@/lib/heroAudioDiagnostics';

export const HeroAudioDiagnosticObserver = memo(function HeroAudioDiagnosticObserver({
  audioRef, controllerRef, edition, audioUrl, onReport,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
  controllerRef: RefObject<HeroAudioDiagnosticsController | null>;
  edition: string;
  audioUrl: string;
  onReport: (report: PlaybackReport | null) => void;
}) {
  const searchParams = useSearchParams();
  const enabled = searchParams.get('audio-check') === '1';
  useEffect(() => {
    const audio = audioRef.current;
    if (!enabled || !audio || !audioUrl) {
      onReport(null);
      return;
    }
    const diagnostics = installHeroAudioDiagnostics(audio, edition, { enabled, onChange: onReport });
    controllerRef.current = diagnostics;
    if (!diagnostics) onReport(null);
    return () => { diagnostics?.dispose(); controllerRef.current = null; };
  }, [enabled, edition, audioUrl, audioRef, controllerRef, onReport]);
  return null;
});

function HeroAudioDiagnostics({ report, getReport, onClear }: {
  report: PlaybackReport;
  getReport: () => PlaybackReport;
  onClear: () => void;
}) {
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getReport(), null, 2));
      setMessage('Playback report copied.');
    } catch {
      setExpanded(true);
      setMessage('Copy was unavailable. Select and copy the report below.');
    }
  };
  return (
    <aside aria-label="Playback check" style={{ padding: '1rem', marginTop: '1rem', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '0.75rem', color: 'var(--text)' }}>
      <h2 style={{ color: 'var(--cyan)', fontSize: '1rem' }}>Playback check</h2>
      <p style={{ color: 'var(--text-muted)' }}>This report helps identify why the recording stops. The playback report stays in this tab until you copy it.</p>
      <p>{report.events.length} events recorded. Latest: {report.events.at(-1)?.event ?? 'none'}.</p>
      {!report.storageAvailable && <p>Tab storage is unavailable. This report is in memory and may be lost on reload.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBlock: '0.75rem' }}>
        <button type="button" aria-label="Copy playback report" className="btn-secondary" style={{ minHeight: '44px' }} onClick={copy}>Copy playback report</button>
        <button type="button" aria-label="Clear report" className="btn-secondary" style={{ minHeight: '44px' }} onClick={() => { onClear(); setMessage('Playback report cleared.'); }}>Clear report</button>
        <Link href="/" prefetch={false} scroll={false} aria-label="Exit playback check" className="btn-secondary" style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center' }}>Exit playback check</Link>
      </div>
      <p role="status" style={{ color: 'var(--cyan)' }}>{message}</p>
      <details open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
        <summary>View playback report</summary>
        <pre tabIndex={0} aria-label="Playback report JSON" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: '20rem', overflow: 'auto', fontSize: '0.75rem', userSelect: 'text' }}>{JSON.stringify(report, null, 2)}</pre>
      </details>
    </aside>
  );
}

export default memo(HeroAudioDiagnostics);
