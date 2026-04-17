'use client';

import { useState } from 'react';
import Link from 'next/link';
import aiAppData from '@/lib/data/ai-app-directory.json';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  values?: string[];
  pricing: string;
  priceDetail?: string;
  roles?: string[];
  url: string;
  domain: string;
  accent: string;
  badge?: string | null;
  dateAdded?: string;
  lastUpdated?: string;
  trending?: boolean;
}

// Get 3 most recently added tools
function getRecentlyAddedTools(): Tool[] {
  const tools = aiAppData.tools as Tool[];

  // Filter tools that have dateAdded, then sort by dateAdded descending
  const toolsWithDates = tools.filter(t => t.dateAdded);
  toolsWithDates.sort((a, b) => {
    const dateA = new Date(a.dateAdded || '2020-01-01');
    const dateB = new Date(b.dateAdded || '2020-01-01');
    return dateB.getTime() - dateA.getTime();
  });

  return toolsWithDates.slice(0, 3);
}

function LogoWithFallback({
  domain,
  name,
  accent
}: {
  domain: string;
  name: string;
  accent: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback: colored circle with first letter
    return (
      <div
        className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-white text-[14px]"
        style={{ background: accent }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={32}
      height={32}
      className="object-contain w-[32px] h-[32px]"
      onError={() => setHasError(true)}
    />
  );
}

function getBadgeStyle(badge: string | null | undefined) {
  if (!badge) return null;
  const upperBadge = badge.toUpperCase();
  // Palette rules: cyan/magenta/purple/amber only — no green, teal, orange
  if (upperBadge === "NEW") {
    return "bg-[var(--cyan-dim)] text-[var(--cyan)]";
  } else if (upperBadge === "TRENDING") {
    return "bg-[var(--amber-dim)] text-[var(--amber)]";
  } else if (upperBadge === "UPDATED") {
    return "bg-[var(--purple-dim)] text-[var(--purple)]";
  }
  return "bg-[var(--cyan-dim)] text-[var(--cyan)]";
}

export default function HomeAIAppCards() {
  const recentTools = getRecentlyAddedTools();

  return (
    <div className="grid-3">
      {recentTools.map((tool) => (
        <Link
          key={tool.id}
          href={`/ai-directory/${tool.id}`}
          className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
        >
          {/* Header with logo and accent bar */}
          <div className="relative">
            <div className="h-[3px]" style={{ background: tool.accent }} />
            <div className="flex items-center gap-3 p-4 pb-3">
              {/* App Logo with Fallback */}
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                <LogoWithFallback
                  domain={tool.domain}
                  name={tool.name}
                  accent={tool.accent}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">
                  {tool.name}
                </h3>
                <div
                  className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase flex items-center gap-[0.35rem]"
                  style={{ color: tool.accent }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: tool.accent }}
                  />
                  {tool.category}
                </div>
              </div>
              {/* Badge */}
              {tool.badge && (
                <span className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] uppercase ${getBadgeStyle(tool.badge)}`}>
                  {tool.badge}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-4 pb-4">
            {/* Description */}
            <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
              {tool.description}
            </p>

            {/* Value bullets (if available) */}
            {tool.values && tool.values.length > 0 && (
              <ul className="text-[0.72rem] text-[var(--text-muted)] mb-3 space-y-1">
                {tool.values.slice(0, 2).map((value, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--cyan)] mt-[2px]">✓</span>
                    <span className="line-clamp-1">{value}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Role tags */}
            {tool.roles && tool.roles.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {tool.roles.map((role) => (
                  <span
                    key={role}
                    className="font-mono text-[0.5rem] uppercase px-[6px] py-[2px] rounded-[3px] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  >
                    {role}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between font-mono text-[0.56rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
              <span className="capitalize">{tool.pricing}</span>
              <span className="text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Learn more →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
