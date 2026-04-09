import { ViewStyle } from "react-native"

import { spacing } from "./spacing"

/* ── Design Token Scales ─────────────────────────────────── */

/** Elevation / shadow scale */
export const elevation = {
  none: { shadowOpacity: 0, elevation: 0 } as ViewStyle,
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  } as ViewStyle,
} as const

/** Border-radius scale */
export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const

/** Opacity scale */
export const opacity = {
  disabled: 0.4,
  dimmed: 0.6,
  subtle: 0.8,
  full: 1,
} as const

/** Z-index scale */
export const zIndex = {
  base: 0,
  header: 2,
  dropdown: 100,
  overlay: 200,
  modal: 300,
  toast: 400,
} as const

/* ── Shared Utility Styles ───────────────────────────────── */
export const $styles = {
  row: { flexDirection: "row" } as ViewStyle,
  flex1: { flex: 1 } as ViewStyle,
  flexWrap: { flexWrap: "wrap" } as ViewStyle,

  container: {
    paddingTop: spacing.lg + spacing.xl,
    paddingHorizontal: spacing.lg,
  } as ViewStyle,

  toggleInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  } as ViewStyle,
}

/** Shared form screen layout constants */
export const $formScreen: ViewStyle = {
  flex: 1,
}

export const $stickyHeader: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

export const $stickyFooter: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

export const $formContent: ViewStyle = {
  padding: spacing.md,
  paddingTop: 88, // 72 (header height) + 16 (spacing)
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: spacing.md,
}

export const $fieldRow: ViewStyle = {
  flexDirection: "row",
  gap: spacing.sm,
}
