interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** The small label above a heading — an accent dot and a tracked caption. */
export const Eyebrow = ({ children, className = "" }: EyebrowProps) => (
  <p
    className={`flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted ${className}`}
  >
    <span aria-hidden className="size-2 rounded-pill bg-accent shadow-glow" />
    {children}
  </p>
);
