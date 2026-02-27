# IHE Prototype — Major Upgrade: Podcast, Tinker Lab, AI Directory, Prompt Navigator, Nav Fix

## CONTEXT & PERMISSIONS

You are upgrading `~/Desktop/ihe-pulse/Prototypes/ihe-complete-prototype.html`. 

**You have FULL PERMISSION to execute everything without stopping. Do not pause for confirmation.**

There is also a reference file at `~/Desktop/ihe-pulse/Prototypes/ihe-episode-clean-v3.html` — read this first to understand the podcast episode detail page design and replicate its style.

---

## FIX 1: NAV LOGO

The nav bar currently shows BOTH the IHE logo image AND text "Innovating Higher Ed" as separate elements. The logo image already contains the full brand name. Fix:
- Remove the separate text element next to the logo
- Keep only the `<img>` tag for the logo
- Set logo height to 44px in the nav

---

## FIX 2: PODCAST PAGE — COMPLETE OVERHAUL

### A. Read the reference file first
Read `~/Desktop/ihe-pulse/Prototypes/ihe-episode-clean-v3.html` to understand the episode detail page design. Replicate that style for all episode pages.

### B. Episode thumbnails on the main podcast listing page
The WordPress site has a podcast icon: `https://innovatinghighered.com/wp-content/uploads/2024/10/INNOVATE-ED-Square-ICON-white.jpg`

For the Human-Centered AI episode with Chesa Caparas, there is a custom thumbnail: `https://innovatinghighered.com/wp-content/uploads/2025/06/2025.06-EP-chesa-Thumb.jpg`

Use the podcast icon as the default thumbnail for all episodes that don't have a custom one. Add thumbnail images to each episode on the main list.

### C. Episode detail pages (7 pages)
Create individual episode detail pages as hidden `<div class="page">` elements (same SPA pattern). Each episode page should include:

- Back button to podcast list
- Large episode thumbnail/artwork at top
- Episode title (large, serif font)
- Guest name, date, duration
- Episode description (2-3 paragraphs of real content about the topic)
- Audio player bar (styled with waveform animation)
- Platform links that link to the REAL IHE podcast on each platform:
  - Apple Podcasts: https://podcasts.apple.com/us/podcast/innovating-higher-ed/id1768896865
  - Spotify: https://open.spotify.com/show/1PaBkIvJQaN9FPqoflbJxI
  - Amazon/Audible: https://music.amazon.com/podcasts/4c006f36-a401-4a1a-b498-c7010e48b50e/innovating-higher-ed
  - Podbean: https://innovatinghighered.podbean.com/
- Related episodes section at bottom

The 7 real episodes with content:

**EP 1: Human-Centered AI Strategy: Empathy, Trust, Access**
- Guest: Professor Chesa Caparas
- Date: June 22, 2025
- Thumbnail: https://innovatinghighered.com/wp-content/uploads/2025/06/2025.06-EP-chesa-Thumb.jpg
- Description: Fifty percent of faculty feel overwhelmed by new tech, yet student AI use is soaring. Professor Chesa Caparas joins Dr. Norma Jones to explore how institutions can build human-centered AI strategies that prioritize empathy, trust, and equitable access. They discuss practical frameworks for making AI adoption feel less threatening and more empowering for educators at every comfort level.

**EP 2: Assistive AI Tools: Transform Course Design & Assessment**
- Guest: Professor Scott James
- Date: May 17, 2025
- Description: Can a chatbot rewrite your toughest assignments in under five minutes? Professor Scott James, an instructional design veteran, talks with Dr. Norma Jones about how assistive AI tools are transforming course design and assessment practices. From automatic rubric generation to adaptive quiz creation, discover how these tools save faculty hours while improving learning outcomes.

**EP 3: OER, ZTC & Lightning-Fast AI Translation**
- Guest: Dr. Sarah Harmon
- Date: May 11, 2025
- Description: Textbooks can cost more than tuition — AI-powered OER wipes that cost out entirely. Dr. Sarah Harmon, Adjunct Professor, joins to discuss how artificial intelligence is revolutionizing open educational resources, zero-textbook-cost initiatives, and multilingual content translation. Learn how one institution made their entire curriculum accessible in 12 languages overnight.

