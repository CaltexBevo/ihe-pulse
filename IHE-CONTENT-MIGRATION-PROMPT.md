# IHE Content Migration: WordPress → Complete Prototype

## CONTEXT & PERMISSIONS

You are migrating REAL content from the WordPress site at innovatinghighered.com into the prototype at `~/Desktop/ihe-pulse/Prototypes/ihe-complete-prototype.html`. 

**You have FULL PERMISSION to execute everything without stopping. Do not pause for confirmation.**

The prototype file already exists with 3,848 lines — it has the full Electric Dusk design system, all 10 pages, navigation, and JavaScript. Your job is to **replace the placeholder/sample content with real content from the WordPress site**.

Do NOT rebuild the design system or page structure. Only update the TEXT CONTENT, IMAGES, LINKS, and DATA within the existing pages.

---

## CONTENT INVENTORY TO MIGRATE

### PAGE: ABOUT (`page-about`)

Replace placeholder bio content with the REAL bios:

**Mission Statement:**
"At Innovating Higher Ed, we're committed to empowering higher education leaders, faculty, and edtech innovators with insights, strategies, and real-world examples of how artificial intelligence and emerging technologies can transform education. Through our engaging podcast episodes, expert interviews, and practical resources, we help educators and administrators confidently navigate the rapidly evolving landscape of AI-driven teaching, learning, and institutional innovation. Whether you're looking to enhance classroom experiences, streamline operations, or stay ahead of the latest edtech trends, Innovating Higher Ed is your trusted partner in embracing the future of education."

**Dr. Norma Jones Bio:**
"Dr. Norma Jones is uniquely positioned to guide conversations about the future of higher education and artificial intelligence. With extensive experience as a presenter, author, editor, keynote speaker, and communication expert, Norma effortlessly bridges academia and executive leadership. Her career spans diverse sectors including education, energy, law enforcement, international business, fine jewelry, eCommerce, multimedia entertainment, and advertising—giving her a distinctive ability to understand and connect complex ideas across industries. A recognized leader in AI initiatives throughout California, Norma has empowered countless educators and students by facilitating meaningful integration of AI into classrooms and institutional strategy. Her expertise in communication and faculty development fosters inclusive, technology-enhanced learning environments designed to elevate student success. As host of Innovating Higher Ed, Norma's insightful perspective, dynamic speaking style, and deep understanding of both academic and corporate innovation make her the perfect guide for exploring new frontiers in educational transformation."

**Brent Jones Bio:**
"Brent Jones is an accomplished producer and editor with over two decades of experience, having contributed to more than 100 hours of television for major networks and studios, including Warner Bros, ABC, CBS, Discovery Channel, and the History Channel. Brent previously oversaw post-production as Director of Operations at Matchframe Film and Video, managing post-production workflows, audio mixing, color correction, and extensive media archiving, always ensuring broadcast standards and tight deadlines were met. In 2023, Brent leveraged his deep technical expertise to explore and integrate artificial intelligence, actively developing innovative AI-driven startup ventures. His background in managing complex media workflows and high-pressure productions laid the foundation for parallel work in podcasting. At Innovating Higher Ed, Brent brings a unique blend of creative direction and technical precision to craft engaging, high-quality episodes that inform and inspire."

---

### PAGE: PODCAST (`page-podcast`)

Replace placeholder episodes with the REAL 7 podcast episodes:

1. **Human-Centered AI Strategy: Empathy, Trust, Access** | Professor Chesa Caparas | June 22, 2025
   - "Fifty percent of faculty feel overwhelmed by new tech, yet student AI use is soaring."
   
2. **Assistive AI Tools: Transform Course Design & Assessment** | Professor Scott James | May 17, 2025
   - "Can a chatbot rewrite your toughest assignments in under five minutes?"

3. **OER, ZTC & Lightning-Fast AI Translation** | Dr. Sarah Harmon | May 11, 2025
   - "Textbooks can cost more than tuition — AI-powered OER wipes that cost out entirely."

4. **Equity-First AI Curriculum for Every Discipline** | Dr. Suha Al Juboori | Feb 21, 2025
   - "A visionary educator reshaping how every discipline approaches AI integration."

5. **VR Rehearsals: Building Confident Nurses Faster** | Dr. Jenna Zeller | Feb 21, 2025
   - "Nine in ten rookie nurses freeze during their first real emergency."

