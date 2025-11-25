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
  EXTERIOR_WALL_MATERIAL_OPTIONS,
  SIDING_OPTIONS,
  SOFFIT_OPTIONS,
  SEALANT_OPTIONS,
  CURTAIN_WALL_GLAZING_OPTIONS,
  CURTAIN_WALL_SPANDREL_OPTIONS,
  CURTAIN_WALL_MULLION_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep4ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep4"> {}

export const BuildingEnvelopeStep4Screen: FC<BuildingEnvelopeStep4ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step4

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Transform data for checklist fields
  const materialData = store?.material.materials ?? []
  const materialItems: ChecklistItem[] = EXTERIOR_WALL_MATERIAL_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: materialData.includes(opt.id),
  }))

  const sidingData = store?.siding.siding ?? []
  const sidingItems: ChecklistItem[] = SIDING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: sidingData.includes(opt.id),
  }))

  const soffitData = store?.soffit.soffit ?? []
  const soffitItems: ChecklistItem[] = SOFFIT_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: soffitData.includes(opt.id),
  }))

  const sealantData = store?.sealant.sealant ?? []
  const sealantItems: ChecklistItem[] = SEALANT_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: sealantData.includes(opt.id),
  }))

  const glazingData = store?.curtainWall.glazing ?? []
  const glazingItems: ChecklistItem[] = CURTAIN_WALL_GLAZING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: glazingData.includes(opt.id),
  }))

  const spandrelData = store?.curtainWall.spandrels ?? []
  const spandrelItems: ChecklistItem[] = CURTAIN_WALL_SPANDREL_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: spandrelData.includes(opt.id),
  }))

  const mullionData = store?.curtainWall.mullions ?? []
  const mullionItems: ChecklistItem[] = CURTAIN_WALL_MULLION_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: mullionData.includes(opt.id),
  }))

  // Toggle handlers
  const toggleMaterial = (id: string, checked: boolean) => {
    const current = materialData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateMaterial({ materials: newArray })
  }

  const toggleSiding = (id: string, checked: boolean) => {
    const current = sidingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateSiding({ siding: newArray })
  }

  const toggleSoffit = (id: string, checked: boolean) => {
    const current = soffitData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateSoffit({ soffit: newArray })
  }

  const toggleSealant = (id: string, checked: boolean) => {
    const current = sealantData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateSealant({ sealant: newArray })
  }

  const toggleGlazing = (id: string, checked: boolean) => {
    const current = glazingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateCurtainWall({ glazing: newArray })
  }

  const toggleSpandrel = (id: string, checked: boolean) => {
    const current = spandrelData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateCurtainWall({ spandrels: newArray })
  }

  const toggleMullion = (id: string, checked: boolean) => {
    const current = mullionData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateCurtainWall({ mullions: newArray })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep3" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Exterior Walls" style={themed($titleStyle)} />
          <ProgressBar current={4} total={10} />
        </View>

        {/* Top-level Date Field */}
        <View style={themed($topLevelFields)}>
          <TextField
            label="Last Time Painted"
            placeholder="MM/DD/YYYY"
            value={store?.lastTimePainted ? new Date(store.lastTimePainted).toLocaleDateString() : ""}
            onChangeText={(txt) => {
              // TODO: Implement proper date parsing
              const date = new Date(txt)
              if (!isNaN(date.getTime())) {
                store?.updateLastTimePainted(date)
              }
            }}
          />
        </View>

        <SectionAccordion
          title="Material"
          expanded={openKey === "material"}
          onToggle={(n) => setOpenKey(n ? "material" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Wall Materials" items={materialItems} onToggle={toggleMaterial} />

            {materialData?.includes("other") && (
              <TextField
                label="Specify Other Wall Material"
                placeholder="Describe the wall material..."
                value={store?.material.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateMaterial({ otherSpecification: txt })}
                multiline
                numberOfLines={2}
              />
            )}

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.material.assessment.condition as any}
                onChange={(v) => store?.updateMaterial({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.material.assessment.repairStatus as any}
                onChange={(v) => store?.updateMaterial({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.material.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateMaterial({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Siding"
          expanded={openKey === "siding"}
          onToggle={(n) => setOpenKey(n ? "siding" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Siding Types" items={sidingItems} onToggle={toggleSiding} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.siding.assessment.condition as any}
                onChange={(v) => store?.updateSiding({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.siding.assessment.repairStatus as any}
                onChange={(v) => store?.updateSiding({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.siding.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateSiding({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Soffit"
          expanded={openKey === "soffit"}
          onToggle={(n) => setOpenKey(n ? "soffit" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Soffit Types" items={soffitItems} onToggle={toggleSoffit} />

            {soffitData?.includes("other") && (
              <TextField
                label="Specify Other Soffit Type"
                placeholder="Describe the soffit type..."
                value={store?.soffit.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateSoffit({ otherSpecification: txt })}
                multiline
                numberOfLines={2}
              />
            )}

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.soffit.assessment.condition as any}
                onChange={(v) => store?.updateSoffit({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.soffit.assessment.repairStatus as any}
                onChange={(v) => store?.updateSoffit({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.soffit.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateSoffit({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Sealant"
          expanded={!store?.sealant.NotApplicable && openKey === "sealant"}
          onToggle={(n) => {
            if (!store?.sealant.NotApplicable) {
              setOpenKey(n ? "sealant" : null)
            }
          }}
          headerStyle={
            store?.sealant.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.sealant.NotApplicable ?? false))}
              onPress={() => store?.updateSealant({ NotApplicable: !store?.sealant.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.sealant.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.sealant.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Sealant Types" items={sealantItems} onToggle={toggleSealant} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.sealant.assessment.condition as any}
                onChange={(v) => store?.updateSealant({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.sealant.assessment.repairStatus as any}
                onChange={(v) => store?.updateSealant({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.sealant.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateSealant({ assessment: { amountToRepair: txt } })}
            />
            </View>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Curtain Wall"
          expanded={!store?.curtainWall.NotApplicable && openKey === "curtainWall"}
          onToggle={(n) => {
            if (!store?.curtainWall.NotApplicable) {
              setOpenKey(n ? "curtainWall" : null)
            }
          }}
          headerStyle={
            store?.curtainWall.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.curtainWall.NotApplicable ?? false))}
              onPress={() => store?.updateCurtainWall({ NotApplicable: !store?.curtainWall.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.curtainWall.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.curtainWall.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Glazing" items={glazingItems} onToggle={toggleGlazing} />

              <ChecklistField label="Spandrels" items={spandrelItems} onToggle={toggleSpandrel} />

              <ChecklistField label="Mullions" items={mullionItems} onToggle={toggleMullion} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.curtainWall.assessment.condition as any}
                  onChange={(v) => store?.updateCurtainWall({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.curtainWall.assessment.repairStatus as any}
                  onChange={(v) => store?.updateCurtainWall({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.curtainWall.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateCurtainWall({ assessment: { amountToRepair: txt } })}
              />
            </View>
          )}
        </SectionAccordion>

        <SectionAccordion
          title="Facade Ordinance"
          expanded={!store?.facadeOrdinance.NotApplicable && openKey === "facadeOrdinance"}
          onToggle={(n) => {
            if (!store?.facadeOrdinance.NotApplicable) {
              setOpenKey(n ? "facadeOrdinance" : null)
            }
          }}
          headerStyle={
            store?.facadeOrdinance.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.facadeOrdinance.NotApplicable ?? false))}
              onPress={() => store?.updateFacadeOrdinance({ NotApplicable: !store?.facadeOrdinance.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.facadeOrdinance.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.facadeOrdinance.NotApplicable && (
            <View style={themed($sectionBody)}>
              <TextField
                label="Date Last Facade Inspection"
                placeholder="MM/DD/YYYY"
                value={store?.facadeOrdinance.DateLastFacadeInspection ? new Date(store.facadeOrdinance.DateLastFacadeInspection).toLocaleDateString() : ""}
                onChangeText={(txt) => {
                  const date = new Date(txt)
                  if (!isNaN(date.getTime())) {
                    store?.updateFacadeOrdinance({ DateLastFacadeInspection: date })
                  }
                }}
              />

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Outstanding Repair?" />
                <Checkbox
                  value={store?.facadeOrdinance.OutstandingRepair ?? false}
                  onValueChange={(val) => store?.updateFacadeOrdinance({ OutstandingRepair: val })}
                />
              </View>

              <TextField
                label="Facade Inspection Report"
                placeholder="Enter report details"
                value={store?.facadeOrdinance.FacadeInspectionReport ?? ""}
                onChangeText={(txt) => store?.updateFacadeOrdinance({ FacadeInspectionReport: txt })}
                multiline
                minRows={2}
              />

              <TextField
                label="Frequency of Inspection"
                placeholder="e.g., Annual, Bi-annual"
                value={store?.facadeOrdinance.FrequencyOfInspection ?? ""}
                onChangeText={(txt) => store?.updateFacadeOrdinance({ FrequencyOfInspection: txt })}
              />

              <TextField
                label="Date of Next Inspection"
                placeholder="MM/DD/YYYY"
                value={store?.facadeOrdinance.DateOfNextInspection ? new Date(store.facadeOrdinance.DateOfNextInspection).toLocaleDateString() : ""}
                onChangeText={(txt) => {
                  const date = new Date(txt)
                  if (!isNaN(date.getTime())) {
                    store?.updateFacadeOrdinance({ DateOfNextInspection: date })
                  }
                }}
              />

              <TextField
                label="Ordinance Code Number"
                placeholder="Enter code number"
                value={store?.facadeOrdinance.OrdinanceCodeNumber ?? ""}
                onChangeText={(txt) => store?.updateFacadeOrdinance({ OrdinanceCodeNumber: txt })}
              />
            </View>
          )}
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Note any exterior wall conditions, damage, or concerns"
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
            navigation.navigate("BuildingEnvelopeStep3" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep5" as never, { transition: "slide_from_right" } as never)
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
