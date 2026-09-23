import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPublicInnovationGrants } from "@/lib/data/innovation-grants-public";
import { getHomepageGrantSummary } from "@/lib/innovation-grants-homepage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Your innovation. Our grant portal. Reported current program funding from Innovating Higher Ed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const boldFont = await readFile(join(process.cwd(), "public/fonts/inter-bold.ttf"));
  // Same cleared records, Pacific date and funding exclusions as the live hero.
  const { funding, asOfDate } = getHomepageGrantSummary(getPublicInnovationGrants());
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(funding.publishedProgramPoolUsd);
  const gradient = { backgroundImage: "linear-gradient(100deg, #00d4ff, #a78bfa, #b040a8)", backgroundClip: "text" as const, color: "transparent", alignSelf: "flex-start" as const };

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", padding: 24, background: "#08080f", color: "#f0ede8", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "36px 52px", borderRadius: 32, border: "2px solid #383840", backgroundImage: "linear-gradient(125deg, #24343a 0%, #18181e 40%, #18181e 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["#00d4ff", "#a78bfa", "#b040a8", "#f59e0b"].map(color => <div key={color} style={{ background: color, width: 40, height: 6, borderRadius: 3 }} />)}
          </div>
          <div style={{ fontSize: 22, color: "#f0ede8" }}>Innovating Higher Ed</div>
        </div>
        <div style={{ display: "flex", marginTop: 22, color: "#00d4ff", fontSize: 19, fontWeight: 700, letterSpacing: 3 }}>GRANT PORTAL</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12, fontFamily: "Inter", fontSize: 76, lineHeight: 1.04, fontWeight: 700, letterSpacing: -3 }}>
          <div>Your innovation.</div>
          <div style={gradient}>Our grant portal.</div>
        </div>
        <div style={{ display: "flex", width: "100%", marginTop: 22, paddingTop: 18, borderTop: "1px solid #383840" }}>
          <div style={{ display: "flex", fontFamily: "Inter", fontSize: 68, lineHeight: 1.1, fontWeight: 700, letterSpacing: -2, ...gradient }}>{amount}</div>
        </div>
        <div style={{ display: "flex", fontSize: 23, color: "#a8a4b8", marginTop: 4 }}>reported current program funding</div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 22, color: "#f0ede8" }}>{funding.openOpportunityCount} currently open · {funding.closingSoonCount} closing soon</div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 17, color: "#a8a4b8" }}>As of {asOfDate} · Includes approximate program totals. Awards are competitive.</div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Inter", data: boldFont, weight: 700, style: "normal" }], headers: { "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}
