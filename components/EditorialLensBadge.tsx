'use client';

import {
  type EditorialLens,
  editorialLensColors,
} from '@/lib/data/innovation-pulse-types';

interface EditorialLensBadgeProps {
  lens: EditorialLens;
  size?: 'sm' | 'md' | 'lg';
}

export default function EditorialLensBadge({
  lens,
  size = 'md',
}: EditorialLensBadgeProps) {
  const colors = editorialLensColors[lens];
  const isGradient = lens === "The Innovator's Edge";

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  if (isGradient) {
    return (
      <span
        className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]} bg-gradient-to-r from-pulse to-synapse text-white`}
      >
        {lens}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]} ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      {lens}
    </span>
  );
}
