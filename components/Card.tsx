"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CardProps {
  title: string;
  teaser: string;
  fullContent?: string;
  editorialCallout?: string;
  category: string;
  categoryColor?: string;
  source: string;
  date: string;
  imageUrl?: string;
  badgeText?: string;
  badgeColor?: string;
  href?: string;
  expandable?: boolean;
}

export default function Card({
  title,
  teaser,
  fullContent,
  editorialCallout,
  category,
  categoryColor = "var(--cyan)",
  source,
  date,
  imageUrl,
  badgeText,
  badgeColor = "rgba(200, 80, 192, 0.85)",
  href,
  expandable = true,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (expandable && !href) {
      setIsExpanded(!isExpanded);
    }
  };

  const CardContent = (
    <>
      {/* Image Section - 170px height standard, ALWAYS show for cards */}
      <div className="relative overflow-hidden">
        <div
          className={`relative w-full transition-all duration-400 ${
            isExpanded ? "h-[190px]" : "h-[170px]"
          }`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // Fallback gradient if no image provided
            <div className="w-full h-full bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]" />
          )}
        </div>
        {/* Badge Overlay - JetBrains Mono */}
        {badgeText && (
          <span
            className="absolute top-[10px] left-[10px] text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white backdrop-blur-[8px]"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: badgeColor,
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 pt-3">
        {/* Category Label - JetBrains Mono, 6px dot + uppercase */}
        <div
          className="text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span style={{ color: categoryColor }}>{category}</span>
        </div>

        {/* Title - DM Sans Bold 700, 1rem */}
        <h3
          className="text-[1rem] font-bold leading-[1.22] mb-[0.35rem]"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}
        >
          {title}
        </h3>

        {/* Teaser - DM Sans Regular 400, 0.78rem, 2-line clamp (hidden when expanded) */}
        {!isExpanded && (
          <p
            className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.4rem] line-clamp-2"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
          >
            {teaser}
          </p>
        )}

        {/* Expand indicator - JetBrains Mono */}
        {expandable && !href && (
          <div
            className="text-[0.53rem] text-[var(--text-muted)] flex items-center gap-[0.25rem] mb-[0.4rem]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              &#9662;
            </span>
            <span>{isExpanded ? "Collapse" : "Read more"}</span>
          </div>
        )}

        {/* Expanded content */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* Full Content - DM Sans Regular */}
          {fullContent && (
            <p
              className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.65] mb-[0.65rem]"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
            >
              {fullContent}
            </p>
          )}
          {/* Editorial Callout */}
          {editorialCallout && (
            <div className="text-[0.76rem] leading-[1.6] p-[0.5rem_0.7rem] bg-[rgba(0,212,255,0.04)] border-l-2 border-[var(--cyan)] rounded-r-[5px] mb-[0.6rem]">
              <strong
                className="text-[var(--cyan)] text-[0.6rem] tracking-[0.06em] uppercase block mb-[0.15rem]"
                style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}
              >
                Why it matters
              </strong>
              <span style={{ fontFamily: "var(--font-sans)" }}>
                {editorialCallout}
              </span>
            </div>
          )}
          {/* Read full story link - JetBrains Mono */}
          {href && (
            <Link
              href={href}
              className="inline-flex text-[0.58rem] text-[var(--cyan)] px-2 py-[3px] border border-[rgba(0,212,255,0.2)] rounded-[5px] bg-[rgba(0,212,255,0.06)] mb-[0.45rem] hover:bg-[rgba(0,212,255,0.12)] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Read full story &#8599;
            </Link>
          )}
        </div>

        {/* Footer - JetBrains Mono 0.58rem for source (cyan) + date (muted), border-top */}
        <div className="flex justify-between items-center pt-[0.45rem] border-t border-[var(--border)]">
          <span
            className="text-[0.58rem] text-[var(--cyan)] font-medium"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {source}
          </span>
          <span
            className="text-[0.55rem] text-[var(--text-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {date}
          </span>
        </div>
      </div>
    </>
  );

  if (href && !expandable) {
    return (
      <Link
        href={href}
        className="group block bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer
        transition-all duration-300
        ${
          isExpanded
            ? "border-[rgba(0,212,255,0.2)]"
            : "hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
        }
      `}
    >
      {CardContent}
    </div>
  );
}
