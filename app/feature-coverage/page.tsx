import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_COVERAGE } from '@/lib/data/featured-coverage';
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
        <div className={styles.grid}>
          {FEATURED_COVERAGE.map((feature) => (
            <article key={feature.slug} className={styles.card}>
              <Link href={`/feature-coverage/${feature.slug}`} className={styles.cardLink}>
                <div className={styles.artwork}>
                  {feature.imagePath ? (
                    <Image
                      src={feature.imagePath}
                      alt={feature.imageAlt || ''}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className={styles.image}
                    />
                  ) : (
                    <span className={styles.artworkFallback}>Feature artwork</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardEyebrow}>{feature.eyebrow}</p>
                  <h2>{feature.title}</h2>
                  <p className={styles.teaser}>{feature.teaser}</p>
                  <div className={styles.cardMeta}>
                    <span>{feature.category}</span>
                    <time dateTime={feature.publishedAt}>{feature.publishedLabel}</time>
                  </div>
                  <span className={styles.readLink}>Read Feature <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
