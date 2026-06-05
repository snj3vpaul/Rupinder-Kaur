"use client";

import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Scroll reveal (reveal, timeline, motto) ----
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll(".reveal, .timeline, .motto")
      .forEach((el) => io.observe(el));

    // ---- Scroll progress bar ----
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (reduce) {
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        bar.remove();
      };
    }

    // ---- Magnetic buttons ----
    const magnets = Array.from(document.querySelectorAll(".btn"));
    const magHandlers = [];
    const finePointerMag = window.matchMedia("(pointer: fine)").matches;
    if (finePointerMag) {
      magnets.forEach((m) => {
        const move = (ev) => {
          const r = m.getBoundingClientRect();
          const x = ev.clientX - (r.left + r.width / 2);
          const y = ev.clientY - (r.top + r.height / 2);
          m.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        };
        const leave = () => { m.style.transform = ""; };
        m.addEventListener("mousemove", move);
        m.addEventListener("mouseleave", leave);
        magHandlers.push([m, move, leave]);
      });
    }

    // ---- Cursor glow (pointer devices only) ----
    let glow;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
      let rx = 0, ry = 0, x = 0, y = 0, raf;
      const onMove = (ev) => { rx = ev.clientX; ry = ev.clientY; };
      const loop = () => {
        x += (rx - x) * 0.15; y += (ry - y) * 0.15;
        glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener("mousemove", onMove);
      loop();
      var cleanupGlow = () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
        glow.remove();
      };
    }

    // ---- 3D tilt on .tilt cards ----
    const tilts = Array.from(document.querySelectorAll(".tilt"));
    const handlers = [];
    if (finePointer) {
      tilts.forEach((card) => {
        const enter = () => (card.style.transition = "transform 0.1s");
        const move = (ev) => {
          const r = card.getBoundingClientRect();
          const px = (ev.clientX - r.left) / r.width - 0.5;
          const py = (ev.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
        };
        const leave = () => {
          card.style.transition = "transform 0.4s";
          card.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
        };
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        handlers.push([card, enter, move, leave]);
      });
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      bar.remove();
      magHandlers.forEach(([m, mv, lv]) => {
        m.removeEventListener("mousemove", mv);
        m.removeEventListener("mouseleave", lv);
      });
      if (typeof cleanupGlow === "function") cleanupGlow();
      handlers.forEach(([c, en, mv, lv]) => {
        c.removeEventListener("mouseenter", en);
        c.removeEventListener("mousemove", mv);
        c.removeEventListener("mouseleave", lv);
      });
    };
  }, []);

  return null;
}
