import Link from "next/link";

const platformLinks = [
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompt Navigator" },
  { href: "/ai-app-directory", label: "AI App Directory" },
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
      {/* Main Footer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8 md:gap-12">
          {/* Brand Column */}
          <div>
            <div className="font-mono text-[0.9rem] font-semibold mb-2">
              Innovating Higher <span className="text-[var(--cyan)]">Ed</span>
            </div>
            <p className="text-[0.78rem] text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
              Empowering educators to navigate the future of teaching, learning,
              and innovation in higher education.
            </p>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3">
              Platform
            </h4>
            <nav className="flex flex-col gap-1">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.78rem] text-[var(--text-secondary)] py-1 hover:text-[var(--cyan)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community Column */}
          <div>
            <h4 className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3">
              Community
            </h4>
            <nav className="flex flex-col gap-1">
              {communityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.78rem] text-[var(--text-secondary)] py-1 hover:text-[var(--cyan)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-[0.68rem] text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Innovating Higher Ed. All rights
            reserved.
          </span>
          <div className="flex items-center gap-4 text-[0.68rem] text-[var(--text-muted)]">
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
