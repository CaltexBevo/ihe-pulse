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
    ];
  },
};

export default nextConfig;
