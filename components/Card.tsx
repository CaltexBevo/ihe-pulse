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
  badgeColor = "var(--magenta)",
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
      {/* Image */}
      {imageUrl && (
        <div className="relative overflow-hidden">
          <div
            className={`relative w-full transition-all duration-400 ${
              isExpanded ? "h-[190px]" : "h-[170px]"
            }`}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          {badgeText && (
            <span
              className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white backdrop-blur-[8px]"
              style={{ backgroundColor: badgeColor }}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-4 pt-3">
        {/* Category */}
        <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
          <span
            className="w-[5px] h-[5px] rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <span style={{ color: categoryColor }}>{category}</span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-[1.02rem] font-bold leading-[1.22] mb-[0.35rem]">
          {title}
        </h3>

        {/* Teaser (hidden when expanded) */}
        {!isExpanded && (
          <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.4rem] line-clamp-2">
            {teaser}
          </p>
        )}

        {/* Expand indicator */}
        {expandable && !href && (
          <div className="font-mono text-[0.53rem] text-[var(--text-muted)] flex items-center gap-[0.25rem] mb-[0.4rem]">
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
          {fullContent && (
            <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.65] mb-[0.65rem]">
              {fullContent}
            </p>
          )}
          {editorialCallout && (
            <div className="text-[0.76rem] leading-[1.6] p-[0.5rem_0.7rem] bg-[rgba(0,212,255,0.04)] border-l-2 border-[var(--cyan)] rounded-r-[5px] mb-[0.6rem]">
              <strong className="text-[var(--cyan)] font-semibold text-[0.6rem] font-mono tracking-[0.06em] uppercase block mb-[0.15rem]">
                Why it matters
              </strong>
              {editorialCallout}
            </div>
          )}
          {href && (
            <Link
              href={href}
              className="inline-flex font-mono text-[0.58rem] text-[var(--cyan)] px-2 py-[3px] border border-[rgba(0,212,255,0.2)] rounded-[5px] bg-[rgba(0,212,255,0.06)] mb-[0.45rem] hover:bg-[rgba(0,212,255,0.12)] transition-colors"
            >
              Read full story &#8599;
            </Link>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-[0.45rem] border-t border-[var(--border)]">
          <span className="font-mono text-[0.58rem] text-[var(--cyan)] font-medium">
            {source}
          </span>
          <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
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
        className="block bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer
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
