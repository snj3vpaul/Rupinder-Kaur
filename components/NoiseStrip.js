"use client";

import { useEffect, useRef } from "react";

/** Monochrome flowing-noise strip (fragment shader). Decorative; pauses off-screen. */
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y;
  vec2 q=vec2(fbm(uv*1.6+t*.05),fbm(uv*1.6-t*.04+3.1));
  float f=fbm(uv*2.2+q*2.4+m*.6+vec2(t*.03,0.));
  float c=smoothstep(.15,.95,f);
  gl_FragColor=vec4(vec3(mix(.07,.93,c)),1.);
}`;
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

export default function NoiseStrip() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: false });
    if (!gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t"), uM = gl.getUniformLocation(prog, "m");
    let mx = 0, my = 0, smx = 0, smy = 0;
    const resize = () => {
      const s = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6; // soft texture: render below native res
      canvas.width = Math.max(1, canvas.clientWidth * s); canvas.height = Math.max(1, canvas.clientHeight * s);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const onMove = e => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
    canvas.addEventListener("pointermove", onMove);
    const draw = ms => {
      smx += (mx - smx) * 0.04; smy += (my - smy) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, ms / 1000 + 20); gl.uniform2f(uM, smx, smy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    let raf = 0;
    const loop = ms => { draw(ms); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf); raf = 0;
      if (e.isIntersecting && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    if (reduce) draw(0);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); canvas.removeEventListener("pointermove", onMove); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  }, []);
  return <canvas ref={ref} className="noise-strip" aria-hidden="true" />;
}
