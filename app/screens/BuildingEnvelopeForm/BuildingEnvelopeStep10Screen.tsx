import { FC, useState } from "react"
import { View, ViewStyle, TouchableOpacity, TextStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { ChecklistField } from "@/components/ChecklistField"
import type { ChecklistItem } from "@/components/ChecklistCard"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Dropdown } from "@/components/Dropdown"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  POOL_SPA_CONSTRUCTION_TYPE_OPTIONS,
  POOL_SPA_HEATER_OPTIONS,
  POOL_DECK_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep10ScreenProps
  extends NativeStackScreenProps<
    BuildingEnvelopeFormNavigatorParamList,
    "BuildingEnvelopeStep10"
  > {}

export const BuildingEnvelopeStep10Screen: FC<BuildingEnvelopeStep10ScreenProps> = observer(
  function BuildingEnvelopeStep10Screen(_props) {
    const { themed } = useAppTheme()
    const navigation = useNavigation()
    const { openDrawer } = useDrawerControl()
    const rootStore = useStores()
    const activeAssessment = rootStore.activeAssessmentId
      ? rootStore.assessments.get(rootStore.activeAssessmentId)
      : undefined
    const store = activeAssessment?.buildingEnvelope.step10

    // Accordion states
    const [swimmingPoolExpanded, setSwimmingPoolExpanded] = useState(false)
    const [spaExpanded, setSpaExpanded] = useState(false)

    // Convert options to ChecklistItems
    const poolSpaConstructionItems: ChecklistItem[] = POOL_SPA_CONSTRUCTION_TYPE_OPTIONS.map((opt) => ({
      id: opt.id,
      label: opt.label,
      checked: false,
    }))

    const poolSpaHeaterItems: ChecklistItem[] = POOL_SPA_HEATER_OPTIONS.map((opt) => ({
      id: opt.id,
      label: opt.label,
      checked: false,
    }))

    const poolDeckItems: ChecklistItem[] = POOL_DECK_OPTIONS.map((opt) => ({
      id: opt.id,
      label: opt.label,
      checked: false,
    }))

    // Swimming Pool handlers
    const togglePoolConstruction = (id: string) => {
      const current = store?.swimmingPool?.constructionTypes?.slice() || []
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(id)
      }
      store?.updateSwimmingPool({ constructionTypes: current })
    }

    const togglePoolHeater = (id: string) => {
      const current = store?.swimmingPool?.heaterTypes?.slice() || []
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(id)
      }
      store?.updateSwimmingPool({ heaterTypes: current })
    }

    const togglePoolDeck = (id: string) => {
      const current = store?.swimmingPool?.deckTypes?.slice() || []
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(id)
      }
      store?.updateSwimmingPool({ deckTypes: current })
    }

    // Spa handlers
    const toggleSpaConstruction = (id: string) => {
      const current = store?.spa?.constructionTypes?.slice() || []
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(id)
      }
      store?.updateSpa({ constructionTypes: current })
    }

    const toggleSpaHeater = (id: string) => {
      const current = store?.spa?.heaterTypes?.slice() || []
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      } else {
        current.push(id)
      }
      store?.updateSpa({ heaterTypes: current })
    }

    // Sync checklist items with store
    const poolConstructionItems: ChecklistItem[] = poolSpaConstructionItems.map((item) => ({
      ...item,
      checked: store?.swimmingPool?.constructionTypes?.includes(item.id) ?? false,
    }))

    const poolHeaterItems: ChecklistItem[] = poolSpaHeaterItems.map((item) => ({
      ...item,
      checked: store?.swimmingPool?.heaterTypes?.includes(item.id) ?? false,
    }))

    const poolDeckItemsChecked: ChecklistItem[] = poolDeckItems.map((item) => ({
      ...item,
      checked: store?.swimmingPool?.deckTypes?.includes(item.id) ?? false,
    }))

    const spaConstructionItems: ChecklistItem[] = poolSpaConstructionItems.map((item) => ({
      ...item,
      checked: store?.spa?.constructionTypes?.includes(item.id) ?? false,
    }))

    const spaHeaterItems: ChecklistItem[] = poolSpaHeaterItems.map((item) => ({
      ...item,
      checked: store?.spa?.heaterTypes?.includes(item.id) ?? false,
    }))

    return (
      <View style={themed($screenContainer)}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep9" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />

        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Swimming Pool & Spa" style={themed($titleStyle)} />
          <ProgressBar current={10} total={10} />
        </View>

        {/* Step-level N/A Toggle */}
        <View style={themed($topLevelFields)}>
          <View style={themed($checkboxRow)}>
            <Text preset="formLabel" text="Not Applicable (No Pool or Spa)" />
            <Checkbox
              value={store?.stepNotApplicable ?? false}
              onValueChange={(val) => store?.updateStepNotApplicable(val)}
            />
          </View>
        </View>

        <Screen preset="scroll" contentContainerStyle={themed($scrollContainer)} safeAreaEdges={["bottom"]}>
          {!store?.stepNotApplicable && (
            <>
              {/* Residence or Public */}
              <View style={themed($fieldContainer)}>
                <Dropdown
                  label="Residence or Public?"
                  options={[
                    { value: "residence", label: "Residence" },
                    { value: "public", label: "Public" },
                  ]}
                  value={store?.residenceOrPublic || ""}
                  onValueChange={(value) => store?.updateResidenceOrPublic(value as string)}
                />
              </View>

              {/* ADA Compliant Restroom */}
              <View style={themed($fieldContainer)}>
                <Dropdown
                  label="ADA Compliant Restroom?"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ]}
                  value={store?.adaCompliantRestroom || ""}
                  onValueChange={(value) => store?.updateAdaCompliantRestroom(value as string)}
                />
              </View>

              {/* SWIMMING POOL ACCORDION */}
              <SectionAccordion
                title="Swimming Pool"
                expanded={swimmingPoolExpanded}
                onToggle={() => setSwimmingPoolExpanded(!swimmingPoolExpanded)}
                RightComponent={
                  <TouchableOpacity
                    style={themed($naButton(store?.swimmingPool.NotApplicable ?? false))}
                    onPress={() =>
                      store?.updateSwimmingPool({
                        NotApplicable: !store?.swimmingPool.NotApplicable,
                      })
                    }
                  >
                    <Text
                      text="N/A"
                      style={themed($naButtonText(store?.swimmingPool.NotApplicable ?? false))}
                    />
                  </TouchableOpacity>
                }
                headerStyle={
                  store?.swimmingPool?.NotApplicable ? themed($disabledAccordionHeader) : undefined
                }
              >
                {!store?.swimmingPool?.NotApplicable && (
                  <>
                    {/* Quantity */}
                    <View style={themed($fieldContainer)}>
                      <TextField
                        label="# (Quantity)"
                        value={store?.swimmingPool?.quantity?.toString() || ""}
                        onChangeText={(text) =>
                          store?.updateSwimmingPool({ quantity: parseInt(text) || 0 })
                        }
                        keyboardType="numeric"
                      />
                    </View>

                    {/* ADA Lift */}
                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="ADA Lift?" />
                        <Checkbox
                          value={store?.swimmingPool?.adaLift || false}
                          onValueChange={(value) =>
                            store?.updateSwimmingPool({ adaLift: value })
                          }
                        />
                      </View>
                    </View>

                    <ChecklistField
                      label="Construction Type"
                      items={poolConstructionItems}
                      onToggle={togglePoolConstruction}
                    />

                    <ChecklistField
                      label="Heater Type"
                      items={poolHeaterItems}
                      onToggle={togglePoolHeater}
                    />

                    <View style={themed($fieldContainer)}>
                      <TextField
                        label="Location"
                        value={store?.swimmingPool?.location || ""}
                        onChangeText={(text) => store?.updateSwimmingPool({ location: text })}
                      />
                    </View>

                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="Virginia Graeme Baker Compliance?" />
                        <Checkbox
                          value={store?.swimmingPool?.virginiaGraemeBakerCompliance || false}
                          onValueChange={(value) =>
                            store?.updateSwimmingPool({ virginiaGraemeBakerCompliance: value })
                          }
                        />
                      </View>
                    </View>

                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="Repaired / Replaced?" />
                        <Checkbox
                          value={store?.swimmingPool?.repairedreplaced || false}
                          onValueChange={(value) =>
                            store?.updateSwimmingPool({ repairedreplaced: value })
                          }
                        />
                      </View>
                    </View>

                    {store?.swimmingPool?.repairedreplaced && (
                      <View style={themed($fieldContainer)}>
                        <TextField
                          label="Repair/Replace Year"
                          value={store?.swimmingPool?.repairedreplacedyear?.toString() || ""}
                          onChangeText={(text) =>
                            store?.updateSwimmingPool({
                              repairedreplacedyear: parseInt(text) || 0,
                            })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Condition" />
                      <ConditionAssessment
                        value={store?.swimmingPool?.assessment.condition as any}
                        onChange={(v) =>
                          store?.updateSwimmingPool({ assessment: { condition: v } })
                        }
                      />
                    </View>

                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Repair Status" />
                      <RepairStatus
                        value={store?.swimmingPool?.assessment.repairStatus as any}
                        onChange={(v) =>
                          store?.updateSwimmingPool({ assessment: { repairStatus: v } })
                        }
                      />
                    </View>

                    {/* Pool Deck Section */}
                    <View style={themed($sectionDivider)}>
                      <Text preset="subheading" text="Pool Deck" />

                      <ChecklistField
                        label="Deck Type"
                        items={poolDeckItemsChecked}
                        onToggle={togglePoolDeck}
                      />

                      <View style={themed($controlGroup)}>
                        <Text preset="formLabel" text="Deck Condition" />
                        <ConditionAssessment
                          value={store?.swimmingPool?.deckAssessment.condition as any}
                          onChange={(v) =>
                            store?.updateSwimmingPool({ deckAssessment: { condition: v } })
                          }
                        />
                      </View>

                      <View style={themed($controlGroup)}>
                        <Text preset="formLabel" text="Deck Repair Status" />
                        <RepairStatus
                          value={store?.swimmingPool?.deckAssessment.repairStatus as any}
                          onChange={(v) =>
                            store?.updateSwimmingPool({ deckAssessment: { repairStatus: v } })
                          }
                        />
                      </View>
                    </View>
                  </>
                )}
              </SectionAccordion>

              {/* SPA ACCORDION */}
              <SectionAccordion
                title="Spa"
                expanded={spaExpanded}
                onToggle={() => setSpaExpanded(!spaExpanded)}
                RightComponent={
                  <TouchableOpacity
                    style={themed($naButton(store?.spa.NotApplicable ?? false))}
                    onPress={() =>
                      store?.updateSpa({ NotApplicable: !store?.spa.NotApplicable })
                    }
                  >
                    <Text
                      text="N/A"
                      style={themed($naButtonText(store?.spa.NotApplicable ?? false))}
                    />
                  </TouchableOpacity>
                }
                headerStyle={
                  store?.spa?.NotApplicable ? themed($disabledAccordionHeader) : undefined
                }
              >
                {!store?.spa?.NotApplicable && (
                  <>
                    {/* Quantity */}
                    <View style={themed($fieldContainer)}>
                      <TextField
                        label="# (Quantity)"
                        value={store?.spa?.quantity?.toString() || ""}
                        onChangeText={(text) =>
                          store?.updateSpa({ quantity: parseInt(text) || 0 })
                        }
                        keyboardType="numeric"
                      />
                    </View>

                    {/* ADA Lift */}
                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="ADA Lift?" />
                        <Checkbox
                          value={store?.spa?.adaLift || false}
                          onValueChange={(value) => store?.updateSpa({ adaLift: value })}
                        />
                      </View>
                    </View>

                    <ChecklistField
                      label="Construction Type"
                      items={spaConstructionItems}
                      onToggle={toggleSpaConstruction}
                    />

                    <ChecklistField
                      label="Heater Type"
                      items={spaHeaterItems}
                      onToggle={toggleSpaHeater}
                    />

                    <View style={themed($fieldContainer)}>
                      <TextField
                        label="Location"
                        value={store?.spa?.location || ""}
                        onChangeText={(text) => store?.updateSpa({ location: text })}
                      />
                    </View>

                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="Virginia Graeme Baker Compliance?" />
                        <Checkbox
                          value={store?.spa?.virginiaGraemeBakerCompliance || false}
                          onValueChange={(value) =>
                            store?.updateSpa({ virginiaGraemeBakerCompliance: value })
                          }
                        />
                      </View>
                    </View>

                    <View style={themed($fieldContainer)}>
                      <View style={themed($checkboxRow)}>
                        <Text preset="formLabel" text="Repaired / Replaced?" />
                        <Checkbox
                          value={store?.spa?.repairedreplaced || false}
                          onValueChange={(value) => store?.updateSpa({ repairedreplaced: value })}
                        />
                      </View>
                    </View>

                    {store?.spa?.repairedreplaced && (
                      <View style={themed($fieldContainer)}>
                        <TextField
                          label="Repair/Replace Year"
                          value={store?.spa?.repairedreplacedyear?.toString() || ""}
                          onChangeText={(text) =>
                            store?.updateSpa({ repairedreplacedyear: parseInt(text) || 0 })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    )}

                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Condition" />
                      <ConditionAssessment
                        value={store?.spa?.assessment.condition as any}
                        onChange={(v) => store?.updateSpa({ assessment: { condition: v } })}
                      />
                    </View>

                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Repair Status" />
                      <RepairStatus
                        value={store?.spa?.assessment.repairStatus as any}
                        onChange={(v) => store?.updateSpa({ assessment: { repairStatus: v } })}
                      />
                    </View>
                  </>
                )}
              </SectionAccordion>

              {/* Comments */}
              <View style={themed($fieldContainer)}>
                <TextField
                  label="Comments"
                  value={store?.comments || ""}
                  onChangeText={(text) => store?.updateComments(text)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </>
          )}
        </Screen>

        <StickyFooterNav
          onBack={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep9" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // Navigate to next form or summary
            navigation.navigate("AssessmentSummary" as never)
          }}
          showCamera={true}
        />
      </View>
    )
  },
)

// Styles
const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $scrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.xxl * 3,
})

const $paddedBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
})

const $titleStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $topLevelFields: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  marginBottom: spacing.md,
})

const $checkboxRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.xs,
})

const $fieldContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $controlGroup: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $naButton: (isActive: boolean) => ThemedStyle<ViewStyle> =
  (isActive) =>
  ({ colors, spacing }) => ({
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
    backgroundColor: isActive ? colors.palette.angry500 : colors.palette.neutral300,
  })

const $naButtonText: (isActive: boolean) => ThemedStyle<TextStyle> =
  (isActive) =>
  ({ colors }) => ({
    color: isActive ? colors.palette.neutral100 : colors.text,
    fontSize: 12,
    fontWeight: "600",
  })

const $disabledAccordionHeader: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
  opacity: 0.6,
})

const $sectionDivider: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.lg,
  paddingTop: spacing.lg,
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})