**EP 4: Equity-First AI Curriculum for Every Discipline**
- Guest: Dr. Suha Al Juboori
- Date: February 21, 2025
- Description: Dr. Suha Al Juboori is a visionary educator reshaping how every discipline approaches AI integration. In this compelling conversation with Dr. Norma Jones, she shares frameworks for building equity-first AI curriculum that works across departments — from STEM to humanities — ensuring no student or faculty member gets left behind in the AI transformation.

**EP 5: VR Rehearsals: Building Confident Nurses Faster**
- Guest: Dr. Jenna Zeller
- Date: February 21, 2025
- Description: Nine in ten rookie nurses freeze during their first real emergency. Dr. Jenna Zeller shares how virtual reality rehearsals combined with AI-powered debriefing are building confidence faster than traditional clinical rotations. The results: students who've completed 50+ VR scenarios perform significantly better in real patient care situations.

**EP 6: XR Learning & AI Engagement Hacks**
- Guest: Dr. Garrick Grace
- Date: February 21, 2025
- Description: Can a VR headset and two AI tutors outperform a traditional lecture? Dr. Garrick Grace thinks so. In this episode, he shares groundbreaking research on extended reality (XR) learning environments enhanced by AI engagement tools. Discover practical ways to bring immersive technology into your classroom without breaking the budget.

**EP 7: ChatGPT Teaching Assistant: Lesson Plans in Minutes**
- Guest: Lynn Dickinson
- Date: October 19, 2024
- Description: Eighty-six percent of students already use AI — are you ready? Lynn Dickinson walks through her workflow for using ChatGPT as a teaching assistant, demonstrating how she creates complete lesson plans, generates discussion prompts, and builds assessment rubrics in minutes instead of hours. A practical, no-hype guide for faculty who want to start using AI today.

### D. Main podcast page links
The platform links at the top of the podcast page (Apple Podcasts, Spotify, Audible, Amazon) should use the real URLs listed above. Each episode in the list should be clickable and navigate to its detail page via showPage().

---

## FIX 3: TINKER LAB — MATCH PODCAST STYLE

Apply the same treatment as the Podcast:

### A. Main listing page
- Each post shows its real thumbnail image
- Posts are clickable, navigating to detail pages

### B. Detail pages (2 posts)
Create detail pages matching the podcast episode detail style:

**Post 1: The Wonka-Lantern Framework: Creative & Ethical AI in Higher Education**
- Date: June 17, 2025
- Author: Dr. Norma Jones
- Image: https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02.jpg
- Audio player with platform links
- Description: Dr. Norma Jones presents the Wonka-Lantern Framework — a creative and ethical approach to integrating AI into higher education. Inspired by the imaginative spirit of Willy Wonka and the guiding light of the Green Lantern, this framework helps educators embrace AI with both creativity and responsibility. Learn how to build assignments that leverage AI as a co-creative partner while maintaining academic integrity and fostering original thinking.

**Post 2: ChatGPT Pro Deep Research: Worth It?**
- Date: February 28, 2025
- Author: Dr. Norma Jones
- Image: https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01.jpg
- Audio player with platform links
- Description: Is ChatGPT Pro's Deep Research feature worth the $200/month price tag for educators? Dr. Norma Jones puts it to the test in this Tinker Lab deep dive. She compares standard ChatGPT, ChatGPT Pro, and Claude for common faculty research tasks — literature reviews, grant writing, and curriculum development. The results may surprise you.

---

## FIX 4: AI APP DIRECTORY — COMPLETE REDESIGN

Replace the current simple tools page with a comprehensive, reimagined AI App Directory. This is one of the most important pages on the site.

### Design Philosophy
The directory should feel like a curated, trustworthy resource — not a dump of tools. Think "Wirecutter for AI in Higher Ed." Every tool should feel hand-picked and reviewed. The page must serve TWO audiences: faculty (teachers) and administrators.

### Page Structure:

**A. Hero Section**
- Title: "AI App *Directory*"
- Subtitle: "Empowering innovators in teaching and administration. Find the right AI tools for your needs. Select your role to see curated tools, then filter by category to narrow your search."
- Search bar (pill-shaped, prominent)
- Role toggle tabs: "For Teachers" / "For Administrators" (styled as two large toggle buttons)

