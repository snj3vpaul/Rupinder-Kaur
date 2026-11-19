"use client";

import { useState } from "react";
import WorkCanvas from "@/components/WorkCanvas";

const VARIANTS = { "01": "parity", "02": "sphere", "03": "gauge" };

export default function SelectedWork({ projects }) {
  const [open, setOpen] = useState(null);
  const active = projects.find(p => p.number === open);

  return <div className="work-board">
    <div className="work-grid">
      {projects.map(p => {
        const isOpen = open === p.number;
        return <article className={`work-card${isOpen ? " is-open" : ""}`} key={p.number}>
          <div className="work-visual"><WorkCanvas variant={VARIANTS[p.number]} /></div>
          <div className="work-meta">
            <p className="work-kicker"><span>{p.number}</span><span>{p.category}</span></p>
            <h3>{p.title}</h3>
            <p>{p.overview}</p>
            <button type="button" className="work-toggle" aria-expanded={isOpen} aria-controls="work-detail"
              onClick={() => setOpen(isOpen ? null : p.number)}>
              {isOpen ? "Close case file" : "Open case file"} <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
          </div>
          <span className="handles" aria-hidden="true"><i /><i /><i /><i /></span>
        </article>;
      })}
    </div>

    <section id="work-detail" className={`work-detail${active ? " is-open" : ""}`} aria-live="polite" hidden={!active}>
      {active && <div className="work-detail-inner" key={active.number}>
        <p className="work-kicker"><span>CASE FILE {active.number}</span><span>{active.category}</span></p>
        <div className="work-detail-grid">
          <div><h4>The challenge</h4><p>{active.challenge}</p></div>
          <div><h4>My contribution</h4><p>{active.contribution}</p></div>
          <div><h4>Quality focus</h4><p>{active.focus}</p>
            <ul className="chip-list" aria-label="Technologies">{active.tools.map(t => <li key={t}>{t}</li>)}</ul></div>
        </div>
      </div>}
    </section>

    <article className="work-card work-card-wide">
      <div className="work-meta">
        <p className="work-kicker"><span>∞</span><span>HOW IT CONNECTS</span></p>
        <h3>Never finished testing</h3>
        <p>When code changes, dependencies move or traffic shifts, the checks run again. A regression is caught, fixed, and re-tested before it reaches anyone.</p>
      </div>
      <div className="work-visual"><WorkCanvas variant="curve" /></div>
      <span className="handles" aria-hidden="true"><i /><i /><i /><i /></span>
    </article>
  </div>;
}
