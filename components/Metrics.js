"use client";

import { useEffect, useRef } from "react";

/**
 * Metrics as a test run: each number counts up while its "verifying" bar fills,
 * then locks with its source. Server HTML already contains the final values.
 */
export default function Metrics({ items }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cells = Array.from(el.querySelectorAll(".metric"));
    cells.forEach(c => c.classList.add("is-pending"));
    const run = () => {
      cells.forEach((cell, i) => {
        const num = cell.querySelector(".metric-value");
        const pct = cell.querySelector(".metric-pct");
        const target = Number(num.dataset.value), suffix = num.dataset.suffix || "";
        const delay = i * 220, dur = 1500;
        let start = 0;
        const step = t => {
          if (!start) start = t;
          const p = Math.min(1, Math.max(0, (t - start - delay) / dur));
          const e = 1 - Math.pow(1 - p, 3);
          num.textContent = Math.round(target * e) + (p === 1 ? suffix : "");
          pct.textContent = `${String(Math.round(p * 100)).padStart(3, " ")}%`;
          cell.style.setProperty("--p", p.toFixed(3));
          if (p < 1) requestAnimationFrame(step);
          else { cell.classList.remove("is-pending"); cell.classList.add("is-verified"); }
        };
        requestAnimationFrame(step);
      });
      el.querySelector(".metrics-summary")?.classList.add("is-running");
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div className="metrics" ref={root}>
    <div className="metrics-grid">
      {items.map((m, i) => <div className="metric" key={m.label}>
        <span className="metric-index">[{String(i + 1).padStart(2, "0")}]</span>
        <p className="metric-value" data-value={m.value} data-suffix={m.suffix}>{m.value}{m.suffix}</p>
        <p className="metric-label">{m.label}</p>
        <p className="metric-run" aria-hidden="true">
          <span className="metric-bar"><i /></span>
          <span className="metric-pct">100%</span>
        </p>
        <p className="metric-source"><span aria-hidden="true">✓</span> Verified · {m.source}</p>
      </div>)}
    </div>
    <p className="metrics-summary"><span>metrics.spec</span><span><b>{items.length}/{items.length} verified</b> · every number has a source · 0 estimates</span></p>
  </div>;
}
