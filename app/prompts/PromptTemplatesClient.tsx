"use client";

import { useMemo, useState } from "react";

interface PromptTemplate {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  isNew?: boolean;
  prompt: string;
  bring: string;
  get: string;
  check: string;
  examples: { input: string; output: string }[];
}

interface PromptTemplatesClientProps {
  prompts: PromptTemplate[];
  categories: string[];
  difficulties: string[];
}

// Palette-locked difficulty colors (Rule 17.3): cyan / purple / amber only.
// Amber is reserved for the "Advanced" tier per the taxonomy rules.
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return { bg: "var(--cyan-dim)", color: "var(--cyan)" };
    case "Intermediate":
      return { bg: "var(--purple-dim)", color: "var(--purple)" };
    case "Advanced":
      return { bg: "var(--amber-dim)", color: "var(--amber)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

export function CopyPromptButton({
  text,
  label,
  ariaLabel,
  className,
}: {
  text: string;
  label: string;
  ariaLabel: string;
  className: string;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      // Clipboard API unavailable (e.g., non-secure context) — tell the user
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <button type="button" aria-live="polite" onClick={handleCopy} aria-label={ariaLabel} className={className}>
      {copyState === "copied" ? "Copied!" : copyState === "failed" ? "Copy failed" : label}
    </button>
  );
}

export default function PromptTemplatesClient({
  prompts,
  categories,
  difficulties,
}: PromptTemplatesClientProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (selectedDifficulty !== "All Levels" && p.difficulty !== selectedDifficulty) {
        return false;
      }
      // Category pills use short names ("Discussion") that should also match
      // longer data values ("Discussion Design").
      if (selectedCategory !== "All" && !p.category.startsWith(selectedCategory)) {
        return false;
      }
      if (q) {
        const haystack = `${p.title} ${p.description} ${p.category} ${p.prompt}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [prompts, selectedDifficulty, selectedCategory, query]);

  return (
    <>
      {/* Filters - Two Rows: Difficulty + Category */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-6">
        {/* Difficulty Row with colored pills */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Difficulty
          </span>
          {difficulties.map((d) => {
            const colors = getDifficultyColor(d);
            const isActive = selectedDifficulty === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                aria-label={`Filter by ${d}`}
                aria-pressed={isActive}
                className={`font-mono text-[0.62rem] font-medium px-3 py-1 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)] border-[rgba(255,255,255,0.15)]"
                    : "border-[var(--border)] hover:border-[var(--border-hover)]"
                }`}
                style={
                  !isActive && d !== "All Levels"
                    ? {
                        color: colors.color,
                        borderColor: `color-mix(in srgb, ${colors.color} 30%, transparent)`,
                      }
                    : undefined
                }
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Category Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Category
          </span>
          {categories.map((c) => {
            const isActive = selectedCategory === c;
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                aria-label={`Filter by ${c}`}
                aria-pressed={isActive}
                className={`font-mono text-[0.62rem] font-medium px-3 py-1 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)] border-[rgba(255,255,255,0.15)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-3 max-w-[400px] focus-within:border-[var(--border-hover)] transition-colors">
          <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts by keyword or task..."
            aria-label="Search prompts"
            className="bg-transparent border-none outline-none text-[0.82rem] text-[var(--text)] placeholder:text-[var(--text-muted)] flex-1"
          />
        </div>
      </div>

      {/* Prompt Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <p className="font-mono text-[0.7rem] text-[var(--text-secondary)] mb-4" aria-live="polite">
          {filtered.length} prompts{query.trim() ? ` matching “${query.trim()}”` : ""}
        </p>
        {filtered.length === 0 ? (
          <p className="text-[0.85rem] text-[var(--text-muted)] py-8">
            No prompts match those filters yet. Try a different category or clear the search.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((prompt) => (
              <div
                key={prompt.title}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />

                {/* Tags */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span
                    className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                    style={{
                      backgroundColor: getDifficultyColor(prompt.difficulty).bg,
                      color: getDifficultyColor(prompt.difficulty).color,
                    }}
                  >
                    {prompt.difficulty}
                  </span>
                  <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--purple-dim)] text-[var(--purple)]">
                    {prompt.category}
                  </span>
                  {prompt.isNew && (
                    <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                      New
                    </span>
                  )}
                </div>

                {/* Title - DM Sans Bold */}
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
                  {prompt.title}
                </h3>

                {/* Description */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3">
                  {prompt.description}
                </p>

                <PromptGuidance prompt={prompt} />
                <details className="mb-3 text-[0.78rem]">
                  <summary className="cursor-pointer text-[var(--cyan)] py-2">Read full prompt</summary>
                  <p className="font-mono text-[0.68rem] text-[var(--text-secondary)] bg-[var(--surface)] rounded-[7px] p-3 leading-[1.6] whitespace-pre-wrap break-words">{prompt.prompt}</p>
                </details>
                <PromptExamples examples={prompt.examples} />

                {/* Footer with copy button */}
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] font-mono text-[0.55rem] text-[var(--text-muted)]">
                  <CopyPromptButton
                    text={prompt.prompt}
                    label="Copy"
                    ariaLabel={`Copy ${prompt.title} prompt`}
                    className="ml-auto text-[var(--cyan)] px-2 py-[3px] rounded-[4px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function PromptGuidance({ prompt }: { prompt: Pick<PromptTemplate, "bring" | "get" | "check"> }) {
  return <dl className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.6] space-y-2 mb-3">
    {([['Bring', prompt.bring], ['Get', prompt.get], ['Check', prompt.check]]).map(([label, value]) => <div key={label}><dt className="inline font-semibold text-[var(--text)]">{label}: </dt><dd className="inline">{value}</dd></div>)}
  </dl>;
}

export function PromptExamples({ examples }: { examples: PromptTemplate["examples"] }) {
  if (!examples.length) return null;
  return <details className="mb-3 text-[0.78rem] text-[var(--text-secondary)]">
    <summary className="cursor-pointer text-[var(--cyan)] py-2">Synthetic worked examples</summary>
    <p className="mb-3">Recorded sample outputs from September 6, 2026. These illustrate review checks, not classroom validation or a guarantee of future results.</p>
    {examples.map((example, index) => <div key={index} className="border-t border-[var(--border)] py-3">
      <p className="font-semibold mb-2">Example {index + 1}: synthetic input</p>
      <p className="whitespace-pre-wrap break-words mb-3">{example.input}</p>
      <p className="font-semibold mb-2">Recorded output</p>
      <p className="whitespace-pre-wrap break-words">{example.output}</p>
    </div>)}
  </details>;
}
