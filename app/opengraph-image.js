import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const alt = "Rupinder Kaur, Software Engineer in Test: spot what everyone else overlooks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Rendered to PNG at build time. Social platforms do not render SVG og:images. */
export default function OpengraphImage() {
  const line = "1px solid rgba(11,11,11,.16)";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#ecece7", padding: 28 }}>
      <div style={{ flex: 1, display: "flex", border: line }}>
        <div style={{ width: 720, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "36px 40px", borderRight: line }}>
          <div style={{ display: "flex" }}>
            <span style={{ background: "#0b0b0b", color: "#ecece7", fontSize: 18, padding: "6px 14px", borderRadius: 999 }}>QA DISCOVERY · ©2026</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 0.95, color: "#0b0b0b", letterSpacing: -2 }}>
            <span>SPOT WHAT</span>
            <span>EVERYONE ELSE</span>
            <span style={{ display: "flex", borderBottom: "6px solid #0acf83", alignSelf: "flex-start", paddingBottom: 4 }}>OVERLOOKS.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 24, color: "#2b2b28" }}>
            <span style={{ fontSize: 30, color: "#0b0b0b" }}>{site.name}</span>
            <span>{`${site.role} · ${site.location}`}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", background: "#0b0b0b", padding: 40, position: "relative" }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ position: "absolute", left: 60 + i * 26, top: 120 + i * 40, width: 260, height: 180, border: "1px solid rgba(236,236,231,.35)", transform: "skewY(-12deg)" }} />)}
          <div style={{ position: "absolute", left: 150, top: 220, width: 16, height: 16, borderRadius: 99, background: "#f24e1e" }} />
          <div style={{ position: "absolute", left: 176, top: 206, display: "flex", background: "#fff", color: "#0b0b0b", fontSize: 16, padding: "6px 10px", borderRadius: "10px 10px 10px 0" }}>#014 1px drift on retry state</div>
          <div style={{ position: "absolute", left: 210, top: 300, display: "flex", background: "#0d99ff", color: "#fff", fontSize: 15, padding: "4px 8px", borderRadius: 5 }}>Rupinder · QA</div>
          <div style={{ position: "absolute", left: 40, bottom: 34, display: "flex", color: "#a3a39c", fontSize: 15, letterSpacing: 3 }}>SCANNING 4 LAYERS · 3 ISSUES SURFACED</div>
        </div>
      </div>
    </div>,
    size
  );
}
