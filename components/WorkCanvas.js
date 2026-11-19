"use client";

import { useEffect, useRef } from "react";

/**
 * Line-art 3D graphics for the Selected Work cards, drawn on a 2D canvas with a
 * tiny perspective projection (no extra WebGL contexts). Each variant reacts to
 * the pointer. Runs only while visible; reduced motion draws a single frame.
 */

const C = {
  line: a => `rgba(236,236,231,${a})`,
  select: "#0d99ff", pass: "#0acf83", issue: "#f24e1e",
};

function camera(w, h, rx, ry, dist = 4.2, scale = 0.29) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  return (x, y, z) => {
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    const y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
    const f = dist / (dist - z2);
    return [w / 2 + x1 * f * Math.min(w, h * 1.5) * scale, h / 2 - y1 * f * Math.min(w, h * 1.5) * scale, f];
  };
}

function label(ctx, x, y, text, color = C.line(0.9), boxed = true) {
  ctx.font = "500 10px 'JetBrains Mono Variable', ui-monospace, monospace";
  const w = ctx.measureText(text).width + 10;
  x = Math.max(4, Math.min(x, ctx.canvas.clientWidth - w - 6));
  y = Math.max(14, Math.min(y, ctx.canvas.clientHeight - 14));
  if (boxed) {
    ctx.fillStyle = "rgba(14,14,14,.92)"; ctx.fillRect(x, y - 9, w, 17);
    ctx.strokeStyle = C.line(0.16); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y - 8.5, w - 1, 16);
  }
  ctx.fillStyle = color; ctx.fillText(text, x + 5, y + 3.5);
}

function dot(ctx, x, y, r, color, glow = 10) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = glow;
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}

function ring(ctx, P, y, r, alpha, dash = []) {
  ctx.setLineDash(dash); ctx.strokeStyle = C.line(alpha); ctx.beginPath();
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2; const [x, yy] = P(Math.cos(a) * r, y, Math.sin(a) * r);
    i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
  }
  ctx.stroke(); ctx.setLineDash([]);
}

