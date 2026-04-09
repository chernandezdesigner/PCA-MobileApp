export const timing = {
  /** Near-instant feedback (e.g. press states) */
  instant: 100,
  /** Quick transitions (e.g. toggles, fades) */
  quick: 200,
  /** Standard animations (e.g. expand/collapse) */
  normal: 300,
  /** Slower, deliberate animations (e.g. page transitions) */
  slow: 450,

  /** Default spring config — smooth, no overshoot */
  spring: { damping: 15, stiffness: 150, mass: 1 },
  /** Bouncy spring — playful feel */
  springBouncy: { damping: 12, stiffness: 180, mass: 0.8 },
} as const
