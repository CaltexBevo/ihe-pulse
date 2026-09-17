import Link from 'next/link';
import ResourceIcon, { type ResourceIconName } from './ResourceIcon';
import FeaturedCoverage from '@/components/FeaturedCoverage';
import NewsletterSignup from '@/components/NewsletterSignup';
import QuickHitsSlider from '@/components/QuickHitsSlider';
import { FEATURED_COVERAGE } from '@/lib/data/featured-coverage';
import {
  formatPulseDate,
  isWeeklyEpisode,
  V4_CATEGORY_SLUGS,
  type InnovationPulseEpisode,
  type V4Category,
} from '@/lib/data/innovation-pulse';
import { getHomepageEpisodeStories } from '@/lib/homepagePulse';
import { pillColorsFor } from '@/lib/categoryPalette';
import styles from './HomepagePulse.module.css';

interface HomepagePulseProps {
  episode: InnovationPulseEpisode | null;
}

const TOPICS: V4Category[] = [
  'Insights & Trends', 'Case Study', 'Practical Tips', 'Ethical AI',
  'Beyond Ed', 'Research', 'AI Workforce & Careers', 'Investing in Innovation',
];

const EXPLORE_LINKS: Array<{ label: string; description: string; href: string; icon: ResourceIconName }> = [
  {
    label: 'Grant Portal',
    description: 'Explore grant opportunities for higher education.',
    href: '/innovation-grants',
    icon: 'portal',
  },
  {
    label: 'AI Directory',
    description: 'Curated tools and solutions for teaching and learning.',
    href: '/ai-directory',
    icon: 'directory',
  },
  {
    label: 'Top Prompts',
    description: 'Classroom-ready prompts from educators like you.',
    href: '/prompts',
    icon: 'prompts',
  },
  {
    label: 'Educator Tools',
    description: 'Practical guides and resources to save you time.',
    href: '/educator-tools',
    icon: 'tools',
  },
  {
    label: 'Podcast',
    description: 'Weekly conversations with higher ed leaders and innovators.',
    href: '/podcast',
    icon: 'podcast',
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

  const episodeStories = getHomepageEpisodeStories(episode).map((story) => {
    const sourceUrl = story.sourceUrl.trim().toLowerCase();
    const feature = FEATURED_COVERAGE.find((record) => {
      return (
        (sourceUrl.length > 0 && record.sourceUrl.trim().toLowerCase() === sourceUrl) ||
        record.title.trim() === story.title.trim()
      );
    });

    return feature
      ? {
          ...story,
          feature: {
            slug: feature.slug,
            imagePath: feature.imagePath,
            category: feature.category,
          },
        }
      : story;
  });
  const cadenceLabel = isWeeklyEpisode(episode) ? 'delivered weekly' : 'delivered every weekday';

  return (
    <>
      <section className={styles.subscribeSection} aria-labelledby="homepage-subscribe-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.subscribe}>
            <div className="np-sub-copy">
              <h2 id="homepage-subscribe-heading" className={styles.subscribeHeading}>
                Never miss an edition.
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
                <h2 id="quick-hits-heading">In This Week’s Innovation Pulse</h2>
                <p>
                  {episodeStories.length} {episodeStories.length === 1 ? 'story' : 'stories'} from the {formatCoverageRange(episode)} Innovation Pulse.
                </p>
              </div>
              <Link href={`/innovation-pulse/${episode.date}`} className={styles.sectionAction}>
                View all {episodeStories.length} stories <span aria-hidden="true">→</span>
              </Link>
            </div>
            <QuickHitsSlider stories={episodeStories} />
          </div>
        </div>
      </section>

      <section className={styles.topicsSection} aria-labelledby="topics-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.topicModule}>
            <div className={styles.topicHeading}>
              <h2 id="topics-heading">Explore Stories <span>by Topic</span></h2>
              <p>Explore all coverage across the topics that matter to your work.</p>
            </div>

            <nav className={styles.topicGrid} aria-label="Explore Innovation Pulse topics">
              {TOPICS.map((category) => {
                const colors = pillColorsFor(category);
                return (
                  <Link
                    key={category}
                    href={`/innovation-pulse/category/${V4_CATEGORY_SLUGS[category]}`}
                    className={styles.topicLink}
                  >
                    <span className={styles.topicDot} style={{ background: colors.text }} aria-hidden="true" />
                    <span>{category}</span>
                    <span className={styles.topicArrow} aria-hidden="true">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className={styles.topicActions}>
              <Link href="/innovation-pulse/stories?tab=features" className={styles.centerLink}>
                Original Features <span aria-hidden="true">→</span>
              </Link>
              <Link href="/innovation-pulse/stories" className={styles.centerLink}>
                All Stories <span aria-hidden="true">→</span>
              </Link>
              <Link href="/innovation-pulse/stories?tab=editions" className={styles.centerLink}>
                Weekly Editions <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.exploreSection} aria-labelledby="explore-more-heading">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
          <div className={styles.resourceModule}>
            <h2 id="explore-more-heading">More from <span>Innovating Higher Ed</span></h2>
            <p className={styles.exploreIntro}>Tools, directories, and practical resources for your work.</p>
            <nav className={styles.exploreNav} aria-label="More Innovating Higher Ed resources">
              {EXPLORE_LINKS.map(({ label, description, href, icon }) => (
                <Link key={href} href={href} className={styles.exploreLink}>
                  <span className={styles.exploreIconWrap}>
                    <ResourceIcon name={icon} className={styles.exploreIcon} />
                  </span>
                  <span className={styles.exploreCopy}>
                    <span className={styles.exploreLabel}>{label}</span>
                    <span className={styles.exploreDescription}>{description}</span>
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
