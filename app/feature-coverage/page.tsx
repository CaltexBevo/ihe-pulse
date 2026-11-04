import type { Metadata } from 'next';
import StoryPreviewCard from '@/components/StoryPreviewCard';
import Link from 'next/link';
import { FEATURED_COVERAGE, featureCardSource } from '@/lib/data/featured-coverage';
import { pageMetadata } from '@/lib/og';
import styles from './page.module.css';

export const metadata: Metadata = pageMetadata({
  title: 'Original Features | Innovating Higher Ed',
  description: 'Original Feature Coverage from Innovating Higher Ed on the ideas and decisions shaping higher education.',
  path: '/feature-coverage',
});

export default function FeatureCoverageIndexPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span> Back to Home
        </Link>
        <p className={styles.eyebrow}>Innovating Higher Ed</p>
        <h1 id="feature-coverage-heading">Original Features</h1>
        <p className={styles.intro}>
          Independent Feature Coverage exploring the questions, tools, and decisions shaping higher education.
        </p>
      </header>

      <section className={styles.content} aria-labelledby="feature-coverage-heading">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {FEATURED_COVERAGE.map(feature => {
            const source = featureCardSource(feature);
            return <StoryPreviewCard headingLevel={2} key={feature.slug} href={'/feature-coverage/' + feature.slug}
              title={feature.title} intro={feature.teaser} category={feature.eyebrow}
              image={feature.imagePath} byline={feature.byline} source={source.label}
              sourceUrl={source.url} dateLabel={feature.publishedLabel} />;
          })}
        </div>
      </section>
    </div>
  );
}
