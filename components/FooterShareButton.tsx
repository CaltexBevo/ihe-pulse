'use client';

import { useState } from 'react';
import { ShareGlyph } from './PlatformLinks';

export default function FooterShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: 'Explore Innovating Higher Ed',
      url: window.location.href,
    };

    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare(shareData))
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className ?? 'inline-flex min-h-[36px] items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-1)] px-2.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.05em] text-[var(--cyan)] transition-all hover:border-[var(--cyan)] hover:bg-[var(--cyan-dim)]'}
      aria-label={copied ? 'Page link copied' : 'Share this page'}
      title={copied ? 'Page link copied' : 'Share this page'}
    >
      <span className="grid h-[18px] w-[18px] place-items-center">
        <ShareGlyph />
      </span>
      <span>{copied ? 'Copied' : 'Share'}</span>
    </button>
  );
}
