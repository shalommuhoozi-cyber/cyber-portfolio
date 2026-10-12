"use client";

import { useEffect, useRef, useState } from "react";
import { usePortfolioMotion } from "./portfolio-motion";

const palettes = [
  { name: "Iris", colors: [[0.38, 0.22, 0.95], [0.98, 0.63, 0.43], [0.72, 0.72, 1.0]] },
  { name: "Tide", colors: [[0.08, 0.46, 0.67], [0.36, 0.94, 0.78], [0.72, 0.91, 1.0]] },
  { name: "Ember", colors: [[0.74, 0.14, 0.29], [1.0, 0.57, 0.23], [0.98, 0.79, 0.64]] },
];

const vertexSource = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

// An original ray-marched, twisted torus: no remote scene, runtime, or tracking.
const fragmentSource = `precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform vec3 u_a;
uniform vec3 u_b;
uniform vec3 u_c;
mat2 rotate(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
float field(vec3 p) {
  p.xy = rotate(-0.43 + u_pointer.x * 0.20) * p.xy;
  p.yz = rotate(0.60 + u_pointer.y * 0.23) * p.yz;
  float angle = atan(p.y, p.x);
  float ripple = sin(angle * 3.0 + u_time * 0.36) * 0.075;
  vec2 q = vec2(length(p.xy) - (1.04 + ripple), p.z);
  q = rotate(angle * 1.5 + u_time * 0.15) * q;
  return length(q / vec2(1.0, 0.78)) - 0.40;
}
vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(field(p + e.xyy) - field(p - e.xyy),
    field(p + e.yxy) - field(p - e.yxy), field(p + e.yyx) - field(p - e.yyx)));
}
float grain(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 ray = normalize(vec3(uv * 1.60, -4.1));
  vec3 origin = vec3(0.0, 0.0, 4.5);
  float travel = 0.0;
  bool hit = false;
  for (int i = 0; i < 64; i++) {
    float dist = field(origin + ray * travel);
    if (dist < 0.003) { hit = true; break; }
    travel += dist * 0.72;
    if (travel > 7.0) break;
  }
  if (!hit) { gl_FragColor = vec4(0.0); return; }
  vec3 p = origin + ray * travel;
  vec3 n = normalAt(p);
  float flow = sin(p.x * 1.8 + p.y * 1.4 + u_time * 0.27) * 0.5 + 0.5;
  vec3 color = mix(u_a, u_b, smoothstep(0.2, 0.92, flow));
  color = mix(color, u_c, smoothstep(-0.45, 0.85, p.y) * 0.65);
  float diffuse = max(dot(n, normalize(vec3(-0.5, 1.0, 2.0))), 0.0);
  float rim = pow(1.0 - max(dot(n, -ray), 0.0), 2.5);
  float specular = pow(max(dot(reflect(-normalize(vec3(-0.4, 1.0, 2.0)), n), -ray), 0.0), 28.0);
  color = color * (0.32 + diffuse * 0.83) + u_c * rim * 0.38 + specular * 0.26;
  color += (grain(gl_FragCoord.xy) - 0.5) * 0.042;
  gl_FragColor = vec4(color, 1.0);
}`;

export default function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState(0);
  const [webgl, setWebgl] = useState(false);
  const { motion, toggleMotion } = usePortfolioMotion();
  const live = useRef({ motion, palette });
  const refresh = useRef<(() => void) | null>(null);

  useEffect(() => {
    live.current = { motion, palette };
    refresh.current?.();
  }, [motion, palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(["resolution", "pointer", "time", "a", "b", "c"].map((key) => [key, gl.getUniformLocation(program, `u_${key}`)]));
    let frame = 0;
    let visible = true;
    let lost = false;
    let clock = 3;
    let previous = 0;
    let pointer = [0, 0];
    let target = [0, 0];
    let lastPalette = -1;
    let lastMotion: boolean | null = null;

    const draw = () => {
      if (lost) return;
      const colors = palettes[live.current.palette].colors;
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
      gl.uniform1f(uniforms.time, clock);
      gl.uniform3fv(uniforms.a, colors[0]);
      gl.uniform3fv(uniforms.b, colors[1]);
      gl.uniform3fv(uniforms.c, colors[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      lastPalette = live.current.palette;
      lastMotion = live.current.motion;
    };
    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || lost) return;
      const elapsed = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      if (now - previous > 1000 / 30 || lastPalette !== live.current.palette || lastMotion !== live.current.motion) {
        previous = now;
        if (live.current.motion) {
          clock += elapsed;
          pointer = pointer.map((value, i) => value + (target[i] - value) * 0.07);
        }
        draw();
      }
      if (live.current.motion) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible && !document.hidden && !lost) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.round(bounds.width * scale));
      canvas.height = Math.max(1, Math.round(bounds.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !live.current.motion) return;
      const bounds = stage.getBoundingClientRect();
      target = [(event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1];
    };
    const reset = () => { target = [0, 0]; };
    const onVisibility = () => { previous = 0; wake(); };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      setWebgl(false);
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; previous = 0; wake(); });
    refresh.current = () => { draw(); wake(); };
    resizeObserver.observe(stage);
    intersection.observe(stage);
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);
    resize();
    setWebgl(true);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      refresh.current = null;
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="signal-field" data-palette={palettes[palette].name.toLowerCase()}>
      <div className="signal-heading"><span>PLAY / EXPLORE</span><span className="signal-star" aria-hidden="true">✳</span></div>
      <div ref={stageRef} className="signal-stage" data-palette={palette} data-playing={motion}>
        <div className={`signal-fallback${webgl ? " is-rendered" : ""}`} aria-hidden="true" />
        <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />
        <span className="signal-axis signal-axis-x" aria-hidden="true" />
        <span className="signal-axis signal-axis-y" aria-hidden="true" />
        <span className="signal-coordinate" aria-hidden="true">FORM.01<br />ALWAYS EVOLVING</span>
      </div>
      <div className="signal-controls">
        <div className="palette-controls" role="group" aria-label="Sculpture colour palette">
          {palettes.map((item, index) => (
            <button key={item.name} type="button" className={`palette-option palette-${item.name.toLowerCase()}`} aria-pressed={palette === index} onClick={() => setPalette(index)}>
              <span aria-hidden="true" />{item.name}
            </button>
          ))}
        </div>
        <button type="button" className="motion-toggle" aria-pressed={motion} onClick={toggleMotion} aria-label={motion ? "Pause animations" : "Play animations"}>
          <span aria-hidden="true">{motion ? "Ⅱ" : "▷"}</span><span>{motion ? "Pause" : "Play"}</span>
        </button>
      </div>
      <p className="signal-caption">A little curiosity goes a long way. <span>Move your cursor.</span></p>
    </div>
  );
}