6. **XR Learning & AI Engagement Hacks** | Dr. Garrick Grace | Feb 21, 2025
   - "Can a VR headset and two AI tutors outperform a traditional lecture?"

7. **ChatGPT Teaching Assistant: Lesson Plans in Minutes** | Lynn Dickinson | Oct 19, 2024
   - "Eighty-six percent of students already use AI. Are you ready?"

Platform links: Apple Podcasts, Spotify, Audible, Amazon

Podcast description: "Innovating Higher Ed Podcast, hosted by Dr. Norma Jones, spotlights innovators who are transforming the way we educate and engage students."

---

### PAGE: TINKER LAB (`page-tinkerlab`)

Replace placeholders with REAL 2 posts:

1. **The Wonka-Lantern Framework: Creative & Ethical AI in Higher Education** | June 17, 2025
   - Image: `https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02.jpg`
   - Has audio version (Apple, Spotify, Audible, Amazon)

2. **ChatGPT Pro Deep Research: Worth It? | Tinker Lab with Dr. Norma Jones** | Feb 28, 2025
   - Image: `https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01.jpg`
   - Has audio version

---

### PAGE: EDUCATOR TOOLS (`page-tools` or create a separate section)

The site has a dedicated Educator Tools page with 3 custom AI-powered tools. These are SEPARATE from the AI App Directory. Either:
- Add an "Educator Tools" section to the existing tools page, OR
- Create a new page section for them

The 3 tools are:

1. **Syllabot** — "Writing a clear and fair AI policy for your syllabus can be stressful. Syllabot is a guided tool that helps you generate course-ready language in minutes. By answering a short set of questions, you can create a practical, student-friendly policy tailored to your specific course and teaching style."
   - Features: Fast & Easy (5-10 min), Customizable, Evidence-Informed, No Login Required
   - CTA: Launch Syllabot

2. **AI Redesign** (Assessment Design Assistant) — "Struggling to create meaningful, AI-resistant assignments? Assessment Design Assistant is a guided tool that helps transform your existing assessments into authentic learning experiences."
   - Features: Research-Backed, Collaborative, Comprehensive, Easy Access
   - CTA: Launch AI Redesign

3. **EquiGrade Mentor** — "Grading first-generation students fairly can feel overwhelming. EquiGrade Mentor is your personalized guide to equitable grading. It helps you transform grading practices to empower diverse learners."
   - Features: Start Small, Ease of Use, Support & Growth, Free and Accessible
   - CTA: Launch EquiGrade

---

### PAGE: AI APP DIRECTORY (`page-tools`)

Update the AI tools to include REAL tools from the WordPress directory. The directory has these categories for Teachers:
- Assessment, Avatars, Gamification, General LLMs, Image & Video Generation, Lesson Planning, Music, Slideshows, Text to Speech

And for Administrators (separate tab):
- Additional admin-focused tools

**Real tools to include (at minimum the Staff Picks and first batch):**

Lesson Planning: Eduaide.Ai, Brisk Teaching, Disco AI, Teachfloor, Curipod
General LLMs: ChatGPT, Claude, Grok, Perplexity AI, Gemini (Google)
Assessment: (pull from directory)
Image & Video: (pull from directory)
Text to Speech: (pull from directory)

Keep the role-based tabs (For Teachers / For Administrators) from the WordPress version.

---

### PAGE: PROMPT NAVIGATOR (`page-prompts`)

This is the BIGGEST content migration. The WordPress Prompt Navigator has:

**9 Core Techniques** (each with definition, use case, when/why, and copyable example prompts):
1. Zero-Shot Prompting
2. Few-Shot Prompting
3. System & Role Prompts
4. Context Injection
5. Step-Back Prompting
6. Chain-of-Thought Prompting
7. Self-Consistency
8. Tree-of-Thought Prompting
9. ReAct (Reason & Act)

**15 Prompt Templates** (each with copyable text and usage instructions):
1. Lesson Plan Generator
2. Syllabus Outline Draft
3. Lesson Plan Adaptation (Inclusive Design)
4. Constructive Feedback Generator
5. Rubric Draft
6. Summative Feedback Letter
7. Differentiated Instruction Strategies
8. Adaptation for Diverse Learners
9. Inclusive Discussion Prompt
10. Advising Email Draft
11. Degree Planning Guide
12. Role-Play Script (Advisor-Student)
13. Syllabus AI Policy Draft
14. Academic Integrity Case Discussion
15. Student Handout on AI Use

