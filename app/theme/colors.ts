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

  // New Colors Pallette

  gray1:"#F9FAFB",
  gray2:"#F3F4F6",
  gray3:"#E5E7EB",
  gray4:"#D1D5DB",
  gray5:"#6B7280",
  gray6:"#18181B",

  primary1: "#0EA5E9",
  primary2: "#0B7DB1",
  primary3: "#7DD3FC",

  background1: "#F3F4F6",
  headerFooterBackground: "#F9FAFB",
  accordionBackground: "rgba(219, 229, 239, 0.4)",
  checklistBackground: "rgba(250, 250, 250, 0.6)",
  checklistAlternatingBackground: "rgba(229, 231, 235, 0.3)",
  

  TopBarHeaderText: "#000000",

  SectionHeaderText: "#0B7DB1",

  progressBarBackground: "#E5E7EB",
  progressBarActive: "#7DD3FC",

  FormLabelText: "rgba(0, 0, 0, 0.8)",
  FormInputPlaceholderText: "rgba(0, 0, 0, 0.6)",
  FormInputText: "rgba(0, 0, 0, 1)",
  FormInputFill: "#F9FAFB",

  accordionHeaderActiveText: "#000000",
  accordionHeaderInactiveText: "rgba(0, 0, 0, 0.8)",

  conditionGoodBackground: "rgba(167, 243, 208, 0.4)",
  conditionFairBackground: "rgba(250, 204, 21, 0.4)",
  conditionPoorBackground: "rgba(239, 68, 68, 0.4)",

  conditionGoodBorder: "#34d399",
  conditionFairBorder: "#fbbf24",
  conditionPoorBorder: "#ef4444",

  SecondaryButtonActiveBackground: "#18181B",
  SecondaryButtonBackground: "#FAFAFA",
  SecondaryButtonBorder: "#D1D5DB", 


  //Pallette end






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
   * Semantic text roles for easy global adjustments.
   */
  heading: palette.neutral900,
  // Make subheadings (like card section headers) darker per new design
  subheading: palette.gray6,
  label: palette.neutral800,
  helper: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.background1,
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
