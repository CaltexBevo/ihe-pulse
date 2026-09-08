import { Suspense } from "react";
import PortalDayRefresh from "../PortalDayRefresh";
import { getPublicInnovationGrants } from "@/lib/data/innovation-grants-public";
import { pageMetadata } from "@/lib/og";
import InnovationGrantsDirectory from "./InnovationGrantsDirectory";
import styles from "../portal.module.css";
import { getInnovationGrantPacificCalendarDate } from "@/lib/innovation-grants-shared";

export const metadata = pageMetadata({
  title: "Find grant opportunities | Innovating Higher Ed",
  description:
    "Compare higher-education innovation grant opportunities by fit, deadline, amount, and official source.",
  path: "/innovation-grants/directory",
  imagePath: "/innovation-grants/opengraph-image",
  imageAlt: "Find grant opportunities in the Innovating Higher Ed Grant Portal",
  imageWidth: 1200,
  imageHeight: 630,
  twitterCard: "summary_large_image",
});

export const dynamic = "force-dynamic";

export default function InnovationGrantsDirectoryPage() {
  const opportunities = getPublicInnovationGrants();
  const asOfDate = getInnovationGrantPacificCalendarDate(new Date());

  return (
    <div className={`${styles.portal} ${styles.results}`}>
      <div className="field" aria-hidden="true">
        <div className="shard s1" />
        <div className="shard s2" />
        <div className="shard s3" />
        <div className="shard s4" />
        <div className="sweep" />
      </div>
      <PortalDayRefresh asOfDate={asOfDate} />
      <Suspense fallback={<DirectoryFallback />}>
        <InnovationGrantsDirectory opportunities={opportunities} asOfDate={asOfDate} />
      </Suspense>
    </div>
  );
}

function DirectoryFallback() {
  return (
    <div className="wrap" aria-busy="true">
      <div className="pagehead"><div><div className="page-kicker">Grant Portal</div><h1>Find <b>grant opportunities</b></h1></div></div>
      <p className="page-intro">Loading the current directory…</p>
    </div>
  );
}
