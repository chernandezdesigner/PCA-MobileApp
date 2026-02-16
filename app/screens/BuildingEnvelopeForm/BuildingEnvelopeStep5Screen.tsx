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
import { Dropdown } from "@/components/Dropdown"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  PAVEMENT_OPTIONS,
  ENTRANCE_APRON_OPTIONS,
  CURBING_OPTIONS,
  SIDEWALK_WALKWAY_OPTIONS,
  SIDEWALK_RAILING_OPTIONS,
  STEPS_STAIRS_OPTIONS,
  STEPS_STAIRS_RAILING_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep5ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep5"> {}

export const BuildingEnvelopeStep5Screen: FC<BuildingEnvelopeStep5ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step5

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Helper component to render material sections with dynamic assessments
  const MaterialSection: FC<{
    title: string
    materials: { id: string; label: string }[]
    selectedMaterials: Map<any, any>
    onToggleMaterial: (id: string, checked: boolean) => void
    onUpdateMaterial: (id: string, assessment: any) => void
  }> = observer(({ title, materials, selectedMaterials, onToggleMaterial, onUpdateMaterial }) => {
    const selectedKeys = Array.from(selectedMaterials.keys())

    return (
      <View style={themed($materialSectionContainer)}>
        <Text preset="formLabel" text={title} style={themed($materialSectionTitle)} />
        
        {materials.map((material) => {
          const isSelected = selectedKeys.includes(material.id)
          const assessment = selectedMaterials.get(material.id)

          return (
            <View key={material.id} style={themed($materialCard)}>
              <View style={themed($checkboxRow)}>
                <Text text={material.label} preset="formLabel" />
                <Checkbox value={isSelected} onValueChange={(val) => onToggleMaterial(material.id, val)} />
              </View>

              {isSelected && (
                <View style={themed($materialAssessment)}>
                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={assessment?.condition as any}
                      onChange={(v) => onUpdateMaterial(material.id, { ...assessment, condition: v })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={assessment?.repairStatus as any}
                      onChange={(v) => onUpdateMaterial(material.id, { ...assessment, repairStatus: v })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={assessment?.amountToRepair ?? ""}
                    onChangeText={(txt) => onUpdateMaterial(material.id, { ...assessment, amountToRepair: txt })}
                  />

                  <TextField
                    label="Effective Age (years)"
                    placeholder="Years"
                    keyboardType="decimal-pad"
                    value={assessment?.effectiveAge ? String(assessment.effectiveAge) : ""}
                    onChangeText={(txt) => onUpdateMaterial(material.id, { ...assessment, effectiveAge: Number(txt) || 0 })}
                  />
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  })

  // Pavement handlers
  const togglePavementMaterial = (id: string, checked: boolean) => {
    if (checked) {
      store?.pavement.updateMaterial(id, {})
    } else {
      store?.pavement.removeMaterial(id)
    }
  }

  const updatePavementMaterial = (id: string, assessment: any) => {
    store?.pavement.updateMaterial(id, assessment)
  }

  // Entrance Aprons handlers
  const toggleEntranceApronMaterial = (id: string, checked: boolean) => {
    if (checked) {
      store?.entranceAprons.updateMaterial(id, {})
    } else {
      store?.entranceAprons.removeMaterial(id)
    }
  }

  const updateEntranceApronMaterial = (id: string, assessment: any) => {
    store?.entranceAprons.updateMaterial(id, assessment)
  }

  // Curbing handlers
  const toggleCurbingMaterial = (id: string, checked: boolean) => {
    if (checked) {
      store?.curbing.updateMaterial(id, {})
    } else {
      store?.curbing.removeMaterial(id)
    }
  }

  const updateCurbingMaterial = (id: string, assessment: any) => {
    store?.curbing.updateMaterial(id, assessment)
  }

  // Sidewalks/Walkways handlers
  const toggleSidewalkMaterial = (id: string, checked: boolean) => {
    if (checked) {
      store?.sidewalksWalkways.updateMaterial(id, {})
    } else {
      store?.sidewalksWalkways.removeMaterial(id)
    }
  }

  const updateSidewalkMaterial = (id: string, assessment: any) => {
    store?.sidewalksWalkways.updateMaterial(id, assessment)
  }

  const sidewalkRailingData = store?.sidewalksWalkways.railingDetails?.railingTypes ?? []
  const sidewalkRailingItems: ChecklistItem[] = SIDEWALK_RAILING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: sidewalkRailingData.includes(opt.id),
  }))

  const toggleSidewalkRailing = (id: string, checked: boolean) => {
    const current = sidewalkRailingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.sidewalksWalkways.updateRailingDetails({ railingTypes: newArray })
  }

  // Steps/Stairs handlers
  const toggleStepsMaterial = (id: string, checked: boolean) => {
    if (checked) {
      store?.stepsStairs.updateMaterial(id, {})
    } else {
      store?.stepsStairs.removeMaterial(id)
    }
  }

  const updateStepsMaterial = (id: string, assessment: any) => {
    store?.stepsStairs.updateMaterial(id, assessment)
  }

  const stepsRailingData = store?.stepsStairs.railingDetails?.railingTypes ?? []
  const stepsRailingItems: ChecklistItem[] = STEPS_STAIRS_RAILING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: stepsRailingData.includes(opt.id),
  }))

  const toggleStepsRailing = (id: string, checked: boolean) => {
    const current = stepsRailingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.stepsStairs.updateRailingDetails({ railingTypes: newArray })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep4" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Parking, Paving, Sidewalks" style={themed($titleStyle)} />
          <ProgressBar current={5} total={10} />
        </View>

        <SectionAccordion
          title="Basic Information"
          expanded={openKey === "basicInfo"}
          onToggle={(n) => setOpenKey(n ? "basicInfo" : null)}
        >
          <View style={themed($sectionBody)}>
            <TextField
              label="Amount of Parking Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.amountOfParkingSpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ amountOfParkingSpaces: Number(txt) || 0 })}
            />

            <TextField
              label="Open Lot Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.openLotSpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ openLotSpaces: Number(txt) || 0 })}
            />

            <TextField
              label="Carport Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.carportSpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ carportSpaces: Number(txt) || 0 })}
            />

            <TextField
              label="Garage Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.garageSpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ garageSpaces: Number(txt) || 0 })}
            />

            <View style={themed($checkboxRow)}>
              <Text preset="formLabel" text="Tuck Under?" />
              <Checkbox
                value={store?.basicInformation.tuckUnder ?? false}
                onValueChange={(val) => store?.updateBasicInformation({ tuckUnder: val })}
              />
            </View>

            <TextField
              label="Regular ADA Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.regADASpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ regADASpaces: Number(txt) || 0 })}
            />

            <TextField
              label="Van Spaces"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.vanSpaces ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ vanSpaces: Number(txt) || 0 })}
            />

            <View style={themed($checkboxRow)}>
              <Text preset="formLabel" text="ADA Signage?" />
              <Checkbox
                value={store?.basicInformation.ADASignage ?? false}
                onValueChange={(val) => store?.updateBasicInformation({ ADASignage: val })}
              />
            </View>

            <TextField
              label="Missing ADA Signs"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.missingADASigns ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ missingADASigns: Number(txt) || 0 })}
            />

            <View style={themed($checkboxRow)}>
              <Text preset="formLabel" text="ADA Van Signage?" />
              <Checkbox
                value={store?.basicInformation.ADAVanSignage ?? false}
                onValueChange={(val) => store?.updateBasicInformation({ ADAVanSignage: val })}
              />
            </View>

            <TextField
              label="Missing ADA Van Signs"
              placeholder="Number"
              keyboardType="decimal-pad"
              value={String(store?.basicInformation.missingADAVanSigns ?? "")}
              onChangeText={(txt) => store?.updateBasicInformation({ missingADAVanSigns: Number(txt) || 0 })}
            />

            <Dropdown
              label="ADA Ramp Signage"
              value={store?.basicInformation.ADARampSignage ?? "Not Applicable"}
              onValueChange={(val) => store?.updateBasicInformation({ ADARampSignage: val as any })}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
                { label: "Not Applicable", value: "Not Applicable" },
              ]}
            />

            <Dropdown
              label="Public Access"
              value={store?.basicInformation.publicAccess ?? "Not Applicable"}
              onValueChange={(val) => store?.updateBasicInformation({ publicAccess: val as any })}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
                { label: "Not Applicable", value: "Not Applicable" },
              ]}
            />

            <TextField
              label="Where Needed"
              placeholder="Describe where access is needed"
              value={store?.basicInformation.whereNeeded ?? ""}
              onChangeText={(txt) => store?.updateBasicInformation({ whereNeeded: txt })}
              multiline
              minRows={2}
            />

            <TextField
              label="Other"
              placeholder="Additional information"
              value={store?.basicInformation.other ?? ""}
              onChangeText={(txt) => store?.updateBasicInformation({ other: txt })}
              multiline
              minRows={2}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Pavement"
          expanded={openKey === "pavement"}
          onToggle={(n) => setOpenKey(n ? "pavement" : null)}
        >
          <View style={themed($sectionBody)}>
            <MaterialSection
              title="Select Pavement Materials"
              materials={PAVEMENT_OPTIONS}
              selectedMaterials={store?.pavement.materials ?? new Map()}
              onToggleMaterial={togglePavementMaterial}
              onUpdateMaterial={updatePavementMaterial}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Entrance Aprons"
          expanded={!store?.entranceAprons.NotApplicable && openKey === "entranceAprons"}
          onToggle={(n) => {
            if (!store?.entranceAprons.NotApplicable) {
              setOpenKey(n ? "entranceAprons" : null)
            }
          }}
          headerStyle={
            store?.entranceAprons.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.entranceAprons.NotApplicable ?? false))}
              onPress={() => store?.entranceAprons.updateNotApplicable(!store?.entranceAprons.NotApplicable)}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.entranceAprons.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.entranceAprons.NotApplicable && (
            <View style={themed($sectionBody)}>
              <MaterialSection
                title="Select Entrance Apron Materials"
                materials={ENTRANCE_APRON_OPTIONS}
                selectedMaterials={store?.entranceAprons.materials ?? new Map()}
                onToggleMaterial={toggleEntranceApronMaterial}
                onUpdateMaterial={updateEntranceApronMaterial}
              />
            </View>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Curbing"
          expanded={!store?.curbing.NotApplicable && openKey === "curbing"}
          onToggle={(n) => {
            if (!store?.curbing.NotApplicable) {
              setOpenKey(n ? "curbing" : null)
            }
          }}
          headerStyle={
            store?.curbing.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.curbing.NotApplicable ?? false))}
              onPress={() => store?.curbing.updateNotApplicable(!store?.curbing.NotApplicable)}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.curbing.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.curbing.NotApplicable && (
            <View style={themed($sectionBody)}>
              <MaterialSection
                title="Select Curbing Materials"
                materials={CURBING_OPTIONS}
                selectedMaterials={store?.curbing.materials ?? new Map()}
                onToggleMaterial={toggleCurbingMaterial}
                onUpdateMaterial={updateCurbingMaterial}
              />
            </View>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Sidewalks/Walkways"
          expanded={!store?.sidewalksWalkways.NotApplicable && openKey === "sidewalks"}
          onToggle={(n) => {
            if (!store?.sidewalksWalkways.NotApplicable) {
              setOpenKey(n ? "sidewalks" : null)
            }
          }}
          headerStyle={
            store?.sidewalksWalkways.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.sidewalksWalkways.NotApplicable ?? false))}
              onPress={() => store?.sidewalksWalkways.updateNotApplicable(!store?.sidewalksWalkways.NotApplicable)}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.sidewalksWalkways.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.sidewalksWalkways.NotApplicable && (
            <View style={themed($sectionBody)}>
              <MaterialSection
                title="Select Sidewalk/Walkway Materials"
                materials={SIDEWALK_WALKWAY_OPTIONS}
                selectedMaterials={store?.sidewalksWalkways.materials ?? new Map()}
                onToggleMaterial={toggleSidewalkMaterial}
                onUpdateMaterial={updateSidewalkMaterial}
              />

              <View style={themed($divider)} />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Railings?" />
                <Checkbox
                  value={store?.sidewalksWalkways.railing === "yes"}
                  onValueChange={(checked) => store?.sidewalksWalkways.updateRailing(checked ? "yes" : "no")}
                />
              </View>

              {store?.sidewalksWalkways.railing === "yes" && (
                <View style={themed($nestedSection)}>
                  <ChecklistField
                    label="Railing Types"
                    items={sidewalkRailingItems}
                    onToggle={toggleSidewalkRailing}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.sidewalksWalkways.railingDetails?.assessment.condition as any}
                      onChange={(v) => store?.sidewalksWalkways.updateRailingDetails({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.sidewalksWalkways.railingDetails?.assessment.repairStatus as any}
                      onChange={(v) => store?.sidewalksWalkways.updateRailingDetails({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.sidewalksWalkways.railingDetails?.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.sidewalksWalkways.updateRailingDetails({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}
            </View>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Steps/Stairs/Extension of Walkways"
          expanded={openKey === "stepsStairs"}
          onToggle={(n) => setOpenKey(n ? "stepsStairs" : null)}
        >
          <View style={themed($sectionBody)}>
            <MaterialSection
              title="Select Steps/Stairs Materials"
              materials={STEPS_STAIRS_OPTIONS}
              selectedMaterials={store?.stepsStairs.materials ?? new Map()}
              onToggleMaterial={toggleStepsMaterial}
              onUpdateMaterial={updateStepsMaterial}
            />

            <View style={themed($divider)} />

            <View style={themed($checkboxRow)}>
              <Text preset="formLabel" text="Railings?" />
              <Checkbox
                value={store?.stepsStairs.railing === "yes"}
                onValueChange={(checked) => store?.stepsStairs.updateRailing(checked ? "yes" : "no")}
              />
            </View>

            {store?.stepsStairs.railing === "yes" && (
              <View style={themed($nestedSection)}>
                <ChecklistField
                  label="Railing Types"
                  items={stepsRailingItems}
                  onToggle={toggleStepsRailing}
                />

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.stepsStairs.railingDetails?.assessment.condition as any}
                    onChange={(v) => store?.stepsStairs.updateRailingDetails({ assessment: { condition: v } })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.stepsStairs.railingDetails?.assessment.repairStatus as any}
                    onChange={(v) => store?.stepsStairs.updateRailingDetails({ assessment: { repairStatus: v } })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="decimal-pad"
                  value={store?.stepsStairs.railingDetails?.assessment.amountToRepair ?? ""}
                  onChangeText={(txt) => store?.stepsStairs.updateRailingDetails({ assessment: { amountToRepair: txt } })}
                />
              </View>
            )}
          </View>
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Note any parking, paving, or sidewalk concerns"
            value={store?.comments ?? ""}
            onChangeText={(txt) => store?.updateComments(txt)}
            multiline
            minRows={2}
          />
        </View>
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep4" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep6" as never, { transition: "slide_from_right" } as never)
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
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
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

const $introBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 32,
  gap: 8,
}

const $paddedBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 16,
  gap: 8,
}

const $commentsBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 24,
  gap: 8,
}

const $materialSectionContainer: ViewStyle = {
  gap: 12,
}

const $materialSectionTitle: ViewStyle = {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 8,
}

const $materialCard: ViewStyle = {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 8,
  padding: 12,
  gap: 12,
}

const $materialAssessment: ViewStyle = {
  gap: 12,
  paddingTop: 8,
  borderTopWidth: 1,
  borderTopColor: "#e5e7eb",
}

const $divider: ViewStyle = {
  height: 1,
  backgroundColor: "#e5e7eb",
  marginVertical: 8,
}

const $nestedSection: ViewStyle = {
  backgroundColor: "#f9fafb",
  padding: 12,
  borderRadius: 8,
  gap: 12,
  marginTop: 8,
}

const $nestedTitle: ViewStyle = {
  fontSize: 15,
  fontWeight: "600",
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
