interface SectionProps {
  /** Anchor target — the nav links to `#id`. */
  id: string;
  /** The section's accessible name (a `<section>` landmark needs one). */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * One full-width page section: the gutter, the vertical rhythm, and a
 * max-width column. A Server Component — the content inside it animates, the
 * frame doesn't.
 */
export const Section = ({ id, label, children, className = "" }: SectionProps) => (
  <section
    id={id}
    aria-label={label}
    className={`relative w-full px-gutter py-section ${className}`}
  >
    <div className="mx-auto w-full max-w-page">{children}</div>
  </section>
);