**B. Staff Picks (3-5 featured tools)**
Large cards with:
- App logo (use Clearbit: `https://logo.clearbit.com/[domain]`)
- App name
- "⭐ Staff Pick" badge
- "Why we love it" — 1-2 sentence editorial blurb
- Category, pricing badge (Free/Freemium/Paid)
- "Verified by IHE ✓" badge
- "Last updated: [date]"
Staff picks: ChatGPT, NotebookLM, Brisk Teaching, Gradescope, Canva

**C. Task-Based Filters (icon buttons)**
Visual icon buttons for common tasks:
- 📝 Lesson Planning
- 📊 Assessment & Grading
- 🔬 Research
- 💬 Student Support
- ✍️ Writing & Feedback
- 🎨 Content Creation
- 📹 Video & Media
- 🗣️ Text to Speech
- 🎮 Gamification
- 🧠 General AI

**D. Category Filter Pills**
All, Assessment, Avatars, Gamification, General LLMs, Image & Video Generation, Lesson Planning, Music, Slideshows, Text to Speech

**E. Tool Cards Grid (3-4 columns)**
Each card shows:
- App logo via Clearbit (`https://logo.clearbit.com/[domain]`)
- App name (bold)
- 1-line tagline
- Category badge (colored)
- Price indicator pill: "Free" (green) / "Freemium" (gold) / "Paid" (rose)
- "Verified by IHE ✓" small badge
- "Updated: [month year]"
Clicking a card opens a detail view.

**F. Tool Detail Views**
For each tool, create a hidden page div with:
- Back button
- Large logo + app name
- Full description (2-3 paragraphs)
- Quick Facts sidebar: Category, Pricing, Platform, LMS Integration
- "Key Features" — 4-6 bullet points
- "Best For" — 2-3 use case descriptions
- "Pros & Cons" side by side
- "Visit [App Name] →" CTA button linking to the tool's website
- "Related Tools" section at bottom

### Real Tools Data (minimum 28 tools)

**LESSON PLANNING:**
1. Eduaide.Ai | eduaide.ai | AI assistant for creating lesson plans, activities, and assessments | Free tier
2. Brisk Teaching | briskteaching.com | Chrome extension for curriculum, feedback, and differentiation | Free
3. Disco AI | disco.co | AI syllabus and course curriculum generator | Freemium
4. Teachfloor | teachfloor.com | All-in-one collaborative learning platform with AI | Paid
5. Curipod | curipod.com | AI-powered platform for creating interactive lessons | Freemium
6. Magic School AI | magicschool.ai | Generate lesson plans, IEPs, rubrics, assessments, and communication templates | Free tier

**GENERAL LLMs:**
7. ChatGPT | openai.com | Large language model for generating human-like text, lesson planning, research, and tutoring | Freemium
8. Claude | anthropic.com | AI assistant focused on helpful, harmless, and honest interactions. Excellent for long-form analysis and writing | Freemium
9. Grok | x.ai | AI chatbot by xAI with real-time access to X and a witty personality | Paid
10. Perplexity AI | perplexity.ai | AI-powered answer engine providing direct, cited answers to research questions | Freemium
11. Gemini | gemini.google.com | Google's multimodal AI assistant with deep integration into Google Workspace | Freemium
12. Microsoft Copilot | copilot.microsoft.com | AI assistant integrated with Microsoft 365 for education workflows | Freemium

**ASSESSMENT:**
13. Gradescope | gradescope.com | AI-assisted grading that groups similar answers, applies rubrics consistently, and provides analytics. Cuts grading time by up to 70% | Paid
14. Turnitin | turnitin.com | AI writing detection and academic integrity platform used by thousands of institutions | Paid
15. Quizlet | quizlet.com | AI-powered study sets, practice tests, and adaptive learning flashcards | Freemium

**RESEARCH:**
16. NotebookLM | notebooklm.google.com | Google's AI research assistant. Upload documents and get instant summaries, connections, and insights | Free
17. Elicit | elicit.com | Automates literature reviews, extracts key findings, and synthesizes research across papers | Freemium
18. Consensus | consensus.app | AI-powered academic search engine that finds and synthesizes peer-reviewed research | Freemium

**CONTENT CREATION:**
19. Canva | canva.com | AI-powered design platform with Magic Write, Magic Design, and education-specific templates | Freemium
20. Gamma | gamma.app | AI-powered presentation and document creation. Create polished slides from text prompts | Freemium
21. Notion AI | notion.so | AI writing and organization assistant built into the Notion workspace | Paid add-on

