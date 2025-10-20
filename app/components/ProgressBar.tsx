import { StyleProp, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
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
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { current, total, height = 8, style } = props
  const { themed } = useAppTheme()
  const progress = Math.max(0, Math.min(1, total > 0 ? current / total : 0))

  return (
    <View style={[themed([$track, { height }]), style]}> 
      <View style={themed([$fill, { width: `${progress * 100}%`, height }])} />
    </View>
  )
}

const $track: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  backgroundColor: colors.palette.progressBarBackground,
  borderRadius: 999,
  overflow: "hidden",
})

const $fill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.progressBarActive,
  borderRadius: 999,
})
