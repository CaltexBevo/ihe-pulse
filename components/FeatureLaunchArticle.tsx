import Image from "next/image";
import Link from "next/link";
import type { FeaturedCoverage } from "@/lib/data/featured-coverage";
import styles from "./FeatureLaunchArticle.module.css";

export default function FeatureLaunchArticle({ feature }: { feature: FeaturedCoverage }) {
  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.label}>{feature.eyebrow}</p>
          <h1>{feature.title}</h1>
          <p className={styles.meta}>
            <span>{feature.byline}</span>
            <time dateTime={feature.publishedAt}>{feature.publishedLabel}</time>
          </p>
        </div>
        {feature.imagePath && (
          <div className={styles.art}>
            <Image
              src={feature.imagePath}
              alt={feature.imageAlt}
              width={feature.imageWidth}
              height={feature.imageHeight}
              priority
              sizes="(max-width: 767px) 100vw, 60vw"
              className={styles.image}
            />
          </div>
        )}
      </header>
      <div className={styles.body}>
        {feature.sections.flatMap((section) => section.paragraphs).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Link href="/innovation-grants" className={styles.cta}>
          Explore the Grant Portal <span aria-hidden="true">→</span>
        </Link>
        <aside className={styles.sources} aria-label="Sources and further reading">
          <h2>Sources and further reading</h2>
          <ul>
            {feature.sources?.map((source) => (
              <li key={source.url}><a href={source.url}>{source.label}</a></li>
            ))}
          </ul>
        </aside>
        <Link href="/" className={styles.back}>← Return to Innovating Higher Ed</Link>
      </div>
    </article>
  );
}