**VIDEO & MEDIA:**
22. Synthesia | synthesia.io | Generate multilingual instructional videos with AI presenters. No camera or studio needed | Paid
23. Descript | descript.com | AI-powered video and podcast editing with transcription, screen recording, and AI voice | Freemium
24. RunwayML | runwayml.com | Advanced AI video generation and editing tools for creative projects | Freemium

**TEXT TO SPEECH:**
25. ElevenLabs | elevenlabs.io | Realistic AI voice generation and text-to-speech with voice cloning | Freemium
26. Otter.ai | otter.ai | Automated transcription, meeting notes, and action items for lectures and faculty meetings | Freemium

**STUDENT SUPPORT:**
27. Khanmigo | khanmigo.ai | Khan Academy's AI tutor providing adaptive learning paths and Socratic-method guidance | Paid
28. Element451 | element451.com | AI-powered student engagement platform for personalized outreach and predictive analytics | Paid

### Educator Tools Section (SEPARATE from directory)
Add a clearly separated "Educator Tools" section at the bottom of the page (or as a tab) with the 3 IHE-built tools:

1. **Syllabot** — "Writing a clear and fair AI policy for your syllabus can be stressful. Syllabot is a guided tool that helps you generate course-ready language in minutes."
   - Image: https://innovatinghighered.com/wp-content/uploads/2025/03/Syllabot01E.png
   - Features: Fast & Easy, Customizable, Evidence-Informed, No Login Required
   - CTA: "Launch Syllabot"

2. **AI Redesign** (Assessment Design Assistant) — "Struggling to create meaningful, AI-resistant assignments? This guided tool helps transform your existing assessments into authentic learning experiences."
   - Image: https://innovatinghighered.com/wp-content/uploads/2025/06/AI-Redesign.01-Chatbot.jpg
   - Features: Research-Backed, Collaborative, Comprehensive, Easy Access
   - CTA: "Launch AI Redesign"

3. **EquiGrade Mentor** — "Grading first-generation students fairly can feel overwhelming. EquiGrade Mentor helps you transform grading practices to empower diverse learners."
   - Image: https://innovatinghighered.com/wp-content/uploads/2025/06/EquiGrade-Mentor01.png
   - Features: Start Small, Ease of Use, Support & Growth, Free and Accessible
   - CTA: "Launch EquiGrade"

---

## FIX 5: PROMPT NAVIGATOR — COMPLETE REBUILD TO MATCH WORDPRESS QUALITY

The current Prompts page is skeletal. The WordPress version has 9 techniques with definitions, use cases, and copyable prompts, plus 15 templates, plus common problems, plus a refinement workflow. The new version must match or exceed that depth.

### Page Structure:

**A. Hero**
- Eyebrow: "PROMPT NAVIGATOR"
- Title: "AI Prompt *Library*"
- Subtitle: "A Human-Centered AI Prompt Engineering Guide for College Faculty. Lead your classroom with confidence in the AI era."
- Quick nav buttons: "Core Techniques" / "Templates" / "Common Problems" / "Refinement Workflow"

**B. Core Techniques Section — 9 COLLAPSIBLE cards**

Each technique is a card that:
- Shows title + "Use when:" tagline when collapsed
- Expands on click to reveal: Definition, Use Case (Higher Ed), When/Why to Use, and 1-2 copyable prompts
- Has smooth expand/collapse animation (max-height transition)
- Each copyable prompt is in a monospace code box with a "📋 Copy" button

Here are ALL 9 techniques with their FULL content:

**1. Zero-Shot Prompting**
Use when: quick baseline answer without examples
Definition: Zero-shot prompting asks the AI to perform a task without any examples. You give a direct instruction and the model responds using its general training. It's the fastest way to get an initial draft.
Use Case: Use for fast definitions, quick contrasts, or rapid lists. In class prep, it's a handy way to draft a first pass.
When/Why: Best for straightforward tasks. Minimizes prep time. If outputs are too generic, move to few-shot.
Prompt 1: "Explain the concept of social stratification in simple terms for an intro sociology class (~120 words) and include one concrete, everyday example."
Prompt 2: "List the three most important differences between photosynthesis and cellular respiration in a single paragraph for first-year students."

