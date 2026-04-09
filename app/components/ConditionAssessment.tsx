import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
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

const CONDITION_CONFIG: Record<ConditionValue, { label: string; face: string }> = {
  good: { label: "Good", face: "\u{1F60A}" },
  fair: { label: "Fair", face: "\u{1F610}" },
  poor: { label: "Poor", face: "\u{2639}\u{FE0F}" },
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
        <Text
          text={config.face}
          style={[
            $faceIcon,
            !selected && { opacity: 0.4 },
          ]}
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

const $faceIcon: TextStyle = {
  fontSize: 22,
  lineHeight: 26,
}

const $tileLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})

const $tileLabelSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})
