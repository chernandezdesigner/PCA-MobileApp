import { FC } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

// ============================================
// CONDITION CONFIG
// ============================================

const CONDITIONS = [
  {
    key: "commercialMoistureLessThan10SF",
    label: "Moisture Damage < 10 SF",
    updateAction: "updateCommercialMoistureLessThan10SF",
  },
  {
    key: "commercialMoistureGreaterOrEqual10SF",
    label: "Moisture Damage \u2265 10 SF",
    updateAction: "updateCommercialMoistureGreaterOrEqual10SF",
  },
  {
    key: "commercialMoldLessThan10SF",
    label: "Mold < 10 SF",
    updateAction: "updateCommercialMoldLessThan10SF",
  },
  {
    key: "commercialMoldGreaterOrEqual10SF",
    label: "Mold \u2265 10 SF",
    updateAction: "updateCommercialMoldGreaterOrEqual10SF",
  },
] as const

// ============================================
// MAIN SCREEN COMPONENT
// ============================================

export const InteriorConditionsStep3Screen: FC = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.interiorConditions?.step3

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("InteriorConditionsStep4" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("InteriorConditionsStep2" as never, { transition: "slide_from_left" } as never)
  }

  const isNA = store?.NotApplicable ?? false

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Interior Conditions"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>

      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Mold & Moisture" style={themed($titleStyle)} />
          <ProgressBar current={3} total={4} />
        </View>

        {/* Top-level N/A toggle */}
        <View style={themed($paddedBlock)}>
          <TouchableOpacity
            style={themed($naToggle(isNA))}
            onPress={() => store?.updateTopLevel({ NotApplicable: !isNA })}
          >
            <Text
              text="Not Applicable"
              style={themed($naToggleText(isNA))}
            />
          </TouchableOpacity>
        </View>

        {!isNA && (
          <>
            {/* Condition Cards */}
            {CONDITIONS.map((cfg) => {
              const condition = store?.[cfg.key]
              const updateFn = store?.[cfg.updateAction] as
                | ((data: { hasCondition?: boolean; sizeSF?: number; location?: string }) => void)
                | undefined

              return (
                <View key={cfg.key} style={themed($conditionCard)}>
                  <Checkbox
                    label={cfg.label}
                    value={condition?.hasCondition ?? false}
                    onValueChange={(val) => updateFn?.({ hasCondition: val })}
                    labelStyle={themed($checkboxLabel)}
                  />

                  {condition?.hasCondition && (
                    <View style={$conditionFields}>
                      <TextField
                        label="Size (SF)"
                        placeholder="Enter square footage"
                        keyboardType="numeric"
                        value={condition.sizeSF ? condition.sizeSF.toString() : ""}
                        onChangeText={(val) =>
                          updateFn?.({ sizeSF: val ? parseFloat(val) : 0 })
                        }
                      />
                      <TextField
                        label="Location"
                        placeholder="Enter location"
                        value={condition.location ?? ""}
                        onChangeText={(val) => updateFn?.({ location: val })}
                      />
                    </View>
                  )}
                </View>
              )
            })}

            {/* Comments */}
            <View style={themed($commentsBlock)}>
              <TextField
                label="Comments"
                placeholder="Additional notes about mold & moisture conditions"
                value={store?.comments ?? ""}
                onChangeText={(val) => store?.updateComments(val)}
                multiline
                minRows={2}
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={$stickyFooter}>
        <StickyFooterNav onBack={onBack} onNext={onNext} showCamera={true} />
      </View>
    </Screen>
  )
})

// ============================================
// STYLES
// ============================================

const $root: ViewStyle = {
  flex: 1,
}

const $screenInner: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  paddingTop: 88,
  paddingBottom: 96,
  gap: 0,
}

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $stickyHeader: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

const $stickyFooter: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

const $paddedBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 16,
  gap: 8,
}

const $conditionFields: ViewStyle = {
  gap: 12,
  marginTop: 12,
}

const $commentsBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 24,
  gap: 8,
}

const $titleStyle: ThemedStyle<any> = ({ colors }) => ({
  color: colors.palette.primary2 as any,
  fontSize: 24,
  fontFamily: undefined,
})

const $conditionCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  marginHorizontal: spacing.md,
  marginBottom: spacing.sm,
  padding: spacing.md,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
})

const $checkboxLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.text,
})

const $naToggle = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 6,
  backgroundColor: isActive ? colors.palette.primary2 : colors.palette.neutral300,
  alignSelf: "flex-start",
})

const $naToggleText = (isActive: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isActive ? colors.palette.neutral100 : colors.text,
  fontSize: 14,
  fontWeight: "600",
})
