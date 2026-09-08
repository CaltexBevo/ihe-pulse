"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  getInnovationGrantDaysUntilDeadline,
  getInnovationGrantInventoryLabel,
  getInnovationGrantLifecycle,
  INNOVATION_GRANTS_AREA_FILTERS,
  INNOVATION_GRANTS_AUDIENCE_FILTERS,
  INNOVATION_GRANTS_FULL_SEARCH_DATE,
  INNOVATION_GRANTS_VERIFIED_ON,
  isInnovationGrantNewThisWeek,
  sortInnovationGrantOpportunities,
  type InnovationGrantArea,
  type InnovationGrantAudience,
  type InnovationGrantLifecycle,
  type InnovationGrantOpportunity,
  type InnovationGrantSort,
} from "@/lib/innovation-grants-shared";
import {
  classifyInnovationGrantCostShare,
  filterInnovationGrantOpportunities,
  getInnovationGrantGeographyOptions,
  type InnovationGrantCostShareFilter,
  type InnovationGrantDeadlineFilter,
  type InnovationGrantFreshnessFilter,
} from "@/lib/innovation-grants-directory";

type DirectoryLifecycleFilter = "active" | "opening-soon" | "recurring-watchlist" | "closed" | "closing-soon" | "open-now";

interface DirectoryState {
  q: string;
  audience: "all" | InnovationGrantAudience;
  area: "all" | InnovationGrantArea;
  funder: FunderType;
  deadline: InnovationGrantDeadlineFilter;
  geography: string;
  freshness: InnovationGrantFreshnessFilter;
  costShare: InnovationGrantCostShareFilter;
  sort: InnovationGrantSort;
  states: DirectoryLifecycleFilter[];
  noMatch: boolean;
  page: number;
  perPage: 10 | 20 | 50;
  id: number | null;
}

type FunderType = "all" | "federal" | "state" | "nonprofit" | "institution" | "corporate" | "other";

const DEFAULT_STATE: DirectoryState = {
  q: "",
  audience: "all",
  area: "all",
  funder: "all",
  deadline: "any",
  geography: "all",
  freshness: "all",
  costShare: "all",
  sort: "recommended",
  states: ["active", "opening-soon"],
  noMatch: false,
  page: 1,
  perPage: 10,
  id: null,
};

const DEADLINES: Array<[InnovationGrantDeadlineFilter, string]> = [
  ["any", "Any deadline"],
  ["closing-14", "Closing in 14 days"],
  ["30-plus", "At least 30 days to prepare"],
  ["60-plus", "At least 60 days to prepare"],
  ["90-plus", "At least 90 days to prepare"],
  ["rolling", "Rolling or no fixed deadline"],
];

const FRESHNESS: Array<[InnovationGrantFreshnessFilter, string]> = [
  ["all", "Any addition date"],
  ["new-this-week", "New this week"],
  ["recently-added", "Added in the last 30 days"],
];

const COST_SHARES: Array<[InnovationGrantCostShareFilter, string]> = [
  ["all", "Any matching requirement"],
  ["required", "Required"],
  ["not-required", "Not required"],
  ["not-stated", "Not stated"],
];

const SORTS: Array<[InnovationGrantSort, string]> = [
  ["recommended", "Recommended / Best Match"],
  ["deadline", "Deadline (soonest)"],
  ["recently-added", "Recently Added"],
  ["newest", "Newest Announcement"],
];

const FUNDER_TYPES: Array<[FunderType, string]> = [
  ["all", "Any funder"],
  ["federal", "Federal agency"],
  ["state", "State / public system"],
  ["nonprofit", "Foundation / nonprofit"],
  ["institution", "Institutional"],
  ["corporate", "Corporate"],
];

const FUNDER_ID_MAP: Record<Exclude<FunderType, "all" | "corporate" | "other">, readonly number[]> = {
  federal: [44, 61, 62, 63, 64, 65, 66, 67, 71, 72, 73, 74, 78, 79, 80, 81, 82, 84, 87, 88],
  state: [43, 52, 54, 55, 56, 57, 58, 59, 68, 70],
  nonprofit: [42, 51, 53, 60, 69, 75, 76, 77, 83, 86],
  institution: [38, 48, 85],
};

