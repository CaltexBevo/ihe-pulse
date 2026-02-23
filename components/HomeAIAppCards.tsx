'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tool {
  name: string;
  desc: string;
  category: string;
  pricing: string;
  domain: string;
  accent: string;
  badge: 'TRENDING' | 'NEW' | 'STAFF PICK';
  href: string;
}

const tools: Tool[] = [
  {
    name: "ChatGPT",
    desc: "OpenAI's flagship conversational AI. Handles everything from essay feedback to coding help to brainstorming.",
    category: "General LLMs",
    pricing: "Free tier + $20/mo Pro",
    domain: "openai.com",
    accent: "#10a37f",
    badge: "TRENDING",
    href: "/ai-directory/chatgpt",
  },
  {
    name: "Claude",
    desc: "Anthropic's AI assistant built for nuanced, thoughtful analysis. Excels at long-form writing and careful reasoning.",
    category: "General LLMs",
    pricing: "Free tier + $20/mo Pro",
    domain: "anthropic.com",
    accent: "#d97706",
    badge: "STAFF PICK",
    href: "/ai-directory/claude",
  },
  {
    name: "Eduaide.Ai",
    desc: "Purpose-built AI for educators. Creates lesson plans, assessments, differentiated materials, and IEP-aligned content.",
    category: "Lesson Planning",
    pricing: "Freemium",
    domain: "eduaide.ai",
    accent: "#6366f1",
    badge: "NEW",
    href: "/ai-directory/eduaide",
  },
];

function LogoWithFallback({
  domain,
  name,
  accent
}: {
  domain: string;
  name: string;
  accent: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback: colored circle with first letter
    return (
      <div
        className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-white text-[14px]"
        style={{ background: accent }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={32}
      height={32}
      className="object-contain w-[32px] h-[32px]"
      onError={() => setHasError(true)}
    />
  );
}

export default function HomeAIAppCards() {
  return (
    <div className="grid-3">
      {tools.map((tool, i) => (
        <Link
          key={i}
          href={tool.href}
          className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
        >
          {/* Header with logo and accent bar */}
          <div className="relative">
            <div className="h-[3px]" style={{ background: tool.accent }} />
            <div className="flex items-center gap-3 p-4 pb-3">
              {/* App Logo with Fallback */}
              <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                <LogoWithFallback
                  domain={tool.domain}
                  name={tool.name}
                  accent={tool.accent}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">
                  {tool.name}
                </h3>
                <div
                  className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase flex items-center gap-[0.35rem]"
                  style={{ color: tool.accent }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: tool.accent }}
                  />
                  {tool.category}
                </div>
              </div>
              {/* Badge */}
              <span className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] ${
                tool.badge === "NEW"
                  ? "bg-[var(--green-dim)] text-[var(--green)]"
                  : tool.badge === "STAFF PICK"
                    ? "bg-[var(--cyan-dim)] text-[var(--cyan)]"
                    : "bg-[var(--amber-dim)] text-[var(--amber)]"
              }`}>
                {tool.badge}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 pb-4">
            {/* Description */}
            <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
              {tool.desc}
            </p>
            {/* Footer */}
            <div className="flex items-center justify-between font-mono text-[0.56rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
              <span>{tool.pricing}</span>
              <span className="text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Learn more →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
