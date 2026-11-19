"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Spot the bug": twelve identical controls, one is 2px off. The hero's promise
 * (find what others overlook) as a ten-second interaction.
 */
const COUNT = 12;

export default function SpotTheBug() {
  const [odd, setOdd] = useState(7); // deterministic for SSR, shuffled on mount
  const [state, setState] = useState({ found: false, misses: 0, wrong: -1, ms: 0 });
  const started = useRef(0);

  useEffect(() => { setOdd(Math.floor(Math.random() * COUNT)); started.current = performance.now(); }, []);

  function pick(i) {
    if (state.found) return;
    if (i === odd) setState(s => ({ ...s, found: true, ms: performance.now() - started.current }));
    else {
      setState(s => ({ ...s, misses: s.misses + 1, wrong: i }));
      setTimeout(() => setState(s => ({ ...s, wrong: -1 })), 450);
    }
  }
  function reset() {
    setOdd(o => (o + 1 + Math.floor(Math.random() * (COUNT - 1))) % COUNT);
    setState({ found: false, misses: 0, wrong: -1, ms: 0 });
    started.current = performance.now();
  }

  const secs = (state.ms / 1000).toFixed(1);
  return <div className={`bug-game${state.found ? " is-found" : ""}`}>
    <p className="bug-game-title"><span>SPOT THE BUG</span><span>ONE IS 2PX OFF</span></p>
    <div className="bug-grid" role="group" aria-label="Twelve toggles. One is misaligned by two pixels.">
      {Array.from({ length: COUNT }, (_, i) => <button type="button" key={i}
        className={`bug-toggle${i === odd ? " is-odd" : ""}${state.wrong === i ? " is-wrong" : ""}${state.found && i === odd ? " is-hit" : ""}`}
        onClick={() => pick(i)} aria-label={`Toggle ${i + 1}`}>
        <span className="bug-knob" />
      </button>)}
    </div>
    <p className="bug-game-status" role="status" aria-live="polite">
      {state.found
        ? <>Logged as <b>RK-{101 + state.misses}</b>, found in {secs}s{state.misses ? ` after ${state.misses} miss${state.misses > 1 ? "es" : ""}` : ""}. That&apos;s the job. <button type="button" className="bug-reset" onClick={reset}>Again ↻</button></>
        : state.misses ? <>{state.misses} miss{state.misses > 1 ? "es" : ""}. It&apos;s in there.</> : <>Click the one that&apos;s off.</>}
    </p>
  </div>;
}