const AREA_COLORS: Record<InnovationGrantArea, string> = {
  "teaching-learning": "var(--t-cyan)",
  "ai-emerging-technology": "var(--t-purple)",
  "student-success": "var(--t-magenta)",
  "workforce-pathways": "var(--t-amber)",
  "community-college-innovation": "var(--t-cyan)",
  "digital-transformation-infrastructure": "var(--t-purple)",
  "research-evidence-building": "var(--t-magenta)",
  "faculty-development": "var(--t-amber)",
};

function optionLabel(options: Array<[string, string]>, value: string): string | undefined {
  return options.find(([id]) => id === value)?.[1];
}

function readParam(params: { get(name: string): string | null }, name: string, fallback: string): string {
  return params.get(name) ?? fallback;
}

function parseQuery(params: { get(name: string): string | null; has(name: string): boolean }): DirectoryState {
  const state: DirectoryState = { ...DEFAULT_STATE, states: [...DEFAULT_STATE.states] };
  state.q = readParam(params, "q", "");
  state.audience = readParam(params, "audience", "all") as DirectoryState["audience"];
  state.area = readParam(params, "area", "all") as DirectoryState["area"];
  state.funder = readParam(params, "funder", "all") as FunderType;
  state.deadline = readParam(params, "deadline", "any") as InnovationGrantDeadlineFilter;
  state.geography = readParam(params, "geography", "all");
  state.freshness = readParam(params, "freshness", "all") as InnovationGrantFreshnessFilter;
  state.costShare = readParam(params, "costShare", "all") as InnovationGrantCostShareFilter;
  state.sort = readParam(params, "sort", "recommended") as InnovationGrantSort;

  if (params.has("states")) {
    const allowed = new Set<DirectoryLifecycleFilter>(["active", "opening-soon", "recurring-watchlist", "closed", "closing-soon", "open-now"]);
    state.states = (params.get("states") ?? "").split(",").filter((value): value is DirectoryLifecycleFilter => allowed.has(value as DirectoryLifecycleFilter));
  }
  if (params.has("status")) {
    const status = params.get("status");
    state.states = status === "all"
      ? ["active", "opening-soon", "recurring-watchlist", "closed"]
      : status && ["active", "closing-soon", "open-now", "opening-soon", "recurring-watchlist", "closed"].includes(status)
        ? [status as DirectoryLifecycleFilter]
        : state.states;
  }
  if (state.states.length === 1 && state.states[0] === "closing-soon") {
    state.states = ["active"];
    state.deadline = "closing-14";
  }

  state.noMatch = params.get("noMatch") === "1";
  const page = Number(params.get("page"));
  if (Number.isFinite(page) && page > 0) state.page = Math.floor(page);
  const perPage = Number(params.get("perPage"));
  if (perPage === 10 || perPage === 20 || perPage === 50) state.perPage = perPage;
  const id = Number(params.get("id"));
  if (Number.isInteger(id) && id > 0) {
    state.id = id;
    state.states = ["active", "opening-soon", "recurring-watchlist", "closed"];
  }

  if (!INNOVATION_GRANTS_AUDIENCE_FILTERS.some(({ id: value }) => value === state.audience)) state.audience = "all";
  if (!INNOVATION_GRANTS_AREA_FILTERS.some(({ id: value }) => value === state.area)) state.area = "all";
  if (!DEADLINES.some(([value]) => value === state.deadline)) state.deadline = "any";
  if (!FRESHNESS.some(([value]) => value === state.freshness)) state.freshness = "all";
  if (!COST_SHARES.some(([value]) => value === state.costShare)) state.costShare = "all";
  if (!SORTS.some(([value]) => value === state.sort)) state.sort = "recommended";
  if (!FUNDER_TYPES.some(([value]) => value === state.funder)) state.funder = "all";
  return state;
}

function lifecycleMatches(opportunity: InnovationGrantOpportunity, states: DirectoryLifecycleFilter[], asOf: Date): boolean {
  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  if (states.includes(lifecycle)) return true;
  return states.includes("active") && (lifecycle === "open-now" || lifecycle === "closing-soon");
}

function funderType(id: number): FunderType {
  for (const [type, ids] of Object.entries(FUNDER_ID_MAP) as Array<[Exclude<FunderType, "all" | "corporate" | "other">, readonly number[]]>) {
    if (ids.includes(id)) return type;
  }
  return "other";
}

function areaLabel(area: string): string {
  return INNOVATION_GRANTS_AREA_FILTERS.find((filter) => filter.id === area)?.label ?? area;
}

