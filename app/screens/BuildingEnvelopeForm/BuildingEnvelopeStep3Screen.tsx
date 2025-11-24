import { FC, useEffect, useMemo, useRef, useState } from "react"
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
import { Button } from "@/components/Button"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Controller, useForm, useWatch } from "react-hook-form"
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  ROOFING_MATERIAL_OPTIONS,
  ROOFING_SHINGLE_OPTIONS,
  SECONDARY_ROOF_OPTIONS,
  FLASHING_OPTIONS,
  CURB_MOUNTED_OPTIONS,
  ROOF_STRUCTURE_OPTIONS,
  DRAINAGE_OPTIONS,
  INSULATION_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep3ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep3"> {}

export const BuildingEnvelopeStep3Screen: FC<BuildingEnvelopeStep3ScreenProps> = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const primaryStore = activeAssessment?.buildingEnvelope.step3
  const secondaryStore = activeAssessment?.buildingEnvelope.step3B

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)
  
  // Show/hide secondary roofing
  const [showSecondaryRoof, setShowSecondaryRoof] = useState(
    secondaryStore && !secondaryStore.stepNotApplicable && 
    (secondaryStore.roofType || secondaryStore.warranty || secondaryStore.materialLabor)
  )

  // Form types
  type ConditionT = "good" | "fair" | "poor"
  type RepairT = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"

  type AssessmentVals = {
    condition: ConditionT
    repairStatus: RepairT
    amountToRepair: string
  }

  // Helper to filter out undefined values from assessment
  const filterAssessment = (assessment: any) => {
    const filtered: any = {}
    if (assessment?.condition !== undefined) filtered.condition = assessment.condition
    if (assessment?.repairStatus !== undefined) filtered.repairStatus = assessment.repairStatus
    if (assessment?.amountToRepair !== undefined) filtered.amountToRepair = assessment.amountToRepair
    return Object.keys(filtered).length > 0 ? filtered : undefined
  }

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("BuildingEnvelopeStep4" as never, { transition: "slide_from_right" } as never)
  }

  const handleAddSecondaryRoof = () => {
    setShowSecondaryRoof(true)
    secondaryStore?.updateStepNotApplicable(false)
  }

  const handleRemoveSecondaryRoof = () => {
    setShowSecondaryRoof(false)
    secondaryStore?.updateStepNotApplicable(true)
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep2" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Primary Roofing" style={themed($titleStyle)} />
          <ProgressBar current={3} total={10} />
        </View>

        {/* PRIMARY ROOF - Top Level Fields */}
        <View style={themed($topLevelFields)}>
          <View style={themed($checkboxRow)}>
            <Text preset="formLabel" text="Warranty?" />
            <Checkbox
              value={primaryStore?.warranty ?? false}
              onValueChange={(val) => primaryStore?.updateWarranty(val)}
            />
          </View>

          <View style={themed($checkboxRow)}>
            <Text preset="formLabel" text="Material & Labor?" />
            <Checkbox
              value={primaryStore?.materialLabor ?? false}
              onValueChange={(val) => primaryStore?.updateMaterialLabor(val)}
            />
          </View>

          <TextField
            label="Remaining Years"
            placeholder="Years"
            keyboardType="numeric"
            value={String(primaryStore?.remainingYears ?? "")}
            onChangeText={(txt) => primaryStore?.updateRemainingYears(Number(txt.replace(/[^0-9]/g, "")) || 0)}
          />

          <Dropdown
            label="Roof Type"
            value={primaryStore?.roofType ?? ""}
            onValueChange={(val) => primaryStore?.updateRoofType(val)}
            options={[
              { label: "Flat", value: "Flat" },
              { label: "Pitched", value: "Pitched" },
              { label: "Hip", value: "Hip" },
              { label: "Gable", value: "Gable" },
              { label: "Built-Up", value: "Built-Up" },
              { label: "Other", value: "Other" },
            ]}
          />

          {primaryStore?.roofType === "Other" && (
            <TextField
              label="Specify Other Type"
              placeholder="Describe roof type"
              value={primaryStore?.otherType ?? ""}
              onChangeText={(txt) => primaryStore?.updateOtherType(txt)}
            />
          )}
        </View>

        {/* PRIMARY ROOF - Accordions */}
        <RoofAccordions
          store={primaryStore}
          openKey={openKey}
          setOpenKey={setOpenKey}
          prefix="primary"
          themed={themed}
        />

        {/* Comments for Primary Roof */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Primary Roof Comments"
            placeholder="Note any roofing issues, leaks, or maintenance concerns"
            value={primaryStore?.comments ?? ""}
            onChangeText={(txt) => primaryStore?.updateComments(txt)}
            multiline
            minRows={2}
          />
        </View>

        {/* SECONDARY ROOF SECTION */}
        {!showSecondaryRoof && (
          <View style={themed($addButtonContainer)}>
            <Button
              text="+ Add Secondary Roofing"
              onPress={handleAddSecondaryRoof}
              style={themed($addButton)}
            />
          </View>
        )}

        {showSecondaryRoof && (
          <>
            <View style={themed($secondaryRoofHeader)}>
              <Text preset="subheading" text="Secondary Roofing" style={themed($titleStyle)} />
              <TouchableOpacity
                style={themed($removeButton)}
                onPress={handleRemoveSecondaryRoof}
              >
                <Text text="Remove" style={themed($removeButtonText)} />
              </TouchableOpacity>
            </View>

            {/* SECONDARY ROOF - Top Level Fields */}
            <View style={themed($topLevelFields)}>
              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Warranty?" />
                <Checkbox
                  value={secondaryStore?.warranty ?? false}
                  onValueChange={(val) => secondaryStore?.updateWarranty(val)}
                />
              </View>

              <View style={themed($checkboxRow)}>
                <Text preset="formLabel" text="Material & Labor?" />
                <Checkbox
                  value={secondaryStore?.materialLabor ?? false}
                  onValueChange={(val) => secondaryStore?.updateMaterialLabor(val)}
                />
              </View>

              <TextField
                label="Remaining Years"
                placeholder="Years"
                keyboardType="numeric"
                value={String(secondaryStore?.remainingYears ?? "")}
                onChangeText={(txt) => secondaryStore?.updateRemainingYears(Number(txt.replace(/[^0-9]/g, "")) || 0)}
              />

              <Dropdown
                label="Roof Type"
                value={secondaryStore?.roofType ?? ""}
                onValueChange={(val) => secondaryStore?.updateRoofType(val)}
                options={[
                  { label: "Flat", value: "Flat" },
                  { label: "Pitched", value: "Pitched" },
                  { label: "Hip", value: "Hip" },
                  { label: "Gable", value: "Gable" },
                  { label: "Built-Up", value: "Built-Up" },
                  { label: "Other", value: "Other" },
                ]}
              />

              {secondaryStore?.roofType === "Other" && (
                <TextField
                  label="Specify Other Type"
                  placeholder="Describe roof type"
                  value={secondaryStore?.otherType ?? ""}
                  onChangeText={(txt) => secondaryStore?.updateOtherType(txt)}
                />
              )}
            </View>

            {/* SECONDARY ROOF - Accordions */}
            <RoofAccordions
              store={secondaryStore}
              openKey={openKey}
              setOpenKey={setOpenKey}
              prefix="secondary"
              themed={themed}
            />

            {/* Comments for Secondary Roof */}
            <View style={themed($commentsBlock)}>
              <TextField
                label="Secondary Roof Comments"
                placeholder="Note any roofing issues, leaks, or maintenance concerns"
                value={secondaryStore?.comments ?? ""}
                onChangeText={(txt) => secondaryStore?.updateComments(txt)}
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
            navigation.navigate("BuildingEnvelopeStep2" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={onNext}
          showCamera={true}
        />
      </View>
    </Screen>
  )
})

// Reusable component for all roof accordions
const RoofAccordions: FC<{
  store: any
  openKey: string | null
  setOpenKey: (key: string | null) => void
  prefix: string
  themed: any
}> = observer(({ store, openKey, setOpenKey, prefix, themed }) => {
  // Material accordion
  const materialData = store?.material.materials ?? []
  const materialItems: ChecklistItem[] = ROOFING_MATERIAL_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: materialData.includes(opt.id),
  }))

  // Shingles accordion
  const shinglesData = store?.shingles.shingles ?? []
  const shinglesItems: ChecklistItem[] = ROOFING_SHINGLE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: shinglesData.includes(opt.id),
  }))

  // Secondary Roof accordion (sub-accordion within roof)
  const secondaryRoofData = store?.secondaryRoof.secondaryRoof ?? []
  const secondaryRoofItems: ChecklistItem[] = SECONDARY_ROOF_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: secondaryRoofData.includes(opt.id),
  }))

  // Flashing accordion
  const flashingData = store?.flashing.flashing ?? []
  const flashingItems: ChecklistItem[] = FLASHING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: flashingData.includes(opt.id),
  }))

  // Curb Mounted accordion
  const curbMountedData = store?.curbMounted.curbMounted ?? []
  const curbMountedItems: ChecklistItem[] = CURB_MOUNTED_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: curbMountedData.includes(opt.id),
  }))

  // Roof Structures accordion
  const roofStructuresData = store?.roofStructures.roofStructures ?? []
  const roofStructuresItems: ChecklistItem[] = ROOF_STRUCTURE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: roofStructuresData.includes(opt.id),
  }))

  // Drainage accordion
  const drainageData = store?.drainage.drainage ?? []
  const drainageItems: ChecklistItem[] = DRAINAGE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: drainageData.includes(opt.id),
  }))

  // Insulation accordion
  const insulationData = store?.insulation.insulation ?? []
  const insulationItems: ChecklistItem[] = INSULATION_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: insulationData.includes(opt.id),
  }))

  const toggleMaterial = (id: string, checked: boolean) => {
    const current = materialData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateMaterial({ materials: newArray })
  }

  const toggleShingles = (id: string, checked: boolean) => {
    const current = shinglesData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateShingles({ shingles: newArray })
  }

  const toggleSecondaryRoof = (id: string, checked: boolean) => {
    const current = secondaryRoofData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateSecondaryRoof({ secondaryRoof: newArray })
  }

  const toggleFlashing = (id: string, checked: boolean) => {
    const current = flashingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateFlashing({ flashing: newArray })
  }

  const toggleCurbMounted = (id: string, checked: boolean) => {
    const current = curbMountedData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateCurbMounted({ curbMounted: newArray })
  }

  const toggleRoofStructures = (id: string, checked: boolean) => {
    const current = roofStructuresData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateRoofStructures({ roofStructures: newArray })
  }

  const toggleDrainage = (id: string, checked: boolean) => {
    const current = drainageData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDrainage({ drainage: newArray })
  }

  const toggleInsulation = (id: string, checked: boolean) => {
    const current = insulationData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateInsulation({ insulation: newArray })
  }

  return (
    <>
      <SectionAccordion
        title="Material"
        expanded={openKey === `${prefix}-material`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-material` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Materials" items={materialItems} onToggle={toggleMaterial} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.material.assessment.condition as any}
              onChange={(v: any) => store?.updateMaterial({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.material.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateMaterial({ assessment: { repairStatus: v } })}
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
        title="Shingles"
        expanded={openKey === `${prefix}-shingles`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-shingles` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Shingle Types" items={shinglesItems} onToggle={toggleShingles} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.shingles.assessment.condition as any}
              onChange={(v: any) => store?.updateShingles({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.shingles.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateShingles({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.shingles.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateShingles({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Secondary Roof Features"
        expanded={!store?.secondaryRoof.NotApplicable && openKey === `${prefix}-secondaryRoofFeatures`}
        onToggle={(n) => {
          if (!store?.secondaryRoof.NotApplicable) {
            setOpenKey(n ? `${prefix}-secondaryRoofFeatures` : null)
          }
        }}
        headerStyle={
          store?.secondaryRoof.NotApplicable
            ? themed($naHeaderStyle)
            : undefined
        }
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(store?.secondaryRoof.NotApplicable ?? false))}
            onPress={() => store?.updateSecondaryRoof({ NotApplicable: !store?.secondaryRoof.NotApplicable })}
          >
            <Text
              text="N/A"
              style={themed($naButtonText(store?.secondaryRoof.NotApplicable ?? false))}
            />
          </TouchableOpacity>
        }
      >
        {!store?.secondaryRoof.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField label="Secondary Features" items={secondaryRoofItems} onToggle={toggleSecondaryRoof} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.secondaryRoof.assessment.condition as any}
                  onChange={(v: any) => store?.updateSecondaryRoof({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.secondaryRoof.assessment.repairStatus as any}
                  onChange={(v: any) => store?.updateSecondaryRoof({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.secondaryRoof.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateSecondaryRoof({ assessment: { amountToRepair: txt } })}
              />
          </View>
        )}
      </SectionAccordion>

      <SectionAccordion
        title="Parapets"
        expanded={!store?.parapets.NotApplicable && openKey === `${prefix}-parapets`}
        onToggle={(n) => {
          if (!store?.parapets.NotApplicable) {
            setOpenKey(n ? `${prefix}-parapets` : null)
          }
        }}
        headerStyle={
          store?.parapets.NotApplicable
            ? themed($naHeaderStyle)
            : undefined
        }
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(store?.parapets.NotApplicable ?? false))}
            onPress={() => store?.updateParapets({ NotApplicable: !store?.parapets.NotApplicable })}
          >
            <Text
              text="N/A"
              style={themed($naButtonText(store?.parapets.NotApplicable ?? false))}
            />
          </TouchableOpacity>
        }
      >
        {!store?.parapets.NotApplicable && (
          <View style={themed($sectionBody)}>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.parapets.assessment.condition as any}
              onChange={(v: any) => store?.updateParapets({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.parapets.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateParapets({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.parapets.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateParapets({ assessment: { amountToRepair: txt } })}
          />
        </View>
        )}
      </SectionAccordion>

      <SectionAccordion
        title="Roof Leaks"
        expanded={openKey === `${prefix}-roofLeaks`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-roofLeaks` : null)}
      >
        <View style={themed($sectionBody)}>
          <TextField
            label="Where?"
            placeholder="Describe leak locations"
            value={store?.roofLeaks.where ?? ""}
            onChangeText={(txt) => store?.updateRoofLeaks({ where: txt })}
            multiline
            minRows={2}
          />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.roofLeaks.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateRoofLeaks({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.roofLeaks.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateRoofLeaks({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Flashing"
        expanded={openKey === `${prefix}-flashing`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-flashing` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Flashing Types" items={flashingItems} onToggle={toggleFlashing} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.flashing.assessment.condition as any}
              onChange={(v: any) => store?.updateFlashing({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.flashing.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateFlashing({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.flashing.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateFlashing({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Curb Mounted"
        expanded={openKey === `${prefix}-curbMounted`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-curbMounted` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Curb Mounted Features" items={curbMountedItems} onToggle={toggleCurbMounted} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.curbMounted.assessment.condition as any}
              onChange={(v: any) => store?.updateCurbMounted({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.curbMounted.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateCurbMounted({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.curbMounted.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateCurbMounted({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Roof Structures"
        expanded={openKey === `${prefix}-roofStructures`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-roofStructures` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Structure Types" items={roofStructuresItems} onToggle={toggleRoofStructures} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.roofStructures.assessment.condition as any}
              onChange={(v: any) => store?.updateRoofStructures({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.roofStructures.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateRoofStructures({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.roofStructures.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateRoofStructures({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Mech Screen"
        expanded={!store?.mechScreen.NotApplicable && openKey === `${prefix}-mechScreen`}
        onToggle={(n) => {
          if (!store?.mechScreen.NotApplicable) {
            setOpenKey(n ? `${prefix}-mechScreen` : null)
          }
        }}
        headerStyle={
          store?.mechScreen.NotApplicable
            ? themed($naHeaderStyle)
            : undefined
        }
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(store?.mechScreen.NotApplicable ?? false))}
            onPress={() => store?.updateMechScreen({ NotApplicable: !store?.mechScreen.NotApplicable })}
          >
            <Text
              text="N/A"
              style={themed($naButtonText(store?.mechScreen.NotApplicable ?? false))}
            />
          </TouchableOpacity>
        }
      >
        {!store?.mechScreen.NotApplicable && (
          <View style={themed($sectionBody)}>
            <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.mechScreen.assessment.condition as any}
                  onChange={(v: any) => store?.updateMechScreen({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.mechScreen.assessment.repairStatus as any}
                  onChange={(v: any) => store?.updateMechScreen({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.mechScreen.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateMechScreen({ assessment: { amountToRepair: txt } })}
              />
          </View>
        )}
      </SectionAccordion>

      <SectionAccordion
        title="Drainage"
        expanded={openKey === `${prefix}-drainage`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-drainage` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Drainage Types" items={drainageItems} onToggle={toggleDrainage} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.drainage.assessment.condition as any}
              onChange={(v: any) => store?.updateDrainage({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.drainage.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateDrainage({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.drainage.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateDrainage({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Insulation"
        expanded={openKey === `${prefix}-insulation`}
        onToggle={(n) => setOpenKey(n ? `${prefix}-insulation` : null)}
      >
        <View style={themed($sectionBody)}>
          <ChecklistField label="Insulation Types" items={insulationItems} onToggle={toggleInsulation} />

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.insulation.assessment.condition as any}
              onChange={(v: any) => store?.updateInsulation({ assessment: { condition: v } })}
            />
          </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.insulation.assessment.repairStatus as any}
              onChange={(v: any) => store?.updateInsulation({ assessment: { repairStatus: v } })}
            />
          </View>

          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.insulation.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => store?.updateInsulation({ assessment: { amountToRepair: txt } })}
          />
        </View>
      </SectionAccordion>
    </>
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

const $addButtonContainer: ViewStyle = {
  paddingHorizontal: 16,
  paddingVertical: 24,
  alignItems: "center",
}

const $addButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  minWidth: 200,
  backgroundColor: colors.palette.primary1,
})

const $secondaryRoofHeader: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 32,
  paddingBottom: 16,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $removeButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  backgroundColor: colors.palette.angry100,
})

const $removeButtonText: ThemedStyle<any> = ({ colors }) => ({
  color: colors.palette.angry500,
  fontSize: 14,
  fontWeight: "600",
})

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
