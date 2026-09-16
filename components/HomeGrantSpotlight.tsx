import Link from "next/link";
import PortalDayRefresh from "@/app/innovation-grants/PortalDayRefresh";
import PortalFundingTally from "@/app/innovation-grants/PortalFundingTally";
import { getPublicInnovationGrants } from "@/lib/data/innovation-grants-public";
import { getHomepageGrantSummary } from "@/lib/innovation-grants-homepage";
import styles from "./HomeGrantSpotlight.module.css";

export default function HomeGrantSpotlight() {
  const summary = getHomepageGrantSummary(getPublicInnovationGrants());
  const { funding, breakdown } = summary;
  const cohortLabel = summary.latestDate ? new Date(`${summary.latestDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  }) : null;
  const statusLabel = [
    breakdown.open && `${breakdown.open} open`,
    breakdown.watchlist && `${breakdown.watchlist} watchlist`,
    breakdown.openingSoon && `${breakdown.openingSoon} opening soon`,
    breakdown.closed && `${breakdown.closed} closed`,
  ].filter(Boolean).join(" + ");

  return (
    <section className={styles.wrapper} aria-labelledby="grant-spotlight-title">
      <PortalDayRefresh asOfDate={summary.asOfDate} />
      <div className={styles.card}>
        <div className={styles.funding}>
          <p className={styles.kicker}>GRANT PORTAL</p>
          <h2 id="grant-spotlight-title">Your innovation. <span className={styles.gradient}>Our grant portal.</span></h2>
          <div className={styles.amount}><PortalFundingTally amount={funding.publishedProgramPoolUsd} /></div>
          <p className={styles.amountLabel}>reported current program funding</p>
        </div>
        <div className={styles.details}>
          <div className={styles.stats}>
            <div>
              <strong>{summary.totalCount}</strong>
              <p>grants &amp; support programs</p>
              <p className={styles.open}>{funding.openOpportunityCount} currently open</p>
            </div>
            <div className={styles.cohort}>
              <strong>{summary.latestCount}</strong>
              <p>{cohortLabel ? <>added <time dateTime={summary.latestDate!}>{cohortLabel}</time></> : "No dated additions yet"}</p>
              {statusLabel && <p className={styles.breakdown}>{statusLabel}</p>}
            </div>
          </div>
          <Link href="/innovation-grants" className={styles.action}>Explore Grant Portal <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
