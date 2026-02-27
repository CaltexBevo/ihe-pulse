# Innovating Higher Ed — Executive Summary

**Prepared for Executive Advisory Review**
**February 2026**

---

## Purpose of This Document

This document provides a comprehensive overview of InnovatingHigherEd.com — what it is, who it serves, what it currently offers, and where it is headed — to give the advisory team sufficient context to evaluate whether the upcoming **AI College Ranking** research initiative should be integrated into InnovatingHigherEd.com or launched as a standalone property with a cross-link relationship.

---

## 1. Platform Identity

**Innovating Higher Ed** (innovatinghighered.com) is a digital media and professional development platform focused exclusively on helping higher education professionals — faculty, administrators, and instructional designers — navigate AI adoption with confidence.

The platform is led by **Dr. Norma Jones**, a college faculty member and AI integration leader who serves as the editorial voice, podcast host, and public face of the brand. **CalTex** is the technical producer responsible for platform engineering, content automation, and infrastructure.

**Core Philosophy:** *"The future is being shaped right now — come help shape it, or it gets shaped without you."*

The platform positions itself as empowering rather than intimidating — meeting educators where they are and giving them practical tools and perspectives, not just theory.

---

## 2. The Problem It Addresses

Higher education is under unprecedented pressure. Undergraduate enrollment declined from 18 million (2016) to 16.5 million (2022). Tuition costs have outpaced inflation. Alternative credentials compete aggressively with traditional degrees. And AI is fundamentally reshaping how knowledge is created, taught, and assessed.

Faculty and administrators know they need to adapt, but face real barriers: overwhelming tool proliferation, fear of making mistakes, lack of practical guidance tailored to academic contexts, and institutional inertia. Most academic websites compound the problem — they look 15–20 years old, sending the signal that higher ed isn't keeping pace.

Innovating Higher Ed exists to be the trusted bridge between the AI revolution and the academic professionals navigating it.

---

## 3. Target Audience

**Primary:**
- **Faculty & Instructors** — Professors, lecturers, and adjuncts seeking practical AI integration in teaching. Often access content on mobile during commutes.
- **Administrators & Academic Leaders** — Deans, provosts, department chairs, and CIOs evaluating AI strategy, policy, and institutional investment.
- **Instructional Designers & EdTech Professionals** — Practitioners building the infrastructure of modern learning environments.

**Common trait:** These are busy professionals with limited time who need a trusted source to cut through the noise and tell them what matters, why it matters, and what to do about it.

---

## 4. Current Platform Status

The platform has undergone a ground-up redesign from an outdated WordPress site to a modern **Next.js 14** application deployed on **Vercel** via GitHub. As of February 2026, the redesigned site is live at ihe-pulse.vercel.app with **51 static pages** deployed.

