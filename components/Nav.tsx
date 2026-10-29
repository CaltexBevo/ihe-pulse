"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PLATFORM_LINKS, PlatformIcon } from "./PlatformLinks";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

// Nav order updated 2026-06-23: "All Episodes" renamed to "Innovation Pulse"
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/innovation-grants", label: "Grant Portal" },
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompts" },
  { href: "/ai-directory", label: "AI Directory" },
  { href: "/educator-tools", label: "Educator Tools" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
  // Hidden from nav per 2026-04-17 sprint — pages still exist at /tinker-lab and /be-our-guest
];

function HomepagePlatforms() {
  return <div className={styles.homePlatforms} role="group" aria-label="Follow and listen to Innovating Higher Ed">
    {PLATFORM_LINKS.map(platform => <a key={platform.name} href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={platform.accessibleLabel} title={platform.label} className={styles[platform.name]}><PlatformIcon name={platform.name} /></a>)}
  </div>;
}

export default function Nav() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-[100] border-b border-[var(--border)] glass ${isHomepage ? styles.homeNav : ""}`}
    >
      <div className="flex items-center h-14 px-[var(--px)] max-w-[var(--max-w)] mx-auto">
        {/* Brand Logo with hover glow */}
        <Link
          href="/"
          aria-label="Innovating Higher Ed home"
          className={`${styles.logoLink} flex items-center shrink-0 transition-transform duration-200 hover:scale-[1.02]`}
        >
          <span className={styles.logoFrame} aria-hidden="true">
            <Image
              src="/images/ihe-logo.png"
              alt=""
              width={180}
              height={56}
              className={`${styles.logo} ${styles.logoDark}`}
              aria-hidden="true"
              priority
            />
            <Image
              src="/images/ihe-logo-light.png"
              alt=""
              width={180}
              height={56}
              className={`${styles.logo} ${styles.logoLight}`}
              aria-hidden="true"
              priority
            />
          </span>
          <span
            className="w-[6px] h-[6px] bg-[var(--cyan)] rounded-full ml-2"
            style={{ animation: "pulseDot 2s infinite" }}
            aria-hidden="true"
          />
        </Link>

        {/* Nav Links - Desktop */}
        <div
          className={`hidden lg:flex items-center gap-[0.15rem] ml-auto ${isHomepage ? styles.homeDesktop : ""}`}
          data-theme-slot="desktop"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                text-[0.78rem] font-medium px-3 py-[0.4rem] rounded-md
                transition-all duration-200 whitespace-nowrap
                ${
                  isActive(link.href)
                    ? "text-[var(--cyan)] bg-[var(--cyan-dim)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                }
              `}
            >
              {link.label}
            </Link>
          ))}

          {isHomepage && <HomepagePlatforms />}
          <div className="ml-2 pl-2 border-l border-[var(--border)]">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: Theme Toggle + Menu Button */}
        <div
          className={`lg:hidden ml-auto flex items-center gap-1 ${isHomepage ? styles.homeMobile : ""}`}
          data-theme-slot="mobile"
        >
          <ThemeToggle />
          <button
            className="p-2 text-[var(--text-secondary)]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t border-[var(--border)] glass ${isHomepage ? styles.homeDropdown : ""}`}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  block text-[0.9rem] font-medium px-3 py-2.5 rounded-lg
                  transition-all duration-200
                  ${
                    isActive(link.href)
                      ? "text-[var(--cyan)] bg-[var(--cyan-dim)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            {isHomepage && <HomepagePlatforms />}
          </div>
        </div>
      )}
    </nav>
  );
}
