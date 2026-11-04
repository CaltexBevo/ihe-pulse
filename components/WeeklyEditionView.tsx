import Image from 'next/image';
import Link from 'next/link';
import HomeEpisodePlayer from './HomeEpisodePlayer';
import PicardFeatureHero from './PicardFeatureHero';
import EditionListeningHub from './EditionListeningHub';
import hubStyles from './EditionListeningHub.module.css';
import { PICARD_FEATURED_COVERAGE as picard } from '@/lib/data/featured-coverage-picard';
import { PICARD_PEAKS } from '@/lib/picard-waveform';
import { getHomePulseWaveform } from '@/lib/home-pulse-waveforms';
import EditionLink from './EditionLink';
import AllStoriesClient from '@/app/innovation-pulse/stories/AllStoriesClient';
import { cleanBroadcastScript, formatPulseDate, formatWeekCovered } from '@/lib/data/innovation-pulse';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { getWeeklyEditionContent } from '@/lib/weeklyEdition';
import pageStyles from '@/app/innovation-pulse/stories/AllStories.module.css';
import styles from './WeeklyEditionView.module.css';

export default function WeeklyEditionView({ episode, current = false, previousDate, nextDate }: {
  episode: InnovationPulseEpisode; current?: boolean; previousDate?: string; nextDate?: string;
}) {
  const { lead, feature, promotedFeature, stories, storyCount } = getWeeklyEditionContent(episode);
  const listeningHub = !current && episode.date === '2026-10-23' && promotedFeature === 'the-measure-of-a-man';
  const picardHref = '/feature-coverage/' + picard.slug;
  const gridStories = listeningHub ? [{
    id: picardHref, href: picardHref, title: picard.title, summary: picard.teaser,
    category: picard.eyebrow, source: picard.sourceLabel, sourceUrl: picard.sourceUrl, byline: picard.byline, date: picard.publishedAt,
    dateLabel: picard.publishedLabel, image: picard.imagePath!,
  }, ...stories] : stories;
  const paragraphs = lead.summary.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  const introduction = feature?.sections[0]?.paragraphs[0] || paragraphs[0];
  const image = feature?.imagePath || lead.heroImage || lead.image;
  const sources = feature?.sources ?? (feature ? [{ label: feature.sourceLabel, url: feature.sourceUrl }] : lead.sourceLinks?.length ? lead.sourceLinks : [{ label: lead.source, url: lead.sourceUrl }]);
  const navigation = (<nav className={styles.navigation} aria-label="Edition navigation">
      {current && <EditionLink date={episode.date} />}
      <Link href="/innovation-pulse/stories">Explore the Library →</Link>
      <Link href="/innovation-pulse/stories?tab=editions">Weekly Editions →</Link>
    </nav>);
  return <div className={listeningHub ? pageStyles.page + " " + hubStyles.conceptPage : pageStyles.page}>
    {!current && <nav className={pageStyles.breadcrumb} aria-label="Breadcrumb"><Link href="/innovation-pulse">Innovation Pulse</Link><span aria-hidden="true">/</span><time dateTime={episode.date}>{episode.editionNumber ? formatWeekCovered(episode) : formatPulseDate(episode.date)}</time></nav>}
    {listeningHub ? <div className={hubStyles.shell}>
      <h1 className={hubStyles.heading}>Innovation Pulse Weekly Edition 22</h1>
      <EditionListeningHub readHref={picardHref} tracks={[
        {id:'weekly', label:'Weekly edition', title:'Innovation Pulse Weekly Edition 22', clock:episode.audioDuration!,
         seconds:501.32, audio:episode.audioUrl!, image:episode.weeklyHeroImageUrl!,
         alt:'Innovation Pulse Weekly Edition 22. Six stories, one weekly listen. The Measure of a Man, with Picard and Data.',
         peaks:getHomePulseWaveform(episode.date)!},
        {id:'feature', label:'Full Special Feature', title:picard.title, clock:picard.audioDuration!,
         seconds:1300.172744, audio:picard.audioUrl!, image:picard.imagePath!, alt:picard.imageAlt, peaks:PICARD_PEAKS},
      ]}/>
    </div> : <HomeEpisodePlayer latestEpisode={{
      date: episode.date, audioUrl: episode.audioUrl, audioDuration: episode.audioDuration,
      headline: lead.title, fallbackArtwork: lead.heroImage || lead.image || '',
      weeklyHeroImageUrl: episode.weeklyHeroImageUrl, storyCount, weekLabel: formatWeekCovered(episode),
    }} editionLayout />}
    {!listeningHub && promotedFeature === 'the-measure-of-a-man' && <PicardFeatureHero home />}
    {!listeningHub && navigation}
    {!promotedFeature && <article className={styles.article} aria-labelledby="edition-lead-title">
      <p className={styles.label}>{feature ? feature.eyebrow : 'Lead Story'}</p>
      <h2 id="edition-lead-title">{feature?.title || lead.title}</h2>
      <p className={styles.meta}>{feature?.byline || lead.source} · <time dateTime={episode.date}>{episode.editionNumber ? formatWeekCovered(episode) : formatPulseDate(episode.date)}</time></p>
      <p>{introduction}</p>
      <details className={styles.disclosure}>
        <summary>{feature ? 'Read Full Feature' : 'Read Full Story'}</summary>
        <div className={styles.body}>
          {image && <Image src={image} alt={feature?.imageAlt || lead.title} width={feature?.imageWidth || 1672} height={feature?.imageHeight || 941} sizes="(max-width: 900px) 100vw, 900px" className={styles.art} />}
          {feature ? feature.sections.map((section, index) => <section key={index}>
            {section.heading && <h3>{section.heading}</h3>}
            {(index === 0 ? section.paragraphs.slice(1) : section.paragraphs).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.sourceIds && <ul aria-label="Section sources">{section.sourceIds.map(id => {
              const source = feature.sources?.find(item => item.id === id);
              return source ? <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li> : null;
            })}</ul>}
          </section>) : <>
            {paragraphs.slice(1).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            {(episode.deepDive.editorialCallout || episode.closingThought) && <p>{episode.deepDive.editorialCallout || episode.closingThought}</p>}
          </>}
          <h3>{feature ? 'Sources and further reading' : 'Original reporting'}</h3>
          <ul>{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
          {feature && <p><Link href={'/feature-coverage/' + feature.slug}>Open the Feature page →</Link></p>}
        </div>
      </details>
    </article>}
    {gridStories.length > 0 && <section className={pageStyles.currentStories} aria-labelledby="edition-stories-title">
      <h2 id="edition-stories-title">Stories in this edition</h2>
      <p className={styles.meta}>{listeningHub ? `${storyCount} edition stories + 1 Special Feature` : <>{storyCount} stories in this edition{!promotedFeature && `, including the ${feature ? 'Feature' : 'lead story'} above`}.</>}</p>
      <AllStoriesClient headingLevel={3} stories={gridStories} embedded editionOrder={listeningHub} />
    </section>}
    {listeningHub && navigation}
    {episode.broadcastScript && <section className={styles.transcript} aria-label="Edition transcript"><details className={styles.disclosure}>
      <summary>Read the full broadcast transcript</summary>
      <div className={styles.body}>{cleanBroadcastScript(episode.broadcastScript).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
    </details></section>}
    <nav className={styles.previous} aria-label="Adjacent editions">
      {previousDate && <Link href={'/innovation-pulse/' + previousDate}>← Previous edition · {formatPulseDate(previousDate)}</Link>}
      {nextDate && <Link href={'/innovation-pulse/' + nextDate}>Next edition · {formatPulseDate(nextDate)} →</Link>}
    </nav>
    <p className={styles.meta}>The Innovation Pulse is produced using A.I. voice technology with editorial oversight by the Innovating Higher Ed team.</p>
  </div>;
}
