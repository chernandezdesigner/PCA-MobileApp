import { useWindowDimensions } from "react-native"

const WIDE_BREAKPOINT = 768

/**
 * Returns responsive layout info based on window width.
 * - `isWide`: true when width >= 768px (tablet/desktop)
 * - `contentMaxWidth`: suggested max content width for wide screens
 */
export function useResponsiveLayout() {
  const { width } = useWindowDimensions()
  const isWide = width >= WIDE_BREAKPOINT
  return {
    isWide,
    contentMaxWidth: isWide ? 720 : undefined,
  }
}
