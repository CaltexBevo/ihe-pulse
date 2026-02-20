import Link from "next/link";

interface SectionHeaderProps {
  icon: string;
  title: string;
  titleColor?: string;
  description?: string;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function SectionHeader({
  icon,
  title,
  titleColor = "var(--cyan)",
  description,
  viewAllHref,
  viewAllText = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-[0.6rem] mb-6 flex-wrap">
      {/* Icon */}
      <span className="text-[1rem]">{icon}</span>

      {/* Section Name - JetBrains Mono, uppercase */}
      <span
        className="text-[0.7rem] tracking-[0.12em] uppercase font-semibold"
        style={{
          fontFamily: "var(--font-mono)",
          color: titleColor,
        }}
      >
        {title}
      </span>

      {/* Description - JetBrains Mono, muted */}
      {description && (
        <span
          className="text-[0.6rem] text-[var(--text-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {description}
        </span>
      )}

      {/* View All Link - JetBrains Mono */}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="ml-auto text-[0.62rem] text-[var(--cyan)] tracking-[0.06em] whitespace-nowrap hover:text-[var(--text)] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {viewAllText} &rarr;
        </Link>
      )}
    </div>
  );
}
