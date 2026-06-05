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

    // ---- Count-up for stat numbers ----
    const fmt = (n, prefix, suffix) =>
      prefix + Math.round(n).toLocaleString() + suffix;
    const nums = Array.from(document.querySelectorAll(".stat-num"));
    if (reduce) {
      nums.forEach((el) => {
        el.textContent = fmt(
          parseFloat(el.dataset.target),
          el.dataset.prefix || "",
          el.dataset.suffix || ""
        );
      });
    } else {
      const ioN = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseFloat(el.dataset.target);
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            const dur = 1400;
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = fmt(target * eased, prefix, suffix);
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = fmt(target, prefix, suffix);
            };
            requestAnimationFrame(tick);
            ioN.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      nums.forEach((n) => ioN.observe(n));
    }

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

    // ---- Trailing outline ring (pointer devices only) ----
    let ring;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      ring = document.createElement("div");
      ring.className = "cursor-ring";
      document.body.appendChild(ring);
      let rx = window.innerWidth / 2, ry = window.innerHeight / 2, x = rx, y = ry, raf;
      const onMove = (ev) => { rx = ev.clientX; ry = ev.clientY; };
      const loop = () => {
        x += (rx - x) * 0.18; y += (ry - y) * 0.18;
        ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
      };
      window.addEventListener("mousemove", onMove);
      loop();

      const hoverTargets = document.querySelectorAll("a, button, .g-card, .tilt");
      const grow = () => ring.classList.add("is-hover");
      const shrink = () => ring.classList.remove("is-hover");
      hoverTargets.forEach((t) => {
        t.addEventListener("mouseenter", grow);
        t.addEventListener("mouseleave", shrink);
      });

      var cleanupGlow = () => {
        window.removeEventListener("mousemove", onMove);
        cancelAnimationFrame(raf);
        hoverTargets.forEach((t) => {
          t.removeEventListener("mouseenter", grow);
          t.removeEventListener("mouseleave", shrink);
        });
        ring.remove();
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