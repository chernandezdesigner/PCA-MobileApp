import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TextStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { ChecklistField } from "@/components/ChecklistField"
import type { ChecklistItem } from "@/components/ChecklistCard"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import { 
  DOMESTIC_PIPING_MATERIAL_OPTIONS,
  WATERMETERS_OPTIONS,
  WASTEPIPING_MATERIAL_OPTIONS,
  NATURAL_GAS_PIPING_MATERIAL_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep5ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep5"> {}

export const MechanicalSystemsStep5Screen: FC<MechanicalSystemsStep5ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step5

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep6" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  // Create checklist helpers
  const createChecklistItems = (options: readonly { id: string; label: string }[], selectedIds: string[]) => {
    return options.map(opt => ({
      id: opt.id,
      label: opt.label,
      checked: selectedIds.includes(opt.id),
    }))
  }

  const createArrayToggleHandler = (currentArray: string[] | undefined, onChange: (newArray: string[]) => void) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      onChange(newArray)
    }
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Mechanical Systems"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Plumbing Systems" style={themed($titleStyle)} />
          <ProgressBar current={5} total={9} />
        </View>

        {/* ============================================ */}
        {/* DOMESTIC PIPING */}
        {/* ============================================ */}
        <SectionAccordion
          title="Domestic Piping"
          expanded={openKey === "domesticPiping"}
          onToggle={(n) => setOpenKey(n ? "domesticPiping" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(DOMESTIC_PIPING_MATERIAL_OPTIONS, store?.domesticPiping.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.domesticPiping.type.slice(),
                (newArray) => store?.updateDomesticPiping({ type: newArray })
              )}
            />

            <TextField
              label="Observations"
              placeholder="Enter observations"
              value={store?.domesticPiping.observations ?? ""}
              onChangeText={(val) => store?.updateDomesticPiping({ observations: val })}
              multiline
              minRows={3}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.domesticPiping.assessment.condition as any}
                onChange={(v) => store?.updateDomesticPiping({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.domesticPiping.assessment.repairStatus as any}
                onChange={(v) => store?.updateDomesticPiping({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.domesticPiping.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateDomesticPiping({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* WATER METER */}
        {/* ============================================ */}
        <SectionAccordion
          title="Water Meter"
          expanded={openKey === "waterMeter"}
          onToggle={(n) => setOpenKey(n ? "waterMeter" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(WATERMETERS_OPTIONS, store?.waterMeter.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.waterMeter.type.slice(),
                (newArray) => store?.updateWaterMeter({ type: newArray })
              )}
            />

            <TextField
              label="Observations"
              placeholder="Enter observations"
              value={store?.waterMeter.observations ?? ""}
              onChangeText={(val) => store?.updateWaterMeter({ observations: val })}
              multiline
              minRows={3}
            />

            <Text preset="formLabel" text="Booster Pumps" style={themed($subSectionLabel)} />
            
            <ChecklistField
              label="Has Booster Pumps?"
              items={[
                { id: "no", label: "No", checked: !store?.waterMeter.hasBoosterPumps },
                { id: "yes", label: "Yes", checked: store?.waterMeter.hasBoosterPumps ?? false },
              ]}
              onToggle={(id, checked) => {
                if (id === "yes") {
                  store?.updateWaterMeter({ hasBoosterPumps: checked })
                } else {
                  store?.updateWaterMeter({ hasBoosterPumps: !checked })
                }
              }}
            />

            {store?.waterMeter.hasBoosterPumps && (
              <View style={$row}>
                <TextField
                  label="Quantity (#)"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.waterMeter.boosterPumpsQuantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWaterMeter({ 
                    boosterPumpsQuantity: val ? parseInt(val, 10) : 0 
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="GPM (#)"
                  placeholder="Enter GPM"
                  keyboardType="numeric"
                  value={store?.waterMeter.boosterPumpsGPM?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWaterMeter({ 
                    boosterPumpsGPM: val ? parseInt(val, 10) : 0 
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
            )}

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.waterMeter.assessment.condition as any}
                onChange={(v) => store?.updateWaterMeter({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.waterMeter.assessment.repairStatus as any}
                onChange={(v) => store?.updateWaterMeter({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.waterMeter.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateWaterMeter({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* WASTE PIPING */}
        {/* ============================================ */}
        <SectionAccordion
          title="Waste Piping"
          expanded={openKey === "wastePiping"}
          onToggle={(n) => setOpenKey(n ? "wastePiping" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(WASTEPIPING_MATERIAL_OPTIONS, store?.wastePiping.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.wastePiping.type.slice(),
                (newArray) => store?.updateWastePiping({ type: newArray })
              )}
            />

            <TextField
              label="Observations"
              placeholder="Enter observations"
              value={store?.wastePiping.observations ?? ""}
              onChangeText={(val) => store?.updateWastePiping({ observations: val })}
              multiline
              minRows={3}
            />

            <Text preset="formLabel" text="Sewer Lift Station" style={themed($subSectionLabel)} />
            
            <ChecklistField
              label="Has Sewer Lift Station?"
              items={[
                { id: "no", label: "No", checked: !store?.wastePiping.hasSewerLiftStation },
                { id: "yes", label: "Yes", checked: store?.wastePiping.hasSewerLiftStation ?? false },
              ]}
              onToggle={(id, checked) => {
                if (id === "yes") {
                  store?.updateWastePiping({ hasSewerLiftStation: checked })
                } else {
                  store?.updateWastePiping({ hasSewerLiftStation: !checked })
                }
              }}
            />

            {store?.wastePiping.hasSewerLiftStation && (
              <TextField
                label="Location"
                placeholder="Enter sewer lift station location"
                value={store?.wastePiping.sewerLiftStationLocation ?? ""}
                onChangeText={(val) => store?.updateWastePiping({ sewerLiftStationLocation: val })}
              />
            )}

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.wastePiping.assessment.condition as any}
                onChange={(v) => store?.updateWastePiping({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.wastePiping.assessment.repairStatus as any}
                onChange={(v) => store?.updateWastePiping({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.wastePiping.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateWastePiping({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* NATURAL GAS PIPE */}
        {/* ============================================ */}
        <SectionAccordion
          title="Natural Gas Pipe"
          expanded={openKey === "naturalGasPipe"}
          onToggle={(n) => setOpenKey(n ? "naturalGasPipe" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(NATURAL_GAS_PIPING_MATERIAL_OPTIONS, store?.naturalGasPipe.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.naturalGasPipe.type.slice(),
                (newArray) => store?.updateNaturalGasPipe({ type: newArray })
              )}
            />

            <TextField
              label="Observations"
              placeholder="Enter observations"
              value={store?.naturalGasPipe.observations ?? ""}
              onChangeText={(val) => store?.updateNaturalGasPipe({ observations: val })}
              multiline
              minRows={3}
            />

            <TextField
              label="Gas Meter Location"
              placeholder="Enter gas meter location"
              value={store?.naturalGasPipe.gasMeterLocation ?? ""}
              onChangeText={(val) => store?.updateNaturalGasPipe({ gasMeterLocation: val })}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.naturalGasPipe.assessment.condition as any}
                onChange={(v) => store?.updateNaturalGasPipe({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.naturalGasPipe.assessment.repairStatus as any}
                onChange={(v) => store?.updateNaturalGasPipe({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.naturalGasPipe.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateNaturalGasPipe({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about plumbing systems"
            value={store?.comments ?? ""}
            onChangeText={(val) => store?.updateComments(val)}
            multiline
            minRows={2}
          />
        </View>
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

const $subSectionLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 15,
  fontWeight: "600",
  color: colors.palette.primary2,
  marginTop: 8,
})

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $halfWidth: ViewStyle = {
  flex: 1,
}
