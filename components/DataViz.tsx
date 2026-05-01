'use client';

import { useEffect, useRef, useState } from 'react';

// ── DataViz Types ──────────────────────────────────────────────────────────

export interface DataPoint {
  label: string;
  value: number;
  unit?: string;
}

export interface DataVizConfig {
  type: 'bar' | 'donut' | 'comparison';
  title?: string;
  data: DataPoint[];
  source?: string;
}

interface DataVizProps {
  config: DataVizConfig;
  className?: string;
}

// ── Palette (from DESIGN-TOKENS.md) ─────────────────────────────────────────
// Primary: cyan #00d4ff, Secondary: magenta #b040a8, Tertiary: purple #a78bfa, Accent: amber #f59e0b

const CHART_COLORS = [
  'var(--cyan)',      // #00d4ff
  'var(--magenta)',   // #b040a8
  'var(--purple)',    // #a78bfa
  'var(--amber)',     // #f59e0b
];

// ── Animation Hook ──────────────────────────────────────────────────────────

function useIntersectionAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ── Bar Chart Component ─────────────────────────────────────────────────────

function BarChart({ data, isVisible }: { data: DataPoint[]; isVisible: boolean }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const percentage = (item.value / maxValue) * 100;
        const color = CHART_COLORS[i % CHART_COLORS.length];

        return (
          <div key={i} className="space-y-1">
            {/* Label row */}
            <div className="flex justify-between items-baseline">
              <span
                className="text-[0.75rem] text-[var(--text-secondary)] leading-tight"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {item.label}
              </span>
              <span
                className="text-[0.85rem] font-bold tabular-nums"
                style={{ fontFamily: 'var(--font-mono)', color }}
              >
                {item.value}{item.unit || ''}
              </span>
            </div>
            {/* Bar */}
            <div className="h-[10px] bg-[var(--surface)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: isVisible ? `${percentage}%` : '0%',
                  backgroundColor: color,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Donut Chart Component ───────────────────────────────────────────────────

function DonutChart({ data, isVisible }: { data: DataPoint[]; isVisible: boolean }) {
  // Single value donut - show the first data point as the main stat
  const mainData = data[0];
  const value = mainData?.value || 0;
  const unit = mainData?.unit || '%';

  // Calculate circumference for a 60px radius circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (value / 100));

  return (
    <div className="flex items-center justify-center gap-6">
      {/* SVG Donut */}
      <div className="relative w-[140px] h-[140px] flex-shrink-0">
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--surface)"
            strokeWidth="14"
          />
          {/* Animated value circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? strokeDashoffset : circumference}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[1.75rem] font-bold text-[var(--cyan)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {value}{unit}
          </span>
        </div>
      </div>

      {/* Label */}
      {mainData?.label && (
        <div className="flex-1 min-w-0">
          <p
            className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.4]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {mainData.label}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Comparison Chart Component ──────────────────────────────────────────────

function ComparisonChart({ data, isVisible }: { data: DataPoint[]; isVisible: boolean }) {
  // Expects exactly 2 data points for before/after comparison
  const before = data[0];
  const after = data[1];

  if (!before || !after) return null;

  const maxValue = Math.max(before.value, after.value);
  const beforePercent = (before.value / maxValue) * 100;
  const afterPercent = (after.value / maxValue) * 100;
  const change = after.value - before.value;
  const changePercent = ((change / before.value) * 100).toFixed(0);
  const isPositive = change > 0;

  return (
    <div className="space-y-4">
      {/* Arrow indicator */}
      <div className="flex items-center justify-center gap-4">
        {/* Before value */}
        <div className="text-center">
          <span
            className="text-[1.5rem] font-bold text-[var(--text-muted)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {before.value}{before.unit || ''}
          </span>
          <p
            className="text-[0.7rem] text-[var(--text-dim)] mt-0.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {before.label}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-[2px] bg-[var(--text-dim)]" />
          <svg
            className="w-5 h-5"
            fill="none"
            stroke={isPositive ? 'var(--cyan)' : 'var(--amber)'}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        {/* After value */}
        <div className="text-center">
          <span
            className="text-[1.5rem] font-bold text-[var(--cyan)]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {after.value}{after.unit || ''}
          </span>
          <p
            className="text-[0.7rem] text-[var(--text-dim)] mt-0.5"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {after.label}
          </p>
        </div>
      </div>

      {/* Visual bars */}
      <div className="space-y-2">
        <div className="h-[8px] bg-[var(--surface)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--text-muted)] transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${beforePercent}%` : '0%',
              opacity: 0.5,
            }}
          />
        </div>
        <div className="h-[8px] bg-[var(--surface)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--cyan)] transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${afterPercent}%` : '0%',
              transitionDelay: '200ms',
            }}
          />
        </div>
      </div>

      {/* Change indicator */}
      <div className="flex justify-center">
        <span
          className="text-[0.7rem] font-semibold px-2 py-0.5 rounded"
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: isPositive ? 'var(--cyan-soft)' : 'var(--amber-soft)',
            color: isPositive ? 'var(--cyan)' : 'var(--amber)',
          }}
        >
          {isPositive ? '+' : ''}{changePercent}% change
        </span>
      </div>
    </div>
  );
}

// ── Main DataViz Component ──────────────────────────────────────────────────

export default function DataViz({ config, className = '' }: DataVizProps) {
  const { ref, isVisible } = useIntersectionAnimation();

  if (!config?.data || config.data.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`dataviz-container ${className}`}
    >
      {/* Optional title */}
      {config.title && (
        <h4
          className="text-[0.8rem] font-semibold text-[var(--text)] mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {config.title}
        </h4>
      )}

      {/* Chart */}
      <div className="chart-content">
        {config.type === 'bar' && <BarChart data={config.data} isVisible={isVisible} />}
        {config.type === 'donut' && <DonutChart data={config.data} isVisible={isVisible} />}
        {config.type === 'comparison' && <ComparisonChart data={config.data} isVisible={isVisible} />}
      </div>

      {/* Source attribution */}
      {config.source && (
        <p
          className="text-[0.6rem] text-[var(--text-dim)] mt-3 text-right"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Source: {config.source}
        </p>
      )}
    </div>
  );
}
