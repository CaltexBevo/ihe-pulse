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
      <span className="text-[1rem]">{icon}</span>
      <span
        className="font-mono text-[0.7rem] tracking-[0.12em] uppercase font-semibold"
        style={{ color: titleColor }}
      >
        {title}
      </span>
      {description && (
        <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">
          {description}
        </span>
      )}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="ml-auto font-mono text-[0.62rem] text-[var(--cyan)] tracking-[0.06em] whitespace-nowrap hover:text-[var(--text)] transition-colors"
        >
          {viewAllText} &rarr;
        </Link>
      )}
    </div>
  );
}
