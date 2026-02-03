'use client';

import { Activity, Brain, BookOpen, Zap } from 'lucide-react';

const metrics = [
  { icon: Brain, label: '847 AI Tools Indexed', delay: '0s' },
  { icon: BookOpen, label: '2.4k Prompts Curated', delay: '0.1s' },
  { icon: Activity, label: '156 Institutions Connected', delay: '0.2s' },
  { icon: Zap, label: 'Updated 3m ago', delay: '0.3s' },
];

export default function IntelligenceBar() {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 border-b border-white/5 bg-darker/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-8 items-center justify-between text-xs">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="font-semibold text-green-400 uppercase tracking-wider">
              Live
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500 hidden sm:inline">
              Intelligence Network Active
            </span>
          </div>

          {/* Metrics */}
          <div className="hidden md:flex items-center gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-1.5 text-gray-500"
              >
                <metric.icon size={12} className="text-pulse/50" />
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Gradient border bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-pulse/30 to-transparent" />
    </div>
  );
}
