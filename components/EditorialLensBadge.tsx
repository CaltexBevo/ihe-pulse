'use client';

import {
  type EditorialLens,
  editorialLensColors,
} from '@/lib/data/innovation-pulse-types';

interface EditorialLensBadgeProps {
  lens: EditorialLens;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

// Map lens types to dot colors
const lensDotColors: Record<EditorialLens, string> = {
  "The Practitioner's Playbook": "bg-[var(--cyan)]",
  "The Hard Question": "bg-amber-400",
  "The Student Experience": "bg-green-400",
  "Connecting the Dots": "bg-[var(--magenta)]",
  "The Innovator's Edge": "", // Uses gradient
};

export default function EditorialLensBadge({
  lens,
  size = 'md',
  showDot = true,
}: EditorialLensBadgeProps) {
  const colors = editorialLensColors[lens];
  const isGradient = lens === "The Innovator's Edge";
  const dotColor = lensDotColors[lens];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-4 py-1.5 text-sm gap-2',
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  if (isGradient) {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]}`}
        style={{
          fontFamily: "var(--font-mono)",
          background: "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(200,80,192,0.12))",
          color: "var(--text)",
          letterSpacing: "0.03em",
        }}
      >
        {showDot && (
          <span
            className={`${dotSizes[size]} rounded-full`}
            style={{
              background: "linear-gradient(135deg, var(--cyan), var(--magenta))",
            }}
          />
        )}
        {lens}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]} ${colors.bg} ${colors.text} border ${colors.border}`}
      style={{
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.03em",
      }}
    >
      {showDot && (
        <span
          className={`${dotSizes[size]} rounded-full ${dotColor}`}
        />
      )}
      {lens}
    </span>
  );
}
