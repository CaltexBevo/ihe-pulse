import Link from "next/link";

const platformLinks = [
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompt Navigator" },
  { href: "/ai-directory", label: "AI Directory" },
];

const communityLinks = [
  { href: "/podcast", label: "Podcast" },
  { href: "/tinker-lab", label: "Tinker Lab" },
  { href: "/be-our-guest", label: "Be Our Guest" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-elevated)] border-t border-[var(--border)]">
      {/* Main Footer - 3 Column Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr] gap-8 md:gap-12">
          {/* Brand Column */}
          <div>
            <div
              className="text-[0.85rem] font-semibold mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Innovating Higher <span className="text-[var(--cyan)]">Ed</span>
            </div>
            <p className="text-[0.78rem] text-[var(--text-muted)] leading-relaxed max-w-[280px]">
              Empowering educators to navigate the future of teaching, learning,
              and innovation in higher education.
            </p>
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
        </div>
      </div>

      {/* Bottom Bar - JetBrains Mono small text */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span
            className="text-[0.68rem] text-[var(--text-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            &copy; 2026 Innovating Higher Ed. All rights reserved.
          </span>
          <div
            className="flex items-center gap-4 text-[0.68rem] text-[var(--text-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Link
              href="/privacy"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--cyan)] transition-colors"
            >
              Terms of Use
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
