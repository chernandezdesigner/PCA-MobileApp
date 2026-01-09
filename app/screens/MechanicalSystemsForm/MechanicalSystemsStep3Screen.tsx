import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { ChecklistField } from "@/components/ChecklistField"
import type { ChecklistItem } from "@/components/ChecklistCard"
import { Dropdown } from "@/components/Dropdown"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import { 
  CHILLER_TYPE_OPTIONS,
  CHILLER_COOLING_METHOD_OPTIONS,
  CHILLER_REFRIGERANT_TYPE_OPTIONS,
  COOLING_TOWER_TYPE_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep3ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep3"> {}

export const MechanicalSystemsStep3Screen: FC<MechanicalSystemsStep3ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step3

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep4" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  // Get unit lists
  const chillersList = store?.chillers.units.slice() ?? []
  const coolingTowersList = store?.coolingTowers.units.slice() ?? []

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
          <Text preset="subheading" text="Chillers & Cooling Towers" style={themed($titleStyle)} />
          <ProgressBar current={3} total={9} />
        </View>

        {/* ============================================ */}
        {/* CHILLERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Chillers"
          expanded={!store?.chillers.NotApplicable && openKey === "chillers"}
          onToggle={(n) => {
            if (!store?.chillers.NotApplicable) {
              setOpenKey(n ? "chillers" : null)
            }
          }}
          headerStyle={
            store?.chillers.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.chillers.NotApplicable ?? false))}
              onPress={() => store?.updateChillers({ NotApplicable: !store?.chillers.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.chillers.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.chillers.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Chillers" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Chiller" 
                  onPress={() => store?.addChiller(0, 0, 0, 0, "", "", [], "", "")}
                  disabled={chillersList.length >= 3}
                />
              </View>
              
              <View style={$listContainer}>
                {chillersList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Chiller ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updateChiller(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity Each (Tons)"
                            placeholder="Enter capacity"
                            keyboardType="numeric"
                            value={unit.capacityTons?.toString() ?? ""}
                            onChangeText={(val) => store?.updateChiller(unit.id, { 
                              capacityTons: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <View style={$row}>
                          <TextField
                            label="Year Install (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearInstall?.toString() ?? ""}
                            onChangeText={(val) => store?.updateChiller(unit.id, { 
                              yearInstall: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Year Rebuild (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearRebuild?.toString() ?? ""}
                            onChangeText={(val) => store?.updateChiller(unit.id, { 
                              yearRebuild: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <TextField
                          label="Manufacturer(s) and ID/Location(s) of Each"
                          placeholder="Enter manufacturer and location details"
                          value={unit.manufacturerIdLocation}
                          onChangeText={(val) => store?.updateChiller(unit.id, { manufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <Dropdown
                          label="Type"
                          options={CHILLER_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
                          value={unit.chillerType}
                          onValueChange={(val: string) => store?.updateChiller(unit.id, { chillerType: val })}
                        />

                        <ChecklistField
                          label="Cooling Method"
                          items={createChecklistItems(CHILLER_COOLING_METHOD_OPTIONS, unit.coolingMethod.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.coolingMethod.slice(),
                            (newArray) => store?.updateChiller(unit.id, { coolingMethod: newArray })
                          )}
                        />

                        <Dropdown
                          label="Refrigerant"
                          options={CHILLER_REFRIGERANT_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
                          value={unit.refrigerant}
                          onValueChange={(val: string) => store?.updateChiller(unit.id, { refrigerant: val })}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updateChiller(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updateChiller(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateChiller(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Chiller H₂O Pumps"
                          placeholder="Enter pump details"
                          value={unit.chillerH2oPumps}
                          onChangeText={(val) => store?.updateChiller(unit.id, { chillerH2oPumps: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Pump Condition" />
                          <ConditionAssessment
                            value={unit.chillerH2oPumpsAssessment.condition as any}
                            onChange={(v) => store?.updateChiller(unit.id, { chillerH2oPumpsAssessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Pump Repair Status" />
                          <RepairStatus
                            value={unit.chillerH2oPumpsAssessment.repairStatus as any}
                            onChange={(v) => store?.updateChiller(unit.id, { chillerH2oPumpsAssessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Pump Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.chillerH2oPumpsAssessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateChiller(unit.id, { 
                            chillerH2oPumpsAssessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Observations"
                          placeholder="Enter observations"
                          value={unit.observations ?? ""}
                          onChangeText={(val) => store?.updateChiller(unit.id, { observations: val })}
                          multiline
                          minRows={2}
                        />

                        <TextField
                          label="Areas Served"
                          placeholder="Enter areas served"
                          value={unit.areasServed ?? ""}
                          onChangeText={(val) => store?.updateChiller(unit.id, { areasServed: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Chiller"
                            onPress={() => store?.removeChiller(unit.id)}
                          />
                        </View>
                      </View>
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* COOLING TOWERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Cooling Towers"
          expanded={!store?.coolingTowers.NotApplicable && openKey === "coolingTowers"}
          onToggle={(n) => {
            if (!store?.coolingTowers.NotApplicable) {
              setOpenKey(n ? "coolingTowers" : null)
            }
          }}
          headerStyle={
            store?.coolingTowers.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.coolingTowers.NotApplicable ?? false))}
              onPress={() => store?.updateCoolingTowers({ NotApplicable: !store?.coolingTowers.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.coolingTowers.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.coolingTowers.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Cooling Towers" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Cooling Tower" 
                  onPress={() => store?.addCoolingTower(0, 0, 0, 0, "", "", "", "")}
                  disabled={coolingTowersList.length >= 3}
                />
              </View>
              
              <View style={$listContainer}>
                {coolingTowersList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Cooling Tower ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity Each (Tons)"
                            placeholder="Enter capacity"
                            keyboardType="numeric"
                            value={unit.capacityTons?.toString() ?? ""}
                            onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                              capacityTons: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <View style={$row}>
                          <TextField
                            label="Year Install (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearInstall?.toString() ?? ""}
                            onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                              yearInstall: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Year Rebuild (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearRebuild?.toString() ?? ""}
                            onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                              yearRebuild: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <TextField
                          label="Manufacturer(s) and ID/Location(s) of Each"
                          placeholder="Enter manufacturer and location details"
                          value={unit.manufacturerIdLocation}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { manufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <Dropdown
                          label="Type"
                          options={COOLING_TOWER_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
                          value={unit.towerType}
                          onValueChange={(val: string) => store?.updateCoolingTower(unit.id, { towerType: val })}
                        />

                        <Dropdown
                          label="Refrigerant"
                          options={CHILLER_REFRIGERANT_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))}
                          value={unit.refrigerant}
                          onValueChange={(val: string) => store?.updateCoolingTower(unit.id, { refrigerant: val })}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updateCoolingTower(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updateCoolingTower(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Condensed H₂O Pumps"
                          placeholder="Enter pump details"
                          value={unit.condensedH2oPumps}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { condensedH2oPumps: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Pump Condition" />
                          <ConditionAssessment
                            value={unit.condensedH2oPumpsAssessment.condition as any}
                            onChange={(v) => store?.updateCoolingTower(unit.id, { condensedH2oPumpsAssessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Pump Repair Status" />
                          <RepairStatus
                            value={unit.condensedH2oPumpsAssessment.repairStatus as any}
                            onChange={(v) => store?.updateCoolingTower(unit.id, { condensedH2oPumpsAssessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Pump Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.condensedH2oPumpsAssessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { 
                            condensedH2oPumpsAssessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Observations"
                          placeholder="Enter observations"
                          value={unit.observations ?? ""}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { observations: val })}
                          multiline
                          minRows={2}
                        />

                        <TextField
                          label="Areas Served"
                          placeholder="Enter areas served"
                          value={unit.areasServed ?? ""}
                          onChangeText={(val) => store?.updateCoolingTower(unit.id, { areasServed: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Cooling Tower"
                            onPress={() => store?.removeCoolingTower(unit.id)}
                          />
                        </View>
                      </View>
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about chillers and cooling towers"
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

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  opacity: 0.6,
})

const $naButton = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 4,
  backgroundColor: isActive ? colors.palette.primary2 : colors.palette.neutral300,
})

const $naButtonText = (isActive: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isActive ? colors.palette.neutral100 : colors.text,
  fontSize: 12,
  fontWeight: "600",
})

const $subSectionHeader: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.palette.primary2,
  marginBottom: 4,
})

const $sectionHeaderRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const $listContainer: ViewStyle = {
  gap: 12,
  marginBottom: 16,
}

const $cardFields: ViewStyle = {
  gap: 12,
}

const $alignEnd: ViewStyle = {
  alignItems: "flex-end",
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $halfWidth: ViewStyle = {
  flex: 1,
}
