import { ReactNode } from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
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
        style={themed([$tile, selected && [$tileSelected, { borderColor: accentColor, backgroundColor: fillColor }]])}
      >
        <Text size="sm" weight="medium" text={label} style={themed($tileLabel)} />
        {rightAdornment}
      </TouchableOpacity>
    )
  }

  return (
    <View style={themed([$container, style])}>
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
  () => ({
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  }),
]

const $tile: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    width: "32%",
    minHeight: 48,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.palette.SecondaryButtonBorder,
    backgroundColor: theme.colors.palette.SecondaryButtonBackground,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  }),
]

const $tileSelected: ViewStyle = {
  shadowColor: "#000000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 6,
}

const $tileLabel: ThemedStyle<ViewStyle> = () => ({})
