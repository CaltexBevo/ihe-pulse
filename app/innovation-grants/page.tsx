import Link from "next/link";
import PortalFundingTally from "./PortalFundingTally";
import PortalDayRefresh from "./PortalDayRefresh";
import {
  INNOVATION_GRANTS_AREA_FILTERS,
  INNOVATION_GRANTS_AUDIENCE_FILTERS,
  INNOVATION_GRANTS_FULL_SEARCH_DATE,
  INNOVATION_GRANTS_VERIFIED_ON,
  getInnovationGrantDaysUntilDeadline,
  getInnovationGrantFundingSnapshot,
  getInnovationGrantLifecycle,
  getInnovationGrantPacificAsOfDate,
  getInnovationGrantPacificCalendarDate,
  isInnovationGrantNewThisWeek,
  sortInnovationGrantOpportunities,
  type InnovationGrantArea,
  type InnovationGrantOpportunity,
} from "@/lib/innovation-grants-shared";
import { getPublicInnovationGrants } from "@/lib/data/innovation-grants-public";
import { pageMetadata } from "@/lib/og";
import styles from "./portal.module.css";

export const metadata = pageMetadata({
  title: "Grant Portal | Innovating Higher Ed",
  description:
    "Find current higher-education innovation grant opportunities by who can apply, what they fund, and when they close.",
  path: "/innovation-grants",
  imagePath: "/innovation-grants/opengraph-image",
  imageAlt: "Grant Portal from Innovating Higher Ed",
  imageWidth: 1200,
  imageHeight: 630,
  twitterCard: "summary_large_image",
});

export const dynamic = "force-dynamic";

const finderDeadlines = [
  ["any", "Any deadline"],
  ["closing-14", "Closing in 14 days"],
  ["30-plus", "At least 30 days to prepare"],
  ["60-plus", "At least 60 days to prepare"],
  ["90-plus", "At least 90 days to prepare"],
  ["rolling", "Rolling or no fixed deadline"],
] as const;

const folderDescriptions: Record<InnovationGrantArea, string> = {
  "ai-emerging-technology": "AI literacy, responsible adoption, and new learning tools.",
  "teaching-learning": "Course redesign, active learning, and pedagogy.",
  "student-success": "Retention, belonging, and support that reaches students.",
  "workforce-pathways": "Credentials, partnerships, and classroom-to-career routes.",
  "community-college-innovation": "Two-year college pathways, teaching, and institutional capacity.",
  "digital-transformation-infrastructure": "Technology and systems that support learning.",
  "research-evidence-building": "Evidence to understand and improve education.",
  "faculty-development": "Educator learning, teaching capacity, and professional growth.",
};

function areaLabel(area: string): string {
  return INNOVATION_GRANTS_AREA_FILTERS.find((filter) => filter.id === area)?.label ?? area;
}

function dateLabel(value: string): string {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function deadlineCountdown(opportunity: InnovationGrantOpportunity, asOf: Date): string {
  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  if (lifecycle === "opening-soon") return "Opening soon";
  if (lifecycle === "recurring-watchlist") return "Planning only";
  const days = getInnovationGrantDaysUntilDeadline(opportunity, asOf);
  if (days === undefined) return "See official deadline";
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  if (days > 1) return `${days} days left`;
  return "Deadline passed";
}

function tileTone(area: InnovationGrantArea): string {
  if (area === "ai-emerging-technology" || area === "digital-transformation-infrastructure") {
    return "var(--purple)";
  }
  if (area === "student-success" || area === "research-evidence-building") {
    return "var(--magenta)";
  }
  if (area === "workforce-pathways" || area === "faculty-development") {
    return "var(--amber)";
  }
  return "var(--cyan)";
}

function FinderSelect({
  id,
  name,
  label,
  className,
  children,
}: {
  id: string;
  name: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} name={name} className={`slot ${className}`} defaultValue={name === "deadline" ? "any" : "all"}>
        {children}
      </select>
    </>
  );
}