**2. Few-Shot Prompting**
Use when: output must match specific format, tone, or rubric
Definition: Includes one or more examples of the task and desired output inside the prompt. The model uses these demonstrations to infer structure, tone, and level.
Use Case: Provide an example student answer with model feedback, then ask for feedback on a new answer. Or show well-formed quiz items and request new ones that match.
When/Why: Reach for few-shot when zero-shot was generic, when format is critical, or when you need a stable voice. 1-3 concise demos are usually enough.
Prompt: 'You are grading short answers. Example student answer: "[paste]"\nExample instructor feedback (tone, length, structure to imitate): "[paste]"\nNow provide feedback on the next student answer in the same style: "[paste new answer]"'

**3. System & Role Prompts**
Use when: consistent behavior, constraints, or persona
Definition: System instructions set global ground rules. Role prompts ask the AI to adopt a persona. Together they shape how the model responds.
Use Case: Set a system message like "You are a helpful teaching assistant for freshman writing who explains in plain language." Then add a role for the task.
When/Why: Use whenever the manner of response matters as much as content — feedback tone, accessibility, policy alignment.
Prompt: 'System: You are a supportive teaching assistant for first-year courses. Use clear, neutral language, avoid full solutions, and flag uncertainty.\nRole: Act as an encouraging writing tutor. Give concise feedback on the draft below tied to our rubric.\nRubric: "[paste]"\nDraft: "[paste]"'

**4. Context Injection**
Use when: outputs must follow your local readings, rubrics, levels
Definition: Supplies the model with background: course level, source material, explicit constraints. Reduces ambiguity, increases alignment.
Use Case: Generate study guides from assigned readings; create quiz items from pasted passages; evaluate a paragraph against your rubric.
When/Why: Use whenever "according to our materials" matters. Pair with few-shot for tone/format.
Prompt: 'Using the rubric below, score the student paragraph and give two specific suggestions tied to criteria.\nCourse/Level: Intro Psych (non-majors)\nRubric: "[paste rubric]"\nStudent paragraph: "[paste]"'

**5. Step-Back Prompting**
Use when: model should identify problem type and plan before solving
Definition: Asks the model to describe the kind of problem and outline a brief plan before attempting the solution. Promotes meta-cognition.
Use Case: Before solving a stats problem, the model identifies it as a sampling vs inference issue, lists steps, then proceeds.
When/Why: Helpful for multi-step or unfamiliar tasks. Surfaces a plan you can critique.
Prompt: 'Identify the type of problem, outline a 3-step plan to solve it, then provide the solution.\nProblem: "[paste]"'

**6. Chain-of-Thought Prompting**
Use when: reasoning steps are instructional or must be checked
Definition: Asks the model to show intermediate reasoning steps rather than only a final answer.
Use Case: In math, have the model explain each step. In history, ask for an evidence chain linking claims to sources.
When/Why: Use when transparency and pedagogy matter. Avoid for trivial tasks.
Prompt: 'Solve the problem and explain in numbered steps (max 6). Then give the final answer on a separate line labeled "Answer:".\nProblem: "[paste]"'

**7. Self-Consistency**
Use when: single-run outputs vary, need reliable result
Definition: Generates multiple independent solutions, then compares and selects the best/most consistent answer.
Use Case: For complex calculations or grading rubrics, ask for 3 variants and then a synthesis.
When/Why: Useful when correctness is critical or earlier runs felt unstable.
Prompt: 'Produce three independent answers to the question below. Then summarize points of agreement, note any conflicts, and choose the best answer with a one-sentence justification.\nQuestion: "[paste]"'

**8. Tree-of-Thought Prompting**
Use when: multiple viable approaches, want options before deciding
Definition: Explores several branches of reasoning rather than a single linear path.
Use Case: Lesson design: request three distinct approaches to teach a topic with objectives, keystone activity, and pros/cons.
When/Why: Ideal when many paths could work and you want structured exploration.
Prompt: 'Propose 3 distinct approaches to teach [topic] to non-majors. For each: objectives, one keystone activity, pros/cons. Then recommend one approach given a 50-minute class and 25 students.'

**9. ReAct (Reason & Act)**
Use when: task benefits from alternating reasoning with actions
Definition: Interleaves reasoning with actions and observations. It's a think-step, act-step, observe-step loop.
Use Case: Scoping a literature review: the model restates the goal, identifies gaps, asks clarifying questions, proposes next action.
When/Why: Use for open-ended tasks that require inquiry and iteration.
Prompt: 'Follow a Reason → Action → Observation loop to build a research plan.\nReason: Restate my topic and identify what information is missing.\nAction: Ask me up to 3 clarifying questions.\nObservation: Wait for answers.\nRepeat once. Then output a step-by-step plan with milestones and risks.'

