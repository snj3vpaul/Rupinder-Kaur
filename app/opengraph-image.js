import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const alt = "Rupinder Kaur — Software Engineer in Test, Ottawa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rendered to PNG at build time. Social platforms do not render SVG og:images. */
export default function OpengraphImage() {
  const checks = ["Understand the risk", "Build the signal", "Find the friction", "Support confident releases"];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f7f5ee", padding: "64px 72px", color: "#173c64" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#b7824d" }}>
        <span>QUALITY ENGINEERING / OTTAWA</span><span style={{ color: "#697784" }}>RK.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, color: "#102a48" }}>Good software</div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, color: "#102a48" }}>
          <span>isn&apos;t an</span><span style={{ color: "#b7824d", marginLeft: 22 }}>accident.</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{site.name}</div>
          <div style={{ fontSize: 24, color: "#425466", marginTop: 6 }}>{`${site.role} · Automation · Performance · CI/CD`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 18, color: "#425466", border: "1px solid #d9dedc", padding: "14px 18px", background: "#fffdf8" }}>
          {checks.map(c => <div key={c} style={{ display: "flex" }}><svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 10, marginTop: 3 }}><path d="M5 12l5 5 9-10" fill="none" stroke="#3f7d5c" strokeWidth="3" /></svg><span>{c}</span></div>)}
          <div style={{ display: "flex", marginTop: 6, color: "#3f7d5c", fontWeight: 700 }}>4 passed · 0 failed</div>
        </div>
      </div>
    </div>,
    size
  );
}
