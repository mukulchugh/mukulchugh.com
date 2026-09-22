"use client";

import { useEffect, useRef } from "react";

// Shared hero/CTA material. CSS lime remains the WebGL fallback.
export function FluorescentShader({
  active,
  className,
}: {
  active: boolean;
  className: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!(canvas && active)) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    const program = gl.createProgram();
    if (!program) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return false;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return false;
      gl.attachShader(program, shader);
      return true;
    };
    const compiled =
      compile(
        gl.VERTEX_SHADER,
        `attribute vec2 p; varying vec2 uv;
      void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`
      ) &&
      compile(
        gl.FRAGMENT_SHADER,
        `precision mediump float; varying vec2 uv; uniform float t;
      void main(){
        vec2 p=uv;
        float bend=sin(p.y*3.8+t*.18)*.16+sin(p.y*7.-t*.12)*.035;
        float fold=sin((p.x+bend)*7.5-t*.14)*.5+.5;
        float light=pow(fold,4.);
        vec3 lime=vec3(.827,1.,.349);
        vec3 color=mix(lime,vec3(.94,1.,.65),light*.65);
        color=mix(color,vec3(.64,.84,.22),(1.-fold)*.19);
        gl_FragColor=vec4(color,1.);
      }`
      );
    gl.linkProgram(program);
    if (!(compiled && gl.getProgramParameter(program, gl.LINK_STATUS))) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    const buffer = gl.createBuffer();
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, "t");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(time, elapsed / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const tick = (now: number) => {
      elapsed += Math.min(now - previous, 50);
      previous = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      draw();
      if (visible && !document.hidden && !reduced.matches) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = new ResizeObserver(() => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * 0.65));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * 0.65));
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resize.observe(canvas);
    observer.observe(canvas);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      gl.deleteBuffer(buffer);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
    };
  }, [active]);
  return (
    <canvas aria-hidden="true" className={className} ref={ref} tabIndex={-1} />
  );
}