**C. Prompt Templates Section — 15 cards**

Each template card shows:
- Category badge (colored)
- Template title
- Full prompt text in monospace code box
- "Usage:" instructions below
- Copy button

Include ALL 15 templates:
1. Lesson Plan Generator | Lesson Planning | cyan
2. Syllabus Outline Draft | Curriculum | magenta
3. Lesson Plan Adaptation (Inclusive Design) | Accessibility | green
4. Constructive Feedback Generator | Assessment | orange
5. Rubric Draft | Assessment | orange
6. Summative Feedback Letter | Feedback | violet
7. Differentiated Instruction Strategies | Inclusive Design | green
8. Adaptation for Diverse Learners | Accessibility | green
9. Inclusive Discussion Prompt | Discussion | sky
10. Advising Email Draft | Advising | gold
11. Degree Planning Guide | Advising | gold
12. Role-Play Script (Advisor-Student) | Training | rose
13. Syllabus AI Policy Draft | Policy | rose
14. Academic Integrity Case Discussion | Ethics | violet
15. Student Handout on AI Use | Policy | rose

For each, write a realistic, detailed prompt with [PLACEHOLDER] brackets. Make each one substantial — at least 3-4 lines of prompt text. Reference the WordPress content I scraped earlier for the actual prompt text.

**D. Common Problems Section — 6 items**
Display as a clean grid of problem/fix pairs:
1. Too Vague → Include course level, focus, and objectives
2. No Audience Level → Specify the intended audience
3. Missing Format or Length → State format and desired length
4. Overloaded Prompts → Break into smaller, sequential prompts
5. No Role or Tone → Assign a role to anchor the voice
6. No Iteration or Verification → Review, refine, and verify before use

**E. Refinement Workflow Section**
8-step visual workflow:
1. Define Your Goal
2. Add Context
3. Draft Clearly
4. Test
5. Spot Gaps
6. Refine
7. Iterate
8. Document

**F. Tuning Checklist**
Checklist items:
- ✓ Clarity — No vague verbs or unclear asks
- ✓ Context — Subject, learner level, and key details included
- ✓ Format — Output type and length specified
- ✓ Tone & Style — Academic, friendly, or role-based as needed
- ✓ Cognitive Level — Matches desired depth
- ✓ Academic Fit — Supports learning goals and integrity
- ✓ Inclusivity — Avoids bias, stereotypes, and exclusionary language

---

## JAVASCRIPT ADDITIONS

### Collapsible technique cards
```javascript
document.querySelectorAll('.technique-card').forEach(card => {
  card.querySelector('.technique-header').addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});
```
CSS: `.technique-card .technique-body { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }` and `.technique-card.expanded .technique-body { max-height: 2000px; }`

### Copy button functionality
```javascript
function copyPrompt(btn) {
  const text = btn.closest('.prompt-card, .copycard').querySelector('.prompt-text, pre').textContent;
  navigator.clipboard.writeText(text);
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = '📋 Copy', 2000);
}
```

### Episode/post detail navigation
Use the existing showPage() pattern. Add IDs like:
- page-ep-1 through page-ep-7 for podcast episodes
- page-tinker-1 and page-tinker-2 for Tinker Lab posts
- page-tool-[slug] for AI tool detail pages (at minimum create detail views for the 5 staff picks)

### Filter functionality for AI Directory
Clicking a category filter or task filter should show/hide tool cards. Use data attributes:
```html
<div class="tool-card" data-category="lesson-planning" data-role="teacher" data-task="lesson-planning content-creation">
```

---

## BUILD STRATEGY

This is a large update. Work section by section:
1. Fix the nav logo first (quick win)
2. Rebuild the Podcast page + add 7 episode detail pages
3. Rebuild Tinker Lab + add 2 post detail pages
4. Rebuild AI App Directory + add detail views for staff picks
5. Rebuild Prompt Navigator with all content
6. Add all new JavaScript
7. Test by opening in browser

The file will grow significantly (likely to 6000-8000+ lines). That's expected and fine.

**GO. Build everything. Do not stop for permissions.**
