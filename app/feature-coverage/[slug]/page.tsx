import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import {
  FEATURED_COVERAGE,
  getFeaturedCoverageBySlug,
  type FeaturedCoverage,
  type FeaturedCoverageSection,
} from "@/lib/data/featured-coverage";
import { pageMetadata } from "@/lib/og";

const SEQUENCE_STEPS = [
  {
    number: "01",
    label: "Purpose",
    description: "Start with what education is meant to achieve.",
  },
  {
    number: "02",
    label: "Practice",
    description: "Design learning experiences that build knowledge, skills, and judgment.",
  },
  {
    number: "03",
    label: "Policy",
    description: "Set AI guidelines that protect what matters and enable what’s possible.",
  },
] as const;

const QUESTIONS_HEADING = "Questions worth carrying back to campus";

export function generateStaticParams() {
  return FEATURED_COVERAGE.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeaturedCoverageBySlug(slug);

  if (!feature) {
    return { title: "Feature Coverage Not Found | Innovating Higher Ed" };
  }

  return {
    ...pageMetadata({
      title: `${feature.title} | Innovating Higher Ed`,
      description: feature.teaser,
      path: `/feature-coverage/${feature.slug}`,
      type: "article",
      imagePath: feature.imagePath ?? undefined,
      imageAlt: feature.imageAlt || feature.title,
      twitterCard: feature.imagePath ? "summary_large_image" : "summary",
      imageWidth: feature.imagePath ? 2752 : undefined,
      imageHeight: feature.imagePath ? 1536 : undefined,
    }),
    authors: [{ name: "Dr. Norma Jones" }],
    creator: "Dr. Norma Jones",
    publisher: "Innovating Higher Ed",
  };
}

function sectionId(section: FeaturedCoverageSection, index: number) {
  if (section.heading === QUESTIONS_HEADING) {
    return "questions";
  }

  if (!section.heading) {
    return index === 0 ? "feature-introduction" : `feature-section-${index + 1}`;
  }

  const headingSlug = section.heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `section-${index + 1}-${headingSlug}`;
}

function FeatureTitle({ title }: { title: string }) {
  const emphasis = "What Education Is For";
  const emphasisStart = title.indexOf(emphasis);

  if (emphasisStart === -1) {
    return title;
  }

  return (
    <>
      {title.slice(0, emphasisStart)}
      <span className={styles.titleEmphasis}>{title.slice(emphasisStart)}</span>
    </>
  );
}

function ArticleParagraph({ text, sourceUrl }: { text: string; sourceUrl: string }) {
  const sourceLead = "Read the complete MIT report";

  if (text.startsWith(sourceLead)) {
    return (
      <p className={styles.articleParagraph}>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.articleLink}
        >
          {text} <span aria-hidden="true">↗</span>
        </a>
      </p>
    );
  }

  return <p className={styles.articleParagraph}>{text}</p>;
}