function OpportunityLine({
  opportunity,
  asOf,
  urgent,
}: {
  opportunity: InnovationGrantOpportunity;
  asOf: Date;
  urgent?: boolean;
}) {
  const firstArea = opportunity.innovationAreas[0];
  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  const tone = tileTone(firstArea);
  return (
    <Link
      className="row"
      style={{ "--c": tone } as React.CSSProperties}
      href={`/innovation-grants/directory?id=${opportunity.id}#grant-${opportunity.id}`}
    >
      <span className="keel" aria-hidden="true" />
      <span className="copy">
        <span className="tag">{areaLabel(firstArea)}</span>
        <h3>{opportunity.title}</h3>
        <span className="meta">{opportunity.source}</span>
      </span>
      <span className="end">
        <span className={`chip ${urgent || lifecycle === "closing-soon" ? "due" : "new"}`}>
          {urgent ? deadlineCountdown(opportunity, asOf) : `Added ${dateLabel(opportunity.portalAddedDate)}`}
        </span>
      </span>
    </Link>
  );
}

export default function InnovationGrantsPage() {
  const now = new Date();
  const asOf = getInnovationGrantPacificAsOfDate(now);
  const asOfDate = getInnovationGrantPacificCalendarDate(now);
  const opportunities = getPublicInnovationGrants();
  const snapshot = getInnovationGrantFundingSnapshot(opportunities, asOf);
  const active = opportunities.filter((opportunity) => {
    const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
    return lifecycle === "open-now" || lifecycle === "closing-soon" || lifecycle === "opening-soon";
  });
  const recent = sortInnovationGrantOpportunities(
    active.filter((opportunity) => isInnovationGrantNewThisWeek(opportunity, asOf)),
    "recently-added",
    asOf,
  ).slice(0, 3);
  const closingSoon = sortInnovationGrantOpportunities(
    active.filter((opportunity) => getInnovationGrantLifecycle(opportunity, asOf) === "closing-soon"),
    "deadline",
    asOf,
  ).slice(0, 3);
  return (
    <div className={`${styles.portal} ${styles.home}`}>
        <PortalDayRefresh asOfDate={asOfDate} />
        <div className="field" aria-hidden="true">
          <div className="shard s1" />
          <div className="shard s2" />
          <div className="shard s3" />
          <div className="shard s4" />
          <div className="sweep" />
        </div>

        <header className="hero">
          <section className="panel statement reveal" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <div className="spectrum" aria-hidden="true">
              <i style={{ "--i": 0, background: "var(--t-cyan)" } as React.CSSProperties} />
              <i style={{ "--i": 1, background: "var(--t-purple)" } as React.CSSProperties} />
              <i style={{ "--i": 2, background: "var(--t-magenta)" } as React.CSSProperties} />
              <i style={{ "--i": 3, background: "var(--t-amber)" } as React.CSSProperties} />
            </div>
            <div className="page-kicker">Grant Portal</div>
            <h1>
              Every kind of change, <span className="grad">funded.</span>
            </h1>
            <p>Find higher-education grant opportunities by who can apply, what they fund, and when they close.</p>
            <div className="metrics" id="metrics" aria-label="Current grant directory totals">
              <div className="funding">
                <PortalFundingTally amount={snapshot.publishedProgramPoolUsd} />
                <small>reported current program funding</small>
              </div>
              <div>
                <b>{snapshot.openOpportunityCount}</b>
                <small>open opportunities</small>
              </div>
              <div>
                <b>{snapshot.closingSoonCount}</b>
                <small>closing soon</small>
              </div>
              <div>
                <b>{snapshot.openingSoonCount}</b>
                <small>opening soon</small>
              </div>
            </div>
            <p className="funding-note" id="fundingNote">
              Across {snapshot.publishedProgramPoolCount} program pools, including {snapshot.approximatePoolCount} approximate totals. Not a promise of remaining funds. Awards are competitive.
            </p>
            <p className="checkpoint" id="checkpoint">
              Latest inventory check {INNOVATION_GRANTS_VERIFIED_ON} · Full discovery search {INNOVATION_GRANTS_FULL_SEARCH_DATE}. Status calculated for {dateLabel(asOfDate)} (Pacific). Individual records retain their own dates.
            </p>
          </section>

          <section className="finder reveal" style={{ "--d": "0.12s" } as React.CSSProperties} aria-labelledby="finder-heading">
            <h2 id="finder-heading">Tell us what you&apos;re working on</h2>
            <p className="sub">Choose the broadest fit that feels right. You can refine every field in the full directory.</p>
            <form id="finder" action="/innovation-grants/directory" method="get" className="finder-form">
              <div className="sentence">
                <div className="finder-line">
                  <span>I work with</span>
                  <FinderSelect id="fWho" name="audience" label="Institution or role" className="q1">
                    {INNOVATION_GRANTS_AUDIENCE_FILTERS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.id === "all" ? "All institutions and roles" : option.label}
                      </option>
                    ))}
                  </FinderSelect>
                </div>
                <div className="finder-line">
                  <span>seeking funding for</span>
                  <FinderSelect id="fWhat" name="area" label="Innovation area" className="q2">
                    {INNOVATION_GRANTS_AREA_FILTERS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </FinderSelect>
                </div>
                <div className="finder-line">
                  <span>with</span>
                  <FinderSelect id="fWhen" name="deadline" label="Deadline window" className="q3">
                    {finderDeadlines.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </FinderSelect>
                  <span>.</span>
                </div>
              </div>
              <button className="go" type="submit">Show my opportunities</button>
              <Link className="alt" href="/innovation-grants/directory">Browse everything instead</Link>
            </form>
            <p className="fine">Matches are potential matches. Confirm eligibility, deadlines, and application access with the official funder.</p>
          </section>
        </header>

        <section className="section" aria-labelledby="areas-heading">
          <div className="sec-head">
            <h2 id="areas-heading">What are you trying to change?</h2>
            <p>Active and opening opportunities. Areas can overlap.</p>
          </div>
          <div className="tiles" id="categoryTiles">
            {(["teaching-learning", "ai-emerging-technology", "student-success", "workforce-pathways", "community-college-innovation", "digital-transformation-infrastructure", "research-evidence-building", "faculty-development"] as InnovationGrantArea[]).map((area) => {
              const filter = INNOVATION_GRANTS_AREA_FILTERS.find((candidate) => candidate.id === area);
              if (!filter) return null;
              const count = active.filter((opportunity) => opportunity.innovationAreas.includes(area)).length;
              return (
                <Link
                  key={area}
                  className="tile"
                  href={`/innovation-grants/directory?area=${area}`}
                  aria-label={`${filter.label}: ${count} opportunities`}
                >
                  <span className="n">{count} opportunities</span>
                  <h3>{filter.label}</h3>
                  <p>{folderDescriptions[area]}</p>
                </Link>
              );
            })}
          </div>
          <div className="rails">
            <section className="rail">
              <div className="rail-heading"><h2>New this week</h2><Link href="/innovation-grants/directory?freshness=new-this-week&sort=recently-added">See all</Link></div>
              <div id="recentRail">
                {recent.length > 0 ? recent.map((opportunity) => <OpportunityLine key={opportunity.id} opportunity={opportunity} asOf={asOf} />) : <p className="fine">No new active opportunities were added in the last seven days. Browse all opportunities for the current inventory.</p>}
              </div>
            </section>
            <section className="rail">
              <div className="rail-heading"><h2>Closing soon</h2><Link href="/innovation-grants/directory?status=closing-soon&sort=deadline">See all</Link></div>
              <div id="closingRail">
                {closingSoon.length > 0 ? closingSoon.map((opportunity) => <OpportunityLine key={opportunity.id} opportunity={opportunity} asOf={asOf} urgent />) : <p className="fine">No currently listed opportunities are closing within fourteen calendar days.</p>}
              </div>
            </section>
          </div>
        </section>

        <section className="trust" id="how-we-verify">
          <div className="trust-in">
            <details>
              <summary>How we verify</summary>
              <p>Every public record starts with an official source and shows a last-verified date. Individual records retain their actual verification dates. Always read the official source before applying.</p>
              <p>The funding total includes reported current program-level cash amounts, not money guaranteed to remain available. Per-award-only caps, in-kind credits, and mixed-purpose budgets are excluded. Awards are competitive and not guaranteed.</p>
              <p>Unresolved source conflicts and unavailable application paths are held for review and do not appear in this launch. Planning-watchlist and closed opportunities are separated from active opportunities. Evidence-only research checks are retained outside the public directory.</p>
              <p id="trustDates">Latest inventory check {INNOVATION_GRANTS_VERIFIED_ON} · Full discovery search {INNOVATION_GRANTS_FULL_SEARCH_DATE} · Status calculated for {dateLabel(asOfDate)} (Pacific).</p>
            </details>
          </div>
        </section>
    </div>
  );
}
