import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import IntelligenceBar from "@/components/IntelligenceBar";
import Footer from "@/components/Footer";
import LivingBackground from "@/components/LivingBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IHE PULSE | Innovating Higher Ed",
  description:
    "AI-powered intelligence for higher education. Tools, prompts, and resources for educators navigating the AI revolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark text-foreground`}
      >
        <LivingBackground />
        <Navigation />
        <IntelligenceBar />
        {/* pt-24 accounts for fixed nav (h-16) + intelligence bar (h-8) */}
        <main className="pt-24 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
