import { FC } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  Pressable,
  StyleProp,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"
import { Button } from "./Button"
import { Checkbox } from "./Toggle/Checkbox"
import { Pill } from "./Pill"
import type { ChecklistItem } from "./ChecklistCard"

export interface ChecklistFieldProps {
  /**
   * Top label for the checklist, e.g. "Slope Type" or "Signage Type".
   * Uses the same visual treatment as other form labels in accordions.
   */
  label: string

  /**
   * Optional helper / description text shown under the label.
   */
  description?: string

  /**
   * Checklist items.
   */
  items: ChecklistItem[]

  /**
   * Called when a row is toggled.
   */
  onToggle: (id: string, checked: boolean) => void

  /**
   * Whether to show "X of Y selected" under the label.
   */
  showCount?: boolean

  /**
   * Optional bulk actions.
   */
  onSelectAll?: () => void
  onClearAll?: () => void

  /**
   * Alternate row background for better scan-ability.
   */
  showAlternatingRows?: boolean

  /**
   * Show a small Yes/No pill next to the checkbox.
   * Defaults to true to match existing checklist visuals.
   */
  showYesNoPill?: boolean

  /**
   * Optional style overrides.
   */
  containerStyle?: StyleProp<ViewStyle>
  rowStyle?: StyleProp<ViewStyle>
}

/**
 * A simplified, form-friendly checklist component designed to be used
 * inside accordion sections without additional Card chrome or nested scroll.
 *
 * - Aligns with form label typography via `Text` presets.
 * - Uses theme spacing & colors through `useAppTheme`.
 * - Ensures rows and controls meet 44x44 accessibility targets.
 */
export const ChecklistField: FC<ChecklistFieldProps> = (props) => {
  const {
    label,
    description,
    items,
    onToggle,
    showCount = false,
    onSelectAll,
    onClearAll,
    showAlternatingRows = true,
    showYesNoPill = true,
    containerStyle,
    rowStyle,
  } = props

  const { themed } = useAppTheme()

  const selectedCount = items.reduce((acc, it) => acc + (it.checked ? 1 : 0), 0)

  const hasBulkActions = !!onSelectAll || !!onClearAll

  return (
    <View style={[themed($container), containerStyle]}>
      <View style={themed($headerRow)}>
        <View style={themed($headerTextBlock)}>
          <Text preset="formLabel" text={label} />
          {!!description && (
            <Text preset="formHelper" text={description} />
          )}
          {showCount && items.length > 0 && selectedCount > 0 && (
            <Text
              size="xs"
              weight="normal"
              style={themed($countText)}
              text={`${selectedCount} of ${items.length} selected`}
            />
          )}
        </View>

        {hasBulkActions && (
          <View style={themed($bulkActionsRow)}>
            {!!onSelectAll && (
              <Button
                text="Select All"
                onPress={onSelectAll}
                style={themed($bulkActionButton)}
                textStyle={themed($bulkActionButtonText)}
              />
            )}
            {!!onClearAll && (
              <Button
                text="Clear All"
                onPress={onClearAll}
                style={themed($bulkActionButton)}
                textStyle={themed($bulkActionButtonText)}
              />
            )}
          </View>
        )}
      </View>

      <View style={themed($list)}>
        {items.map((item, index) => {
          const isAlt = showAlternatingRows && index % 2 === 1
          const isChecked = item.checked

          return (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item.id, !isChecked)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                themed($rowBase),
                isAlt && themed($rowAlt),
                pressed && themed($rowPressed),
                rowStyle,
              ]}
            >
              <Text
                size="sm"
                weight="medium"
                style={themed($itemLabel)}
                text={item.label}
              />

              <View style={themed($controlsRow)}>
                <View style={themed($checkboxWrapper)}>
                  <Checkbox
                    value={isChecked}
                    onValueChange={(v) => onToggle(item.id, v)}
                  />
                </View>

                {showYesNoPill && (
                  <Pill
                    label={isChecked ? "Yes" : "No"}
                    variant={isChecked ? "active" : "default"}
                  />
                )}
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

// Styles

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $headerRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: spacing.sm,
})

const $headerTextBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  gap: spacing.xxs,
})

const $countText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray5,
  opacity: 0.8,
})

const $bulkActionsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  flexShrink: 0,
})

// Small, text-like buttons for bulk actions
const $bulkActionButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  minHeight: 44,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  backgroundColor: colors.palette.SecondaryButtonBackground,
  borderColor: colors.palette.SecondaryButtonBorder,
  borderWidth: 1,
  borderRadius: spacing.xs,
})

const $bulkActionButtonText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
})

const $list: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  borderRadius: spacing.xs,
  overflow: "hidden",
})

const $rowBase: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  minHeight: 56, // 44px minimum touch target + padding
  backgroundColor: colors.palette.checklistBackground,
})

const $rowAlt: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.checklistAlternatingBackground,
})

const $rowPressed: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.gray2,
})

const $itemLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  flex: 1,
  marginRight: 12,
  color: colors.palette.gray6,
})

const $controlsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  flexShrink: 0,
})

const $checkboxWrapper: ThemedStyle<ViewStyle> = () => ({
  height: 44,
  width: 44,
  alignItems: "center",
  justifyContent: "center",
})


