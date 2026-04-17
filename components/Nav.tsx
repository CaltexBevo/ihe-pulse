"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

// Nav order is locked per SKILL.md — only 7 items visible (Tinker Lab and Be Our Guest hidden)
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompts" },
  { href: "/ai-directory", label: "AI Directory" },
  { href: "/educator-tools", label: "Educator Tools" },
  { href: "/podcast", label: "Podcast" },
  { href: "/about", label: "About" },
  // Hidden from nav per 2026-04-17 sprint — pages still exist at /tinker-lab and /be-our-guest
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-[100] border-b border-[var(--border)] glass"
    >
      <div className="flex items-center h-14 px-[var(--px)] max-w-[var(--max-w)] mx-auto">
        {/* Brand Logo with hover glow */}
        <Link
          href="/"
          className="flex items-center shrink-0 transition-all duration-200 hover:scale-[1.02]"
          style={{
            filter: 'none',
            transition: 'transform 0.2s ease, filter 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(0,212,255,0.35))'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
        >
          <Image
            src="/images/ihe-logo.png"
            alt="Innovating Higher Ed"
            width={180}
            height={56}
            className="h-14 w-auto object-contain max-[1100px]:h-12 max-[900px]:h-11"
            priority
          />
          <span
            className="w-[6px] h-[6px] bg-[var(--cyan)] rounded-full ml-2"
            style={{ animation: "pulseDot 2s infinite" }}
          />
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-[0.15rem] ml-auto">
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

          {/* Theme Toggle — hidden until light-mode logo ships */}
          {/* TODO: re-enable when light-mode logo ships */}
          {false && (
            <div className="ml-2 pl-2 border-l border-[var(--border)]">
              <ThemeToggle />
            </div>
          )}
        </div>

        {/* Mobile: Menu Button (Theme toggle hidden until light-mode logo ships) */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          {/* TODO: re-enable ThemeToggle when light-mode logo ships */}
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
        <div className="md:hidden border-t border-[var(--border)] glass">
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
          </div>
        </div>
      )}
    </nav>
  );
}
