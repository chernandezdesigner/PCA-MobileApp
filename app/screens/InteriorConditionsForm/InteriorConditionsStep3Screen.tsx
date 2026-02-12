import { FC } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

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

  const onBack = () => navigation.goBack()

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
        <View style={themed($naRow)}>
          <Text preset="formLabel" text="Not Applicable" />
          <Checkbox
            value={isNA}
            onValueChange={(val) => store?.updateTopLevel({ NotApplicable: val })}
          />
        </View>

        {!isNA && (
          <>
            {/* Condition 1: Moisture Damage < 10 SF */}
            <View style={themed($conditionCard)}>
              <Text preset="bold" text="Moisture Damage < 10 SF" style={themed($conditionTitle)} />
              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Has Condition" />
                <Checkbox
                  value={store?.commercialMoistureLessThan10SF.hasCondition ?? false}
                  onValueChange={(val) =>
                    store?.updateCommercialMoistureLessThan10SF({ hasCondition: val })
                  }
                />
              </View>
              {store?.commercialMoistureLessThan10SF.hasCondition && (
                <View style={$fieldGroup}>
                  <TextField
                    label="Size (SF)"
                    placeholder="Enter square footage"
                    keyboardType="numeric"
                    value={
                      store?.commercialMoistureLessThan10SF.sizeSF
                        ? store.commercialMoistureLessThan10SF.sizeSF.toString()
                        : ""
                    }
                    onChangeText={(val) =>
                      store?.updateCommercialMoistureLessThan10SF({
                        sizeSF: val ? parseFloat(val) : 0,
                      })
                    }
                  />
                  <TextField
                    label="Location"
                    placeholder="Enter location"
                    value={store?.commercialMoistureLessThan10SF.location ?? ""}
                    onChangeText={(val) =>
                      store?.updateCommercialMoistureLessThan10SF({ location: val })
                    }
                  />
                </View>
              )}
            </View>

            {/* Condition 2: Moisture Damage >= 10 SF */}
            <View style={themed($conditionCard)}>
              <Text preset="bold" text="Moisture Damage >= 10 SF" style={themed($conditionTitle)} />
              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Has Condition" />
                <Checkbox
                  value={store?.commercialMoistureGreaterOrEqual10SF.hasCondition ?? false}
                  onValueChange={(val) =>
                    store?.updateCommercialMoistureGreaterOrEqual10SF({ hasCondition: val })
                  }
                />
              </View>
              {store?.commercialMoistureGreaterOrEqual10SF.hasCondition && (
                <View style={$fieldGroup}>
                  <TextField
                    label="Size (SF)"
                    placeholder="Enter square footage"
                    keyboardType="numeric"
                    value={
                      store?.commercialMoistureGreaterOrEqual10SF.sizeSF
                        ? store.commercialMoistureGreaterOrEqual10SF.sizeSF.toString()
                        : ""
                    }
                    onChangeText={(val) =>
                      store?.updateCommercialMoistureGreaterOrEqual10SF({
                        sizeSF: val ? parseFloat(val) : 0,
                      })
                    }
                  />
                  <TextField
                    label="Location"
                    placeholder="Enter location"
                    value={store?.commercialMoistureGreaterOrEqual10SF.location ?? ""}
                    onChangeText={(val) =>
                      store?.updateCommercialMoistureGreaterOrEqual10SF({ location: val })
                    }
                  />
                </View>
              )}
            </View>

            {/* Condition 3: Mold < 10 SF */}
            <View style={themed($conditionCard)}>
              <Text preset="bold" text="Mold < 10 SF" style={themed($conditionTitle)} />
              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Has Condition" />
                <Checkbox
                  value={store?.commercialMoldLessThan10SF.hasCondition ?? false}
                  onValueChange={(val) =>
                    store?.updateCommercialMoldLessThan10SF({ hasCondition: val })
                  }
                />
              </View>
              {store?.commercialMoldLessThan10SF.hasCondition && (
                <View style={$fieldGroup}>
                  <TextField
                    label="Size (SF)"
                    placeholder="Enter square footage"
                    keyboardType="numeric"
                    value={
                      store?.commercialMoldLessThan10SF.sizeSF
                        ? store.commercialMoldLessThan10SF.sizeSF.toString()
                        : ""
                    }
                    onChangeText={(val) =>
                      store?.updateCommercialMoldLessThan10SF({
                        sizeSF: val ? parseFloat(val) : 0,
                      })
                    }
                  />
                  <TextField
                    label="Location"
                    placeholder="Enter location"
                    value={store?.commercialMoldLessThan10SF.location ?? ""}
                    onChangeText={(val) =>
                      store?.updateCommercialMoldLessThan10SF({ location: val })
                    }
                  />
                </View>
              )}
            </View>

            {/* Condition 4: Mold >= 10 SF */}
            <View style={themed($conditionCard)}>
              <Text preset="bold" text="Mold >= 10 SF" style={themed($conditionTitle)} />
              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Has Condition" />
                <Checkbox
                  value={store?.commercialMoldGreaterOrEqual10SF.hasCondition ?? false}
                  onValueChange={(val) =>
                    store?.updateCommercialMoldGreaterOrEqual10SF({ hasCondition: val })
                  }
                />
              </View>
              {store?.commercialMoldGreaterOrEqual10SF.hasCondition && (
                <View style={$fieldGroup}>
                  <TextField
                    label="Size (SF)"
                    placeholder="Enter square footage"
                    keyboardType="numeric"
                    value={
                      store?.commercialMoldGreaterOrEqual10SF.sizeSF
                        ? store.commercialMoldGreaterOrEqual10SF.sizeSF.toString()
                        : ""
                    }
                    onChangeText={(val) =>
                      store?.updateCommercialMoldGreaterOrEqual10SF({
                        sizeSF: val ? parseFloat(val) : 0,
                      })
                    }
                  />
                  <TextField
                    label="Location"
                    placeholder="Enter location"
                    value={store?.commercialMoldGreaterOrEqual10SF.location ?? ""}
                    onChangeText={(val) =>
                      store?.updateCommercialMoldGreaterOrEqual10SF({ location: val })
                    }
                  />
                </View>
              )}
            </View>

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

const $root: ViewStyle = {
  flex: 1,
}

const $screenInner: ViewStyle = {
  flex: 1,
}

const $content: ThemedStyle<ViewStyle> = () => ({
  paddingTop: 88,
  paddingBottom: 96,
  gap: 0,
})

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

const $paddedBlock: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 16,
  gap: 8,
})

const $titleStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary2,
  fontSize: 24,
  fontFamily: undefined,
})

const $naRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
})

const $conditionCard: ThemedStyle<ViewStyle> = ({ colors }) => ({
  marginHorizontal: 16,
  marginBottom: 16,
  padding: 16,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral200,
  gap: 12,
})

const $conditionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary2,
  fontSize: 16,
})

const $checkboxRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $fieldGroup: ViewStyle = {
  gap: 12,
}

const $commentsBlock: ThemedStyle<ViewStyle> = () => ({
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 8,
  gap: 8,
})
