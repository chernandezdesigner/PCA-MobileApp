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
  STAIRS_EXTERIOR_OPTIONS,
  STAIRS_INTERIOR_OPTIONS,
  BALCONY_OPTIONS,
  PATIO_PLAZA_OPTIONS,
  BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS,
  BALCONY_BALUSTER_SPACING_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep7ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep7"> {}

export const BuildingEnvelopeStep7Screen: FC<BuildingEnvelopeStep7ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step7

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Stairs Exterior data
  const stairsExteriorData = store?.stairsExterior.materials ?? []
  const stairsExteriorItems: ChecklistItem[] = STAIRS_EXTERIOR_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: stairsExteriorData.includes(opt.id),
  }))

  const toggleStairsExterior = (id: string, checked: boolean) => {
    const current = stairsExteriorData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateStairsExterior({ materials: newArray })
  }

  const stairsExteriorRailingData = store?.stairsExterior.railingDetails?.railingTypes ?? []
  const stairsExteriorRailingItems: ChecklistItem[] = BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: stairsExteriorRailingData.includes(opt.id),
  }))

  const toggleStairsExteriorRailing = (id: string, checked: boolean) => {
    const current = stairsExteriorRailingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.stairsExterior.update({ railingDetails: { railingTypes: newArray } })
  }

  // Stairs Interior data
  const stairsInteriorData = store?.stairsInterior.materials ?? []
  const stairsInteriorItems: ChecklistItem[] = STAIRS_INTERIOR_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: stairsInteriorData.includes(opt.id),
  }))

  const toggleStairsInterior = (id: string, checked: boolean) => {
    const current = stairsInteriorData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateStairsInterior({ materials: newArray })
  }

  const stairsInteriorRailingData = store?.stairsInterior.railingDetails?.railingTypes ?? []
  const stairsInteriorRailingItems: ChecklistItem[] = BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: stairsInteriorRailingData.includes(opt.id),
  }))

  const toggleStairsInteriorRailing = (id: string, checked: boolean) => {
    const current = stairsInteriorRailingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.stairsInterior.update({ railingDetails: { railingTypes: newArray } })
  }

  // Balcony Baluster Spacing data
  const balconyBalusterSpacingData = store?.balconies.balconyBalusterSpacing.balusterSpacing ?? []
  const balconyBalusterSpacingItems: ChecklistItem[] = BALCONY_BALUSTER_SPACING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: balconyBalusterSpacingData.includes(opt.id),
  }))

  const toggleBalconyBalusterSpacing = (id: string, checked: boolean) => {
    const current = balconyBalusterSpacingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.balconies.updateBalconyBalusterSpacing({ balusterSpacing: newArray })
  }

  // Helper component for dynamic materials
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
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  })

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep6" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Building Stairs, Balconies, Patios" style={themed($titleStyle)} />
          <ProgressBar current={7} total={10} />
        </View>

        {/* Stairs Exterior */}
        <SectionAccordion
          title="Stairs (Exterior)"
          expanded={!store?.stairsExterior.NotApplicable && openKey === "stairsExterior"}
          onToggle={(n) => {
            if (!store?.stairsExterior.NotApplicable) {
              setOpenKey(n ? "stairsExterior" : null)
            }
          }}
          headerStyle={
            store?.stairsExterior.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.stairsExterior.NotApplicable ?? false))}
              onPress={() => store?.updateStairsExterior({ NotApplicable: !store?.stairsExterior.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.stairsExterior.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.stairsExterior.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Material Types" items={stairsExteriorItems} onToggle={toggleStairsExterior} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.stairsExterior.assessment.condition as any}
                  onChange={(v) => store?.updateStairsExterior({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.stairsExterior.assessment.repairStatus as any}
                  onChange={(v) => store?.updateStairsExterior({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.stairsExterior.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateStairsExterior({ assessment: { amountToRepair: txt } })}
              />

              <View style={themed($divider)} />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Railings?" />
                <Checkbox
                  value={store?.stairsExterior.railing === "yes"}
                  onValueChange={(checked) => store?.updateStairsExterior({ railing: checked ? "yes" : "no" })}
                />
              </View>

              {store?.stairsExterior.railing === "yes" && (
                <View style={themed($nestedSection)}>
                  <ChecklistField
                    label="Railing Types"
                    items={stairsExteriorRailingItems}
                    onToggle={toggleStairsExteriorRailing}
                  />

                  <TextField
                    label="Baluster Spacing"
                    placeholder="Enter spacing details"
                    value={store?.stairsExterior.railingDetails?.balusterSpacing ?? ""}
                    onChangeText={(txt) => store?.stairsExterior.update({ railingDetails: { balusterSpacing: txt } })}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.stairsExterior.railingDetails?.assessment.condition as any}
                      onChange={(v) => store?.stairsExterior.update({ railingDetails: { assessment: { condition: v } } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.stairsExterior.railingDetails?.assessment.repairStatus as any}
                      onChange={(v) => store?.stairsExterior.update({ railingDetails: { assessment: { repairStatus: v } } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.stairsExterior.railingDetails?.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.stairsExterior.update({ railingDetails: { assessment: { amountToRepair: txt } } })}
                  />
                </View>
              )}
            </View>
          )}
        </SectionAccordion>

        {/* Stairs Interior */}
        <SectionAccordion
          title="Stairs (Interior)"
          expanded={!store?.stairsInterior.NotApplicable && openKey === "stairsInterior"}
          onToggle={(n) => {
            if (!store?.stairsInterior.NotApplicable) {
              setOpenKey(n ? "stairsInterior" : null)
            }
          }}
          headerStyle={
            store?.stairsInterior.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.stairsInterior.NotApplicable ?? false))}
              onPress={() => store?.updateStairsInterior({ NotApplicable: !store?.stairsInterior.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.stairsInterior.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.stairsInterior.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Material Types" items={stairsInteriorItems} onToggle={toggleStairsInterior} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.stairsInterior.assessment.condition as any}
                  onChange={(v) => store?.updateStairsInterior({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.stairsInterior.assessment.repairStatus as any}
                  onChange={(v) => store?.updateStairsInterior({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.stairsInterior.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateStairsInterior({ assessment: { amountToRepair: txt } })}
              />

              <View style={themed($divider)} />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Railings?" />
                <Checkbox
                  value={store?.stairsInterior.railing === "yes"}
                  onValueChange={(checked) => store?.updateStairsInterior({ railing: checked ? "yes" : "no" })}
                />
              </View>

              {store?.stairsInterior.railing === "yes" && (
                <View style={themed($nestedSection)}>
                  <ChecklistField
                    label="Railing Types"
                    items={stairsInteriorRailingItems}
                    onToggle={toggleStairsInteriorRailing}
                  />

                  <TextField
                    label="Baluster Spacing"
                    placeholder="Enter spacing details"
                    value={store?.stairsInterior.railingDetails?.balusterSpacing ?? ""}
                    onChangeText={(txt) => store?.stairsInterior.update({ railingDetails: { balusterSpacing: txt } })}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.stairsInterior.railingDetails?.assessment.condition as any}
                      onChange={(v) => store?.stairsInterior.update({ railingDetails: { assessment: { condition: v } } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.stairsInterior.railingDetails?.assessment.repairStatus as any}
                      onChange={(v) => store?.stairsInterior.update({ railingDetails: { assessment: { repairStatus: v } } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.stairsInterior.railingDetails?.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.stairsInterior.update({ railingDetails: { assessment: { amountToRepair: txt } } })}
                  />
                </View>
              )}
            </View>
          )}
        </SectionAccordion>

        {/* Balconies - Dynamic Materials */}
        <SectionAccordion
          title="Balconies"
          expanded={!store?.balconies.NotApplicable && openKey === "balconies"}
          onToggle={(n) => {
            if (!store?.balconies.NotApplicable) {
              setOpenKey(n ? "balconies" : null)
            }
          }}
          headerStyle={
            store?.balconies.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.balconies.NotApplicable ?? false))}
              onPress={() => store?.balconies.updateNotApplicable(!store?.balconies.NotApplicable)}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.balconies.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.balconies.NotApplicable && (
            <View style={themed($sectionBody)}>
              <MaterialSection
                title="Select Balcony Materials"
                materials={BALCONY_OPTIONS}
                selectedMaterials={store?.balconies.materials ?? new Map()}
                onToggleMaterial={(id, checked) => {
                  if (checked) {
                    store?.balconies.updateMaterial(id, {})
                  } else {
                    store?.balconies.removeMaterial(id)
                  }
                }}
                onUpdateMaterial={(id, assessment) => store?.balconies.updateMaterial(id, assessment)}
              />

              <View style={themed($divider)} />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Railings?" />
                <Checkbox
                  value={store?.balconies.railing === "yes"}
                  onValueChange={(checked) => store?.balconies.updateRailing(checked ? "yes" : "no")}
                />
              </View>

              {store?.balconies.railing === "yes" && (
                <View style={themed($nestedSection)}>
                  <ChecklistField
                    label="Railing Types"
                    items={BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS.map(opt => ({
                      id: opt.id,
                      label: opt.label,
                      checked: store?.balconies.railingDetails?.railingTypes.includes(opt.id) ?? false,
                    }))}
                    onToggle={(id, checked) => {
                      const current = store?.balconies.railingDetails?.railingTypes ?? []
                      const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
                      store?.balconies.updateRailingDetails({ railingTypes: newArray })
                    }}
                  />

                  <TextField
                    label="Baluster Spacing"
                    placeholder="Enter spacing details"
                    value={store?.balconies.railingDetails?.balusterSpacing ?? ""}
                    onChangeText={(txt) => store?.balconies.updateRailingDetails({ balusterSpacing: txt })}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.balconies.railingDetails?.assessment.condition as any}
                      onChange={(v) => store?.balconies.updateRailingDetails({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.balconies.railingDetails?.assessment.repairStatus as any}
                      onChange={(v) => store?.balconies.updateRailingDetails({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.balconies.railingDetails?.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.balconies.updateRailingDetails({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}

              <View style={themed($divider)} />

              {/* Balcony Baluster Spacing Sub-Section */}
              <Text preset="formLabel" text="Balcony Baluster Spacing" style={themed($subSectionTitle)} />
              
              <ChecklistField
                label="Baluster Spacing Options"
                items={balconyBalusterSpacingItems}
                onToggle={toggleBalconyBalusterSpacing}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.balconies.balconyBalusterSpacing.assessment.condition as any}
                  onChange={(v) => store?.balconies.updateBalconyBalusterSpacing({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.balconies.balconyBalusterSpacing.assessment.repairStatus as any}
                  onChange={(v) => store?.balconies.updateBalconyBalusterSpacing({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.balconies.balconyBalusterSpacing.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.balconies.updateBalconyBalusterSpacing({ assessment: { amountToRepair: txt } })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* Patios/Plaza - Dynamic Materials */}
        <SectionAccordion
          title="Patios/Plaza"
          expanded={!store?.patiosPlaza.NotApplicable && openKey === "patiosPlaza"}
          onToggle={(n) => {
            if (!store?.patiosPlaza.NotApplicable) {
              setOpenKey(n ? "patiosPlaza" : null)
            }
          }}
          headerStyle={
            store?.patiosPlaza.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.patiosPlaza.NotApplicable ?? false))}
              onPress={() => store?.patiosPlaza.updateNotApplicable(!store?.patiosPlaza.NotApplicable)}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.patiosPlaza.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.patiosPlaza.NotApplicable && (
            <View style={themed($sectionBody)}>
              <MaterialSection
                title="Select Patio/Plaza Materials"
                materials={PATIO_PLAZA_OPTIONS}
                selectedMaterials={store?.patiosPlaza.materials ?? new Map()}
                onToggleMaterial={(id, checked) => {
                  if (checked) {
                    store?.patiosPlaza.updateMaterial(id, {})
                  } else {
                    store?.patiosPlaza.removeMaterial(id)
                  }
                }}
                onUpdateMaterial={(id, assessment) => store?.patiosPlaza.updateMaterial(id, assessment)}
              />

              <View style={themed($divider)} />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Railings?" />
                <Checkbox
                  value={store?.patiosPlaza.railing === "yes"}
                  onValueChange={(checked) => store?.patiosPlaza.updateRailing(checked ? "yes" : "no")}
                />
              </View>

              {store?.patiosPlaza.railing === "yes" && (
                <View style={themed($nestedSection)}>
                  <ChecklistField
                    label="Railing Types"
                    items={BUILDING_STAIRS_BALCONIES_RAILING_OPTIONS.map(opt => ({
                      id: opt.id,
                      label: opt.label,
                      checked: store?.patiosPlaza.railingDetails?.railingTypes.includes(opt.id) ?? false,
                    }))}
                    onToggle={(id, checked) => {
                      const current = store?.patiosPlaza.railingDetails?.railingTypes ?? []
                      const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
                      store?.patiosPlaza.updateRailingDetails({ railingTypes: newArray })
                    }}
                  />

                  <TextField
                    label="Baluster Spacing"
                    placeholder="Enter spacing details"
                    value={store?.patiosPlaza.railingDetails?.balusterSpacing ?? ""}
                    onChangeText={(txt) => store?.patiosPlaza.updateRailingDetails({ balusterSpacing: txt })}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.patiosPlaza.railingDetails?.assessment.condition as any}
                      onChange={(v) => store?.patiosPlaza.updateRailingDetails({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.patiosPlaza.railingDetails?.assessment.repairStatus as any}
                      onChange={(v) => store?.patiosPlaza.updateRailingDetails({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.patiosPlaza.railingDetails?.assessment.amountToRepair ?? ""}
                    onChangeText={(txt) => store?.patiosPlaza.updateRailingDetails({ assessment: { amountToRepair: txt } })}
                  />
                </View>
              )}
            </View>
          )}
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Note any concerns about stairs, balconies, or patios"
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
            navigation.navigate("BuildingEnvelopeStep6" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep8" as never, { transition: "slide_from_right" } as never)
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

const $subSectionTitle: ViewStyle = {
  fontSize: 16,
  fontWeight: "600",
  marginTop: 16,
  marginBottom: 8,
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
