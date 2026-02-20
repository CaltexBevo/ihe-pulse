import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
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
  openGraph: {
    title: "Innovating Higher Ed",
    description: "AI-powered intelligence for higher education",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
