import { ReactNode } from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"

type ConditionValue = "good" | "fair" | "poor"

export interface ConditionAssessmentProps {
  /**
   * Selected value.
   */
  value?: ConditionValue
  /**
   * Called when user selects a different condition.
   */
  onChange?: (value: ConditionValue) => void
  /**
   * Disable interaction.
   */
  disabled?: boolean
  /**
   * Container style override.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const ConditionAssessment = (props: ConditionAssessmentProps) => {
  const { style, value, onChange, disabled } = props
  const { themed, theme } = useAppTheme()

  const Option = ({
    id,
    label,
    accentColor,
    fillColor,
    rightAdornment,
  }: {
    id: ConditionValue
    label: string
    accentColor: string
    fillColor: string
    rightAdornment?: ReactNode
  }) => {
    const selected = value === id
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: !!disabled }}
        onPress={() => onChange?.(id)}
        style={[themed($tile), selected && $tileSelected, selected && { borderColor: accentColor, backgroundColor: fillColor }]}
      >
        <Text size="sm" weight={selected ? "bold" : "medium"} text={label} style={themed(selected ? $tileLabelSelected : $tileLabel)} />
        {rightAdornment}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[themed($container), style]}>
      <Option
        id="good"
        label="Good"
        accentColor={theme.colors.palette.conditionGoodBorder}
        fillColor={theme.colors.palette.conditionGoodBackground}
      />
      <Option
        id="fair"
        label="Fair"
        accentColor={theme.colors.palette.conditionFairBorder}
        fillColor={theme.colors.palette.conditionFairBackground}
      />
      <Option
        id="poor"
        label="Poor"
        accentColor={theme.colors.palette.conditionPoorBorder}
        fillColor={theme.colors.palette.conditionPoorBackground}
      />
    </View>
  )
}

const $container: ThemedStyleArray<ViewStyle> = [
  ({ spacing }) => ({
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.xs, // Consistent spacing between tiles
  }),
]

const $tile: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    // 32% width allows 3 tiles with gap
    width: "32%",
    // Meets accessibility minimum for touch targets (slightly above 44x44)
    minHeight: 48,
    borderRadius: theme.spacing.md, // 16px
    borderWidth: 1,
    borderColor: theme.colors.palette.SecondaryButtonBorder,
    backgroundColor: theme.colors.palette.SecondaryButtonBackground,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xs, // 8px
    paddingHorizontal: theme.spacing.sm, // 12px - better text padding
  }),
]

const $tileSelected: ViewStyle = {
  // Subtle elevation for selected state
  shadowColor: "#000000",
  shadowOpacity: 0.08,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
}

const $tileLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})

const $tileLabelSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})
