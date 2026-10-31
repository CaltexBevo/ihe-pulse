import PicardReadingProgress, { PicardContents } from './PicardReadingNavigation';
import Link from 'next/link';
import PicardFeatureHero from './PicardFeatureHero';
import { PICARD_FEATURED_COVERAGE as feature, PICARD_SECTIONS, PICARD_SIGNALS } from '@/lib/data/featured-coverage-picard';
import styles from './PicardFeature.module.css';

export default function PicardFeatureArticle() {
  let paragraphIndex = 0;
  return <div className={styles.page}>
    <PicardFeatureHero />
    <div className={styles.mission}><div><p>Humanity. Leadership. The future we choose to build.</p><a href="#read">Explore the reflection ↓</a></div></div>
    <PicardReadingProgress />
    <div className={styles.reading} id="read">
      <PicardContents />
      <article className={styles.article}>
        {feature.sections.map((section,index) => <section data-picard-section className={styles.articleSection} id={PICARD_SECTIONS[index].id} key={PICARD_SECTIONS[index].id} aria-labelledby={`heading-${PICARD_SECTIONS[index].id}`}>
          <div className={styles.kicker}>{PICARD_SECTIONS[index].kicker}</div>
          <h2 id={`heading-${PICARD_SECTIONS[index].id}`}>{section.heading}</h2>
          {section.paragraphs.map(text => { const i = paragraphIndex++; return <p key={i} data-source-index={i} className={PICARD_SIGNALS.includes(text) ? styles.signal : text === 'Adieu, mon capitaine.' ? styles.salute : i === 0 ? styles.opening : undefined}>{text}</p>; })}
        </section>)}
        <section className={styles.references} id="references"><h2>Episodes & references</h2><ul>{feature.sources?.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul></section>
        <div className={styles.endCard}><p>Explore new ideas. Shape higher ed together.</p><Link href="/#email-signup">Subscribe to Innovating Higher Ed ↗</Link></div>
      </article>
    </div>
  </div>;
}
