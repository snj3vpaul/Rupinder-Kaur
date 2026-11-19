"use client";

import { useEffect } from "react";

/**
 * One small, dependency-free motion layer.
 * - Scroll reveal (.reveal → .in-view). Content is never hidden unless this runs.
 * - Header scroll progress + scrollspy (aria-current on the active nav link).
 * - Experience timeline fill driven by scroll position.
 * - Pointer spotlight variables for .spotlight cards.
 * - Mobile menu closes on link tap, Escape or outside click.
 * - "Re-run" for the How I think test run.
 */
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    // ---- Scroll reveal ----
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    const inViewport = el => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    // Anything already on screen is shown immediately, so there is no flash.
    reveals.forEach(el => { if (reduce || inViewport(el)) el.classList.add("in-view"); });
    root.classList.add("motion-ready");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(el => { if (!el.classList.contains("in-view")) io.observe(el); });
    cleanups.push(() => io.disconnect());

    // ---- Scroll progress, scrollspy, timeline ----
    const bar = document.querySelector(".scroll-progress");
    const timeline = document.querySelector(".timeline");
    const links = Array.from(document.querySelectorAll(".desktop-nav a, .mobile-nav nav a"));
    const sections = Array.from(new Set(links.map(a => a.getAttribute("href"))))
      .map(href => document.querySelector(href)).filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - root.clientHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? root.scrollTop / max : 0})`;

      const probe = window.innerHeight * 0.35;
      let active = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= probe) active = s.id;
      links.forEach(a => {
        if (a.getAttribute("href") === `#${active}`) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });

      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
        timeline.style.setProperty("--progress", reduce ? 1 : p.toFixed(3));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    on(window, "scroll", schedule, { passive: true });
    on(window, "resize", schedule);
    update();

    // ---- Spotlight cards ----
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll(".spotlight").forEach(card => {
        on(card, "pointermove", e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      });
    }

    // ---- Mobile menu ----
    const menu = document.querySelector(".mobile-nav");
    if (menu) {
      menu.querySelectorAll("nav a").forEach(a => on(a, "click", () => menu.removeAttribute("open")));
      on(document, "keydown", e => {
        if (e.key === "Escape" && menu.open) { menu.removeAttribute("open"); menu.querySelector("summary")?.focus(); }
      });
      on(document, "click", e => { if (menu.open && !menu.contains(e.target)) menu.removeAttribute("open"); });
    }

    // ---- Re-run the How I think "suite" ----
    document.querySelectorAll("[data-rerun]").forEach(btn => {
      on(btn, "click", () => {
        const suite = document.getElementById(btn.getAttribute("data-rerun"));
        if (!suite) return;
        suite.classList.remove("is-running");
        void suite.offsetWidth; // restart CSS animations
        suite.classList.add("is-running");
      });
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      cleanups.forEach(fn => fn());
    };
  }, []);

  return null;
}
