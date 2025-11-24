import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity } from "react-native"
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
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  PARKING_GARAGE_STRUCTURE_OPTIONS,
  PARKING_GARAGE_DECKING_OPTIONS,
  PARKING_GARAGE_PERIMETER_WALL_OPTIONS,
  PARKING_GARAGE_TRAFFIC_COATING_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep6ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep6"> {}

export const BuildingEnvelopeStep6Screen: FC<BuildingEnvelopeStep6ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step6

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Transform data for checklist fields
  const structureData = store?.structure.structure ?? []
  const structureItems: ChecklistItem[] = PARKING_GARAGE_STRUCTURE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: structureData.includes(opt.id),
  }))

  const deckingData = store?.decking.decking ?? []
  const deckingItems: ChecklistItem[] = PARKING_GARAGE_DECKING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: deckingData.includes(opt.id),
  }))

  const perimeterWallData = store?.perimeterWall.perimeterWalls ?? []
  const perimeterWallItems: ChecklistItem[] = PARKING_GARAGE_PERIMETER_WALL_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: perimeterWallData.includes(opt.id),
  }))

  const trafficCoatingData = store?.trafficCoating.trafficCoating ?? []
  const trafficCoatingItems: ChecklistItem[] = PARKING_GARAGE_TRAFFIC_COATING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: trafficCoatingData.includes(opt.id),
  }))

  // Toggle handlers
  const toggleStructure = (id: string, checked: boolean) => {
    const current = structureData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateStructure({ structure: newArray })
  }

  const toggleDecking = (id: string, checked: boolean) => {
    const current = deckingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDecking({ decking: newArray })
  }

  const togglePerimeterWall = (id: string, checked: boolean) => {
    const current = perimeterWallData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updatePerimeterWall({ perimeterWalls: newArray })
  }

  const toggleTrafficCoating = (id: string, checked: boolean) => {
    const current = trafficCoatingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateTrafficCoating({ trafficCoating: newArray })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep5" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Parking Garage Structure" style={themed($titleStyle)} />
          <ProgressBar current={6} total={10} />
        </View>

        {/* Step-level N/A Toggle */}
        <View style={themed($topLevelFields)}>
          <View style={themed($checkboxRow)}>
            <Text preset="formLabel" text="Not Applicable (No Parking Garage)" />
            <Checkbox
              value={store?.stepNotApplicable ?? false}
              onValueChange={(val) => store?.updateStepNotApplicable(val)}
            />
          </View>
        </View>

        {!store?.stepNotApplicable && (
          <>
            <SectionAccordion
              title="Structure"
              expanded={openKey === "structure"}
              onToggle={(n) => setOpenKey(n ? "structure" : null)}
            >
              <View style={themed($sectionBody)}>
                <ChecklistField label="Structure Types" items={structureItems} onToggle={toggleStructure} />

                {structureData.includes("other") && (
                  <TextField
                    label="Specify Other Type"
                    placeholder="Specify type"
                    value={store?.structure.otherType ?? ""}
                    onChangeText={(txt) => store?.updateStructure({ otherType: txt })}
                  />
                )}

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.structure.assessment.condition as any}
                    onChange={(v) => store?.updateStructure({ assessment: { condition: v } })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.structure.assessment.repairStatus as any}
                    onChange={(v) => store?.updateStructure({ assessment: { repairStatus: v } })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={store?.structure.assessment.amountToRepair ?? ""}
                  onChangeText={(txt) => store?.updateStructure({ assessment: { amountToRepair: txt } })}
                />
              </View>
            </SectionAccordion>

            <SectionAccordion
              title="Decking"
              expanded={openKey === "decking"}
              onToggle={(n) => setOpenKey(n ? "decking" : null)}
            >
              <View style={themed($sectionBody)}>
                <ChecklistField label="Decking Types" items={deckingItems} onToggle={toggleDecking} />

                {deckingData.includes("other") && (
                  <TextField
                    label="Specify Other Type"
                    placeholder="Specify type"
                    value={store?.decking.otherType ?? ""}
                    onChangeText={(txt) => store?.updateDecking({ otherType: txt })}
                  />
                )}

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.decking.assessment.condition as any}
                    onChange={(v) => store?.updateDecking({ assessment: { condition: v } })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.decking.assessment.repairStatus as any}
                    onChange={(v) => store?.updateDecking({ assessment: { repairStatus: v } })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={store?.decking.assessment.amountToRepair ?? ""}
                  onChangeText={(txt) => store?.updateDecking({ assessment: { amountToRepair: txt } })}
                />
              </View>
            </SectionAccordion>

            <SectionAccordion
              title="Expansion Joints/Materials"
              expanded={!store?.expansionJointsMaterials.NotApplicable && openKey === "expansionJoints"}
              onToggle={(n) => {
                if (!store?.expansionJointsMaterials.NotApplicable) {
                  setOpenKey(n ? "expansionJoints" : null)
                }
              }}
              headerStyle={
                store?.expansionJointsMaterials.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.expansionJointsMaterials.NotApplicable ?? false))}
                  onPress={() => store?.updateExpansionJointsMaterials({ NotApplicable: !store?.expansionJointsMaterials.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.expansionJointsMaterials.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.expansionJointsMaterials.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <View style={themed($checkboxRow)}>
                    <Text preset="formLabel" text="Rubber" />
                    <Checkbox
                      value={store?.expansionJointsMaterials.Rubber ?? false}
                      onValueChange={(val) => store?.updateExpansionJointsMaterials({ Rubber: val })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.expansionJointsMaterials.assessment.condition as any}
                      onChange={(v) => store?.updateExpansionJointsMaterials({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.expansionJointsMaterials.assessment.repairStatus as any}
                      onChange={(v) => store?.updateExpansionJointsMaterials({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="numeric"
                    value={store?.expansionJointsMaterials.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.updateExpansionJointsMaterials({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}
            </SectionAccordion>

            <SectionAccordion
              title="Perimeter Wall"
              expanded={!store?.perimeterWall.NotApplicable && openKey === "perimeterWall"}
              onToggle={(n) => {
                if (!store?.perimeterWall.NotApplicable) {
                  setOpenKey(n ? "perimeterWall" : null)
                }
              }}
              headerStyle={
                store?.perimeterWall.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.perimeterWall.NotApplicable ?? false))}
                  onPress={() => store?.updatePerimeterWall({ NotApplicable: !store?.perimeterWall.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.perimeterWall.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.perimeterWall.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField label="Perimeter Wall Types" items={perimeterWallItems} onToggle={togglePerimeterWall} />

                  {perimeterWallData.includes("other") && (
                    <TextField
                      label="Specify Other Type"
                      placeholder="Specify type"
                      value={store?.perimeterWall.OtherType ?? ""}
                      onChangeText={(txt) => store?.updatePerimeterWall({ OtherType: txt })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.perimeterWall.assessment.condition as any}
                      onChange={(v) => store?.updatePerimeterWall({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.perimeterWall.assessment.repairStatus as any}
                      onChange={(v) => store?.updatePerimeterWall({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="numeric"
                    value={store?.perimeterWall.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.updatePerimeterWall({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}
            </SectionAccordion>

            <SectionAccordion
              title="Traffic Coating"
              expanded={!store?.trafficCoating.NotApplicable && openKey === "trafficCoating"}
              onToggle={(n) => {
                if (!store?.trafficCoating.NotApplicable) {
                  setOpenKey(n ? "trafficCoating" : null)
                }
              }}
              headerStyle={
                store?.trafficCoating.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.trafficCoating.NotApplicable ?? false))}
                  onPress={() => store?.updateTrafficCoating({ NotApplicable: !store?.trafficCoating.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.trafficCoating.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.trafficCoating.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField label="Traffic Coating Options" items={trafficCoatingItems} onToggle={toggleTrafficCoating} />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.trafficCoating.assessment.condition as any}
                      onChange={(v) => store?.updateTrafficCoating({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.trafficCoating.assessment.repairStatus as any}
                      onChange={(v) => store?.updateTrafficCoating({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="numeric"
                    value={store?.trafficCoating.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.updateTrafficCoating({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}
            </SectionAccordion>

            <View style={themed($commentsBlock)}>
              <TextField
                label="Comments"
                placeholder="Note any parking garage structure concerns"
                value={store?.comments ?? ""}
                onChangeText={(txt) => store?.updateComments(txt)}
                multiline
                minRows={2}
              />
            </View>
          </>
        )}
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep5" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep7" as never, { transition: "slide_from_right" } as never)
          }}
          showCamera={true}
        />
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

const $content: ViewStyle = {
  paddingTop: 88,
  paddingBottom: 96,
  gap: 0,
}

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $sectionBody: ViewStyle = {
  gap: 16,
  paddingBottom: 16,
  paddingTop: 8,
}

const $controlGroup: ViewStyle = {
  gap: 8,
}

const $checkboxRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
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

const $topLevelFields: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  gap: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#e5e7eb",
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

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  opacity: 0.6,
})

const $naButton = (active: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  backgroundColor: active ? colors.palette.primary1 : colors.palette.neutral300,
  minWidth: 50,
  alignItems: "center",
  justifyContent: "center",
})

const $naButtonText = (active: boolean): ThemedStyle<any> => ({ colors }) => ({
  color: active ? colors.palette.neutral100 : colors.palette.neutral600,
  fontSize: 12,
  fontWeight: "600",
})
