import Link from 'next/link';
import { getEpisodeByDate } from '@/lib/data/innovation-pulse';
import { getHomepageEpisodeStories, getHomepageStoryHref } from '@/lib/homepagePulse';
import styles from './HomepageShell.module.css';
import { getMostViewedStories } from '@/lib/mostViewedStories';

const titles = ['Make Vendor Proposals Easier to Compare', 'Share AI Study Resources With a Clear Basis for Trust', 'Find Journal Publishing Support Before You Submit', 'Make Archived Data Easier to Check Before Reusing It'];
export default async function MoreStoriesToExplore() {
  const ranking = await getMostViewedStories();
  if (ranking) return <aside className={styles.mostViewed} aria-labelledby="most-viewed-title">
    <h2 id="most-viewed-title">Most Viewed Stories</h2>
    <p className={styles.range}>Past 30 days</p>
    <p className={styles.sample}>Updated {new Date(ranking.until).toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false })} UTC</p>
    <ol>{ranking.articles.map((article, index) => <li key={article.href}><Link href={article.href}><span className={styles.rank} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{article.title}</span><span className={styles.rankArrow} aria-hidden="true">→</span></Link></li>)}</ol>
  </aside>;
  return <ArchiveStoriesSidebar />;
}

export function ArchiveStoriesSidebar() {
  const episode = getEpisodeByDate('2026-10-09');
  const stories = episode ? getHomepageEpisodeStories(episode) : [];
  return <aside className={styles.mostViewed} aria-labelledby="more-stories-title">
    <h2 id="more-stories-title">More Stories to Explore</h2>
    <p className={styles.range}>From the story archive</p>
    <ol>{titles.map((title, index) => {
      const story = stories.find(story => story.title === title);
      return story ? <li key={title}><Link href={getHomepageStoryHref(story)}><span className={styles.rank} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{title}</span><span className={styles.rankArrow} aria-hidden="true">→</span></Link></li> : null;
    })}</ol>
  </aside>;
}
