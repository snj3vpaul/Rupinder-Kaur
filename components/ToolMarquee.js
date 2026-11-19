"use client";

import { useEffect, useRef } from "react";

/**
 * Two typographic marquee rows of the toolbelt. Page scroll velocity speeds them
 * up (and flips them when scrolling up), rows are draggable, hover slows them.
 * Reduced motion: rows become plain horizontally scrollable lists.
 */
const STYLES = ["t-wide", "t-cond", "t-mono", "t-light", "t-heavy"];

function Row({ items, offset }) {
  const doubled = [...items, ...items];
  return <div className="marquee-row" aria-hidden="true">
    <div className="marquee-track">
      {doubled.map((tool, i) => <span className={`tool ${STYLES[(i + offset + 5) % STYLES.length]}`} key={i}>
        <span className="tool-name">{tool.name}</span>
        <span className="tool-kind">{tool.kind}</span>
      </span>)}
    </div>
  </div>;
}

export default function ToolMarquee({ tools }) {
  const root = useRef(null);
  const half = Math.ceil(tools.length / 2);
  const rows = [tools.slice(0, half), tools.slice(half)];

  useEffect(() => {
    const el = root.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-static"); return; }
    const rowEls = Array.from(el.querySelectorAll(".marquee-row"));
    const state = rowEls.map((row, i) => ({
      row, track: row.querySelector(".marquee-track"), x: 0, dir: i === 0 ? -1 : 1,
      speed: 1, target: 1, drag: null, width: 0,
    }));
    const measure = () => state.forEach(s => { s.width = s.track.scrollWidth / 2; });
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);

    let lastY = window.scrollY, velocity = 0, flip = 1;
    const onScroll = () => {
      const dy = window.scrollY - lastY; lastY = window.scrollY;
      velocity = Math.min(40, Math.abs(dy));
      if (dy !== 0) flip = dy > 0 ? 1 : -1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handlers = [];
    state.forEach(s => {
      const enter = () => (s.target = 0.15), leave = () => (s.target = 1);
      const down = e => { s.drag = { x: e.clientX, start: s.x }; s.row.setPointerCapture(e.pointerId); s.row.classList.add("is-dragging"); };
      const move = e => { if (s.drag) s.x = s.drag.start + (e.clientX - s.drag.x); };
      const up = () => { s.drag = null; s.row.classList.remove("is-dragging"); };
      s.row.addEventListener("pointerenter", enter); s.row.addEventListener("pointerleave", leave);
      s.row.addEventListener("pointerdown", down); s.row.addEventListener("pointermove", move);
      s.row.addEventListener("pointerup", up); s.row.addEventListener("pointercancel", up);
      handlers.push(() => {
        s.row.removeEventListener("pointerenter", enter); s.row.removeEventListener("pointerleave", leave);
        s.row.removeEventListener("pointerdown", down); s.row.removeEventListener("pointermove", move);
        s.row.removeEventListener("pointerup", up); s.row.removeEventListener("pointercancel", up);
      });
    });

    let raf = 0, visible = false;
    const tick = () => {
      velocity *= 0.92;
      state.forEach(s => {
        s.speed += (s.target - s.speed) * 0.08;
        if (!s.drag) s.x += s.dir * flip * (0.55 + velocity * 0.35) * s.speed;
        if (s.width) { s.x = ((s.x % s.width) - s.width) % s.width; }
        s.track.style.transform = `translate3d(${s.x}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf); raf = 0;
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener("scroll", onScroll); handlers.forEach(h => h()); };
  }, []);

  return <div className="marquee" ref={root}>
    <Row items={rows[0]} offset={0} />
    <Row items={rows[1]} offset={2} />
    <ul className="visually-hidden" aria-label="Toolkit">{tools.map(t => <li key={t.name}>{t.name} ({t.kind})</li>)}</ul>
  </div>;
}