function SequenceRail() {
  return (
    <aside className={`${styles.sideRail} ${styles.sequenceRail}`} aria-labelledby="sequence-heading">
      <p id="sequence-heading" className={styles.sectionLabel}>
        The Sequence
      </p>
      <ol className={styles.sequenceList}>
        {SEQUENCE_STEPS.map((step, index) => (
          <li key={step.number} className={styles.sequenceStep}>
            <span
              className={`${styles.sequenceDot} ${index === 0 ? styles.sequenceDotActive : ""}`}
              aria-hidden="true"
            />
            <span className={styles.sequenceNumber}>{step.number}</span>
            <span className={styles.sequenceCopy}>
              <strong>{step.label}</strong>
              <span>{step.description}</span>
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function QuestionsRail({ questions }: { questions: string[] }) {
  return (
    <aside className={`${styles.sideRail} ${styles.questionsRail}`} aria-labelledby="questions-nav-heading">
      <p id="questions-nav-heading" className={styles.sectionLabel}>
        Eight Questions
      </p>
      <ol className={styles.questionNav}>
        {questions.slice(0, 3).map((question, index) => (
          <li key={question}>
            <a className={styles.questionNavLink} href={`#question-${index + 1}`}>
              <span className={styles.questionNavNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span>{question}</span>
            </a>
          </li>
        ))}
      </ol>
      <a className={styles.allQuestionsLink} href="#questions">
        View all eight questions <span aria-hidden="true">↓</span>
      </a>
    </aside>
  );
}

function ArticleSection({
  feature,
  section,
  sectionIndex,
}: {
  feature: FeaturedCoverage;
  section: FeaturedCoverageSection;
  sectionIndex: number;
}) {
  const isQuestionSection = section.heading === QUESTIONS_HEADING;
  const id = sectionId(section, sectionIndex);

  return (
    <section id={id} className={styles.articleSection}>
      {section.heading && <h2 className={styles.articleHeading}>{section.heading}</h2>}
      <div className={styles.paragraphStack}>
        {section.paragraphs.map((paragraph, paragraphIndex) => (
          <div
            key={`${sectionIndex}-${paragraphIndex}`}
            className={sectionIndex === 0 && paragraphIndex === 0 ? styles.leadParagraph : undefined}
          >
            <ArticleParagraph text={paragraph} sourceUrl={feature.sourceUrl} />
          </div>
        ))}
      </div>
      {section.bullets && section.bullets.length > 0 &&
        (isQuestionSection ? (
          <ol className={styles.questionList} aria-label="Eight questions for campus conversations">
            {section.bullets.map((item, itemIndex) => (
              <li
                id={`question-${itemIndex + 1}`}
                tabIndex={-1}
                key={`${sectionIndex}-question-${itemIndex}`}
                className={styles.questionItem}
              >
                <span className={styles.questionItemNumber}>{String(itemIndex + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        ) : (
          <ul className={styles.articleList}>
            {section.bullets.map((item, itemIndex) => (
              <li key={`${sectionIndex}-bullet-${itemIndex}`}>{item}</li>
            ))}
          </ul>
        ))}
    </section>
  );
}

export default async function FeaturedCoveragePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeaturedCoverageBySlug(slug);

  if (!feature) {
    notFound();
  }

  const questionSection = feature.sections.find((section) => section.heading === QUESTIONS_HEADING);
  const questions = questionSection?.bullets ?? [];

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="feature-title">
        <div className={styles.heroCopy}>
          <p className={styles.featureLabel}>
            <span aria-hidden="true" className={styles.featureLabelLine} />
            <span>{feature.eyebrow}</span>
          </p>
          <p className={styles.analysisLabel}>Original Analysis</p>
          <h1 id="feature-title" className={styles.heroTitle}>
            <FeatureTitle title={feature.title} />
          </h1>
        </div>

        <div className={styles.heroArt}>
          {feature.imagePath && (
            <Image
              src={feature.imagePath}
              alt={feature.imageAlt || feature.title}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 55vw"
              className={styles.heroImage}
            />
          )}
        </div>

        <div className={styles.heroMeta}>
          <span>{feature.byline}</span>
          <span aria-hidden="true" className={styles.metaDot}>•</span>
          <time dateTime={feature.publishedAt}>{feature.publishedLabel}</time>
        </div>
      </section>

      <section className={styles.editorialGrid} aria-label="Feature Coverage article">
        <SequenceRail />

        <div className={styles.articleBody}>
          {feature.sections.map((section, sectionIndex) => (
            <div key={section.heading ?? `intro-${sectionIndex}`}>
              <ArticleSection
                feature={feature}
                section={section}
                sectionIndex={sectionIndex}
              />
              {sectionIndex === 0 && (
                <p className={styles.sourceNote}>
                  <span className={styles.sourceNoteLabel}>Primary source</span>
                  <a
                    href={feature.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.articleLink}
                  >
                    {feature.sourceLabel} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              )}
            </div>
          ))}

          <div className={styles.articleFooter}>
            <Link href="/" className={styles.backLink}>
              <span aria-hidden="true">←</span> Return to the Innovation Pulse
            </Link>
          </div>
        </div>

        <QuestionsRail questions={questions} />
      </section>
    </article>
  );
}
