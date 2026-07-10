"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL "liquid silk" background for the President hero — domain-warped fbm
 * noise flowing between espresso, walnut, and brass, with a subtle pointer
 * drift. Written against raw WebGL (no three.js) so it adds zero bundle
 * weight beyond this file.
 *
 * Degrades gracefully: no WebGL → the parent's CSS gradient shows through;
 * prefers-reduced-motion → renders a single static frame; off-screen or
 * hidden tab → the render loop pauses.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 2.2;
  float t = u_time * 0.045;

  // Pointer gently bends the field.
  p += (u_mouse - 0.5) * 0.35;

  // Domain warp: fbm fed through itself twice — the "silk" flow.
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + t),
                fbm(p + 2.0 * q + vec2(8.3, 2.8) + t * 0.7));
  float f = fbm(p + 2.4 * r);

  // Palette: espresso -> walnut -> brass.
  vec3 espresso = vec3(0.078, 0.066, 0.055);
  vec3 walnut   = vec3(0.196, 0.145, 0.098);
  vec3 brass    = vec3(0.722, 0.573, 0.353);

  vec3 col = mix(espresso, walnut, clamp(f * f * 3.4, 0.0, 1.0));
  col = mix(col, brass, smoothstep(0.58, 0.98, f) * 0.5);

  // A thin drifting gold thread where the warped field crosses a level line.
  float thread = smoothstep(0.012, 0.0, abs(r.x - 0.52));
  col += brass * thread * 0.35;

  // Vignette to sink the edges into the page.
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= mix(0.55, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function SilkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // CSS gradient fallback underneath

    // --- Compile the fullscreen-triangle program ---
    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    // --- State ---
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let running = false;
    let inView = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    function draw(now: number) {
      resize();
      // Ease the pointer for a weighty, liquid feel.
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function loop(now: number) {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    function setRunning(next: boolean) {
      if (next === running) return;
      running = next;
      if (running) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    }

    // Reduced motion: paint one calm frame and stop.
    if (reduced) {
      draw(start + 20000);
    } else {
      setRunning(true);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / Math.max(rect.width, 1);
      mouse.ty = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onVis = () => setRunning(!reduced && !document.hidden && inView);
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      onVis();
    });
    io.observe(canvas);

    return () => {
      setRunning(false);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
