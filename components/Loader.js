/**
 * Intro loader: "RK" written back to front: K before R, and every stroke drawn
 * from its end to its start. Pure CSS timeline, so it removes itself even if
 * JavaScript fails. Only shown when <html> has .intro (set by the boot script).
 */
export default function Loader() {
  const strokes = [
    ["k-leg", "M232 92 L300 190"],
    ["k-arm", "M296 14 L206 106"],
    ["k-stem", "M200 14 V190"],
    ["r-leg", "M104 112 L160 190"],
    ["r-bowl", "M38 24 H108 A44 44 0 0 1 108 112 H38"],
    ["r-stem", "M38 14 V190"],
  ];
  return <div className="loader" aria-hidden="true">
    <svg className="loader-mark" viewBox="0 0 340 222">
      {strokes.map(([id, d], i) => <path key={id} d={d} pathLength="1" style={{ "--s": i }} />)}
      <circle className="loader-dot" cx="324" cy="178" r="13" />
      <rect className="loader-handle" x="258" y="210" width="9" height="9" />
    </svg>
    <div className="loader-status">
      <span>RUNNING INTRO.SPEC</span>
      <span className="loader-bar"><i /></span>
      <span className="loader-pass">6 / 6 STROKES ✓</span>
    </div>
  </div>;
}
