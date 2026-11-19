/**
 * Animated, meaning-carrying diagrams for each case study.
 * Pure SVG + CSS (no JS). Animations start when the parent .project gets .in-view
 * and collapse to their final frame under prefers-reduced-motion.
 */

function Parity() {
  const rows = [0, 1, 2, 3];
  return <svg viewBox="0 0 360 230" className="diagram diagram-parity" role="img" aria-labelledby="dg-parity">
    <title id="dg-parity">Legacy and modern records compared row by row; every row matches.</title>
    <text x="40" y="24" className="dg-label">LEGACY · COBOL/DB2</text>
    <text x="320" y="24" className="dg-label" textAnchor="end">MODERN · C#/SQL</text>
    {rows.map(i => {
      const y = 46 + i * 36;
      return <g key={i} className="dg-row" style={{ "--i": i }}>
        <rect x="40" y={y} width="104" height="20" rx="2" className="dg-cell" />
        <rect x="48" y={y + 8} width={40 + (i % 2) * 22} height="4" className="dg-ink" />
        <rect x="216" y={y} width="104" height="20" rx="2" className="dg-cell" />
        <rect x="224" y={y + 8} width={40 + (i % 2) * 22} height="4" className="dg-ink" />
        <line x1="150" y1={y + 10} x2="210" y2={y + 10} className="dg-link" pathLength="1" />
        <g className="dg-check" transform={`translate(180 ${y + 10})`}>
          <circle r="9" />
          <path d="M-4 0l3 3 5-6" />
        </g>
      </g>;
    })}
    <rect x="34" y="40" width="292" height="2" className="dg-scan" />
    <text x="180" y="214" className="dg-label dg-result" textAnchor="middle">PARITY 4 / 4 ✓</text>
  </svg>;
}

function Pipeline() {
  const stages = ["COMMIT", "BUILD", "E2E", "RELEASE"];
  return <svg viewBox="0 0 360 230" className="diagram diagram-pipeline" role="img" aria-labelledby="dg-pipeline">
    <title id="dg-pipeline">A change moves through commit, build, end-to-end tests and release; each stage passes.</title>
    <line x1="45" y1="100" x2="315" y2="100" className="dg-track" />
    <line x1="45" y1="100" x2="315" y2="100" className="dg-track-fill" pathLength="1" />
    {stages.map((s, i) => {
      const x = 45 + i * 90;
      return <g key={s} className="dg-stage" style={{ "--i": i }} transform={`translate(${x} 100)`}>
        <circle r="15" className="dg-node" />
        <path d="M-5 0l3.5 3.5 6-7" className="dg-node-check" />
        <text y="38" className="dg-label" textAnchor="middle">{s}</text>
      </g>;
    })}
    <circle r="5" cx="45" cy="100" className="dg-packet" />
    <g className="dg-specs" transform="translate(225 160)">
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={-34 + i * 14} y="0" width="10" height="10" rx="2" style={{ "--i": i }} />)}
    </g>
    <text x="225" y="196" className="dg-label" textAnchor="middle">5 SPECS · 0 FLAKY</text>
  </svg>;
}

function Load() {
  return <svg viewBox="0 0 360 230" className="diagram diagram-load" role="img" aria-labelledby="dg-load">
    <title id="dg-load">A load test ramps virtual users while response time stays under the p95 threshold.</title>
    <line x1="40" y1="190" x2="330" y2="190" className="dg-axis" />
    <line x1="40" y1="30" x2="40" y2="190" className="dg-axis" />
    <path d="M40 190 L100 190 L100 160 L160 160 L160 130 L220 130 L220 100 L330 100 L330 190 Z" className="dg-area" />
    <line x1="40" y1="70" x2="330" y2="70" className="dg-threshold" />
    <text x="330" y="62" className="dg-label" textAnchor="end">p95 &lt; 500ms</text>
    <path d="M40 170 C70 168 90 150 110 152 S150 140 170 128 S210 120 230 104 S270 96 290 90 S320 92 330 88"
      className="dg-line" pathLength="1" />
    <circle cx="290" cy="90" r="4" className="dg-blip" />
    <text x="44" y="210" className="dg-label">0 VU</text>
    <text x="330" y="210" className="dg-label" textAnchor="end">50 VU · k6</text>
  </svg>;
}

const map = { "01": Parity, "02": Pipeline, "03": Load };

export default function ProjectDiagram({ number }) {
  const Diagram = map[number] || Parity;
  return <div className="project-visual">
    <Diagram />
  </div>;
}
