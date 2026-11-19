"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero visual: an exploded "layers" view of an application, rendered as a point
 * cloud in WebGL (three.js). A scan plane sweeps through; defects that look like
 * every other point turn red once the scan passes them, and get a comment pin.
 * A "Rupinder · QA" cursor travels to each find.
 *
 * - three.js is loaded on demand (code-split), never during SSR.
 * - Renders only while on screen and the tab is visible.
 * - prefers-reduced-motion: one still frame with every defect found.
 * - No WebGL: falls back to a static, labelled layers diagram.
 */

const LAYERS = ["UI", "API", "DATA", "PIPELINE"];
const DEFECTS = [
  { id: "#014", note: "1px drift on retry state", layer: 0, x: -0.55, y: 0.38 },
  { id: "#027", note: "null slips past the contract", layer: 1, x: 0.42, y: -0.25 },
  { id: "#031", note: "p95 spikes at 40 users", layer: 3, x: 1.05, y: 0.2 },
];
const PERIOD = 7.5; // seconds per sweep

const vertexShader = /* glsl */`
  attribute float aRand;
  attribute float aDefect;
  attribute float aStrength;
  uniform float uTime;
  uniform float uScan;
  uniform float uPixelRatio;
  varying float vScan;
  varying float vFound;
  varying float vStrength;
  varying float vFade;
  void main() {
    vec3 p = position;
    // Dissolve the right edge into drifting particles.
    float edge = smoothstep(0.9, 1.9, p.x + aRand * 0.35);
    p.x += edge * (0.6 + aRand * 1.4) * (0.6 + 0.4 * sin(uTime * 0.4 + aRand * 6.28));
    p.y += edge * sin(uTime * 0.6 + aRand * 12.0) * 0.35;
    p.z += edge * cos(uTime * 0.5 + aRand * 9.0) * 0.45;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = abs(position.x - uScan);
    vScan = 1.0 - smoothstep(0.0, 0.09, d);
    vFound = aDefect * step(position.x, uScan);
    vStrength = aStrength;
    vFade = 1.0 - edge * 0.65;
    float size = (1.9 + aStrength * 1.9 + vScan * 2.4 + vFound * 5.0) * uPixelRatio;
    gl_PointSize = size * (4.2 / -mv.z);
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3 uInk;
  uniform vec3 uSelect;
  uniform vec3 uIssue;
  varying float vScan;
  varying float vFound;
  varying float vStrength;
  varying float vFade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    vec3 col = mix(uInk, uSelect, vScan);
    col = mix(col, uIssue, vFound);
    float a = (0.42 + vStrength * 0.58 + vScan * 0.6 + vFound) * vFade;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;

// Procedural "screen" for each layer: rectangles where points are denser and brighter.
function layout(layer) {
  const sets = [
    [[-1.5, 0.82, 3.0, 0.16], [-1.5, 0.35, 1.3, 0.34], [-0.05, 0.35, 1.55, 0.34], [-1.5, -0.2, 0.9, 0.4], [-0.45, -0.2, 0.9, 0.4], [0.6, -0.2, 0.9, 0.4], [-1.5, -0.8, 0.55, 0.14]],
    [[-1.5, 0.6, 0.7, 0.7], [-0.6, 0.6, 0.7, 0.7], [0.3, 0.6, 0.7, 0.7], [-1.5, -0.4, 3.0, 0.08], [-1.5, -0.65, 3.0, 0.08]],
    [[-1.5, 0.8, 3.0, 0.1], [-1.5, 0.45, 3.0, 0.1], [-1.5, 0.1, 3.0, 0.1], [-1.5, -0.25, 3.0, 0.1], [-1.5, -0.6, 3.0, 0.1]],
    [[-1.5, 0.1, 0.5, 0.3], [-0.75, 0.1, 0.5, 0.3], [0.0, 0.1, 0.5, 0.3], [0.75, 0.1, 0.5, 0.3], [-1.5, -0.03, 2.75, 0.04]],
  ];
  return sets[layer];
}

function buildCloud(THREE) {
  const pos = [], rand = [], defect = [], strength = [];
  const W = 3.2, H = 2.0, cols = 72, rows = 44;
  LAYERS.forEach((_, L) => {
    const z = (1.5 - L) * 0.85;
    const rects = layout(L);
    for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
      const x = -W / 2 + (i / cols) * W, y = -H / 2 + (j / rows) * H;
      const inside = rects.some(([rx, ry, rw, rh]) => x >= rx && x <= rx + rw && y <= ry && y >= ry - rh);
      const border = i === 0 || j === 0 || i === cols || j === rows;
      if (!inside && !border && (i + j) % 3 !== 0) continue;
      pos.push(x, y, z);
      rand.push(Math.random());
      defect.push(0);
      strength.push(border ? 0.7 : inside ? 0.55 : 0.08);
    }
  });
  // Defect clusters: identical to their neighbours until the scan finds them.
  DEFECTS.forEach(d => {
    const z = (1.5 - d.layer) * 0.85;
    for (let k = 0; k < 7; k++) {
      pos.push(d.x + (Math.random() - 0.5) * 0.09, d.y + (Math.random() - 0.5) * 0.09, z);
      rand.push(Math.random() * 0.1);
      defect.push(1);
      strength.push(0.55);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aRand", new THREE.Float32BufferAttribute(rand, 1));
  g.setAttribute("aDefect", new THREE.Float32BufferAttribute(defect, 1));
  g.setAttribute("aStrength", new THREE.Float32BufferAttribute(strength, 1));
  return g;
}

export default function HeroScan() {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const pins = useRef([]);
  const cursor = useRef(null);
  const [mode, setMode] = useState("loading"); // loading | webgl | fallback

  useEffect(() => {
    let disposed = false, cleanup = () => {};
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const probe = document.createElement("canvas");
    const supported = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    if (!supported) { setMode("fallback"); return; }

    import("three").then(THREE => {
      if (disposed || !wrap.current) return;
      const renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true, alpha: true, powerPreference: "low-power" });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 7.4);

      const group = new THREE.Group();
      group.rotation.set(-0.42, 0.62, 0.06);
      scene.add(group);

      const styles = getComputedStyle(document.documentElement);
      const color = name => new THREE.Color(styles.getPropertyValue(name).trim() || "#ffffff");
      const material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader, transparent: true, depthWrite: false,
        uniforms: {
          uTime: { value: 0 }, uScan: { value: -2 }, uPixelRatio: { value: dpr },
          uInk: { value: new THREE.Color("#ecece7") }, uSelect: { value: color("--select") }, uIssue: { value: color("--issue") },
        },
      });
      const geometry = buildCloud(THREE);
      group.add(new THREE.Points(geometry, material));

      // Faint layer outlines + labels positions.
      const lineMat = new THREE.LineBasicMaterial({ color: 0xecece7, transparent: true, opacity: 0.12 });
      LAYERS.forEach((_, L) => {
        const z = (1.5 - L) * 0.85;
        const g = new THREE.BufferGeometry().setFromPoints([[-1.6, 1, z], [1.6, 1, z], [1.6, -1, z], [-1.6, -1, z], [-1.6, 1, z]].map(p => new THREE.Vector3(...p)));
        group.add(new THREE.Line(g, lineMat));
      });

      const anchors = DEFECTS.map(d => new THREE.Vector3(d.x, d.y, (1.5 - d.layer) * 0.85));
      const v = new THREE.Vector3();
      let w = 0, h = 0;
      const resize = () => {
        const r = wrap.current.getBoundingClientRect();
        w = r.width; h = r.height;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = w / h < 0.8 ? 8.4 : w / h < 1.25 ? 7.0 : 6.4;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(wrap.current);

      let tx = 0, ty = 0;
      const onMove = e => {
        const r = wrap.current.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5);
        ty = ((e.clientY - r.top) / r.height - 0.5);
      };
      wrap.current.addEventListener("pointermove", onMove);

      let cx = w * 0.2, cy = h * 0.8, lastFound = -1;
      const frame = t => {
        const time = t / 1000;
        const phase = reduce ? 1 : (time % PERIOD) / PERIOD;
        const scan = -1.75 + phase * 3.6;
        material.uniforms.uTime.value = time;
        material.uniforms.uScan.value = scan;
        group.rotation.y += ((0.62 + tx * 0.5) - group.rotation.y) * 0.05;
        group.rotation.x += ((-0.42 + ty * 0.3) - group.rotation.x) * 0.05;
        renderer.render(scene, camera);

        group.updateMatrixWorld();
        DEFECTS.forEach((d, i) => {
          const el = pins.current[i];
          if (!el) return;
          v.copy(anchors[i]).applyMatrix4(group.matrixWorld).project(camera);
          const x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
          const left = x > w * 0.5;
          el.classList.toggle("is-left", left);
          el.dataset.x = x; el.dataset.y = y;
          el.style.transform = `translate(${x}px, ${y}px)${left ? " translateX(-100%)" : ""}`;
          const found = scan > d.x;
          el.classList.toggle("is-found", found);
          if (found) lastFound = i;
        });
        if (cursor.current) {
          const target = pins.current[Math.max(0, lastFound)];
          const gx = target?.dataset.x ? +target.dataset.x + 12 : w * 0.2, gy = target?.dataset.y ? +target.dataset.y + 22 : h * 0.8;
          cx += (gx - cx) * (reduce ? 1 : 0.06); cy += (gy - cy) * (reduce ? 1 : 0.06);
          cursor.current.style.transform = `translate(${cx}px, ${cy}px)`;
        }
      };

      let raf = 0, visible = true;
      const loop = t => { frame(t); raf = requestAnimationFrame(loop); };
      const start = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop); };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
      io.observe(wrap.current);
      const onVis = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVis);

      setMode("webgl");
      if (reduce) requestAnimationFrame(() => frame(PERIOD * 1000 - 1)); else start();

      cleanup = () => {
        stop(); io.disconnect(); ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        wrap.current?.removeEventListener("pointermove", onMove);
        geometry.dispose(); material.dispose(); lineMat.dispose(); renderer.dispose();
      };
    }).catch(() => !disposed && setMode("fallback"));

    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className={`hero-scan is-${mode}`} ref={wrap}>
    <canvas ref={canvas} className="hero-scan-canvas" aria-hidden="true" />
    <div className="hero-scan-pins" aria-hidden="true">
      {DEFECTS.map((d, i) => <div className="scan-pin" key={d.id} ref={el => (pins.current[i] = el)}>
        <span className="scan-pin-dot" />
        <span className="scan-pin-label"><b>{d.id}</b> {d.note}</span>
      </div>)}
      <div className="qa-cursor" ref={cursor}>
        <svg width="16" height="18" viewBox="0 0 16 18"><path d="M1 1l13 7-6 1.5L5 16z" /></svg>
        <span>Rupinder · QA</span>
      </div>
    </div>
    <ul className="hero-scan-layers" aria-label="Layers inspected">
      {LAYERS.map(l => <li key={l}>{l}</li>)}
    </ul>
    <p className="hero-scan-caption"><span className="scan-led" /> SCANNING 4 LAYERS · {DEFECTS.length} ISSUES SURFACED</p>
    <p className="visually-hidden">Animated illustration: a scan passes through the UI, API, data and pipeline layers of an application and highlights {DEFECTS.length} issues that were hidden among normal points: {DEFECTS.map(d => `${d.id}, ${d.note}`).join("; ")}.</p>
  </div>;
}
