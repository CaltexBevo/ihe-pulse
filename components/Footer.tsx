import Image from 'next/image';
import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';
import FooterShareButton from './FooterShareButton';
import { PLATFORM_LINKS, PlatformIcon } from './PlatformLinks';
import styles from './Footer.module.css';

const platformLinks = [
  // Match the nav — /innovation-pulse itself redirects to the homepage
  { href: '/innovation-pulse/archive', label: 'Innovation Pulse' },
  { href: '/prompts', label: 'Prompt Navigator' },
  { href: '/ai-directory', label: 'AI Directory' },
];

const communityLinks = [
  { href: '/podcast', label: 'Podcast' },
  { href: '/tinker-lab', label: 'Tinker Lab' },
  { href: '/be-our-guest', label: 'Be Our Guest' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)]" role="contentinfo">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)] py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[minmax(340px,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(240px,1.2fr)] lg:gap-12">
          <div>
            <Link href="/" aria-label="Innovating Higher Ed home" className={styles.logoLink}>
              <span className={styles.logoFrame} aria-hidden="true">
                <Image
                  src="/images/ihe-logo.png"
                  alt=""
                  fill
                  sizes="168px"
                  className={`${styles.logo} ${styles.logoDark}`}
                />
                <Image
                  src="/images/ihe-logo-light.png"
                  alt=""
                  fill
                  sizes="168px"
                  className={`${styles.logo} ${styles.logoLight}`}
                />
              </span>
            </Link>
            <p className="mb-5 mt-3 max-w-[280px] text-[0.78rem] leading-relaxed text-[var(--text-muted)]">
              Empowering educators to navigate the future of teaching, learning,
              and innovation in higher education.
            </p>

            <div className={styles.socialLinks} aria-label="Innovating Higher Ed social links">
              {PLATFORM_LINKS.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialLink} ${styles[platform.name]}`}
                  aria-label={platform.accessibleLabel}
                  title={platform.label}
                >
                  <span className={styles.socialIcon}>
                    <PlatformIcon name={platform.name} />
                  </span>
                  <span className={styles.socialLabel}>{platform.label}</span>
                </a>
              ))}
              <FooterShareButton className={`${styles.socialLink} ${styles.shareButton}`} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-[0.68rem] tracking-[0.1em] text-[var(--text-muted)] uppercase">
              Platform
            </h2>
            <nav className="flex flex-col gap-1" aria-label="Platform links">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 text-[0.8rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--cyan)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-3 font-mono text-[0.68rem] tracking-[0.1em] text-[var(--text-muted)] uppercase">
              Community
            </h2>
            <nav className="flex flex-col gap-1" aria-label="Community links">
              {communityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 text-[0.8rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--cyan)]"
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

      <div className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-col items-center justify-between gap-3 px-[var(--px)] py-4 md:flex-row">
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)]">
            &copy; 2026 Innovating Higher Ed. All rights reserved.
          </span>
          <nav className="flex flex-wrap items-center gap-4 font-mono text-[0.68rem] text-[var(--text-muted)]" aria-label="Legal links">
            <Link href="/about" className="transition-colors hover:text-[var(--cyan)]">About</Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--cyan)]">Terms of Use</Link>
            <Link href="/privacy" className="transition-colors hover:text-[var(--cyan)]">Privacy Policy</Link>
            <Link href="/disclaimer" className="transition-colors hover:text-[var(--cyan)]">Disclaimer</Link>
            <Link href="/ai-disclosure" className="transition-colors hover:text-[var(--cyan)]">AI Disclosure</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
