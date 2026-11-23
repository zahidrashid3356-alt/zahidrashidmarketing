// 📖 Docs: obsidian/frontend/webgl-scenes.md → "Frame rate and time" (same rules, 2D canvas)

/**
 * The background swarm: ~1.8k particles on one 2D canvas that either form a
 * silhouette or drift as a faint ambient field, driven by the scroll position.
 *
 * Two states, switched by how close a stage (`[data-particle-stage]`) is to the
 * middle of the screen:
 *  - FORM: the swarm converges on the stage's shape (each particle a critically
 *    damped spring, stiffness varied so it arrives as a swarm, not a sheet).
 *    When 99% of the particles are within 2 px of their targets it calls
 *    `onFormed(id, true)`; the page fades its real image in and the swarm out.
 *  - DISPERSED: leaving a stage, every particle gets an outward impulse and
 *    then drifts slowly around a home position at low opacity, so text on top
 *    stays readable.
 *
 * Built to the starter's scene rules (.claude/rules/scenes.md): one clock in
 * seconds, every step scaled by `dt`, desktop draw gated to ~60 fps, resize
 * only on a real change (and an immediate draw after one), never stops drawing
 * while visible, no per-frame allocation. 2D canvas, so there is no GPU context
 * to lose. Not started on phones, with reduced motion, or on the robot form.
 */

import { createDrawGate, createFrameClock, damp } from "@/lib/scene/per-frame";
import { sampleShape, shapeFor } from "@/lib/scene/particle-shapes";

export interface ParticleField {
  /** Re-read the stages' positions (after a route change or a layout shift). */
  remeasure: () => void;
  /** Frames drawn so far. */
  frames: () => number;
  dispose: () => void;
}

interface Options {
  count: number;
  /** CSS colours read from the site's tokens. */
  accent: string;
  muted: string;
  onFormed: (id: string, formed: boolean) => void;
}

interface Stage {
  id: string;
  /** Centre in page coordinates (y includes the scroll offset at measure time). */
  x: number;
  docY: number;
  /** Radius the unit shape is scaled to, px. */
  radius: number;
  shape: Float32Array;
}

const DPR_MAX = 1.5;
/** A stage is "in" when its centre is within this fraction of the viewport height of the middle. */
const FORM_ENTER = 0.6;
const FORM_LEAVE = 0.4;
const FORMED_RATIO = 0.99;
const FORMED_PX = 2;
const ALPHA_AMBIENT = 0.24;
const ALPHA_FORM = 0.9;
const SIZE_AMBIENT = 2;
const SIZE_FORM = 2.4;
const WANDER_PX = 38;

