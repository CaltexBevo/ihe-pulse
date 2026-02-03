# IHE PULSE - BUILD TASKS

## PHASE 1: PROJECT INITIALIZATION (Do First!)

### Task 1.1: Initialize Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```
When prompted:
- Would you like to use TypeScript? → Yes
- Would you like to use ESLint? → Yes  
- Would you like to use Tailwind CSS? → Yes
- Would you like to use `src/` directory? → No
- Would you like to use App Router? → Yes
- Would you like to customize import alias? → Yes, use @/*

### Task 1.2: Install Additional Dependencies
```bash
npm install @supabase/supabase-js lucide-react framer-motion
```

### Task 1.3: Configure Tailwind for Electric Dusk Theme
Update `tailwind.config.ts` with custom colors:
- pulse: '#00d4ff' (cyan)
- synapse: '#c850c0' (magenta)
- dark: '#0a0a0f'
- darker: '#050508'

### Task 1.4: Create Global Styles
Update `app/globals.css` with:
- Dark theme defaults
- Custom animations (pulse glow, gradient shift, ticker scroll)
- Living background keyframes

### Task 1.5: Verify Setup
```bash
npm run dev
```
Confirm site loads at http://localhost:3000

---

## PHASE 2: LAYOUT & COMPONENTS

### Task 2.1: Create LivingBackground Component
`components/LivingBackground.tsx`
- Animated gradient background
- Floating orbs with cyan/magenta colors
- Grid overlay effect

### Task 2.2: Create Navigation Component
`components/Navigation.tsx`
- Logo: "IHE" with "PULSE" gradient text
- Nav links for all 9 pages
- Mobile hamburger menu
- Active page indicator

### Task 2.3: Create IntelligenceBar Component
`components/IntelligenceBar.tsx`
- Status indicator (green dot + "LIVE")
- Metrics: "847 AI Tools Indexed" etc.
- Gradient border bottom

### Task 2.4: Create Footer Component
`components/Footer.tsx`
- Links to all pages
- Social media icons
- Copyright

### Task 2.5: Create Root Layout
`app/layout.tsx`
- Import all layout components
- Set up metadata (title, description)
- Dark theme body styling

---

## PHASE 3: HOME PAGE

### Task 3.1: Hero Section
- "THE PLATFORM IS" headline
- "LEARNING" with gradient animation
- Subheadline about AI higher ed
- CTA buttons

### Task 3.2: Brain Visualization
- Central pulsing circle
- Orbital rings
- Floating nodes
- Connection lines

### Task 3.3: Discovery Ticker
- Horizontal scrolling news items
- Cyan accent dots
- Continuous animation

### Task 3.4: Daily Briefing Section
- "TODAY'S INTELLIGENCE BRIEFING" header
- Audio waveform player (visual only for now)
- Briefing text preview
- Episode info

### Task 3.5: Live Intelligence Feed
- Activity feed showing recent actions
- Timestamps
- User avatars (placeholder)

---

## PHASE 4: CONTENT PAGES

### Task 4.1: Daily Pulse Page
`app/daily-pulse/page.tsx`
- Featured story card (large)
- Sidebar with smaller story cards
- Category filters
- "Today's Top Stories" section

### Task 4.2: Prompts Page (Navigator)
`app/prompts/page.tsx`
- Search bar with icon
- Category pills (Curriculum Design, Assessment, etc.)
- Prompt library grid
- Each prompt card has copy button

### Task 4.3: AI Directory Page
`app/ai-directory/page.tsx`
- Filter tabs (All, Teaching, Research, Admin)
- Tool cards with:
  - Logo placeholder
  - Name, category badge
  - Description
  - "Learn More" button

### Task 4.4: Educator Tools Page
`app/educator-tools/page.tsx`
- 6 category cards:
  - Syllabus Templates (12)
  - Assessment Rubrics (24)
  - Lesson Plan Builders (8)
  - AI Policy Guides (6)
  - Workshop Materials (15)
  - Analytics Dashboards (4)
- Each expandable to show items

### Task 4.5: Podcast Page
`app/podcast/page.tsx`
- Show artwork
- Platform links (Spotify, Apple, YouTube)
- Episode list with:
  - Episode number, title
  - Duration, date
  - Play button
  - Description preview

### Task 4.6: Tinker Lab Page
`app/tinker-lab/page.tsx`
- Blog post grid
- Featured post large
- Categories/tags
- "Load More" pagination

### Task 4.7: About Page
`app/about/page.tsx`
- Dr. Norma Jones hero section
- Bio text
- Mission statement
- Credentials/experience

### Task 4.8: Be Our Guest Page
`app/be-our-guest/page.tsx`
- Guest application form
- Name, email, topic, bio fields
- Submit button
- Contact information

---

## PHASE 5: INTERACTIVITY

### Task 5.1: Create AudioPlayer Component
- Waveform visualization (bars)
- Play/pause toggle
- Progress indicator
- Time display

### Task 5.2: Create CopyButton Component
- Copies text to clipboard
- Shows "Copied!" feedback
- Used in Prompt Navigator

### Task 5.3: Create FilterTabs Component
- Reusable for AI Directory, Prompts
- Active state styling
- Click handlers

### Task 5.4: Page Transitions
- Subtle fade in on route change
- Framer Motion integration

---

## PHASE 6: DATA & CONTENT

### Task 6.1: Create Sample Data Files
`lib/data/`
- prompts.ts (sample prompts)
- tools.ts (sample AI tools)
- episodes.ts (podcast episodes)
- posts.ts (Tinker Lab posts)

### Task 6.2: Set Up Supabase (Optional for Week 1)
- Create Supabase project
- Set up tables: tools, prompts, users
- Add environment variables
- Create client in `lib/supabase.ts`

---

## PHASE 7: POLISH & DEPLOY

### Task 7.1: Responsive Testing
- Test all pages on mobile (375px)
- Test on tablet (768px)
- Test on desktop (1280px+)

### Task 7.2: SEO & Metadata
- Page titles and descriptions
- Open Graph images
- Favicon

### Task 7.3: Performance
- Image optimization
- Lazy loading
- Lighthouse audit

### Task 7.4: Git & Deploy
```bash
git init
git add .
git commit -m "Initial IHE Pulse build"
git remote add origin [YOUR_GITHUB_URL]
git push -u origin main
```
- Connect to Vercel
- Get preview URL

---

## QUICK REFERENCE: Component Checklist

- [ ] LivingBackground
- [ ] Navigation
- [ ] IntelligenceBar
- [ ] Footer
- [ ] AudioPlayer
- [ ] DiscoveryTicker
- [ ] PromptCard
- [ ] ToolCard
- [ ] EpisodeCard
- [ ] PostCard
- [ ] CategoryPill
- [ ] FilterTabs
- [ ] CopyButton
- [ ] SearchBar
- [ ] ContactForm
- [ ] BrainVisualization

---

## START COMMAND

Give this to Claude Code to begin:

"Read the CLAUDE.md file, then start with Task 1.1 - initialize the Next.js project. After each task, confirm it's working before moving to the next."
