'use client';

import { useState } from 'react';
import { Play, Pause, Mic, Clock, Calendar, Headphones, ExternalLink } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import PageTransition from '@/components/PageTransition';
import { episodes } from '@/lib/data/episodes';

const platforms = [
  { name: 'Spotify', color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30' },
  { name: 'Apple Podcasts', color: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' },
  { name: 'YouTube', color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
  { name: 'RSS Feed', color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' },
];

export default function PodcastPage() {
  const [playingEp, setPlayingEp] = useState<number | null>(null);

  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={18} className="text-pulse" />
            <p className="text-sm font-mono text-pulse uppercase tracking-widest">
              Podcast
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            IHE <span className="gradient-text">PULSE</span> Podcast
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl">
            Weekly conversations on AI in higher education with Dr. Norma Jones.
            Practical insights for faculty, administrators, and innovators.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="shrink-0 w-40 h-40 rounded-2xl bg-gradient-to-br from-pulse/30 to-synapse/30 border border-white/10 flex flex-col items-center justify-center">
              <Headphones size={48} className="text-pulse mb-2" />
              <span className="text-xs font-mono text-gray-400">IHE PULSE</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">
                Subscribe & Listen
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                New episodes every Wednesday. Available on all major platforms.
              </p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${p.color}`}
                  >
                    {p.name}
                    <ExternalLink size={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">All Episodes</h2>
        <div className="space-y-4">
          {episodes.map((ep) => (
            <div
              key={ep.number}
              className={`glass rounded-xl p-5 flex items-start gap-5 hover:border-pulse/20 transition-colors ${
                ep.featured ? 'border-pulse/10' : ''
              }`}
            >
              <button
                onClick={() =>
                  setPlayingEp(playingEp === ep.number ? null : ep.number)
                }
                className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pulse to-synapse flex items-center justify-center hover:opacity-80 transition-opacity mt-1"
              >
                {playingEp === ep.number ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-pulse">
                    EP. {ep.number}
                  </span>
                  {ep.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pulse/10 text-pulse uppercase">
                      Latest
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1.5">
                  {ep.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {ep.description}
                </p>
                {/* Mobile-only metadata */}
                <div className="sm:hidden flex items-center gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {ep.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {ep.date}
                  </span>
                </div>
                {playingEp === ep.number && (
                  <div className="mt-3">
                    <AudioPlayer title={ep.title} duration={ep.duration} barCount={60} />
                  </div>
                )}
              </div>

              <div className="shrink-0 text-right hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock size={12} />
                  {ep.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar size={12} />
                  {ep.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}
