"use client";

// Working share bar: copy link, X, LinkedIn, email.
// Replaces the four dead <button> placeholders on story pages (UX audit, item c2).

import { useState } from "react";

interface ShareBarProps {
  url: string;
  title: string;
}

const buttonClass =
  "w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all";

export default function ShareBar({ url, title }: ShareBarProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copied = copyState === "copied";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
    } catch {
      // Clipboard unavailable (e.g., non-secure context) — tell the user
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 mb-10">
      <span className="font-mono text-[0.65rem] text-[var(--text-muted)] tracking-[0.08em] uppercase">
        Share
      </span>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title="Copy link"
        className={buttonClass}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-[var(--cyan)]" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>

      {/* X (Twitter) */}
      <a
        href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        title="Share on X"
        className={buttonClass}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-6.8-8.5L19.5 4H18l-5 6L9 4H4z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
        className={buttonClass}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>

      {/* Email */}
      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`}
        aria-label="Share via email"
        title="Share via email"
        className={buttonClass}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </a>

      <span
        aria-live="polite"
        className={`font-mono text-[0.62rem] text-[var(--cyan)] transition-opacity ${
          copyState === "idle" ? "opacity-0" : "opacity-100"
        }`}
      >
        {copied ? "Link copied" : copyState === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
}