const variants = {
  // 01 — legacy ring vs modern ring, record pairs; a mismatch appears, then gets fixed.
  parity(ctx, w, h, t, m) {
    const P = camera(w, h, 0.42 + m.y * 0.2, t * 0.12 + m.x * 0.8);
    ctx.lineWidth = 1.2;
    ring(ctx, P, 0.45, 1.15, 0.55); ring(ctx, P, 0.45, 0.22, 0.4);
    ring(ctx, P, -0.65, 0.95, 0.28, [3, 5]);
    ctx.setLineDash([4, 6]); ctx.strokeStyle = C.line(0.22); ctx.beginPath();
    let [ax, ay] = P(0, 1.3, 0), [bx, by] = P(0, -1.2, 0); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    [ax, ay] = P(-1.9, 0.45, -0.9); [bx, by] = P(1.9, 0.45, 0.9); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    const cycle = (t % 6) / 6;
    [0.6, 2.4, 4.3].forEach((a, i) => {
      const [x1, y1] = P(Math.cos(a) * 1.15, 0.45, Math.sin(a) * 1.15);
      const [x2, y2] = P(Math.cos(a) * 0.95, -0.65, Math.sin(a) * 0.95);
      const broken = i === 1 && cycle > 0.25 && cycle < 0.62;
      const color = broken ? C.issue : C.pass;
      ctx.strokeStyle = broken ? "rgba(242,78,30,.7)" : "rgba(10,207,131,.45)"; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
      dot(ctx, x1, y1, 3.2, C.select); dot(ctx, x2, y2, 3.2, color);
      if (i === 1) label(ctx, x2 + 10, y2, broken ? "Δ 3 ROWS · DB2 ≠ SQL" : "✓ PARITY 1.00", color);
      if (i === 0) label(ctx, x1 + 10, y1 - 4, "LEGACY · COBOL/DB2");
      if (i === 2) label(ctx, x2 + 10, y2 + 10, "MODERN · C#/SQL");
    });
  },

  // 02 — hemisphere of suites; a run travels the arcs to "safe to ship".
  sphere(ctx, w, h, t, m) {
    const P = camera(w, h, 0.32 + m.y * 0.25, -0.5 + m.x * 1.0 + t * 0.06, 4.4, 0.3);
    ctx.lineWidth = 1.2;
    ring(ctx, P, -0.35, 1.25, 0.55);
    ring(ctx, P, 0.35, 1.04, 0.18, [2, 5]);
    const arc = (phi, alpha) => {
      ctx.strokeStyle = C.line(alpha); ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const th = (i / 48) * Math.PI; const r = 1.25;
        const [x, y] = P(Math.cos(th) * r * Math.cos(phi), -0.35 + Math.sin(th) * r, Math.cos(th) * r * Math.sin(phi));
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    };
    [0, 1.05, 2.1].forEach((p, i) => arc(p, i === 1 ? 0.6 : 0.35));
    ctx.setLineDash([4, 6]); ctx.strokeStyle = C.line(0.18); ctx.beginPath();
    let [ax, ay] = P(-2, -0.35, 0), [bx, by] = P(2, -0.35, 0); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    const node = (th, phi) => P(Math.cos(th) * 1.25 * Math.cos(phi), -0.35 + Math.sin(th) * 1.25, Math.cos(th) * 1.25 * Math.sin(phi));
    const stops = [[0.6, 1.05], [Math.PI / 2, 1.05], [2.4, 1.05], [0.0, 0], [Math.PI, 2.1]];
    const run = (t % 5) / 5;
    stops.forEach(([th, ph], i) => {
      const [x, y] = node(th, ph); const passed = run > i / stops.length;
      dot(ctx, x, y, i === 1 ? 5 : 3.5, passed ? (i === 1 ? "#fff" : C.pass) : C.line(0.4), passed ? 14 : 0);
    });
    const [tx, ty] = node(0.6 + run * 1.8, 1.05); dot(ctx, tx, ty, 2.6, C.select, 16);
    const [lx, ly] = node(0.6, 1.05);
    label(ctx, lx + 12, ly, run > 0.8 ? "✓ SAFE TO SHIP" : `RUNNING ${Math.min(100, Math.round((run / 0.8) * 100))}/100 SPECS`, run > 0.8 ? C.pass : C.line(0.85));
  },

  // 03 — pointer x is load; ticks rise, p95 crosses the threshold if you push too far.
  gauge(ctx, w, h, t, m) {
    const load = Math.min(1, Math.max(0.05, m.active ? m.px : 0.35 + Math.sin(t * 0.5) * 0.2));
    const base = h * 0.6, n = 26, left = w * 0.08, right = w * 0.92;
    for (let gx = w * 0.55; gx < w; gx += 7) for (let gy = h * 0.7; gy < h; gy += 7) {
      const a = 0.05 * (1 - (gy - h * 0.7) / (h * 0.3)); ctx.fillStyle = C.line(a); ctx.fillRect(gx, gy, 1, 1);
    }
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), x = left + u * (right - left);
      const wave = Math.sin(u * 9 + t * 1.6) * 0.5 + 0.5;
      const near = Math.max(0, 1 - Math.abs(u - load) * 3.5);
      const hgt = 8 + wave * 10 + near * 26 * (0.6 + load);
      ctx.strokeStyle = C.line(0.25 + near * 0.6); ctx.lineWidth = i % 4 === 0 ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(x, base - 6); ctx.lineTo(x, base - 6 - hgt); ctx.stroke();
    }
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = C.line(0.5 - k * 0.15); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(w / 2, base + 6 + k * 9, w * (0.5 - k * 0.02), 4 + k * 3, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke();
    }
    const mx = left + load * (right - left);
    const p95 = Math.round(120 + Math.pow(load, 3) * 620);
    const over = p95 > 500;
    ctx.strokeStyle = over ? C.issue : C.line(0.9); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(left, base); ctx.lineTo(mx, base); ctx.stroke();
    dot(ctx, mx, base, 4, over ? C.issue : "#fff", 12);
    label(ctx, Math.min(mx + 10, w - 150), base, `${Math.round(load * 50)} VU · P95 ${p95} MS`, over ? C.issue : C.line(0.9));
    label(ctx, left, h * 0.16, over ? "✕ THRESHOLD P95 < 500 MS" : "✓ THRESHOLD P95 < 500 MS", over ? C.issue : C.pass, false);
  },

  // Wide card — release over release: expected vs actual; caught, fixed, re-tested.
  curve(ctx, w, h, t, m) {
    ctx.strokeStyle = C.line(0.06); ctx.lineWidth = 1;
    for (let x = 0; x < w; x += w / 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += h / 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    const shift = (t * 0.05) % 1;
    const f = (u, actual) => {
      const base = Math.sin((u + shift) * 7) * 0.12 + Math.sin((u + shift) * 2.3) * 0.18;
      const dipAt = 0.38, dip = actual ? -Math.exp(-Math.pow((u - dipAt) / 0.04, 2)) * 0.32 : 0;
      return h * (0.55 - base - dip);
    };
    const path = (actual, alpha, dash) => {
      ctx.setLineDash(dash); ctx.strokeStyle = C.line(alpha); ctx.lineWidth = actual ? 2 : 1.3; ctx.beginPath();
      for (let i = 0; i <= 160; i++) { const u = i / 160; const y = f(u, actual); i ? ctx.lineTo(u * w, y) : ctx.moveTo(0, y); }
      ctx.stroke(); ctx.setLineDash([]);
    };
    path(false, 0.35, [5, 6]); path(true, 0.95, []);
    const marks = [[0.18, "BASELINE", "#fff"], [0.38, "REGRESSION CAUGHT", C.issue], [0.56, "FIXED", C.select], [0.76, "RE-TESTED ✓", C.pass]];
    marks.forEach(([u, text, color]) => { const y = f(u, true); dot(ctx, u * w, y, 3.5, color, 14); label(ctx, u * w + 8, y - 14, text, color === "#fff" ? C.line(0.85) : color, false); });
    if (m.active) {
      const gx = m.px * w, g = ctx.createRadialGradient(gx, f(m.px, true), 0, gx, f(m.px, true), 120);
      g.addColorStop(0, "rgba(255,255,255,.18)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(gx - 120, 0, 240, h);
      ctx.strokeStyle = C.line(0.35); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, Math.min(gx + 8, w - 120), 18, `RELEASE ${(2 + m.px * 3).toFixed(1)}`);
    }
  },
};

export default function WorkCanvas({ variant }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext("2d");
    const draw = variants[variant];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = { x: 0, y: 0, px: 0.5, active: false, tx: 0, ty: 0 };
    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) render(8000);
    };
    const host = canvas.closest(".work-card") || canvas;
    const move = e => {
      const r = canvas.getBoundingClientRect();
      m.px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      m.tx = m.px - 0.5; m.ty = (e.clientY - r.top) / r.height - 0.5; m.active = true;
      if (reduce) render(8000);
    };
    const leave = () => { m.active = false; m.tx = 0; m.ty = 0; if (reduce) render(8000); };
    const render = ms => {
      m.x += (m.tx - m.x) * (reduce ? 1 : 0.06); m.y += (m.ty - m.y) * (reduce ? 1 : 0.06);
      ctx.clearRect(0, 0, w, h); draw(ctx, w, h, ms / 1000, m);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    host.addEventListener("pointermove", move); host.addEventListener("pointerleave", leave);
    let raf = 0;
    const loop = ms => { render(ms); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf); raf = 0;
      if (e.isIntersecting && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave); };
  }, [variant]);
  return <canvas ref={ref} className="work-canvas" aria-hidden="true" />;
}
