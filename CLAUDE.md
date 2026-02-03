# IHE PULSE - Innovating Higher Ed Website

## Project Overview
This is the complete rebuild of innovatinghighered.com - transforming it from a WordPress site into a modern Next.js application with the "Electric Dusk" theme (cyan #00d4ff + magenta #c850c0).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (for AI tools directory, users)
- **Deployment:** Vercel
- **Audio:** ElevenLabs API (future)
- **Community:** Circle.so embed (future)

## Design Theme: Electric Dusk
- Primary (Pulse): `#00d4ff` (cyan)
- Secondary (Synapse): `#c850c0` (magenta)
- Background: Dark (`#0a0a0f` to `#1a1a2e`)
- Text: White/gray on dark backgrounds
- Gradients: Cyan → Magenta throughout UI
- Animated living background with energy field effect

## Site Structure (9 Pages)
1. **Home** (`/`) - Living platform hero, daily briefing, discovery ticker
2. **Daily Pulse** (`/daily-pulse`) - AI news for higher ed
3. **Prompts** (`/prompts`) - Prompt Navigator with search and categories
4. **AI Directory** (`/ai-directory`) - Curated AI tools for education
5. **Educator Tools** (`/educator-tools`) - Templates, rubrics, guides
6. **Podcast** (`/podcast`) - Episode archive with audio player
7. **Tinker Lab** (`/tinker-lab`) - Blog/experiments
8. **About** (`/about`) - Dr. Norma Jones bio and mission
9. **Be Our Guest** (`/be-our-guest`) - Guest application form

## Key Features
- Intelligence status bar (live metrics)
- Animated waveform audio player
- Discovery ticker with scrolling news
- Brain visualization with orbital rings
- Copy-to-clipboard for prompts
- Filterable AI tools directory
- Mobile responsive design

## Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run lint` - Run linter

## File Structure
```
ihe-pulse/
├── app/
│   ├── layout.js          # Root layout with nav/footer
│   ├── page.js            # Home page
│   ├── daily-pulse/
│   ├── prompts/
│   ├── ai-directory/
│   ├── educator-tools/
│   ├── podcast/
│   ├── tinker-lab/
│   ├── about/
│   └── be-our-guest/
├── components/
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   ├── LivingBackground.jsx
│   ├── IntelligenceBar.jsx
│   ├── AudioPlayer.jsx
│   ├── DiscoveryTicker.jsx
│   ├── PromptCard.jsx
│   ├── ToolCard.jsx
│   └── ...
├── lib/
│   └── supabase.js        # Database client
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Brand Voice
- Empowering, practical, forward-thinking
- Speaks to faculty, administrators, instructional designers
- Balances tech innovation with human-centered education
- Dr. Norma Jones is the face/voice of the brand

## Reference
The complete HTML mockup is available at:
`/mnt/user-data/outputs/ihe-pulse-electric-dusk-complete.html`

Use this as the design reference for all components and pages.
