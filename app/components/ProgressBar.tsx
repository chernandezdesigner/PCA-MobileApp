import { useEffect } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"
import { radii } from "@/theme/styles"
import { timing } from "@/theme/timing"
import type { ThemedStyle } from "@/theme/types"

export interface ProgressBarProps {
  /**
   * 0-based current step index OR 1-based current count when `total` provided.
   */
  current: number
  /**
   * Total steps for progress calculation.
   */
  total: number
  /**
   * Optional height of the track.
   */
  height?: number
  /**
   * Optional container style.
   */
  style?: StyleProp<ViewStyle>
  /**
   * Accessibility label describing what progress is measured. Defaults to "Form progress".
   */
  accessibilityLabel?: string
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { current, total, height = 8, style, accessibilityLabel = "Form progress" } = props
  const { themed } = useAppTheme()
  const progress = Math.max(0, Math.min(1, total > 0 ? current / total : 0))

  const animatedProgress = useSharedValue(progress)

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: timing.normal })
  }, [progress])

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }))

  return (
    <View
      style={[themed([$track, { height }]), style]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      <Animated.View style={[themed([$fill, { height }]), animatedFillStyle]} />
    </View>
  )
}

const $track: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  backgroundColor: colors.palette.progressBarBackground,
  borderRadius: radii.full,
  overflow: "hidden",
})

const $fill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.progressBarActive,
  borderRadius: radii.full,
})
