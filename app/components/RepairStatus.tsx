import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
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
        style={themed([$tile, selected && $tileSelected])}
      >
        <Text weight="medium" text={code} />
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
  () => ({
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  }),
]

const $tile: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    width: "32%",
    minHeight: 64,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "rgba(250,250,250,0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  }),
]

const $tileSelected: ViewStyle = {
  borderColor: "#6366f1",
  shadowColor: "#000000",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 6,
}
