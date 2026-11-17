import type { NextConfig } from "next";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const staticTools = [
  { name: 'Does-It-Fit', alias: true, library: 'pdf' },
  { name: 'cor-checker', library: 'pdf' },
  { name: 'QTI-quiz-builder', library: 'zip' },
  { name: 'AVCFT-Redesign', alias: true, library: '' },
  { name: 'Normas-AVC-Document-Navigator-4000', alias: true, library: '' },
];

function policyHeader(directives: string[]) {
  return [{ key: 'Content-Security-Policy', value: directives.join('; ') }];
}

function productionPolicies() {
  if (process.env.NODE_ENV !== 'production') return [];

  const isPreview = process.env.VERCEL_ENV === 'preview';
  const previewToolbar = isPreview ? ' https://vercel.live' : '';
  const previewSocket = isPreview ? ' wss://ws-us3.pusher.com' : '';
  const previewFonts = isPreview ? ' https://assets.vercel.com' : '';
  const sharedDirectives = [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com${previewToolbar}`,
    `font-src 'self' https://fonts.gstatic.com${previewToolbar}${previewFonts}`,
    "img-src 'self' data: blob: https:",
  ];
  const toolPaths = staticTools.flatMap(({ name, alias }) => alias ? [name, name + '.html'] : [name + '.html']);
  const toolPattern = toolPaths.map((path) => path.replace('.', '\\.')).join('|');
  const appPolicy = {
    source: `/:path((?!(?:${toolPattern})/?$).*)`,
    headers: policyHeader([
      ...sharedDirectives,
      // Static and ISR pages carry Next's inline bootstrap and Flight data.
      `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${previewToolbar}`,
      "script-src-attr 'none'",
      `connect-src 'self' https://challenges.cloudflare.com${previewToolbar}${previewSocket}`,
      `frame-src https://www.podbean.com https://challenges.cloudflare.com${previewToolbar}`,
      "media-src 'self' https://storage.googleapis.com",
      "worker-src 'self'",
    ]),
  };

  const toolPolicies = staticTools.flatMap(({ name, library, alias }) => {
    const html = readFileSync(join(process.cwd(), 'public', name + '.html'), 'utf8').replace(/\r\n?/g, '\n');
    const hashes = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi))
      .filter((match) => match[1].trim())
      .map((match) => "'sha256-" + createHash('sha256').update(match[1]).digest('base64') + "'");
    const pdfLibrary = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
    const scripts = ["'self'", ...hashes];
    if (library === 'pdf') scripts.push(pdfLibrary + 'pdf.min.js', pdfLibrary + 'pdf.worker.min.js');
    if (library === 'zip') scripts.push('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const headers = policyHeader([
      ...sharedDirectives,
      'script-src ' + scripts.join(' ') + previewToolbar,
      // These standalone tools have legacy controls with inline event attributes.
      name === 'Normas-AVC-Document-Navigator-4000' ? "script-src-attr 'none'" : "script-src-attr 'unsafe-inline'",
      library === 'pdf' ? "worker-src blob:" : "worker-src 'none'",
      `connect-src 'self'${previewToolbar}${previewSocket}`,
      isPreview ? 'frame-src https://vercel.live' : "frame-src 'none'",
    ]);
    const paths = alias ? [`/${name}`, `/${name}.html`] : [`/${name}.html`];
    return paths.map((source) => ({ source, headers }));
  });
  return [appPolicy, ...toolPolicies];
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/Does-It-Fit', destination: '/Does-It-Fit.html' },
      { source: '/Normas-AVC-Document-Navigator-4000', destination: '/Normas-AVC-Document-Navigator-4000.html' },
      { source: '/AVCFT-Redesign', destination: '/AVCFT-Redesign.html' },
    ];
  },
  async headers() {
    const unlisted = [
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
    return [...unlisted, ...productionPolicies()];
  },
  outputFileTracingIncludes: {
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
