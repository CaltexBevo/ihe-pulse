import type { MetadataRoute } from 'next';
import { getEpisodeDates } from '@/lib/data/innovation-pulse';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.innovatinghighered.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/innovation-pulse`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/feature-coverage/mit-ai-education-purpose`, lastModified: new Date('2026-08-28T12:00:00Z'), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/podcast`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/ai-directory`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/prompts`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/educator-tools`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/tinker-lab`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // Episode pages
  const episodeDates = getEpisodeDates();
  const episodePages = episodeDates.map(date => ({
    url: `${baseUrl}/innovation-pulse/${date}`,
    lastModified: new Date(date + 'T12:00:00Z'),
    changeFrequency: 'never' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...episodePages];
}
