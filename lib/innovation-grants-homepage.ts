import {
  getInnovationGrantFundingSnapshot,
  getInnovationGrantLifecycle,
  getInnovationGrantPacificAsOfDate,
  getInnovationGrantPacificCalendarDate,
  type InnovationGrantOpportunity,
} from "./innovation-grants-shared";

/** Accept only the cleared public projection supplied by the server component. */
export function getHomepageGrantSummary(opportunities: InnovationGrantOpportunity[], now = new Date()) {
  const asOf = getInnovationGrantPacificAsOfDate(now);
  const asOfDate = getInnovationGrantPacificCalendarDate(now);
  const dates = opportunities.flatMap(({ portalAddedDate: date }) => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date > asOfDate) return [];
    const parsed = new Date(`${date}T00:00:00.000Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? [date] : [];
  });
  const latestDate = dates.sort().at(-1) ?? null;
  const cohort = latestDate ? opportunities.filter(record => record.portalAddedDate === latestDate) : [];
  const breakdown = { open: 0, watchlist: 0, openingSoon: 0, closed: 0 };
  for (const record of cohort) {
    const status = getInnovationGrantLifecycle(record, asOf);
    if (status === "open-now" || status === "closing-soon") breakdown.open++;
    else if (status === "recurring-watchlist") breakdown.watchlist++;
    else if (status === "opening-soon") breakdown.openingSoon++;
    else breakdown.closed++;
  }
  return {
    asOfDate,
    totalCount: opportunities.length,
    funding: getInnovationGrantFundingSnapshot(opportunities, asOf),
    latestDate,
    latestCount: cohort.length,
    breakdown,
  };
}
