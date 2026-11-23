import { HERO_SHAPE, polygonPoints, type ShapePath } from "@/lib/scene/particle-shapes";

/**
 * PLACEHOLDER art: draws the same shape the particles form, so the swarm lands
 * exactly on it. Replace with a real image (and a matching point-map in
 * `particle-shapes.ts`) when artwork is supplied.
 */
export const GeometricShape = ({ paths = HERO_SHAPE }: { paths?: readonly ShapePath[] }) => (
  <svg
    viewBox="-1.08 -1.08 2.16 2.16"
    role="img"
    aria-label="Geometric placeholder artwork"
    className="size-full"
    fill="none"
    strokeLinejoin="round"
  >
    {paths.map((path, index) =>
      path.kind === "circle" ? (
        <circle
          key={index}
          r={path.radius}
          strokeWidth={0.03}
          className={index % 2 === 0 ? "stroke-accent" : "stroke-muted"}
        />
      ) : (
        <polygon
          key={index}
          points={polygonPoints(path)
            .map(([px, py]) => `${px.toFixed(4)},${py.toFixed(4)}`)
            .join(" ")}
          strokeWidth={0.03}
          className={index % 2 === 0 ? "stroke-accent" : "stroke-muted"}
        />
      ),
    )}
    <circle r={0.05} className="fill-accent" />
  </svg>
);
