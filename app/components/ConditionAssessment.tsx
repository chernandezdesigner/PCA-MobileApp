import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { AnimatedPressable } from "@/components/AnimatedPressable"
import { elevation, radii } from "@/theme/styles"

type ConditionValue = "good" | "fair" | "poor"

export interface ConditionAssessmentProps {
  value?: ConditionValue
  onChange?: (value: ConditionValue) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

const CONDITION_CONFIG: Record<ConditionValue, { label: string; iconName: string }> = {
  good: { label: "Good", iconName: "happy-outline" },
  fair: { label: "Fair", iconName: "remove-circle-outline" },
  poor: { label: "Poor", iconName: "sad-outline" },
}

export const ConditionAssessment = (props: ConditionAssessmentProps) => {
  const { style, value, onChange, disabled } = props
  const { themed, theme } = useAppTheme()

  const Option = ({
    id,
    accentColor,
    fillColor,
  }: {
    id: ConditionValue
    accentColor: string
    fillColor: string
  }) => {
    const selected = value === id
    const config = CONDITION_CONFIG[id]

    return (
      <AnimatedPressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${config.label} condition`}
        accessibilityState={{ selected, disabled: !!disabled }}
        onPress={() => onChange?.(id)}
        style={[
          themed($tile),
          selected && $tileSelected,
          selected && { borderColor: accentColor, backgroundColor: fillColor },
        ]}
      >
        <Ionicons
          name={config.iconName as any}
          size={26}
          color={theme.colors.text}
        />
        <Text
          size="xs"
          weight={selected ? "bold" : "medium"}
          text={config.label}
          style={themed(selected ? $tileLabelSelected : $tileLabel)}
        />
      </AnimatedPressable>
    )
  }

  return (
    <View style={[themed($container), style]}>
      <Option
        id="good"
        accentColor={theme.colors.palette.conditionGoodBorder}
        fillColor={theme.colors.palette.conditionGoodBackground}
      />
      <Option
        id="fair"
        accentColor={theme.colors.palette.conditionFairBorder}
        fillColor={theme.colors.palette.conditionFairBackground}
      />
      <Option
        id="poor"
        accentColor={theme.colors.palette.conditionPoorBorder}
        fillColor={theme.colors.palette.conditionPoorBackground}
      />
    </View>
  )
}

const $container: ThemedStyleArray<ViewStyle> = [
  () => ({
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  }),
]

const $tile: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    width: "31%",
    minHeight: 64,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.palette.SecondaryButtonBorder,
    backgroundColor: theme.colors.palette.SecondaryButtonBackground,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 4,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    flexShrink: 0,
  }),
]

const $tileSelected: ViewStyle = {
  ...elevation.sm,
}

const $tileLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})

const $tileLabelSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})