/** Deterministic PRNG so a rebuild looks identical. */
const seeded = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const createParticleField = (
  canvas: HTMLCanvasElement,
  { count, accent, muted, onFormed }: Options,
): ParticleField => {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D canvas unavailable");
  const ctx: CanvasRenderingContext2D = context;
  const container = canvas.parentElement ?? canvas;

  const rand = seeded(20261124);
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const seed = new Float32Array(count);
  /** Home positions as fractions of the viewport. */
  const homeU = new Float32Array(count);
  const homeV = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    seed[i] = rand();
    homeU[i] = rand();
    homeV[i] = rand();
  }

  let width = 0;
  let height = 0;
  let dpr = 0;
  let stages: Stage[] = [];
  let forming = false;
  let activeId = "";
  let formed = false;
  let alpha = 0;
  let frameCount = 0;
  let raf = 0;
  let disposed = false;
  let placed = false;

  const clock = createFrameClock();
  const gate = createDrawGate(true);

  const measure = (): void => {
    const next: Stage[] = [];
    const scrollY = window.scrollY;
    document.querySelectorAll<HTMLElement>("[data-particle-stage]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const id = el.dataset.particleStage ?? "";
      const existing = stages.find((stage) => stage.id === id);
      next.push({
        id,
        x: rect.left + rect.width / 2,
        docY: rect.top + scrollY + rect.height / 2,
        radius: (Math.min(rect.width, rect.height) / 2) * 0.96,
        shape: existing?.shape ?? sampleShape(shapeFor(id), count),
      });
    });
    stages = next;
  };

  const scatter = (): void => {
    // First placement: start the swarm spread over the screen so it visibly
    // gathers, instead of appearing already in place.
    for (let i = 0; i < count; i += 1) {
      x[i] = homeU[i] * width;
      y[i] = homeV[i] * height;
    }
    placed = true;
  };

  const resize = (): void => {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    const nextDpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    if (nextWidth === 0 || nextHeight === 0) return;
    // A same-size resize clears the canvas for nothing — skip it (iOS toolbar).
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!placed) scatter();
    measure();
    gate.force();
    draw(); // resizing cleared the canvas — draw in the same frame
  };

  const explode = (cx: number, cy: number): void => {
    for (let i = 0; i < count; i += 1) {
      const dx = x[i] - cx;
      const dy = y[i] - cy;
      const len = Math.hypot(dx, dy) || 1;
      const speed = 260 + seed[i] * 620;
      // Outward, with a sideways twist so the burst swirls rather than inflates.
      vx[i] += (dx / len) * speed - (dy / len) * speed * 0.25;
      vy[i] += (dy / len) * speed + (dx / len) * speed * 0.25;
    }
  };

  function draw(): void {
    ctx.clearRect(0, 0, width, height);
    if (alpha < 0.01) {
      frameCount += 1;
      return;
    }
    const size = forming ? SIZE_FORM : SIZE_AMBIENT;
    const half = size / 2;
    for (let batch = 0; batch < 2; batch += 1) {
      ctx.fillStyle = batch === 0 ? accent : muted;
      ctx.globalAlpha = batch === 0 ? alpha : alpha * 0.85;
      for (let i = batch; i < count; i += 2) ctx.fillRect(x[i] - half, y[i] - half, size, size);
    }
    ctx.globalAlpha = 1;
    frameCount += 1;
  }

  const loop = (now: number): void => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) {
      clock.reset();
      return;
    }
    const { dt, t } = clock.tick(now);
    if (dt === 0 || width === 0) return;

    // Which stage, if any, is the swarm gathering on?
    const scrollY = window.scrollY;
    let bestId = "";
    let bestF = 0;
    let best: Stage | null = null;
    for (const stage of stages) {
      const distance = Math.abs(stage.docY - scrollY - height / 2) / height;
      const f = clamp01(1 - (distance - 0.12) / 0.4);
      if (f > bestF) {
        bestF = f;
        bestId = stage.id;
        best = stage;
      }
    }

    if (!forming && best && bestF > FORM_ENTER) {
      forming = true;
      activeId = bestId;
      formed = false;
    } else if (forming && bestF < FORM_LEAVE) {
      forming = false;
      const left = stages.find((stage) => stage.id === activeId);
      explode(left ? left.x : width / 2, left ? left.docY - scrollY : height / 2);
      if (formed) {
        formed = false;
        onFormed(activeId, false);
      }
    } else if (forming && best && bestId !== activeId && bestF > FORM_ENTER) {
      if (formed) onFormed(activeId, false);
      formed = false;
      activeId = bestId;
    }

    const target = forming ? stages.find((stage) => stage.id === activeId) : undefined;
    const centerY = target ? target.docY - scrollY : 0;
    let onTarget = 0;

    for (let i = 0; i < count; i += 1) {
      let dx: number;
      let dy: number;
      let k: number;
      if (target) {
        const tx = target.x + target.shape[i * 2] * target.radius;
        const ty = centerY + target.shape[i * 2 + 1] * target.radius;
        dx = tx - x[i];
        dy = ty - y[i];
        k = 14 + seed[i] * 14;
        if (Math.abs(dx) < FORMED_PX && Math.abs(dy) < FORMED_PX) onTarget += 1;
      } else {
        const wx = Math.sin(t * 0.15 + seed[i] * 17) * WANDER_PX;
        const wy = Math.cos(t * 0.12 + seed[i] * 23) * WANDER_PX;
        dx = homeU[i] * width + wx - x[i];
        dy = homeV[i] * height + wy - y[i];
        k = 0.9;
      }
      // Critically damped spring: c = 2·sqrt(k).
      const c = 2 * Math.sqrt(k);
      vx[i] += dx * k * dt;
      vy[i] += dy * k * dt;
      const drag = Math.exp(-c * dt);
      vx[i] *= drag;
      vy[i] *= drag;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
    }

    if (forming) {
      const ratio = onTarget / count;
      if (!formed && ratio >= FORMED_RATIO) {
        formed = true;
        onFormed(activeId, true);
      } else if (formed && ratio < 0.9) {
        formed = false;
        onFormed(activeId, false);
      }
    }

    // Opacity: faint when dispersed, strong while gathering, gone once the real image is in.
    const targetAlpha = formed ? 0 : forming ? ALPHA_FORM : ALPHA_AMBIENT;
    alpha = damp(alpha, targetAlpha, formed ? 7 : 3, dt);

    if (gate.shouldDraw(dt)) draw();
  };

  const containerObserver = new ResizeObserver(resize);
  containerObserver.observe(container);
  // The page changing height moves the stages: re-read them.
  const bodyObserver = new ResizeObserver(measure);
  bodyObserver.observe(document.body);

  resize();
  raf = requestAnimationFrame(loop);

  return {
    remeasure: measure,
    frames: () => frameCount,
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      containerObserver.disconnect();
      bodyObserver.disconnect();
      ctx.clearRect(0, 0, width, height);
    },
  };
};
