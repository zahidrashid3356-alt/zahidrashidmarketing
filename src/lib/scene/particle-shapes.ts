/**
 * Geometry the particle swarm can form, as plain data. The same data draws the
 * placeholder art (`GeometricShape`) and generates the particle targets, so
 * the swarm lands exactly on the image that replaces it. Coordinates are
 * normalised: the shape fits the square -1..1 on both axes.
 *
 * When real artwork replaces the placeholder, add a point-map generated from
 * the image (sample its alpha) under a new id; nothing else changes.
 */

export type ShapePath =
  | { kind: "polygon"; sides: number; radius: number; rotation: number }
  | { kind: "circle"; radius: number };

const UP = -Math.PI / 2;

/** A hexagon, a ring and a triangle, nested. */
export const HERO_SHAPE: readonly ShapePath[] = [
  { kind: "polygon", sides: 6, radius: 1, rotation: UP },
  { kind: "circle", radius: 0.66 },
  { kind: "polygon", sides: 3, radius: 0.38, rotation: UP },
];

/** Shapes by stage id (`data-particle-stage`); an unknown id gets the hero's. */
export const SHAPES: Readonly<Record<string, readonly ShapePath[]>> = {
  hero: HERO_SHAPE,
  work: [
    { kind: "circle", radius: 1 },
    { kind: "circle", radius: 0.62 },
    { kind: "polygon", sides: 4, radius: 0.32, rotation: Math.PI / 4 },
  ],
};

export const shapeFor = (id: string): readonly ShapePath[] => SHAPES[id] ?? HERO_SHAPE;

export const polygonPoints = (path: Extract<ShapePath, { kind: "polygon" }>): [number, number][] =>
  Array.from({ length: path.sides }, (_, index) => {
    const angle = path.rotation + (index * Math.PI * 2) / path.sides;
    return [Math.cos(angle) * path.radius, Math.sin(angle) * path.radius];
  });

const perimeter = (path: ShapePath): number =>
  path.kind === "circle"
    ? 2 * Math.PI * path.radius
    : path.sides * 2 * path.radius * Math.sin(Math.PI / path.sides);

/**
 * `count` points spread evenly along the outlines, in proportion to each
 * outline's length — x, y pairs in one flat array. Deterministic.
 */
export const sampleShape = (paths: readonly ShapePath[], count: number): Float32Array => {
  const lengths = paths.map(perimeter);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const out = new Float32Array(count * 2);
  let written = 0;

  paths.forEach((path, pathIndex) => {
    const isLast = pathIndex === paths.length - 1;
    const share = isLast ? count - written : Math.round((lengths[pathIndex] / total) * count);
    for (let i = 0; i < share && written < count; i += 1) {
      const t = i / share;
      let x: number;
      let y: number;
      if (path.kind === "circle") {
        const angle = t * Math.PI * 2;
        x = Math.cos(angle) * path.radius;
        y = Math.sin(angle) * path.radius;
      } else {
        const vertices = polygonPoints(path);
        const along = t * path.sides;
        const edge = Math.floor(along) % path.sides;
        const local = along - Math.floor(along);
        const a = vertices[edge];
        const b = vertices[(edge + 1) % path.sides];
        x = a[0] + (b[0] - a[0]) * local;
        y = a[1] + (b[1] - a[1]) * local;
      }
      out[written * 2] = x;
      out[written * 2 + 1] = y;
      written += 1;
    }
  });
  return out;
};
