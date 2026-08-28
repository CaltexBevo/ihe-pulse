import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import EngagementAnalytics from "@/components/EngagementAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.innovatinghighered.com'),
  title: "Innovating Higher Ed | AI Innovation for Education",
  description:
    "AI-powered intelligence for higher education. The Innovation Pulse, AI tools, prompts, and resources for educators navigating the AI revolution.",
  keywords: [
    "higher education",
    "AI in education",
    "educational technology",
    "Innovation Pulse",
    "AI tools for educators",
    "teaching with AI",
  ],
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "The Innovation Pulse — RSS" },
      ],
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Innovating Higher Ed",
    description: "AI-powered intelligence for higher education",
    url: "https://www.innovatinghighered.com",
    siteName: "Innovating Higher Ed",
    type: "website",
    images: [
      {
        url: "https://www.innovatinghighered.com/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Innovating Higher Ed",
      },
    ],
  },
  twitter: {
    card: "summary",
    images: ["https://www.innovatinghighered.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme - dark is always default for first-time visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ihe-theme');
                  var theme = saved;
                  if (!theme || theme === 'system') {
                    theme = 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* Skip navigation link for keyboard users */}
          <a href="#main-content" className="skip-nav">
            Skip to main content
          </a>
          <header>
            <Nav />
          </header>
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
        <EngagementAnalytics />
      </body>
    </html>
  );
}
