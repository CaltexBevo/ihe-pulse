import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

const platformLinks = [
  // Match the nav — /innovation-pulse itself redirects to the homepage
  { href: "/innovation-pulse/archive", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompt Navigator" },
  { href: "/ai-directory", label: "AI Directory" },
];

const communityLinks = [
  { href: "/podcast", label: "Podcast" },
  { href: "/tinker-lab", label: "Tinker Lab" },
  { href: "/be-our-guest", label: "Be Our Guest" },
  { href: "/about", label: "About" },
];

const socialLinks = [
  {
    href: "https://twitter.com/innovatinghied",
    label: "Follow us on X (Twitter)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/company/innovatinghighered",
    label: "Follow us on LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@innovatinghighered",
    label: "Subscribe on YouTube",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-elevated)] border-t border-[var(--border)]" role="contentinfo">
      {/* Main Footer - 4 Column Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 lg:gap-12">
          {/* Brand Column */}
          <div>
            <div
              className="text-[0.85rem] font-semibold mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Innovating Higher <span className="text-[var(--cyan)]">Ed</span>
            </div>
            <p className="text-[0.78rem] text-[var(--text-muted)] leading-relaxed max-w-[280px] mb-5">
              Empowering educators to navigate the future of teaching, learning,
              and innovation in higher education.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4
              className="text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Platform
            </h4>
            <nav className="flex flex-col gap-1">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.8rem] text-[var(--text-secondary)] py-1 hover:text-[var(--cyan)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community Column */}
          <div>
            <h4
              className="text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Community
            </h4>
            <nav className="flex flex-col gap-1">
              {communityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.8rem] text-[var(--text-secondary)] py-1 hover:text-[var(--cyan)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <NewsletterSignup variant="footer" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span
            className="text-[0.68rem] text-[var(--text-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &copy; 2026 Innovating Higher Ed. All rights reserved.
          </span>
          <div
            className="flex items-center gap-4 text-[0.68rem] text-[var(--text-muted)] flex-wrap"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Link
              href="/about"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/disclaimer"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              Disclaimer
            </Link>
            <Link
              href="/ai-disclosure"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              AI Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
