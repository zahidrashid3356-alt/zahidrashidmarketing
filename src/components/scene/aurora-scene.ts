// 📖 Docs: obsidian/frontend/webgl-scenes.md · skill: optimize-3d-scene

/**
 * The page's background: a soft colour field with fine contour lines, drawn by
 * one full-screen fragment shader. Scrolling carries three tinted blobs across
 * the screen and bends the contour lines, so the page feels like it travels
 * through one landscape; the time uniform adds a slow drift on top.
 *
 * Built to the starter's scene rules (.claude/rules/scenes.md):
 *  - one triangle, one draw call, no geometry beyond that;
 *  - time in seconds from `createFrameClock`, scroll eased with `perFrame`;
 *  - desktop draws at ~60 fps (`createDrawGate`), phones are never capped, they
 *    pay with a smaller buffer instead (DPR);
 *  - the buffer is sized once per real size change; a same-size resize (the iOS
 *    toolbar) is ignored;
 *  - every colour is read from the site's own tokens.
 *
 * Imported lazily by `aurora.tsx`, never on the robot form.
 */

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearSRGBColorSpace,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import { createDrawGate, createFrameClock, perFrame } from "@/lib/scene/per-frame";

export interface Aurora {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  /** Frames drawn so far — lets `keepSceneAlive` notice a stalled scene. */
  frames: () => number;
  dispose: () => void;
}

interface Options {
  /** A rebuild after a context loss: no fade-in, the reader already saw it. */
  settled: boolean;
}

const DPR_DESKTOP = 1;
const DPR_PHONE = 0.75;

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntro;
  uniform vec3 uGround;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform vec3 uLine;

  float blob(vec2 p, vec2 c, float r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = gl_FragCoord.xy / uRes.y;           // height = 1
    p.x -= 0.5 * aspect;
    p.y -= 0.5;

    float s = uScroll * 9.0;
    float t = uTime * 0.06;

    // Three tinted blobs, steered by the scroll position.
    vec2 ca = vec2(0.42 * aspect * sin(s * 0.9 + t), 0.34 * cos(s * 0.7 + 1.0));
    vec2 cb = vec2(0.46 * aspect * cos(s * 0.6 + 2.0 - t), 0.38 * sin(s * 0.8 + 3.0));
    vec2 cc = vec2(0.40 * aspect * sin(s * 0.5 + 4.0 + t), 0.36 * cos(s * 0.95 + 0.5));
    float wa = blob(p, ca, 0.62);
    float wb = blob(p, cb, 0.70);
    float wc = blob(p, cc, 0.58);

    vec3 col = uGround;
    col = mix(col, uA, clamp(wa * 0.95, 0.0, 1.0));
    col = mix(col, uB, clamp(wb * 0.85, 0.0, 1.0));
    col = mix(col, uC, clamp(wc * 0.85, 0.0, 1.0));

    // Contour lines of a warped field; scrolling slides the field through them.
    float f = sin(p.x * 3.2 + sin(p.y * 2.6 + s * 0.8) * 1.5 + t * 2.0)
            + sin(length(p - ca) * 5.5 - s * 1.2)
            + sin((p.x + p.y) * 2.1 + s * 0.5);
    float v = f * 1.6;
    float w = fwidth(v);
    float d = abs(fract(v) - 0.5);
    float line = 1.0 - smoothstep(0.0, max(w * 1.5, 0.01), d);
    col = mix(col, uLine, line * 0.09);

    gl_FragColor = vec4(mix(uGround, col, uIntro), 1.0);
  }
`;

/** A design token as sRGB 0..1 — the scene never carries a colour literal. */
const readToken = (name: string): Vector3 => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const rgb = { r: 0, g: 0, b: 0 };
  new Color(raw || "#000").getRGB(rgb, SRGBColorSpace);
  return new Vector3(rgb.r, rgb.g, rgb.b);
};

const isPhoneTier = (): boolean =>
  window.innerWidth < 768 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;

export const createAurora = (container: HTMLElement, { settled }: Options): Aurora => {
  const renderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
  });
  // The shader writes display colours directly, so nothing is converted twice.
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  container.appendChild(renderer.domElement);

  // One oversized triangle covers the screen.
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
  );
  const material = new ShaderMaterial({
    uniforms: {
      uRes: { value: new Vector2(1, 1) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntro: { value: settled ? 1 : 0 },
      uGround: { value: readToken("--stream-ground") },
      uA: { value: readToken("--stream-start") },
      uB: { value: readToken("--stream-middle") },
      uC: { value: readToken("--stream-end") },
      uLine: { value: readToken("--stream-line") },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  const scene = new Scene();
  scene.add(mesh);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let phone = isPhoneTier();
  let width = 0;
  let height = 0;
  let dpr = 0;
  let maxScroll = 1;
  let progress = 0;
  let frameCount = 0;
  let raf = 0;
  let disposed = false;

  const clock = createFrameClock();
  let gate = createDrawGate(!phone);

  const draw = (): void => {
    renderer.render(scene, camera);
    frameCount += 1;
  };

  const measureScroll = (): void => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };

  const resize = (): void => {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    if (nextWidth === 0 || nextHeight === 0) return;
    phone = isPhoneTier();
    const nextDpr = Math.min(window.devicePixelRatio || 1, phone ? DPR_PHONE : DPR_DESKTOP);
    // A same-size resize clears the buffer for nothing — skip it (iOS toolbar).
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    gate = createDrawGate(!phone);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    material.uniforms.uRes.value.set(width * dpr, height * dpr);
    measureScroll();
    gate.force();
    draw(); // setSize cleared the buffer — draw in the same frame
  };

  const loop = (now: number): void => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) {
      clock.reset();
      return;
    }
    const { dt, t } = clock.tick(now);
    const raw = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    progress += (raw - progress) * perFrame(0.12, dt);
    if (Math.abs(raw - progress) > 0.2) progress = raw; // a jump to a section: snap
    material.uniforms.uTime.value = t;
    material.uniforms.uScroll.value = progress;
    const intro = material.uniforms.uIntro.value as number;
    material.uniforms.uIntro.value = Math.min(1, intro + dt * 1.2);
    if (gate.shouldDraw(dt)) draw();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const bodyObserver = new ResizeObserver(measureScroll);
  bodyObserver.observe(document.body);

  resize();
  raf = requestAnimationFrame(loop);

  return {
    canvas: renderer.domElement,
    gl: renderer.getContext(),
    frames: () => frameCount,
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      bodyObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
};
