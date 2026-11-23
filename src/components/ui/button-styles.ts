/**
 * Class strings for the site's two button looks — shared by every `<a>` and
 * `<button>` that is dressed as one, so there is exactly one primary and one
 * secondary. Colour changes only (ADR-0014): the hover is a CSS transition with
 * token-backed timing, never a spring.
 */
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors duration-[var(--duration-fast)] ease-entrance";

const SIZES: Record<ButtonSize, string> = {
  md: "px-7 py-3.5 text-base",
  sm: "px-5 py-2.5 text-sm",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary:
    "border border-glass-line bg-glass text-foreground hover:border-accent hover:text-accent",
};

export const buttonClass = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string => `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`;
