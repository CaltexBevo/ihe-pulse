"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/innovation-pulse", label: "Innovation Pulse" },
  { href: "/prompts", label: "Prompts" },
  { href: "/ai-app-directory", label: "AI App Directory" },
  { href: "/podcast", label: "Podcast" },
  { href: "/tinker-lab", label: "Tinker Lab" },
  { href: "/about", label: "About" },
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
      className="sticky top-0 z-[100] border-b border-[var(--border)]"
      style={{
        background: "rgba(8, 8, 15, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="flex items-center h-14 px-[var(--px)] max-w-[var(--max-w)] mx-auto">
        {/* Brand - INNOVATING HIGHER ED with green pulse dot */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span
            className="font-semibold text-[0.85rem] tracking-[0.05em]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            INNOVATING HIGHER ED
          </span>
          <span
            className="w-[6px] h-[6px] bg-[var(--green)] rounded-full ml-1"
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
                    : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.05)]"
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden ml-auto p-2 text-[var(--text-secondary)]">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
    </nav>
  );
}
