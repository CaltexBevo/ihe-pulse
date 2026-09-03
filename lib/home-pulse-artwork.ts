const HOME_PULSE_ARTWORK: Record<string, string> = {
  '2026-08-28': '/images/innovation-pulse/homepage/2026-08-28-option-a-master.png',
  '2026-08-21': '/images/innovation-pulse/2026-08-21-style-2-waveform-web.png',
};

const HOME_PULSE_SUPPORT_COPY: Record<string, string> = {
  '2026-08-28':
    'AI policy, new programs, classroom tools, and research, distilled for higher ed leaders.',
};

const PULSE_EPISODE_THUMBNAILS: Record<string, string> = {
  '2026-07-03': '/images/innovation-pulse/thumbnails/2026-07-03-style-2-waveform.png',
  '2026-07-10': '/images/innovation-pulse/thumbnails/2026-07-10-style-2-waveform.png',
  '2026-07-17': '/images/innovation-pulse/thumbnails/2026-07-17-style-2-waveform.png',
  '2026-07-24': '/images/innovation-pulse/thumbnails/2026-07-24-style-2-waveform.png',
  '2026-07-31': '/images/innovation-pulse/thumbnails/2026-07-31-style-2-waveform.png',
  '2026-08-07': '/images/innovation-pulse/thumbnails/2026-08-07-style-2-waveform.png',
  '2026-08-14': '/images/innovation-pulse/thumbnails/2026-08-14-style-2-waveform.png',
  '2026-08-21': '/images/innovation-pulse/thumbnails/2026-08-21-style-2-waveform.png',
};

export function getHomePulseArtwork(date: string): string | null {
  return HOME_PULSE_ARTWORK[date] ?? null;
}

export function getHomePulseSupportCopy(date: string): string {
  return (
    HOME_PULSE_SUPPORT_COPY[date] ??
    'The week’s most useful higher education developments, distilled for leaders.'
  );
}

export function getPulseEpisodeThumbnail(date: string): string | null {
  return PULSE_EPISODE_THUMBNAILS[date] ?? null;
}