### Design System: "Electric Dusk"
The visual identity is intentionally bold and modern — a deliberate departure from the beige-and-serif conservatism of most academic platforms. The design uses **cyan (#00d4ff)** and **magenta (#c850c0)** on dark backgrounds, with the typography stack of **Instrument Serif** (headlines), **DM Sans** (body), and **JetBrains Mono** (labels). Mobile-first design is prioritized for the primary use case of educators accessing content on their phones.

### Technology Stack
- **Frontend:** Next.js 14, Vercel hosting, GitHub CI/CD
- **Content Automation:** Google Cloud Run, Cloud Scheduler, OpenAI, Serper API, Firecrawl, ElevenLabs (voice synthesis)
- **Workflow:** Claude (strategic design) + Claude Code (implementation)

---

## 5. Platform Sections & Content Offerings

The redesigned platform features nine distinct content areas:

### 5.1 Innovation Pulse *(Flagship Feature)*
Daily AI-in-education news briefings narrated by Dr. Norma Jones via voice-cloned audio (ElevenLabs). This is not a traditional podcast — it's a short-form daily editorial briefing designed for the morning commute.

Key differentiators include a **rotating daily editorial lens** (Monday: Practitioner's Playbook, Tuesday: The Hard Question, Wednesday: Student Experience, Thursday: Connecting the Dots, Friday: Innovator's Edge) and a **story callback system** that tracks developing narratives across days, creating continuity and insider knowledge for regular listeners.

The entire pipeline is automated: daily scheduling → news discovery → content scraping → editorial synthesis → voice generation → site deployment. Stories are categorized into five types: Latest AI Product Releases, Insights & Trends, Case Studies, Practical Tips, and Ethical AI.

### 5.2 The Podcast
Dr. Norma Jones' long-form interview series featuring conversations with higher ed innovators. Distributed via Podbean, YouTube, Apple Podcasts, Spotify, and other major platforms. The podcast established the brand's initial credibility and remains a thought leadership cornerstone.

### 5.3 AI App Directory
A curated, continuously updated directory of AI tools relevant to higher education, organized by function (teaching, learning, administration, research, student support) with role-based filtering (faculty, administrator, researcher, student). Expanding to 38+ vetted tools with honest evaluations — not promotional content.

### 5.4 Prompt Navigator
A comprehensive AI prompting guide tailored for academic contexts — technique explanations, templates, and real-world examples covering curriculum design, assessment creation, research assistance, and administrative workflows.

### 5.5 Tinker Lab
Dr. Jones' audio blog — short-form, experimental explorations of AI tools and techniques. The platform's R&D sandbox in an accessible, conversational format.

### 5.6 Educator Tools
Three custom-built tools created by the Innovating Higher Ed team:
- **Syllabot** — Guided AI policy generator for course syllabi
- **AI Redesign** — Assessment transformation assistant for creating AI-resilient assignments
- **EquiGrade Mentor** — Equitable grading practices tool for first-generation students

### 5.7 Getting Started
An onboarding pathway for AI-hesitant educators — structured, empowering, and intentionally non-intimidating.

### 5.8 Case Studies
Real-world examples of successful AI integration at institutions, emphasizing measurable outcomes (time saved, engagement improved, student performance data).

### 5.9 Community
Emerging community-of-practice features for peer connection, experience sharing, and collaborative learning. Future plans include forums, live events, and Innovation Roundtables.

---

## 6. Editorial Voice & Content Strategy

Innovating Higher Ed is not a news aggregator. Its differentiation comes from Dr. Norma Jones' editorial perspective and the platform's proprietary "IHE Perspective" analysis callouts.

**Content Principles:**
- Empowerment over intimidation
- Practical over theoretical ("What can I do with this Monday morning?")
- Human-centered AI positioning
- Editorial perspective over aggregation
- Anti-advertorial: honest evaluation, never promotional
- Quality controls including theme deduplication, transition phrase rotation, and story callback continuity

---

## 7. Competitive Landscape

| Competitor | Focus Area | IHE Differentiation |
|---|---|---|
| Enrollify | Higher ed marketing/enrollment | IHE focuses on teaching, learning, & AI integration |
| Teaching in Higher Ed | Broad pedagogy | IHE zeroes in on AI and emerging tech specifically |
| EdSurge | General edtech news (K-12 + higher ed) | IHE is practitioner-focused, not journalistic |
| Inside Higher Ed | Higher ed news, policy, opinion | IHE is hands-on, how-to, community-driven |
| Educause / WCET | Research reports, conferences | IHE is freely accessible, distilled into action |
| Innovative Educators | Paid PD courses ($425+/course) | IHE offers daily free content with future premium tiers |

**IHE's unique advantages:** Daily automated content, voice-narrated briefings, curated tool directory with role-based filtering, custom educator tools (Syllabot, AI Redesign, EquiGrade), and a design-forward presentation that signals innovation rather than institutional inertia.

---

## 8. Monetization Roadmap

The platform is building toward a hybrid model:

**Free Tier (Current — Audience Building):**
- Daily Innovation Pulse briefings
- Podcast episodes
- AI App Directory access
- Educator Tools (Syllabot, AI Redesign, EquiGrade)
- Getting Started guides
- Weekly newsletter

**Planned Premium Offerings:**
- Structured online courses (e.g., "AI Foundations for Higher Ed Faculty")
- Premium newsletter with trend reports and insider analysis
- Members-only community access with live events
- Institutional licenses for campus-wide professional development
- Consulting services (Campus AI Readiness Audits, custom training)
- Certification programs in AI integration for higher education

---

## 9. Brand Positioning Summary

Innovating Higher Ed occupies a specific niche: **the trusted, practical, daily companion for higher education professionals navigating AI.** It's not trying to be a news outlet (Inside Higher Ed), a broad pedagogy podcast (Teaching in Higher Ed), or a paid course marketplace (Innovative Educators). It's the platform that shows up every morning with Dr. Norma Jones telling you what happened in AI yesterday and what it means for your classroom today — backed by a curated toolkit, honest evaluations, and a growing community of peers.

The brand's credibility rests on three pillars:
1. **Dr. Norma Jones' voice and perspective** — a practitioner speaking to practitioners
2. **Daily consistency** — automated content delivery that never misses a day
3. **Design that practices what it preaches** — a site that looks as innovative as the ideas it champions

---

## 10. The Decision Framework for AI College Ranking

The advisory team is being asked to evaluate whether the **AI College Ranking** research initiative should:

**(A) Live within InnovatingHigherEd.com** — as a new section alongside the existing nine content areas, leveraging the existing brand, audience, design system, and domain authority.

**(B) Launch as a separate website** — with its own domain, brand identity, and audience, linked to/from InnovatingHigherEd.com but operating independently.

### Considerations the advisory team should weigh:

**Brand Alignment:** Does ranking colleges on their AI readiness/adoption fit the mission of empowering individual educators — or does it serve a different audience (prospective students, institutional leadership, media)?

**Audience Overlap vs. Expansion:** Does the AI College Ranking attract the same professionals who visit IHE for daily briefings and tools, or does it attract an entirely different audience (e.g., prospective students choosing where to enroll, parents, journalists, policymakers)?

**Domain Authority & SEO:** Would the ranking content boost InnovatingHigherEd.com's search authority, or would it be better served by its own domain optimized for ranking-specific search terms?

**Revenue Potential:** Does the ranking have its own monetization path (institutional licensing, sponsorship, media citations) that might benefit from brand independence?

**Operational Complexity:** Can the ranking's content cadence (likely annual or semi-annual research publications) coexist with IHE's daily content rhythm without diluting either?

**Credibility & Perception:** Would housing a ranking system inside a platform that also reviews AI tools and provides how-to guides create perception issues around objectivity? Or does the editorial credibility of IHE strengthen the ranking's legitimacy?

---

*This document is intended to give the advisory team a complete understanding of InnovatingHigherEd.com's current state, trajectory, and strategic position so they can provide informed guidance on the AI College Ranking question.*

---

**Platform:** innovatinghighered.com
**Live Build:** ihe-pulse.vercel.app
**Tech Stack:** Next.js 14 · Vercel · Electric Dusk Design System
**Leadership:** Dr. Norma Jones (Editorial) · CalTex (Technical Production)