**Common Problems Section** — 6 problems with fixes
**Refinement Workflow** — 8-step process + tuning checklist
**References** — 19 academic references

This page should be restructured into the Electric Dusk design with:
- Technique cards (expandable/collapsible)
- Template cards with copy buttons
- The problems and workflow sections
- Keep ALL the actual prompt text — this is the core value of the page

---

### PAGE: BE OUR GUEST (add to Community page or create separate)

**Content:**
"The Innovating Higher Ed Podcast is where bold ideas, practical strategies, and pioneering voices come together to shape the future of higher education."

Why Be a Guest sections:
- Influential Platform — "Reach a global audience of higher education leaders"
- Thought Leadership — "Join a curated group of guests contributing valuable insights"
- Real Impact — "Your voice can inspire action"
- Professional Visibility — "Each episode is promoted across podcast platforms, social media"

What to Expect:
- High-Quality Production
- Collaborative Support
- Strategic Promotion
- Engaged Community

Include a form or CTA to apply as a guest.

---

### PAGE: INNOVATION PULSE / DAILY NEWS (`page-pulse`)

The daily news posts are auto-generated. For the prototype, use the REAL most recent post titles:
- IHE Daily AI News – Friday, February 13, 2026
- IHE Daily AI News – Thursday, February 12, 2026
- IHE Daily AI News – Wednesday, February 11, 2026
- IHE Daily AI News – Monday, February 9, 2026
- IHE Daily AI News – Sunday, February 8, 2026
- IHE Daily AI News – Friday, February 6, 2026

Use the real excerpts from these posts if available in the prototype.

---

### HOMEPAGE / PORTAL

Update homepage sections to reference real content:
- Newsletter CTA text: "Your Teaching Matters More Than Ever with Human-Centered AI. Subscribe to receive fresh insights, practical tools, ethical guidelines, inspiring educator stories, and timely AI trends curated specifically to empower and support your teaching."
- Podcast section should show real latest episode
- Tinker Lab section should show real posts
- AI Apps Directory CTA: "Empowering innovators in teaching and administration. Find the right AI tools for your needs."
- Prompt Guide CTA: "This lets you focus your time where it matters most. Our comprehensive prompt guide provides the framework and 24+ templates needed to put knowledge into practice, fast."
- Educator Tools CTA: "Built by Educators, For Educators. These aren't just AI tools—they're classroom-tested solutions from your peers."

---

### IMAGES TO USE

Real WordPress images (these URLs are live and accessible):
- Tinker Lab Wonka: `https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02.jpg`
- Tinker Lab ChatGPT Pro: `https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01.jpg`
- IHE Logo: `https://innovatinghighered.com/wp-content/uploads/2025/06/IHE-Logo-June-25.03-Logo-ALPHA.png`
- IHE Logo over Earth: `https://innovatinghighered.com/wp-content/uploads/2025/06/IHE-Logo-over-Earth.png`
- Syllabot banner: `https://innovatinghighered.com/wp-content/uploads/2025/03/Syllabot01E.png`
- AI Redesign: `https://innovatinghighered.com/wp-content/uploads/2025/06/AI-Redesign.01-Chatbot.jpg`
- EquiGrade: `https://innovatinghighered.com/wp-content/uploads/2025/06/EquiGrade-Mentor01.png`
- CTA Background: `https://innovatinghighered.com/wp-content/uploads/2025/07/CTA-bg.05.v2.jpg`
- Night Sky: `https://innovatinghighered.com/wp-content/uploads/2024/11/night-sky-stars-galaxy.jpg`
- Podcast Icon: `https://innovatinghighered.com/wp-content/uploads/2024/10/INNOVATE-ED-Square-ICON-white.jpg`

For any additional images needed, use Unsplash URLs with relevant education/AI keywords.

---

## BUILD STRATEGY

1. Read the existing `ihe-complete-prototype.html` file completely
2. Make targeted text replacements using sed, python, or direct file editing
3. DO NOT rewrite the entire file — make surgical edits to swap content
4. After all edits, open in browser and verify each page looks correct
5. Save the updated file

**CRITICAL: Preserve the Electric Dusk CSS design system, page structure, navigation, and JavaScript exactly as they are. Only change content.**

**GO. Execute all migrations. Do not stop.**
