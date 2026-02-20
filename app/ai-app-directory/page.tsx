import Link from "next/link";

export const metadata = {
  title: "AI App Directory | Innovating Higher Ed",
  description:
    "AI tools vetted by educators, for educators. Honest reviews, not marketing fluff.",
};

const categories = [
  { name: "All Categories", count: 38 },
  { name: "General LLMs", count: 5 },
  { name: "Lesson Planning", count: 5 },
  { name: "Assessment", count: 3 },
  { name: "Research", count: 2 },
  { name: "Writing & Feedback", count: 1 },
  { name: "Presentations", count: 4 },
  { name: "Image & Video", count: 10 },
  { name: "Productivity", count: 3 },
  { name: "Student Tools", count: 4 },
];

const roles = ["All Roles", "Faculty", "Administrator", "Student"];

const tools = [
  {
    name: "ChatGPT",
    description: "OpenAI's flagship conversational AI. Handles everything from essay feedback to coding help to brainstorming session agendas.",
    category: "General LLMs",
    pricing: "freemium",
    badge: "trending",
    accent: "#10a37f",
    roles: ["Faculty", "Admin", "Student"],
    values: [
      "Generate discussion questions, quiz items, or rubric drafts in seconds",
      "Free tier handles most faculty tasks — GPT-4o included",
      "Integrates with Canvas via plugins for in-platform use",
    ],
  },
  {
    name: "Claude",
    description: "Anthropic's AI assistant built for nuanced, thoughtful analysis. Excels at long-form writing and careful reasoning.",
    category: "General LLMs",
    pricing: "freemium",
    badge: "trending",
    accent: "#d97706",
    roles: ["Faculty", "Admin", "Student"],
    values: [
      "200K context window — paste entire textbooks or research papers",
      "Strongest at nuanced writing feedback and academic tone",
      "Built with safety-first design, less likely to fabricate citations",
    ],
  },
  {
    name: "Gemini",
    description: "Google's multimodal AI. Deep integration with Google Workspace makes it powerful for faculty already in the Google ecosystem.",
    category: "General LLMs",
    pricing: "freemium",
    badge: "updated",
    accent: "#4285f4",
    roles: ["Faculty", "Admin", "Student"],
    values: [
      "Built into Google Docs, Sheets, Slides — works where you already work",
      "Multimodal: analyze images, charts, and documents natively",
      "Free tier is generous for individual use",
    ],
  },
  {
    name: "Perplexity AI",
    description: "AI-powered research engine that provides cited answers from real sources. Like Google Scholar meets a research assistant.",
    category: "General LLMs",
    pricing: "freemium",
    badge: "trending",
    accent: "#20b2aa",
    roles: ["Faculty", "Admin", "Student"],
    values: [
      "Every answer includes source citations — model research integrity",
      "Academic focus mode searches scholarly databases specifically",
      "Great for quick lit review scoping and fact-checking",
    ],
  },
  {
    name: "Eduaide.Ai",
    description: "Purpose-built AI for educators. Creates lesson plans, assessments, differentiated materials, and IEP-aligned accommodations.",
    category: "Lesson Planning",
    pricing: "freemium",
    badge: "trending",
    accent: "#6366f1",
    roles: ["Faculty"],
    values: [
      "Over 100 education-specific generators — not a generic chatbot",
      "Outputs aligned to standards (Common Core, state frameworks)",
      "Creates differentiated versions for diverse learner needs automatically",
    ],
  },
  {
    name: "Brisk Teaching",
    description: "Chrome extension that works inside your existing platforms. Create, feedback, and differentiate directly in Google Docs, Canvas, and Schoology.",
    category: "Lesson Planning",
    pricing: "free",
    badge: "new",
    accent: "#ec4899",
    roles: ["Faculty"],
    values: [
      "Works inside Canvas, Google Docs, Schoology — no tab switching",
      "One-click reading level adjustment for any text",
      "Generates instant feedback comments on student work",
    ],
  },
  {
    name: "Gradescope",
    description: "AI-assisted grading platform. Upload assignments, create rubrics, and grade consistently across hundreds of submissions.",
    category: "Assessment",
    pricing: "paid",
    accent: "#059669",
    roles: ["Faculty"],
    values: [
      "AI groups similar answers — grade once, apply to all matches",
      "Rubric-based grading ensures consistency across sections and TAs",
      "Handles handwritten work, code, and STEM notation",
    ],
  },
  {
    name: "Turnitin",
    description: "Academic integrity platform with AI writing detection, plagiarism checking, and Feedback Studio for formative assessment.",
    category: "Assessment",
    pricing: "paid",
    badge: "updated",
    accent: "#2563eb",
    roles: ["Faculty", "Admin"],
    values: [
      "Industry-standard AI writing detection with confidence scores",
      "Similarity reports cross-reference billions of sources",
      "Feedback Studio enables inline comments and rubric scoring",
    ],
  },
  {
    name: "Gamma",
    description: "AI presentation creator. Describe what you need, get polished slides with smart layout, design, and content structure.",
    category: "Presentations",
    pricing: "freemium",
    badge: "trending",
    accent: "#8b5cf6",
    roles: ["Faculty", "Student"],
    values: [
      "Creates a full slide deck from a text description in minutes",
      "Designs look professional — not the typical AI-generated aesthetic",
      "Exports to PowerPoint for final editing in familiar tools",
    ],
  },
  {
    name: "Consensus",
    description: "AI-powered academic search engine. Finds and synthesizes insights from peer-reviewed papers — no marketing content mixed in.",
    category: "Research",
    pricing: "freemium",
    accent: "#6d28d9",
    roles: ["Faculty", "Student"],
    values: [
      "Only searches peer-reviewed papers — no blog posts or SEO content",
      "Synthesizes findings across multiple studies into a summary",
      "Great teaching tool for modeling proper research methodology",
    ],
  },
  {
    name: "Synthesia",
    description: "AI video creation with realistic virtual presenters. Create training and lecture videos without cameras, studios, or editing skills.",
    category: "Image & Video",
    pricing: "paid",
    badge: "updated",
    accent: "#6366f1",
    roles: ["Faculty", "Admin"],
    values: [
      "Create professional talking-head videos without filming",
      "160+ AI avatars and 130+ languages for global accessibility",
      "Perfect for standardized training and orientation content",
    ],
  },
  {
    name: "Knowt",
    description: "AI study tool that converts notes and lectures into flashcards and practice quizzes automatically.",
    category: "Student Tools",
    pricing: "freemium",
    badge: "new",
    accent: "#f97316",
    roles: ["Student"],
    values: [
      "Upload lecture notes or slides — AI generates study materials",
      "Creates both flashcards and practice tests from the same content",
      "Free for students — no institutional license needed",
    ],
  },
];

