import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"

type RepairCode = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"

export interface RepairStatusProps {
  value?: RepairCode
  onChange?: (value: RepairCode) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const RepairStatus = (props: RepairStatusProps) => {
  const { style, value, onChange, disabled } = props
  const { themed, theme } = useAppTheme()

  function Tile({ code, label }: { code: RepairCode; label: string }) {
    const selected = value === code
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: !!disabled }}
        onPress={() => onChange?.(code)}
        style={themed([
          $tile,
          selected && [
            $tileSelected,
            {
              backgroundColor: theme.colors.palette.SecondaryButtonActiveBackground,
              borderColor: theme.colors.palette.SecondaryButtonActiveBackground,
            },
          ],
        ])}
      >
        <Text weight={selected ? "bold" : "medium"} text={code} style={themed(selected ? $tileTextSelected : $tileText)} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={themed([$grid, style])}>
      <Tile code="IR" label="Immediate Repair" />
      <Tile code="ST" label="Short Term" />
      <Tile code="RR" label="Replace/Repair" />
      <Tile code="RM" label="Routine Maintenance" />
      <Tile code="INV" label="Investigate" />
      <Tile code="NA" label="Not Applicable" />
    </View>
  )
}

const $grid: ThemedStyleArray<ViewStyle> = [
  ({ spacing }) => ({
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping for 2 rows of 3
    justifyContent: "space-between", // Space items evenly
    rowGap: spacing.sm, // 12px gap between rows
  }),
]

const $tile: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    // 31% width with space-between creates proper gaps for 3 columns
    width: "31%",
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
    flexShrink: 0, // Prevent shrinking
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

const $tileText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})

const $tileTextSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
