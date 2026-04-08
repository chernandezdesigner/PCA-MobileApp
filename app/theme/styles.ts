import { ViewStyle } from "react-native"

import { spacing } from "./spacing"

/* Use this file to define styles that are used in multiple places in your app. */
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
