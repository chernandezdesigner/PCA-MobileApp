import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { AnimatedPressable } from "@/components/AnimatedPressable"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { elevation, radii, opacity as opacityScale } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export type PillVariant = "default" | "active" | "success" | "warning" | "error"

export interface PillProps {
  /**
   * The text to display inside the pill
   */
  label: string
  /**
   * Visual variant of the pill
   */
  variant?: PillVariant
  /**
   * Make the pill interactive
   */
  onPress?: () => void
  /**
   * Disable interaction
   */
  disabled?: boolean
  /**
   * Style override for container
   */
  style?: ViewStyle
  /**
   * Style override for text
   */
  textStyle?: TextStyle
}

/**
 * Reusable Pill component for status indicators and badges
 * Meets 44x44 minimum touch target for accessibility when interactive
 */
export const Pill: FC<PillProps> = ({
  label,
  variant = "default",
  onPress,
  disabled,
  style: styleOverride,
  textStyle: textStyleOverride,
}) => {
  const { themed, theme } = useAppTheme()

  const isInteractive = !!onPress && !disabled

  const containerStyle = [
    themed($container),
    themed($variants[variant]),
    isInteractive && themed($interactive),
    disabled && themed($disabled),
    styleOverride,
  ]

  const textStyle = [
    themed($text),
    themed($textVariants[variant]),
    disabled && themed($textDisabled),
    textStyleOverride,
  ]

  if (isInteractive) {
    return (
      <AnimatedPressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        style={containerStyle}
      >
        <Text text={label} style={textStyle} />
      </AnimatedPressable>
    )
  }

  return (
    <View style={containerStyle}>
      <Text text={label} style={textStyle} />
    </View>
  )
}

// Base styles using existing theme system
const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // Fixed 44px height for perfect alignment (iOS/Android guidelines)
  height: 44,
  minWidth: 68,
  paddingHorizontal: spacing.md, // 16px
  paddingVertical: 0, // Remove to maintain fixed height
  borderRadius: radii.full, // Pill shape
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "flex-start",
  flexShrink: 0, // Prevent shrinking
})

const $text: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  lineHeight: 24,
  textAlign: "center",
})

// Interactive state
const $interactive: ThemedStyle<ViewStyle> = () => ({
  ...elevation.xs,
})

// Disabled state
const $disabled: ThemedStyle<ViewStyle> = () => ({
  opacity: opacityScale.disabled,
})

const $textDisabled: ThemedStyle<TextStyle> = () => ({
  opacity: opacityScale.dimmed,
})

// Variant styles using existing color palette
const $variants: Record<PillVariant, ThemedStyle<ViewStyle>> = {
  default: ({ colors }) => ({
    backgroundColor: colors.palette.gray2,
    borderWidth: 1,
    borderColor: colors.palette.gray3,
  }),
  active: ({ colors }) => ({
    backgroundColor: colors.palette.primary100,
    borderWidth: 1,
    borderColor: colors.palette.primary200,
  }),
  success: ({ colors }) => ({
    backgroundColor: colors.palette.conditionGoodBackground,
    borderWidth: 1,
    borderColor: colors.palette.conditionGoodBorder,
  }),
  warning: ({ colors }) => ({
    backgroundColor: colors.palette.conditionFairBackground,
    borderWidth: 1,
    borderColor: colors.palette.conditionFairBorder,
  }),
  error: ({ colors }) => ({
    backgroundColor: colors.palette.conditionPoorBackground,
    borderWidth: 1,
    borderColor: colors.palette.conditionPoorBorder,
  }),
}

const $textVariants: Record<PillVariant, ThemedStyle<TextStyle>> = {
  default: ({ colors }) => ({
    color: colors.palette.gray6,
    fontWeight: "500",
  }),
  active: ({ colors }) => ({
    color: colors.palette.primary2,
    fontWeight: "600",
  }),
  success: ({ colors }) => ({
    color: colors.palette.statusSuccessText,
    fontWeight: "600",
  }),
  warning: ({ colors }) => ({
    color: colors.palette.statusWarningText,
    fontWeight: "600",
  }),
  error: ({ colors }) => ({
    color: colors.palette.statusErrorText,
    fontWeight: "600",
  }),
}

