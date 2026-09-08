import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Grant Portal from Innovating Higher Ed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#08080f",
          color: "#f0ede8",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 84px",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ color: "#a8a4b8", display: "flex", fontSize: 28, fontWeight: 700 }}>
          INNOVATING HIGHER ED <span style={{ color: "#00d4ff", marginLeft: 18 }}>·</span> GRANT PORTAL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ color: "#a8a4b8", fontSize: 26 }}>Higher-education innovation funding</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.03 }}>
            Every kind of change, <span style={{ color: "#b040a8" }}>funded.</span>
          </div>
          <div style={{ color: "#a8a4b8", fontSize: 28 }}>Find opportunities by who can apply, what they fund, and when they close.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["#00d4ff", "#a78bfa", "#b040a8", "#f59e0b"].map((color) => <div key={color} style={{ background: color, borderRadius: 6, height: 10, width: 82 }} />)}
        </div>
      </div>
    ),
    { ...size },
  );
}
