import Link from 'next/link';
import { getEpisodeByDate } from '@/lib/data/innovation-pulse';
import { getHomepageEpisodeStories, getHomepageStoryHref } from '@/lib/homepagePulse';
import styles from './HomepageShell.module.css';

const titles = ['Make Vendor Proposals Easier to Compare', 'Share AI Study Resources With a Clear Basis for Trust', 'Find Journal Publishing Support Before You Submit', 'Make Archived Data Easier to Check Before Reusing It'];
export default function MoreStoriesToExplore() {
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
