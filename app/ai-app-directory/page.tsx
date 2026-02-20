import Link from "next/link";

export const metadata = {
  title: "AI App Directory | Innovating Higher Ed",
  description:
    "AI tools vetted for higher education. Every tool reviewed, rated, and analyzed for teaching, learning, and administrative use.",
};

const categories = [
  "All",
  "General LLMs",
  "Writing & Research",
  "Assessment",
  "Content Creation",
  "Coding",
  "Accessibility",
  "Admin & Productivity",
];

const tools = [
  {
    name: "ChatGPT",
    tagline: "OpenAI's flagship conversational AI",
    category: "General LLMs",
    pricing: "Freemium",
    rating: 4.8,
    reviews: 342,
    featured: true,
    accent: "#10a37f",
  },
  {
    name: "Claude",
    tagline: "Anthropic's nuanced AI assistant",
    category: "General LLMs",
    pricing: "Freemium",
    rating: 4.9,
    reviews: 287,
    featured: true,
    accent: "#d97706",
  },
  {
    name: "Gemini",
    tagline: "Google's multimodal AI platform",
    category: "General LLMs",
    pricing: "Freemium",
    rating: 4.5,
    reviews: 198,
    accent: "#4285f4",
  },
  {
    name: "Perplexity",
    tagline: "AI-powered research and search",
    category: "Writing & Research",
    pricing: "Freemium",
    rating: 4.7,
    reviews: 156,
    accent: "#5c6bc0",
  },
  {
    name: "Gradescope",
    tagline: "AI-assisted grading platform",
    category: "Assessment",
    pricing: "Institutional",
    rating: 4.6,
    reviews: 223,
    accent: "#059669",
  },
  {
    name: "Turnitin",
    tagline: "Academic integrity and AI detection",
    category: "Assessment",
    pricing: "Institutional",
    rating: 3.9,
    reviews: 412,
    accent: "#dc2626",
  },
  {
    name: "Otter.ai",
    tagline: "Meeting transcription and notes",
    category: "Admin & Productivity",
    pricing: "Freemium",
    rating: 4.4,
    reviews: 178,
    accent: "#2563eb",
  },
  {
    name: "Descript",
    tagline: "Video editing with AI transcription",
    category: "Content Creation",
    pricing: "Freemium",
    rating: 4.5,
    reviews: 134,
    accent: "#7c3aed",
  },
  {
    name: "GitHub Copilot",
    tagline: "AI pair programmer",
    category: "Coding",
    pricing: "Paid",
    rating: 4.7,
    reviews: 267,
    accent: "#000000",
  },
  {
    name: "Synthesia",
    tagline: "AI video generation platform",
    category: "Content Creation",
    pricing: "Paid",
    rating: 4.3,
    reviews: 89,
    accent: "#ec4899",
  },
  {
    name: "Notion AI",
    tagline: "AI writing in your workspace",
    category: "Admin & Productivity",
    pricing: "Add-on",
    rating: 4.4,
    reviews: 145,
    accent: "#000000",
  },
  {
    name: "Grammarly",
    tagline: "AI writing assistant",
    category: "Writing & Research",
    pricing: "Freemium",
    rating: 4.5,
    reviews: 523,
    accent: "#15c39a",
  },
];

const featuredTools = tools.filter((t) => t.featured);

function getPricingColor(pricing: string) {
  switch (pricing) {
    case "Free":
      return { bg: "var(--green-dim)", color: "var(--green)" };
    case "Freemium":
      return { bg: "var(--cyan-dim)", color: "var(--cyan)" };
    case "Paid":
      return { bg: "var(--amber-dim)", color: "var(--amber)" };
    case "Institutional":
      return { bg: "var(--purple-dim)", color: "var(--purple)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

export default function AIAppDirectoryPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--teal)] mb-2 flex items-center gap-2">
          <span className="text-[1rem]">🛠️</span>
          AI APP DIRECTORY
        </div>
        <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
          AI Tools Vetted for Higher Ed
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Every tool reviewed, rated, and analyzed for teaching, learning, and
          administrative use. No affiliate links. Just honest assessments.
        </p>
        <div className="flex gap-6 mt-4 font-mono text-[0.68rem] text-[var(--text-muted)]">
          <span>
            <strong className="text-[var(--cyan)]">28+</strong> tools reviewed
          </span>
          <span>
            <strong className="text-[var(--cyan)]">8</strong> categories
          </span>
          <span>
            Updated <strong className="text-[var(--cyan)]">weekly</strong>
          </span>
        </div>
      </div>

      {/* Featured Tools */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--amber)] mb-4">
          Staff Picks
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredTools.map((tool) => (
            <div
              key={tool.name}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 relative overflow-hidden hover:border-[var(--border-hover)] hover:-translate-y-[2px] transition-all duration-300 cursor-pointer"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: tool.accent }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-[12px] flex items-center justify-center text-white text-[1.2rem] font-bold shrink-0"
                  style={{ backgroundColor: tool.accent }}
                >
                  {tool.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[1.2rem] font-bold">{tool.name}</h3>
                    <span className="font-mono text-[0.55rem] font-semibold px-2 py-[2px] rounded-[4px] bg-[var(--amber-dim)] text-[var(--amber)]">
                      Staff Pick
                    </span>
                  </div>
                  <p className="text-[0.82rem] text-[var(--text-secondary)] mb-3">
                    {tool.tagline}
                  </p>
                  <div className="flex items-center gap-3 text-[0.68rem]">
                    <span
                      className="font-mono font-semibold px-2 py-[2px] rounded-[4px]"
                      style={getPricingColor(tool.pricing)}
                    >
                      {tool.pricing}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {tool.category}
                    </span>
                    <span className="text-[var(--amber)]">
                      ★ {tool.rating}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      ({tool.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Category
          </span>
          {categories.map((c, i) => (
            <button
              key={c}
              className={`filter-pill ${i === 0 ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Pricing
          </span>
          <button className="filter-pill active">All</button>
          <button className="filter-pill">Free</button>
          <button className="filter-pill">Freemium</button>
          <button className="filter-pill">Paid</button>
          <button className="filter-pill">Institutional</button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-3 max-w-[400px]">
          <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search tools by name or use case..."
            className="bg-transparent border-none outline-none text-[0.82rem] text-[var(--text)] placeholder:text-[var(--text-muted)] flex-1"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
          All Tools
        </div>
        <div className="grid-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 relative overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] cursor-pointer"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: tool.accent }}
              />

              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-[0.9rem]"
                  style={{ backgroundColor: tool.accent }}
                >
                  {tool.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">
                    {tool.name}
                  </h3>
                  <p className="text-[0.68rem] text-[var(--text-muted)]">
                    {tool.category}
                  </p>
                </div>
              </div>

              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3">
                {tool.tagline}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-[0.55rem] font-semibold px-2 py-[2px] rounded-[4px]"
                  style={getPricingColor(tool.pricing)}
                >
                  {tool.pricing}
                </span>
                <span className="font-mono text-[0.55rem] text-[var(--amber)]">
                  ★ {tool.rating}
                </span>
                <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                  ({tool.reviews})
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="btn-secondary">Load more tools</button>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--teal)] to-[var(--cyan)]" />

          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Know a Tool We Should Review?
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Submit AI tools you&apos;ve found useful in your teaching, research, or
            administrative work.
          </p>
          <button className="btn-primary">Submit a Tool</button>
        </div>
      </div>
    </div>
  );
}
