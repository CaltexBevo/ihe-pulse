import Image from "next/image";
import Link from "next/link";
import {
  MIT_FEATURED_COVERAGE,
  type FeaturedCoverage as FeaturedCoverageRecord,
} from "@/lib/data/featured-coverage";

type FeaturedCoverageProps = {
  feature?: FeaturedCoverageRecord;
};

export function FeatureArtwork({ feature }: { feature: FeaturedCoverageRecord }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-[var(--border-strong)] bg-[var(--surface)]">
      {feature.imagePath ? (
        <Image
          src={feature.imagePath}
          alt={feature.imageAlt || feature.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7"
          role="img"
          aria-label="Feature Coverage artwork is awaiting final image selection"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.14em] text-[var(--cyan)]">
                FEATURE COVERAGE
              </span>
              <span className="rounded-[4px] bg-[var(--magenta)] px-2 py-1 font-mono text-[0.58rem] font-bold tracking-[0.1em] text-[var(--text)]">
                MIT REPORT
              </span>
            </div>
            <span className="h-[2px] w-16 bg-[var(--magenta)]" aria-hidden="true" />
          </div>
          <div className="max-w-[28rem]">
            <p className="mb-2 font-mono text-[0.58rem] uppercase leading-[1.5] tracking-[0.1em] text-[var(--text-muted)]">
              AI and Education Report
            </p>
            <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--amber)]">
              Before setting AI guidelines
            </p>
            <p
              className="text-[clamp(1.35rem,3.2vw,2.3rem)] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--text)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What is education for?
            </p>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="h-1 w-24 bg-[var(--cyan)]" aria-hidden="true" />
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-[var(--text-dim)]">
              Purpose before policy
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeaturedCoverage({ feature = MIT_FEATURED_COVERAGE }: FeaturedCoverageProps) {
  return (
    <section
      aria-labelledby="featured-coverage-heading"
      className="w-full border-y border-[var(--border)] bg-[var(--surface)]"
    >
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)] py-10 md:py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src="/images/ihe-logo.png"
              alt="Innovating Higher Ed"
              width={168}
              height={72}
              className="h-12 w-auto shrink-0 object-contain sm:h-14"
            />
            <div className="min-w-0 border-l border-[var(--border-strong)] pl-4">
              <p className="mb-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--cyan)]">
                Original analysis
              </p>
              <h2
                id="featured-coverage-heading"
                className="text-[clamp(1.35rem,3vw,2.1rem)] font-bold leading-[1.15] text-[var(--text)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Featured Coverage
              </h2>
            </div>
          </div>
          <Link
            href={`/feature-coverage/${feature.slug}`}
            className="hidden shrink-0 font-mono text-[0.7rem] tracking-[0.05em] text-[var(--cyan)] transition-colors hover:text-[var(--text)] sm:inline-flex"
          >
            Read full coverage <span aria-hidden="true">→</span>
          </Link>
        </div>

        <Link
          href={`/feature-coverage/${feature.slug}`}
          className="group grid gap-7 rounded-[18px] border border-[var(--border-strong)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[var(--cyan)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)] sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center"
        >
          <FeatureArtwork feature={feature} />

          <div className="min-w-0">
            <p className="mb-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--magenta-text)]">
              {feature.eyebrow}
            </p>
            <h3
              className="mb-4 text-[clamp(1.5rem,3vw,2.35rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[var(--text)] transition-colors group-hover:text-[var(--cyan)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {feature.title}
            </h3>
            <p className="mb-5 text-[0.96rem] leading-[1.7] text-[var(--text-secondary)]">
              {feature.teaser}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--border)] pt-4">
              <span className="text-[0.82rem] font-semibold text-[var(--text)]">{feature.byline}</span>
              <span aria-hidden="true" className="text-[var(--text-dim)]">•</span>
              <time
                dateTime={feature.publishedAt}
                className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[var(--text-muted)]"
              >
                {feature.publishedLabel}
              </time>
            </div>
            <span className="mt-5 inline-flex font-mono text-[0.7rem] tracking-[0.05em] text-[var(--cyan)] sm:hidden">
              Read full coverage <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
