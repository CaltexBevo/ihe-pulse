import Link from "next/link";

interface SectionHeaderProps {
  icon?: string;
  title: string;
  titleColor?: string;
  tagline?: string;
  description?: string;
  viewAllHref?: string;
  viewAllText?: string;
  accentColor?: string;
}

export default function SectionHeader({
  icon,
  title,
  titleColor = "var(--text)",
  tagline,
  description,
  viewAllHref,
  viewAllText = "View all",
  accentColor,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      {/* Main header */}
      <div>
        {/* Icon + Title Row */}
        <div className="flex items-center gap-3 mb-1">
          {icon && <span className="text-[1.4rem]">{icon}</span>}
          <h2
            className="text-[1.75rem] md:text-[2rem] font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: titleColor,
            }}
          >
            {title}
          </h2>
          {/* View All Link - positioned on same row on desktop */}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden md:inline-flex ml-auto text-[0.72rem] text-[var(--cyan)] tracking-[0.06em] whitespace-nowrap hover:text-[var(--text)] transition-colors items-center gap-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {viewAllText} <span className="text-[0.9em]">→</span>
            </Link>
          )}
        </div>

        {/* Tagline */}
        {tagline && (
          <p
            className="text-[0.9rem] md:text-[1rem] text-[var(--text-muted)] leading-relaxed max-w-[600px]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {tagline}
          </p>
        )}

        {/* Legacy description (smaller, mono) */}
        {description && !tagline && (
          <p
            className="text-[0.72rem] text-[var(--text-muted)] mt-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Mobile view all link */}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="md:hidden inline-flex mt-3 text-[0.72rem] text-[var(--cyan)] tracking-[0.06em] whitespace-nowrap hover:text-[var(--text)] transition-colors items-center gap-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {viewAllText} <span className="text-[0.9em]">→</span>
        </Link>
      )}
    </div>
  );
}
