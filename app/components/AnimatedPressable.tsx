import { ReactNode } from "react"
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { timing } from "@/theme/timing"

const ReanimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface AnimatedPressableProps extends Omit<PressableProps, "style" | "children"> {
  /** Scale when pressed (default 0.97) */
  scaleDown?: number
  /** Opacity when pressed (default 0.85) */
  opacityDown?: number
  /** Style applied to the animated pressable */
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

/**
 * Drop-in Reanimated-powered pressable with scale + opacity spring feedback.
 * Use instead of TouchableOpacity / Pressable for interactive elements.
 */
export function AnimatedPressable(props: AnimatedPressableProps) {
  const {
    scaleDown = 0.97,
    opacityDown = 0.85,
    style,
    children,
    disabled,
    onPressIn,
    onPressOut,
    ...rest
  } = props

  const isPressed = useSharedValue(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isPressed.value ? scaleDown : 1, timing.spring) },
    ],
    opacity: withSpring(isPressed.value ? opacityDown : 1, timing.spring),
  }))

  return (
    <ReanimatedPressable
      onPressIn={(e) => {
        if (!disabled) isPressed.value = true
        onPressIn?.(e)
      }}
      onPressOut={(e) => {
        isPressed.value = false
        onPressOut?.(e)
      }}
      disabled={disabled}
      accessibilityRole={rest.accessibilityRole ?? "button"}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </ReanimatedPressable>
  )
}