function dateLabel(value: string): string {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

function safeUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function deadlineLabel(opportunity: InnovationGrantOpportunity, asOf: Date): string {
  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  if (lifecycle === "closed") return "Closed / Past";
  if (lifecycle === "recurring-watchlist") return "Planning only";
  if (lifecycle === "opening-soon") return "Opening soon";
  const days = getInnovationGrantDaysUntilDeadline(opportunity, asOf);
  if (days === undefined) return "See official deadline";
  if (days === 0) return "Due today; check time";
  if (days === 1) return "1 day left";
  if (days > 1) return `${days} days left`;
  return "Deadline passed";
}

function DetailField({ label, value, wide = false }: { label: string; value: string | undefined; wide?: boolean }) {
  return <div className={wide ? "span-all" : undefined}><dt>{label}</dt><dd>{value?.trim() || "Not stated"}</dd></div>;
}

function OpportunityCard({ opportunity, asOf, openById }: { opportunity: InnovationGrantOpportunity; asOf: Date; openById: boolean }) {
  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  const badge = lifecycle === "closing-soon" ? "due" : lifecycle === "open-now" ? "open" : lifecycle === "closed" ? "closed" : "watch";
  const officialUrl = safeUrl(opportunity.officialUrl);
  const applicationUrl = safeUrl(opportunity.applicationUrl);
  const firstArea = opportunity.innovationAreas[0];

  return (
    <article className="gcard" id={`grant-${opportunity.id}`} tabIndex={-1} style={{ "--c": AREA_COLORS[firstArea] } as React.CSSProperties}>
      <div className="gright">
        <span className={`chip ${badge}`}>{({ "open-now": "Open Now", "closing-soon": "Closing Soon", "opening-soon": "Opening Soon", "recurring-watchlist": "Planning Watchlist", closed: "Closed / Past" } as Record<InnovationGrantLifecycle, string>)[lifecycle]}</span>
        {isInnovationGrantNewThisWeek(opportunity, asOf) && <span className="chip new">New this week</span>}
      </div>
      <div className="gtop"><span className="gtag">{areaLabel(firstArea)}</span><span className="gfunder">{opportunity.source}</span></div>
      <h3>{opportunity.title}</h3>
      <p className="desc">{opportunity.bestFit}</p>
      <div className="gmeta">
        <span><small>Amount / value</small>{opportunity.awardAmount}</span>
        <span><small>Deadline</small><strong>{deadlineLabel(opportunity, asOf)}</strong><br />{opportunity.deadline}</span>
        <span><small>Who can apply</small>{opportunity.eligibilityBadge || opportunity.geography}<small className="verified-label">Last verified</small>{opportunity.lastVerified}</span>
      </div>
      <details open={openById}>
        <summary className="detail-summary">View full details</summary>
        <div className="grant-details">
          <dl className="details-grid">
            <DetailField label="Who can apply" value={opportunity.eligibility} wide />
            <DetailField label="What it funds" value={opportunity.whatItFunds} wide />
            <DetailField label="Geography" value={opportunity.geography} />
            <DetailField label="Cost share / matching" value={opportunity.costShareRequirement} />
            <DetailField label="Final application deadline" value={opportunity.deadline} />
            <DetailField label="Deadline time zone" value={opportunity.deadlineTimeZone} />
            <DetailField label="Application access" value={opportunity.applicationAccess} wide />
            <DetailField label="Innovation areas" value={opportunity.innovationAreas.map(areaLabel).join(" · ")} wide />
            <DetailField label="Announced / cycle" value={opportunity.announcedDate} />
            <DetailField label="Added to portal" value={dateLabel(opportunity.portalAddedDate)} />
            <DetailField label="Inventory origin" value={getInnovationGrantInventoryLabel(opportunity)} />
            <DetailField label="Recurrence evidence" value={opportunity.recurrenceEvidence} wide />
            <DetailField label="Other qualifications" value={opportunity.qualifiers?.join("; ")} wide />
          </dl>
          {opportunity.sourceNotes && <p className="source-note"><strong>Source notes</strong><br />{opportunity.sourceNotes}</p>}
          <div className="source-actions">
            {officialUrl && <a href={officialUrl} target="_blank" rel="noopener noreferrer">Official source ↗</a>}
            {applicationUrl && <a href={applicationUrl} target="_blank" rel="noopener noreferrer">{lifecycle === "recurring-watchlist" ? "Application information" : "Application route"} ↗</a>}
          </div>
        </div>
      </details>
    </article>
  );
}

export default function InnovationGrantsDirectory({ opportunities, asOfDate }: { opportunities: InnovationGrantOpportunity[]; asOfDate: string }) {
  const searchParams = useSearchParams();
  const [state, setState] = useState<DirectoryState>(() => parseQuery(searchParams));
  const asOf = useMemo(() => new Date(`${asOfDate}T00:00:00.000Z`), [asOfDate]);
  const geographyOptions = useMemo(() => getInnovationGrantGeographyOptions(opportunities), [opportunities]);

  const found = useMemo(() => {
    const filters = {
      keyword: state.q,
      audience: state.audience,
      area: state.area,
      status: "all" as const,
      geography: state.geography,
      deadline: state.deadline,
      costShare: state.costShare,
      freshness: state.freshness,
    };
    return sortInnovationGrantOpportunities(
      filterInnovationGrantOpportunities(opportunities, filters, asOf)
        .filter((opportunity) => lifecycleMatches(opportunity, state.states, asOf))
        .filter((opportunity) => state.funder === "all" || funderType(opportunity.id) === state.funder)
        .filter((opportunity) => !state.noMatch || classifyInnovationGrantCostShare(opportunity) !== "required")
        .filter((opportunity) => state.id === null || opportunity.id === state.id),
      state.sort,
      asOf,
    );
  }, [asOf, opportunities, state]);

  const pageCount = Math.max(1, Math.ceil(found.length / state.perPage));
  const page = Math.min(Math.max(1, state.page), pageCount);
  const pageItems = found.slice((page - 1) * state.perPage, page * state.perPage);
  const asOfLabel = dateLabel(asOfDate);

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.audience !== "all") params.set("audience", state.audience);
    if (state.area !== "all") params.set("area", state.area);
    if (state.funder !== "all") params.set("funder", state.funder);
    if (state.deadline !== "any") params.set("deadline", state.deadline);
    if (state.geography !== "all") params.set("geography", state.geography);
    if (state.freshness !== "all") params.set("freshness", state.freshness);
    if (state.costShare !== "all") params.set("costShare", state.costShare);
    if (state.sort !== "recommended") params.set("sort", state.sort);
    if (state.states.join(",") !== DEFAULT_STATE.states.join(",")) params.set("states", state.states.join(","));
    if (state.noMatch) params.set("noMatch", "1");
    if (page > 1) params.set("page", String(page));
    if (state.perPage !== 10) params.set("perPage", String(state.perPage));
    if (state.id !== null) params.set("id", String(state.id));
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}${state.id !== null ? `#grant-${state.id}` : ""}`);
  }, [page, state]);

  useEffect(() => {
    if (!state.id) return;
    requestAnimationFrame(() => {
      const card = document.getElementById(`grant-${state.id}`);
      if (!card) return;
      card.scrollIntoView({ block: "start" });
      card.focus({ preventScroll: true });
    });
  }, [state.id, pageItems]);

  const reset = () => setState({ ...DEFAULT_STATE, states: [...DEFAULT_STATE.states] });
  const toggleState = (value: DirectoryLifecycleFilter) => setState((current) => ({ ...current, states: current.states.includes(value) ? current.states.filter((candidate) => candidate !== value) : [...current.states, value], page: 1 }));
  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState((current) => ({ ...current, page: 1, id: null }));
  };

  const copySearch = async () => {
    const url = new URL(window.location.href);
    try {
      await navigator.clipboard.writeText(url.href);
      setShareStatus("Copied search link.");
      const fallback = document.getElementById("shareFallback") as HTMLInputElement | null;
      if (fallback) fallback.hidden = true;
    } catch {
      const fallback = document.getElementById("shareFallback") as HTMLInputElement | null;
      if (!fallback) return;
      fallback.hidden = false;
      fallback.value = url.href;
      fallback.select();
      setShareStatus("Copy the selected search link.");
    }
  };

  // Kept local so the status announcement does not add another global analytics path.
  const [shareStatus, setShareStatus] = useState("");

  return (
    <div className="wrap">
      <div className="pagehead">
        <div><div className="page-kicker">Grant Portal</div><h1>Find <b>grant opportunities</b></h1></div>
        <button className="share-search" type="button" id="copySearch" onClick={copySearch}>Copy search link</button>
      </div>
      <div className="status-line" id="copyStatus" role="status">{shareStatus}</div>
      <input className="share-fallback" id="shareFallback" aria-label="Search link to copy" readOnly hidden />
      <p className="page-intro">Compare likely fit, deadlines, amounts, and official sources. Use the filters to build a practical shortlist, then confirm eligibility with the funder.</p>
      <p className="checkpoint" id="checkpoint">Latest inventory check {INNOVATION_GRANTS_VERIFIED_ON} · Full discovery search {INNOVATION_GRANTS_FULL_SEARCH_DATE}. Status calculated for {asOfLabel} (Pacific). Individual records retain their own dates.</p>

      <form className="refine" id="refineForm" onSubmit={applyFilters}>
        <h2 className="legend">Refine results</h2>
        <div className="refine-grid">
          <div>
            <label className="flabel" htmlFor="q">Keyword search</label>
            <p className="fhint">What are you looking for?</p>
            <input className="kw" id="q" name="q" type="search" placeholder="Search titles, funders, and descriptions" value={state.q} onChange={(event) => setState((current) => ({ ...current, q: event.target.value, page: 1 }))} />
            <div className="showrow"><h3>Show:</h3><div className="checks">
              <label className="opt"><input type="checkbox" name="lifecycle" value="active" checked={state.states.includes("active")} onChange={() => toggleState("active")} />Active</label>
              <label className="opt"><input type="checkbox" name="lifecycle" value="opening-soon" checked={state.states.includes("opening-soon")} onChange={() => toggleState("opening-soon")} />Opening soon</label>
              <label className="opt"><input type="checkbox" name="lifecycle" value="recurring-watchlist" checked={state.states.includes("recurring-watchlist")} onChange={() => toggleState("recurring-watchlist")} />Planning watchlist</label>
              <label className="opt"><input type="checkbox" name="lifecycle" value="closed" checked={state.states.includes("closed")} onChange={() => toggleState("closed")} />Closed / Past</label>
            </div><p className="filter-notice">Active includes Open Now and Closing Soon. Watchlist items are not open applications.</p></div>
            <div className="showrow"><h3>Do not show:</h3><div className="checks"><label className="opt"><input type="checkbox" id="noMatch" name="noMatch" checked={state.noMatch} onChange={(event) => setState((current) => ({ ...current, noMatch: event.target.checked, page: 1 }))} />Opportunities requiring matched funding</label></div><p className="filter-notice">Unknown matching requirements remain visible and are labeled.</p></div>
            <details className="advanced" open={state.geography !== "all" || state.freshness !== "all" || state.costShare !== "all"}><summary>More filters</summary><div className="selgrid">
              <div className="selblock"><label htmlFor="geography">Location or institution</label><select className="bigsel b1" id="geography" name="geography" value={state.geography} onChange={(event) => setState((current) => ({ ...current, geography: event.target.value, page: 1 }))}><option value="all">Any location or institution</option>{geographyOptions.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
              <div className="selblock"><label htmlFor="freshness">Added to portal</label><select className="bigsel b2" id="freshness" name="freshness" value={state.freshness} onChange={(event) => setState((current) => ({ ...current, freshness: event.target.value as InnovationGrantFreshnessFilter, page: 1 }))}>{FRESHNESS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              <div className="selblock"><label htmlFor="costShare">Matching requirement</label><select className="bigsel b3" id="costShare" name="costShare" value={state.costShare} onChange={(event) => setState((current) => ({ ...current, costShare: event.target.value as InnovationGrantCostShareFilter, page: 1 }))}>{COST_SHARES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            </div></details>
          </div>
          <div className="filterby"><h3>Filter grant opportunities by</h3><div className="selgrid">
            <div className="selblock"><label htmlFor="audience">I work with</label><select className="bigsel b1" id="audience" name="audience" value={state.audience} onChange={(event) => setState((current) => ({ ...current, audience: event.target.value as DirectoryState["audience"], page: 1 }))}>{INNOVATION_GRANTS_AUDIENCE_FILTERS.map(({ id, label }) => <option key={id} value={id}>{id === "all" ? "All institutions and roles" : label}</option>)}</select></div>
            <div className="selblock"><label htmlFor="area">Innovation area</label><select className="bigsel b2" id="area" name="area" value={state.area} onChange={(event) => setState((current) => ({ ...current, area: event.target.value as DirectoryState["area"], page: 1 }))}>{INNOVATION_GRANTS_AREA_FILTERS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}</select></div>
            <div className="selblock"><label htmlFor="funder">Funder type</label><select className="bigsel b3" id="funder" name="funder" value={state.funder} onChange={(event) => setState((current) => ({ ...current, funder: event.target.value as FunderType, page: 1 }))}>{FUNDER_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="selblock"><label htmlFor="deadline">Deadline</label><select className="bigsel b4" id="deadline" name="deadline" value={state.deadline} onChange={(event) => setState((current) => ({ ...current, deadline: event.target.value as InnovationGrantDeadlineFilter, page: 1 }))}>{DEADLINES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          </div><div className="actions"><button className="clear" type="button" id="clearFilters" onClick={reset}>Clear search terms</button><button className="apply" type="submit">Apply filters</button></div></div>
        </div>
      </form>

      <section aria-labelledby="resultsHeading"><div className="rhead"><h2 id="resultsHeading"><b role="status" aria-live="polite">{found.length} {found.length === 1 ? "opportunity" : "opportunities"} match{found.length === 1 ? "es" : ""} your search</b></h2><p id="querySummary">{[state.audience !== "all" ? INNOVATION_GRANTS_AUDIENCE_FILTERS.find(({ id }) => id === state.audience)?.label : null, state.area !== "all" ? areaLabel(state.area) : null, state.deadline !== "any" ? optionLabel(DEADLINES, state.deadline) : null, state.id !== null ? "One linked opportunity" : null].filter(Boolean).join(" · ")}</p><label className="sort" htmlFor="sort">Sort by <select className="sortsel" id="sort" value={state.sort} onChange={(event) => setState((current) => ({ ...current, sort: event.target.value as InnovationGrantSort, page: 1 }))}>{SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <div id="grantResults">{found.length > 0 ? pageItems.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} asOf={asOf} openById={state.id === opportunity.id} />) : <div className="empty"><h3>No grant opportunities match every filter.</h3><p>Try a broader audience, another category, or more time before the deadline. Unknown eligibility still needs an official-source check.</p><button type="button" id="widenDeadline" onClick={() => setState((current) => ({ ...current, deadline: "any", page: 1 }))}>Widen to any deadline</button><button type="button" id="resetEmpty" onClick={reset}>Clear all filters</button></div>}</div>
        <div className="pager" aria-label="Result pages"><span className="range" id="resultRange">{found.length > 0 ? `Displaying ${(page - 1) * state.perPage + 1}–${Math.min(page * state.perPage, found.length)} of ${found.length}` : "No matching opportunities"}</span><label htmlFor="perPage">Per page</label><select className="persel" id="perPage" value={state.perPage} onChange={(event) => setState((current) => ({ ...current, perPage: Number(event.target.value) as DirectoryState["perPage"], page: 1 }))}><option value="10">10</option><option value="20">20</option><option value="50">50</option></select><button className="pgbtn" id="prevPage" type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setState((current) => ({ ...current, page: page - 1 }))}>←</button><span id="pageStatus">Page {page} of {pageCount}</span><button className="pgbtn primary" id="nextPage" type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => setState((current) => ({ ...current, page: page + 1 }))}>→</button></div>
      </section>
      <div className="trust" id="how-we-verify"><div className="trust-in"><details><summary>How we verify</summary><p>Every public record starts with an official source and shows a last-verified date. Individual records retain their actual verification dates. Always read the official source before applying.</p><p>The funding total includes reported current program-level cash amounts, not money guaranteed to remain available. Per-award-only caps, in-kind credits, and mixed-purpose budgets are excluded. Awards are competitive and not guaranteed.</p><p>Unresolved source conflicts and unavailable application paths are held for review and do not appear in this launch. Planning-watchlist and closed opportunities are separated from active opportunities. Evidence-only research checks are retained outside the public directory.</p><p id="trustDates">Latest inventory check {INNOVATION_GRANTS_VERIFIED_ON} · Full discovery search {INNOVATION_GRANTS_FULL_SEARCH_DATE} · Status calculated for {asOfLabel} (Pacific).</p></details></div></div>
    </div>
  );
}
