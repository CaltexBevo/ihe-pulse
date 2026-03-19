"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompts" },
  { href: "/ai-directory", label: "AI Directory" },
  { href: "/educator-tools", label: "Educator Tools" },
  { href: "/podcast", label: "Podcast" },
  { href: "/tinker-lab", label: "Tinker Lab" },
  { href: "/about", label: "About" },
  { href: "/be-our-guest", label: "Be Our Guest" },
];

export default function Nav() {
  const pathname = usePathname();

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
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/ihe-logo.png"
            alt="Innovating Higher Ed"
            width={180}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
          <span
            className="w-[6px] h-[6px] bg-[var(--green)] rounded-full ml-2"
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

          {/* Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-[var(--border)]">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: Theme Toggle + Menu Button */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-[var(--text-secondary)]"
            aria-label="Open navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