function getPricingStyle(pricing: string) {
  switch (pricing) {
    case "free":
      return { bg: "rgba(46,230,168,0.08)", color: "var(--green)", border: "rgba(46,230,168,0.15)" };
    case "freemium":
      return { bg: "rgba(0,212,255,0.07)", color: "var(--cyan)", border: "rgba(0,212,255,0.15)" };
    case "paid":
      return { bg: "rgba(255,179,71,0.07)", color: "var(--amber)", border: "rgba(255,179,71,0.15)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)", border: "var(--border)" };
  }
}

function getBadgeStyle(badge: string) {
  switch (badge) {
    case "new":
      return { bg: "rgba(46,230,168,0.1)", color: "var(--green)", border: "rgba(46,230,168,0.2)" };
    case "trending":
      return { bg: "rgba(255,179,71,0.1)", color: "var(--amber)", border: "rgba(255,179,71,0.2)" };
    case "updated":
      return { bg: "rgba(0,212,255,0.08)", color: "var(--cyan)", border: "rgba(0,212,255,0.18)" };
    default:
      return null;
  }
}

export default function AIAppDirectoryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-14 pb-8 text-center relative">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,rgba(200,80,192,0.03)_40%,transparent_70%)] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,212,255,0.18)] bg-[rgba(0,212,255,0.04)] text-[var(--cyan)] font-mono text-[0.78rem] font-semibold tracking-[1.8px] uppercase mb-5">
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current" fill="none" strokeWidth="2">
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z" />
          </svg>
          AI App Directory
        </div>

        <h1 className="font-sans text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] mb-4 tracking-[-0.02em]">
          Find the Right <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">AI Tool</span> for Higher Ed
        </h1>
        <p className="text-[1.08rem] text-[var(--text-muted)] max-w-[580px] mx-auto mb-7">
          AI tools vetted by educators, for educators. Honest reviews, not marketing fluff.
        </p>

        {/* Search */}
        <div className="max-w-[600px] mx-auto mb-5">
          <div className="relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, category, or what you need to do..."
              className="w-full px-5 py-3.5 pl-[50px] rounded-[14px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[0.95rem] outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex justify-center gap-2 flex-wrap mb-2">
          {roles.map((role, i) => (
            <button
              key={role}
              className={`font-mono text-[0.82rem] font-medium px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
                i === 0
                  ? "bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.4)] text-[var(--cyan)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(0,212,255,0.35)] hover:text-[var(--text)]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-2 flex-wrap px-5">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              className={`font-mono text-[0.82rem] font-medium px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${
                i === 0
                  ? "bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.4)] text-[var(--cyan)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[rgba(0,212,255,0.35)] hover:text-[var(--text)]"
              }`}
            >
              {cat.name} <span className="font-mono text-[0.72rem] ml-1 opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort Bar */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          {["All", "Recently Added", "Trending", "Updated"].map((sort, i) => (
            <button
              key={sort}
              className={`font-mono text-[0.8rem] font-medium px-3.5 py-1.5 rounded-[8px] border transition-all duration-200 ${
                i === 0
                  ? "bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
        <div className="font-mono text-[0.84rem] text-[var(--text-muted)]">
          {tools.length} tools
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const pricingStyle = getPricingStyle(tool.pricing);
            const badgeStyle = tool.badge ? getBadgeStyle(tool.badge) : null;

            return (
              <div
                key={tool.name}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-[350ms] cursor-pointer hover:border-[var(--border-hover)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] group"
                style={{ "--tool-accent": tool.accent } as React.CSSProperties}
              >
                {/* Accent Strip */}
                <div className="h-[3px] transition-[height] duration-300 group-hover:h-1" style={{ backgroundColor: tool.accent }} />

                <div className="p-5 pb-4">
                  {/* Top Row: Logo + Name + Badge */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    {/* Logo */}
                    <div
                      className="w-[46px] h-[46px] rounded-[12px] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[var(--border)] text-[1.1rem] font-bold"
                      style={{ backgroundColor: tool.accent, color: "#fff" }}
                    >
                      {tool.name[0]}
                    </div>

                    {/* Name + Category */}
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-[1.12rem] font-bold tracking-[-0.01em]">
                        {tool.name}
                      </div>
                      <div className="font-mono text-[0.76rem] text-[var(--text-muted)] font-medium mt-[1px]">
                        {tool.category}
                      </div>
                    </div>

                    {/* Badge */}
                    {badgeStyle && (
                      <span
                        className="font-mono text-[0.68rem] font-semibold tracking-[0.4px] uppercase px-2.5 py-[3px] rounded-[4px]"
                        style={{
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                        }}
                      >
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[0.9rem] text-[var(--text-muted)] leading-[1.55] mb-3.5">
                    {tool.description}
                  </p>

                  {/* Value Points */}
                  <ul className="space-y-2 mb-4">
                    {tool.values.map((value, i) => (
                      <li key={i} className="text-[0.84rem] text-[var(--text)] leading-[1.45] pl-5 relative">
                        <span
                          className="absolute left-0 top-[7px] w-2 h-2 rounded-[2px] opacity-70"
                          style={{ backgroundColor: tool.accent }}
                        />
                        {value}
                      </li>
                    ))}
                  </ul>

                  {/* Footer: Pricing + Roles + Learn More */}
                  <div className="flex items-center gap-2.5 pt-3.5 border-t border-[var(--border)] flex-wrap">
                    {/* Pricing Tag */}
                    <span
                      className="font-mono text-[0.76rem] font-semibold px-3 py-1 rounded-[6px]"
                      style={{
                        backgroundColor: pricingStyle.bg,
                        color: pricingStyle.color,
                        border: `1px solid ${pricingStyle.border}`,
                      }}
                    >
                      {tool.pricing}
                    </span>

                    {/* Role Tags */}
                    <div className="flex gap-1.5 flex-1">
                      {tool.roles.map((role) => (
                        <span
                          key={role}
                          className="font-mono text-[0.7rem] px-2 py-[2px] rounded-[4px] text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Learn More */}
                    <span className="ml-auto text-[0.84rem] font-semibold flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2" style={{ color: tool.accent }}>
                      Learn More
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current" fill="none" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="font-mono text-[0.72rem] text-[var(--cyan)] px-6 py-2.5 rounded-[8px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] hover:border-[rgba(0,212,255,0.3)] transition-all tracking-[0.04em]">
            Load more tools
          </button>
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
