import { ReactNode } from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"

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
    icon,
    label,
    accentColor,
    rightAdornment,
  }: {
    id: ConditionValue
    icon?: ReactNode
    label: string
    accentColor: string
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
        style={themed([$tile, selected && [$tileSelected, { borderColor: accentColor }]])}
      >
        <View style={themed([$iconWrap, selected && { backgroundColor: accentColor }])}>
          {icon}
        </View>
        <Text size="xs" weight="medium" text={label} style={themed($tileLabel)} />
        {rightAdornment}
      </TouchableOpacity>
    )
  }

  return (
    <View style={themed([$container, style])}>
      <Option
        id="good"
        icon={<Icon icon="check" size={16} color={theme.colors.palette.neutral100} />}
        label="Excellent"
        accentColor={theme.colors.palette.primary500}
      />
      <Option
        id="fair"
        // using emoji to avoid adding new assets for a warning triangle
        icon={<Text size="xs">⚠️</Text>}
        label="Fair"
        accentColor={theme.colors.palette.accent500}
      />
      <Option
        id="poor"
        icon={<Icon icon="x" size={16} color={theme.colors.palette.neutral100} />}
        label="Poor"
        accentColor={theme.colors.palette.angry500}
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
    minHeight: 88,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(250,250,250,0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  }),
]

const $tileSelected: ViewStyle = {
  shadowColor: "#000000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 6,
}

const $iconWrap: ThemedStyle<ViewStyle> = (theme) => ({
  width: 28,
  height: 28,
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.palette.neutral300,
  marginBottom: theme.spacing.xs,
})

const $tileLabel: ThemedStyle<ViewStyle> = () => ({})
