let canvas: OffscreenCanvas;
let gl: WebGLRenderingContext | null;
let time: WebGLUniformLocation | null;
let frame = 0;
let elapsed = 0;
let previous = 0;

function draw() {
  if (!gl) return;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(time, elapsed / 1000);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function tick(now: number) {
  elapsed += Math.min(now - previous, 50);
  previous = now;
  draw();
  frame = requestAnimationFrame(tick);
}

function initialize(surface: OffscreenCanvas) {
  canvas = surface;
  gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return false;
  const program = gl.createProgram();
  if (!program) return false;
  const sources = [
    [
      gl.VERTEX_SHADER,
      `attribute vec2 p; varying vec2 uv;
      void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`,
    ],
    [
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
      }`,
    ],
  ] as const;
  for (const [type, source] of sources) {
    const shader = gl.createShader(type);
    if (!shader) return false;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook.
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  time = gl.getUniformLocation(program, "t");
  return true;
}

self.addEventListener(
  "message",
  (
    event: MessageEvent<
      | { type: "init"; canvas: OffscreenCanvas }
      | { type: "resize"; width: number; height: number }
      | { type: "active"; value: boolean }
    >
  ) => {
    const data = event.data;
    if (data.type === "init" && !initialize(data.canvas)) {
      gl = null;
      self.postMessage("unavailable");
    }
    if (!gl) return;
    if (data.type === "resize") {
      canvas.width = data.width;
      canvas.height = data.height;
      draw();
    }
    if (data.type === "active") {
      cancelAnimationFrame(frame);
      if (data.value) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
  }
);
