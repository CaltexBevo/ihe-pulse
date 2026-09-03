import Link from 'next/link';
import {
  BriefcaseBusiness,
  Globe2,
  Lightbulb,
  MessageCircle,
  Mic2,
  Search,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import FeaturedCoverage from '@/components/FeaturedCoverage';
import NewsletterSignup from '@/components/NewsletterSignup';
import QuickHitsSlider from '@/components/QuickHitsSlider';
import {
  formatPulseDate,
  isWeeklyEpisode,
  V4_CATEGORY_SLUGS,
  type InnovationPulseEpisode,
  type V4Category,
} from '@/lib/data/innovation-pulse';
import { getHomepageQuickHits } from '@/lib/homepagePulse';
import { pillColorsFor } from '@/lib/categoryPalette';
import styles from './HomepagePulse.module.css';

interface HomepagePulseProps {
  episode: InnovationPulseEpisode | null;
}

const TOPICS: Array<{ category: V4Category; icon: LucideIcon }> = [
  { category: 'Insights & Trends', icon: TrendingUp },
  { category: 'Case Study', icon: UsersRound },
  { category: 'Practical Tips', icon: Wrench },
  { category: 'Ethical AI', icon: ShieldCheck },
  { category: 'Beyond Ed', icon: Globe2 },
  { category: 'Research', icon: Search },
  { category: 'AI Workforce & Careers', icon: BriefcaseBusiness },
  { category: 'Investing in Innovation', icon: Lightbulb },
];

const EXPLORE_LINKS: Array<{ label: string; description: string; href: string; icon: LucideIcon }> = [
  {
    label: 'Podcast',
    description: 'Weekly conversations with higher ed leaders and innovators.',
    href: '/podcast',
    icon: Mic2,
  },
  {
    label: 'AI Directory',
    description: 'Curated tools and solutions for teaching and learning.',
    href: '/ai-directory',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Top Prompts',
    description: 'Classroom-ready prompts from educators like you.',
    href: '/prompts',
    icon: MessageCircle,
  },
  {
    label: 'Educator Tools',
    description: 'Practical guides and resources to save you time.',
    href: '/educator-tools',
    icon: Wrench,
  },
];

function formatCoverageRange(episode: InnovationPulseEpisode): string {
  if (!episode.weekCovered) return formatPulseDate(episode.date);

  const [startDate, endDate] = episode.weekCovered.split('/');
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  return startMonth === endMonth
    ? `${startMonth} ${startDay}–${endDay}`
    : `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

export default function HomepagePulse({ episode }: HomepagePulseProps) {
  if (!episode) {
    return (
      <section className={styles.empty} aria-labelledby="homepage-empty-heading">
        <h1 id="homepage-empty-heading">No Briefings Yet</h1>
        <p>Check back soon for the latest Innovation Pulse.</p>
      </section>
    );
  }

  const quickHits = getHomepageQuickHits(episode);
  const cadenceLabel = isWeeklyEpisode(episode) ? 'delivered weekly' : 'delivered every weekday';

  return (
    <>
      <section className={styles.subscribeSection} aria-labelledby="homepage-subscribe-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.subscribe}>
            <div className="np-sub-copy">
              <h2 id="homepage-subscribe-heading" className={styles.subscribeHeading}>
                Never miss an episode.
              </h2>
              <p className="np-sub-muted">The Innovation Pulse, {cadenceLabel}.</p>
            </div>
            <NewsletterSignup variant="inline-strip" />
          </div>
        </div>
      </section>

      <FeaturedCoverage variant="homepage" />

      <section className={styles.section} aria-labelledby="quick-hits-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.module}>
            <div className={styles.sectionHeadingWithAction}>
              <div className={styles.sectionHeading}>
                <h2 id="quick-hits-heading">More from the Innovation Pulse</h2>
                <p>
                  {quickHits.length} quick {quickHits.length === 1 ? 'read' : 'reads'} from the {formatCoverageRange(episode)} Innovation Pulse.
                </p>
              </div>
              <Link href={`/innovation-pulse/${episode.date}`} className={styles.sectionAction}>
                View all {quickHits.length} stories <span aria-hidden="true">→</span>
              </Link>
            </div>
            <QuickHitsSlider stories={quickHits} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="topics-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.module}>
            <div className={styles.sectionHeading}>
              <h2 id="topics-heading">Find More Stories</h2>
              <p>Explore all coverage across the topics that matter to your work.</p>
            </div>

            <nav className={styles.topicGrid} aria-label="Explore Innovation Pulse topics">
              {TOPICS.map(({ category, icon: Icon }) => {
                const colors = pillColorsFor(category);
                return (
                  <Link
                    key={category}
                    href={`/innovation-pulse/category/${V4_CATEGORY_SLUGS[category]}`}
                    className={styles.topicLink}
                    style={{
                      color: colors.text,
                      borderColor: `color-mix(in srgb, ${colors.text} 34%, var(--border))`,
                    }}
                  >
                    <Icon className={styles.topicIcon} strokeWidth={1.5} aria-hidden="true" />
                    <span>{category}</span>
                  </Link>
                );
              })}
            </nav>

            <Link href="/innovation-pulse/archive" className={styles.centerLink}>
              Browse the full archive <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.exploreSection} aria-labelledby="explore-more-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.module}>
            <h2 id="explore-more-heading">More from Innovating Higher Ed</h2>
            <p className={styles.exploreIntro}>Tools, directories, and practical resources for your work.</p>
            <nav className={styles.exploreNav} aria-label="More Innovating Higher Ed resources">
              {EXPLORE_LINKS.map(({ label, description, href, icon: Icon }) => (
                <Link key={href} href={href} className={styles.exploreLink}>
                  <span className={styles.exploreIconWrap}>
                    <Icon className={styles.exploreIcon} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className={styles.exploreCopy}>
                    <span className={styles.exploreLabel}>{label}</span>
                    <span className={styles.exploreDescription}>{description}</span>
                    <span className={styles.exploreArrow} aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
