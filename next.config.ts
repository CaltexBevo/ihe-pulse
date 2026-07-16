import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'innovatinghighered.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/ihe-daily-news-audio/**',
      },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/daily-pulse',
        destination: '/innovation-pulse',
        permanent: true,
      },
      {
        source: '/daily-pulse/:date',
        destination: '/innovation-pulse/:date',
        permanent: true,
      },
      // ai-app-directory redirects to ai-directory (canonical URL)
      {
        source: '/ai-app-directory',
        destination: '/ai-directory',
        permanent: true,
      },
      {
        source: '/ai-app-directory/:slug',
        destination: '/ai-directory/:slug',
        permanent: true,
      },
      // Old WordPress URL redirects (post-migration)
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us/', destination: '/about', permanent: true },
      { source: '/prompt-navigator', destination: '/prompts', permanent: true },
      { source: '/prompt-navigator/', destination: '/prompts', permanent: true },
      { source: '/innovating-higher-ed-podcast-with-dr-norma-jones', destination: '/podcast', permanent: true },
      { source: '/innovating-higher-ed-podcast-with-dr-norma-jones/', destination: '/podcast', permanent: true },
      { source: '/innovating-higher-ed-podcast/:slug*', destination: '/podcast', permanent: true },
      { source: '/category/:slug*', destination: '/innovation-pulse', permanent: true },
      { source: '/be_out-guest', destination: '/about', permanent: true },
      { source: '/be_out-guest/', destination: '/about', permanent: true },
      { source: '/author/:slug*', destination: '/about', permanent: true },
      { source: '/educator-tools/', destination: '/educator-tools', permanent: true },
      // :slug+ (one or more segments) — NEVER :slug* here: zero-segment match
      // makes /tinker-lab redirect to itself (infinite 308 loop, site-wide
      // ERR_TOO_MANY_REDIRECTS via footer link prefetch). Fixed 2026-07-15.
      { source: '/tinker-lab/:slug+', destination: '/tinker-lab', permanent: true },
    ];
  },
};

export default nextConfig;
