import { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { ListWithFadingDot } from "@/components/ListWithFadingDot"
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
        <View style={$headerRow}>
          <View>
            <Text preset="subheading" text={title} />
            <Text size="xs" weight="normal" style={$countLight} text={`${selectedCount} of ${items.length} selected`} />
          </View>
          {(onSelectAll || onClearAll) ? (
            <View style={$row}>
              {!!onSelectAll && <Button text="Select All" onPress={onSelectAll} />}
              {!!onClearAll && <Button preset="reversed" text="Clear All" onPress={onClearAll} />}
            </View>
          ) : (
            !!onOpen && <Button text={openButtonText} onPress={onOpen} />
          )}
        </View>
      }
      ContentComponent={
        <View style={$sectionContent}>
          <View style={themed($container)}>
            <ListWithFadingDot
              data={items}
              keyExtractor={(it: ChecklistItem) => it.id}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />}
              contentContainerStyle={$contentPadding}
              renderItem={({ item, index }: { item: ChecklistItem; index: number }) => (
                <View style={[$rowWrapper, index % 2 === 1 ? themed($altRow) : undefined]}>
                  <View style={$rowBetween}>
                    <Text text={item.label} />
                    <View style={$row}>
                      <Checkbox value={item.checked} onValueChange={(v) => onToggle(item.id, v)} />
                      <View style={$pill(item.checked)}>
                        <Text text={item.checked ? "Yes" : "No"} />
                      </View>
                      {showComments && (
                        <Button
                          onPress={() => toggleRow(item.id)}
                          style={themed($commentBtn(!!expanded[item.id]))}
                          LeftAccessory={({ style }) => (
                            <Icon icon="more" size={16} containerStyle={style} />
                          )}
                          accessibilityLabel="Toggle comment"
                        />
                      )}
                    </View>
                  </View>
                  {showComments && expanded[item.id] && (
                    <View style={$commentContainer}>
                      <TextField
                        placeholder="Add comments..."
                        multiline
                        value={item.comments ?? ""}
                        onChangeText={(t) => onChangeComment?.(item.id, t)}
                      />
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      }
    />
  )
}

const $row: ViewStyle = { flexDirection: "row", alignItems: "center", gap: 8 }
const $rowBetween: ViewStyle = { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 }
const $headerRow: ViewStyle = { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }
const $sectionContent: ViewStyle = { gap: 12, marginTop: 16 }
const $countLight: ViewStyle = { opacity: 0.7 }
const $contentPadding: ViewStyle = { paddingVertical: 8 }
const $rowWrapper: ViewStyle = {}
const $commentContainer: ViewStyle = { paddingHorizontal: 16, paddingBottom: 12 }
const $pill = (on: boolean): ViewStyle => ({ height: 32, minWidth: 64, paddingHorizontal: 12, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: on ? "#dbeafe" : "#e5e7eb" })
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({ maxHeight: 240, backgroundColor: colors.palette.checklistBackground, borderRadius: 8, borderWidth: 1, borderColor: colors.palette.gray3 })
const $altRow: ThemedStyle<any> = ({ colors }) => ({ backgroundColor: colors.palette.checklistAlternatingBackground })
const $commentBtn = (active: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  minHeight: 32,
  minWidth: 32,
  paddingHorizontal: 10,
  backgroundColor: active ? colors.palette.secondary100 : colors.palette.SecondaryButtonBackground,
  borderWidth: 1,
  borderColor: active ? colors.palette.secondary200 : colors.palette.SecondaryButtonBorder,
})


