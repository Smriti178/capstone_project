/**
 * Shared cover gradient palette used by all dark-theme book components
 * when a real cover image is unavailable.
 * Exported as a single source of truth — do not redefine locally.
 */
export const COVER_COLORS = [
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ef4444,#b91c1c)",
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#10b981,#047857)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#f97316,#c2410c)",
];

/** Returns a deterministic cover gradient for a given index */
export const coverColorAt = (index) => COVER_COLORS[index % COVER_COLORS.length];
