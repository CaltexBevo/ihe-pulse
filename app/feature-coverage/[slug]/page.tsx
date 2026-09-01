import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FeatureArtwork } from "@/components/FeaturedCoverage";
import {
  FEATURED_COVERAGE,
  getFeaturedCoverageBySlug,
} from "@/lib/data/featured-coverage";
import { pageMetadata } from "@/lib/og";

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

function ArticleParagraph({ text, sourceUrl }: { text: string; sourceUrl: string }) {
  const sourceLead = "Read the complete MIT report";

  if (text.startsWith(sourceLead)) {
    return (
      <p className="text-[1.04rem] leading-[1.85] text-[var(--text-secondary)]">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--cyan)] underline decoration-[var(--cyan)]/50 underline-offset-4 hover:text-[var(--text)]"
        >
          {text}
        </a>
      </p>
    );
  }

  return <p className="text-[1.04rem] leading-[1.85] text-[var(--text-secondary)]">{text}</p>;
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

  return (
    <article className="min-h-screen">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 border-b border-[var(--border)] px-[var(--px)] py-3">
        <Link
          href="/"
          className="font-mono text-[0.72rem] text-[var(--cyan)] transition-colors hover:text-[var(--text)]"
        >
          <span aria-hidden="true">←</span> Back to Innovating Higher Ed
        </Link>
        <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {feature.category}
        </span>
      </div>

      <div className="mx-auto max-w-[1200px] px-[var(--px)] py-10 md:py-14">
        <header className="mx-auto mb-10 max-w-[900px]">
          <p className="mb-4 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--cyan)]">
            {feature.eyebrow}
          </p>
          <h1
            className="max-w-[880px] text-[clamp(2.15rem,5vw,4.2rem)] font-bold leading-[1.03] tracking-[-0.03em] text-[var(--text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {feature.title}
          </h1>
          <p className="mt-6 max-w-[800px] text-[1.12rem] leading-[1.7] text-[var(--text-secondary)]">
            {feature.teaser}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--border)] pt-4">
            <span className="text-[0.9rem] font-semibold text-[var(--text)]">{feature.byline}</span>
            <span aria-hidden="true" className="text-[var(--text-dim)]">•</span>
            <time
              dateTime={feature.publishedAt}
              className="font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[var(--text-muted)]"
            >
              {feature.publishedLabel}
            </time>
          </div>
        </header>

        <div className="mx-auto mb-10 max-w-[1000px]">
          <FeatureArtwork feature={feature} />
        </div>

        <div className="mx-auto mb-10 flex max-w-[820px] flex-col gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[var(--text-muted)]">
              Primary source
            </p>
            <p className="mt-1 text-[0.9rem] font-semibold text-[var(--text)]">{feature.sourceLabel}</p>
          </div>
          <a
            href={feature.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-[8px] border border-[var(--cyan)] px-3 py-2 font-mono text-[0.68rem] text-[var(--cyan)] transition-colors hover:bg-[var(--cyan-soft)] hover:text-[var(--text)]"
          >
            Open MIT report <span aria-hidden="true" className="ml-2">↗</span>
          </a>
        </div>

        <div className="mx-auto max-w-[820px] space-y-10">
          {feature.sections.map((section, sectionIndex) => (
            <section key={section.heading ?? `intro-${sectionIndex}`} className="space-y-4">
              {section.heading && (
                <h2
                  className="border-l-2 border-[var(--magenta)] pl-4 text-[clamp(1.45rem,3vw,2rem)] font-bold leading-[1.15] text-[var(--text)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {section.heading}
                </h2>
              )}
              <div className="space-y-5">
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <ArticleParagraph
                    key={`${sectionIndex}-${paragraphIndex}`}
                    text={paragraph}
                    sourceUrl={feature.sourceUrl}
                  />
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-3 border-l border-[var(--border-strong)] pl-6 text-[1.02rem] leading-[1.75] text-[var(--text-secondary)]">
                    {section.bullets.map((item, itemIndex) => (
                      <li key={`${sectionIndex}-bullet-${itemIndex}`} className="relative pl-4 before:absolute before:left-0 before:text-[var(--cyan)] before:content-['•']">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-[820px] border-t border-[var(--border)] pt-6">
          <Link
            href="/"
            className="font-mono text-[0.72rem] tracking-[0.05em] text-[var(--cyan)] transition-colors hover:text-[var(--text)]"
          >
            <span aria-hidden="true">←</span> Return to the Innovation Pulse
          </Link>
        </div>
      </div>
    </article>
  );
}
