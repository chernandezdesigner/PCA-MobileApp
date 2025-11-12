import { FC, useState } from "react"
import { View, ViewStyle, TextStyle, ScrollView } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { TextField } from "@/components/TextField"
import { Pill } from "@/components/Pill"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Icon } from "@/components/Icon"

export type ChecklistItem = { id: string; label: string; checked: boolean; comments?: string }

type Props = {
  title: string
  items: ChecklistItem[]
  showComments?: boolean
  onToggle: (id: string, checked: boolean) => void
  onChangeComment?: (id: string, text: string) => void
  onSelectAll?: () => void
  onClearAll?: () => void
  onOpen?: () => void
  openButtonText?: string
}

export const ChecklistCard: FC<Props> = (props) => {
  const { title, items, showComments = false, onToggle, onChangeComment, onSelectAll, onClearAll, onOpen, openButtonText = "Open Checklist" } = props
  const { themed } = useAppTheme()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const selectedCount = items.reduce((acc, it) => acc + (it.checked ? 1 : 0), 0)

  function toggleRow(id: string) {
    setExpanded((p) => ({ ...p, [id]: !p[id] }))
  }

  return (
    <Card
      HeadingComponent={
        <View style={themed($headerRow)}>
          <View>
            <Text preset="subheading" text={title} />
            <Text size="xs" weight="normal" style={themed($countLight)} text={`${selectedCount} of ${items.length} selected`} />
          </View>
          {(onSelectAll || onClearAll) ? (
            <View style={themed($row)}>
              {!!onSelectAll && <Button text="Select All" onPress={onSelectAll} style={themed($headerButton)} textStyle={$headerButtonText} />}
              {!!onClearAll && <Button text="Clear All" onPress={onClearAll} style={themed($headerButton)} textStyle={$headerButtonText} />}
            </View>
          ) : (
            !!onOpen && <Button text={openButtonText} onPress={onOpen} style={themed($headerButton)} textStyle={$headerButtonText} />
          )}
        </View>
      }
      ContentComponent={
        <View style={$sectionContent}>
          <ScrollView style={themed($container)} contentContainerStyle={$contentPadding} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
            {items.map((item, index) => (
              <View key={item.id}>
                {index > 0 && <View style={themed($divider)} />}
                <View style={[$rowWrapper, index % 2 === 1 ? themed($altRow) : undefined]}>
                  <View style={themed($rowBetween)}>
                    <Text text={item.label} size="sm" weight="medium" style={themed($itemLabel)} />
                    <View style={themed($controlsRow)}>
                      <View style={themed($checkboxWrapper)}>
                        <Checkbox value={item.checked} onValueChange={(v) => onToggle(item.id, v)} />
                      </View>
                      <Pill 
                        label={item.checked ? "Yes" : "No"} 
                        variant={item.checked ? "active" : "default"}
                      />
                      {showComments && (
                        <Button
                          onPress={() => toggleRow(item.id)}
                          style={themed($commentBtn(!!expanded[item.id]))}
                          LeftAccessory={({ style }) => (
                            <Icon icon="more" size={20} containerStyle={style} />
                          )}
                          accessibilityLabel="Toggle comment"
                        />
                      )}
                    </View>
                  </View>
                  {showComments && expanded[item.id] && (
                    <View style={themed($commentContainer)}>
                      <TextField
                        placeholder="Add comments..."
                        multiline
                        value={item.comments ?? ""}
                        onChangeText={(t) => onChangeComment?.(item.id, t)}
                        returnKeyType="done"
                        blurOnSubmit={true}
                      />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      }
    />
  )
}

// Styles using theme system for consistency
const $row: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs, // 8px
})

const $rowBetween: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md, // 16px
  paddingVertical: spacing.sm, // 12px for better spacing
  minHeight: 60, // Increased to accommodate 44px elements comfortably
})

const $controlsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs, // 8px between controls
  flexShrink: 0, // Don't shrink controls
  height: 44, // Fixed height for all controls
})

const $checkboxWrapper: ThemedStyle<ViewStyle> = () => ({
  // Wrapper to center checkbox vertically with other 44px elements
  height: 44, // Fixed height instead of minHeight
  width: 44, // Fixed width for consistent sizing
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
})

const $headerRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: spacing.xs, // 8px
})

const $sectionContent: ViewStyle = {
  marginTop: 16,
}

const $countLight: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.7,
  color: colors.palette.gray5,
})

const $contentPadding: ViewStyle = {
  paddingVertical: 8,
}

const $rowWrapper: ViewStyle = {}

const $commentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md, // 16px
  paddingBottom: spacing.sm, // 12px
})

const $itemLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
  flex: 1,
  marginRight: 12,
  // Ensure text aligns with the row height
  lineHeight: 24, // Match Text component sm size lineHeight
  // Vertically center text in the row
  textAlignVertical: "center",
})

// Mobile-optimized button sizes - now meets 44x44 accessibility minimum
const $headerButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minHeight: 44, // Increased from 36 for accessibility
  paddingHorizontal: spacing.md, // 16px (up from 12)
  paddingVertical: spacing.xs, // 8px (up from 6)
})

const $headerButtonText: TextStyle = {
  fontSize: 14, // Slightly increased from 13 for better readability
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  maxHeight: 240,
  backgroundColor: colors.palette.checklistBackground,
  borderRadius: spacing.xs, // 8px from theme
  borderWidth: 1,
  borderColor: colors.palette.gray3,
})

const $altRow: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.checklistAlternatingBackground,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.palette.gray3, // Use theme color instead of hardcoded
})

// Comment button - sized for visual balance with pill
const $commentBtn = (active: boolean): ThemedStyle<ViewStyle> => ({ colors, spacing }) => ({
  height: 40, // Slightly smaller for better visual balance with pill
  minHeight: 40, // Override Button's base minHeight of 56
  maxHeight: 40, // Ensure it can't grow larger
  width: 48, // Narrower for better proportion
  minWidth: 48, // Override Button's base minWidth
  padding: 0, // Remove all padding
  paddingVertical: 0, // Override Button's base paddingVertical
  paddingHorizontal: 0, // Override Button's base paddingHorizontal
  margin: 0, // Remove any margin
  backgroundColor: active ? colors.palette.secondary100 : colors.palette.SecondaryButtonBackground,
  borderWidth: 1,
  borderColor: active ? colors.palette.secondary200 : colors.palette.SecondaryButtonBorder,
  borderRadius: spacing.xs, // 8px rounded corners to match pill style
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
})

