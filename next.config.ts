import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/Does-It-Fit', destination: '/Does-It-Fit.html' },
      { source: '/Normas-AVC-Document-Navigator-4000', destination: '/Normas-AVC-Document-Navigator-4000.html' },
      { source: '/AVCFT-Redesign', destination: '/AVCFT-Redesign.html' },
    ];
  },
  async headers() {
    return [
      '/Does-It-Fit',
      '/Does-It-Fit.html',
      '/Normas-AVC-Document-Navigator-4000',
      '/Normas-AVC-Document-Navigator-4000.html',
      '/normas-avc-navigator/:path*',
      '/AVCFT-Redesign',
      '/AVCFT-Redesign.html',
    ].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
  outputFileTracingIncludes: {
    "/api/newsletter/share": ["./data/newsletter-share/edition-20.html", "./data/newsletter-share/edition-20.json", "./data/newsletter-share/edition-21.html", "./data/newsletter-share/edition-21.json"],
    "/innovation-grants/opengraph-image": ["./public/fonts/inter-bold.ttf"],
  },
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
        source: '/innovation-pulse/story/make-it-so-how-we-made-the-my-voice-at-scale-video',
        destination: '/feature-coverage/my-voice-at-scale',
        permanent: true,
      },
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
      // Require one or more segments — NEVER :slug* here: zero-segment match
      // makes /tinker-lab redirect to itself (infinite 308 loop, site-wide
      // ERR_TOO_MANY_REDIRECTS via footer link prefetch). Fixed 2026-07-15.
      // The two retired articles must reach their normal route 404 instead.
      { source: '/tinker-lab/:slug((?!(?:wonka-lantern|chatgpt-pro)/?$).+)', destination: '/tinker-lab', permanent: true },
    ];
  },
};

export default nextConfig;
