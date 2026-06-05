"use client";

import { useState, useEffect, useCallback } from "react";

export default function Gallery({ recipes = [] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const show = (i) => { setIdx(i); setOpen(true); };
  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(
    (e) => { e?.stopPropagation(); setIdx((p) => (p + 1) % recipes.length); },
    [recipes.length]
  );
  const prev = useCallback(
    (e) => { e?.stopPropagation(); setIdx((p) => (p - 1 + recipes.length) % recipes.length); },
    [recipes.length]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, prev]);

  const active = recipes[idx] || {};

  return (
    <>
      <div className="gallery">
        {recipes.map((r, i) => (
          <button
            className={`g-card reveal d${(i % 4) + 1}`}
            key={r.title}
            onClick={() => show(i)}
            aria-label={`View ${r.title}`}
          >
            <img src={r.img} alt={r.title} loading="lazy" />
            <span className="g-cuisine">{r.cuisine}</span>
            <div className="g-overlay">
              <h3>{r.title}</h3>
              <p>{r.blurb}</p>
              <span className="g-view">View dish →</span>
            </div>
          </button>
        ))}

        {/* Invitation tile — design ready for more photos */}
        <div className="g-card g-add reveal d3" aria-hidden="true">
          <div className="g-add-inner">
            <span className="g-add-mark">🍳</span>
            <b>More dishes simmering</b>
            <span>New recipes plated soon</span>
          </div>
        </div>
      </div>

      {open && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="lb-close" onClick={close} aria-label="Close">×</button>
          {recipes.length > 1 && (
            <button className="lb-nav lb-prev" onClick={prev} aria-label="Previous">‹</button>
          )}
          <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
            <img src={active.img} alt={active.title} />
            <figcaption>
              <span className="lb-cuisine">{active.cuisine}</span>
              <h3>{active.title}</h3>
              <p>{active.blurb}</p>
            </figcaption>
          </figure>
          {recipes.length > 1 && (
            <button className="lb-nav lb-next" onClick={next} aria-label="Next">›</button>
          )}
        </div>
      )}
    </>
  );
}
