const palette = {
  neutral100: "#f9fafb",
  neutral200: "#f3f4f6",
  neutral300: "#e5e7eb", 
  neutral400: "#d1d5db",
  neutral500: "#9ca3af",
  neutral600: "#6b7280",
  neutral700: "#4b5563",
  neutral800: "#374151",
  neutral900: "#1f2937",

  primary100: "#dbeafe",
  primary200: "#bfdbfe",
  primary300: "#93c5fd", 
  primary400: "#60a5fa",
  primary500: "#3b82f6",
  primary600: "#2563eb",

  secondary100: "#e0e7ff", // indigo-100
  secondary200: "#c7d2fe", // indigo-200
  secondary300: "#a5b4fc", // indigo-300
  secondary400: "#818cf8", // indigo-400
  secondary500: "#6366f1", // indigo-500

  accent100: "#fef3c7", // amber-100
  accent200: "#fde68a", // amber-200
  accent300: "#fcd34d", // amber-300
  accent400: "#fbbf24", // amber-400
  accent500: "#f59e0b", // amber-500

  angry100: "#fee2e2", // red-200 (lighter error bg)
  angry500: "#ef4444", // red-500

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const
