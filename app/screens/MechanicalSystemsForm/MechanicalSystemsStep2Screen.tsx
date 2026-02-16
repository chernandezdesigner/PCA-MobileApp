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
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import { 
  UNIT_HEATER_TYPE_OPTIONS,
  MISC_UNITS_HEAT_SOURCE_OPTIONS,
  MISC_UNITS_MOUNTING_LOCATION_OPTIONS,
  AIR_HANDLER_MOUNTING_LOCATION_OPTIONS,
  EXHAUST_LOCATION_OPTIONS,
  RESPONSIBILITY_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep2ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep2"> {}

export const MechanicalSystemsStep2Screen: FC<MechanicalSystemsStep2ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step2

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep3" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep1" as never, { transition: "slide_from_left" } as never)
  }

  // Get unit lists
  const unitHeatersList = store?.unitHeaters.units.slice() ?? []
  const airHandlingUnitsList = store?.airHandlingUnits.units.slice() ?? []
  const exhaustFansList = store?.exhaustFans.units.slice() ?? []

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
        <View style={$introBlock}>
          <Text preset="subheading" text="Misc Units" style={themed($titleStyle)} />
          <ProgressBar current={2} total={9} />
        </View>

        {/* ============================================ */}
        {/* UNIT HEATERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Unit Heaters"
          expanded={!store?.unitHeaters.NotApplicable && openKey === "unitHeaters"}
          onToggle={(n) => {
            if (!store?.unitHeaters.NotApplicable) {
              setOpenKey(n ? "unitHeaters" : null)
            }
          }}
          headerStyle={
            store?.unitHeaters.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.unitHeaters.NotApplicable ?? false))}
              onPress={() => store?.updateUnitHeaters({ NotApplicable: !store?.unitHeaters.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.unitHeaters.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.unitHeaters.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Units" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Unit" 
                  onPress={() => store?.addUnitHeater("", 0, "", [], [])}
                  disabled={unitHeatersList.length >= 3}
                />
              </View>
              
              <View style={$listContainer}>
                {unitHeatersList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Unit ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Type"
                            placeholder="Enter type"
                            value={unit.type}
                            onChangeText={(val) => store?.updateUnitHeater(unit.id, { type: val })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="decimal-pad"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updateUnitHeater(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>
                        
                        <TextField
                          label="Capacity Range"
                          placeholder="Enter capacity range"
                          value={unit.capacityRange}
                          onChangeText={(val) => store?.updateUnitHeater(unit.id, { capacityRange: val })}
                        />

                        <ChecklistField
                          label="Heat Source"
                          items={createChecklistItems(MISC_UNITS_HEAT_SOURCE_OPTIONS, unit.heatSource.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.heatSource.slice(),
                            (newArray) => store?.updateUnitHeater(unit.id, { heatSource: newArray })
                          )}
                        />

                        <ChecklistField
                          label="Mounted"
                          items={createChecklistItems(MISC_UNITS_MOUNTING_LOCATION_OPTIONS, unit.mounted.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.mounted.slice(),
                            (newArray) => store?.updateUnitHeater(unit.id, { mounted: newArray })
                          )}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updateUnitHeater(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updateUnitHeater(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="decimal-pad"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateUnitHeater(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Unit"
                            onPress={() => store?.removeUnitHeater(unit.id)}
                          />
                        </View>
                      </View>
                    }
                  />
                ))}
              </View>

              {/* Shared Fields */}
              <View style={themed($sharedFieldsSection)}>
                <Text preset="formLabel" text="Shared Information" style={themed($subSectionHeader)} />
                
                <TextField
                  label="Observations/Issues"
                  placeholder="Enter observations or issues"
                  value={store?.unitHeaters.observationsIssues ?? ""}
                  onChangeText={(val) => store?.updateUnitHeaters({ observationsIssues: val })}
                  multiline
                  minRows={2}
                />

                <TextField
                  label="Areas Served"
                  placeholder="Enter areas served"
                  value={store?.unitHeaters.areasServed ?? ""}
                  onChangeText={(val) => store?.updateUnitHeaters({ areasServed: val })}
                  multiline
                  minRows={2}
                />

                <ChecklistField
                  label="Maintenance Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.unitHeaters.maintenanceResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.unitHeaters.maintenanceResponsibility.slice(),
                    (newArray) => store?.updateUnitHeaters({ maintenanceResponsibility: newArray })
                  )}
                />

                <ChecklistField
                  label="Replacement Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.unitHeaters.replacementResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.unitHeaters.replacementResponsibility.slice(),
                    (newArray) => store?.updateUnitHeaters({ replacementResponsibility: newArray })
                  )}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* AIR HANDLING UNITS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Air Handling Units"
          expanded={!store?.airHandlingUnits.NotApplicable && openKey === "airHandlingUnits"}
          onToggle={(n) => {
            if (!store?.airHandlingUnits.NotApplicable) {
              setOpenKey(n ? "airHandlingUnits" : null)
            }
          }}
          headerStyle={
            store?.airHandlingUnits.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.airHandlingUnits.NotApplicable ?? false))}
              onPress={() => store?.updateAirHandlingUnits({ NotApplicable: !store?.airHandlingUnits.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.airHandlingUnits.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.airHandlingUnits.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Units" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Unit" 
                  onPress={() => store?.addAirHandlingUnit(0, 0, [], [])}
                  disabled={airHandlingUnitsList.length >= 3}
                />
              </View>
              
              <View style={$listContainer}>
                {airHandlingUnitsList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Unit ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="decimal-pad"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updateAirHandlingUnit(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="CFM"
                            placeholder="Enter CFM"
                            keyboardType="decimal-pad"
                            value={unit.cfm?.toString() ?? ""}
                            onChangeText={(val) => store?.updateAirHandlingUnit(unit.id, { 
                              cfm: val ? parseFloat(val) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <ChecklistField
                          label="Heat Source"
                          items={createChecklistItems(MISC_UNITS_HEAT_SOURCE_OPTIONS, unit.heatSource.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.heatSource.slice(),
                            (newArray) => store?.updateAirHandlingUnit(unit.id, { heatSource: newArray })
                          )}
                        />

                        <ChecklistField
                          label="Mounted"
                          items={createChecklistItems(AIR_HANDLER_MOUNTING_LOCATION_OPTIONS, unit.mounted.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.mounted.slice(),
                            (newArray) => store?.updateAirHandlingUnit(unit.id, { mounted: newArray })
                          )}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updateAirHandlingUnit(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updateAirHandlingUnit(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="decimal-pad"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateAirHandlingUnit(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Unit"
                            onPress={() => store?.removeAirHandlingUnit(unit.id)}
                          />
                        </View>
                      </View>
                    }
                  />
                ))}
              </View>

              {/* Shared Fields */}
              <View style={themed($sharedFieldsSection)}>
                <Text preset="formLabel" text="Shared Information" style={themed($subSectionHeader)} />
                
                <TextField
                  label="Observations/Issues"
                  placeholder="Enter observations or issues"
                  value={store?.airHandlingUnits.observationsIssues ?? ""}
                  onChangeText={(val) => store?.updateAirHandlingUnits({ observationsIssues: val })}
                  multiline
                  minRows={2}
                />

                <TextField
                  label="Areas Served"
                  placeholder="Enter areas served"
                  value={store?.airHandlingUnits.areasServed ?? ""}
                  onChangeText={(val) => store?.updateAirHandlingUnits({ areasServed: val })}
                  multiline
                  minRows={2}
                />

                <ChecklistField
                  label="Maintenance Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.airHandlingUnits.maintenanceResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.airHandlingUnits.maintenanceResponsibility.slice(),
                    (newArray) => store?.updateAirHandlingUnits({ maintenanceResponsibility: newArray })
                  )}
                />

                <ChecklistField
                  label="Replacement Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.airHandlingUnits.replacementResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.airHandlingUnits.replacementResponsibility.slice(),
                    (newArray) => store?.updateAirHandlingUnits({ replacementResponsibility: newArray })
                  )}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* EXHAUST FANS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Exhaust Fans"
          expanded={!store?.exhaustFans.NotApplicable && openKey === "exhaustFans"}
          onToggle={(n) => {
            if (!store?.exhaustFans.NotApplicable) {
              setOpenKey(n ? "exhaustFans" : null)
            }
          }}
          headerStyle={
            store?.exhaustFans.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.exhaustFans.NotApplicable ?? false))}
              onPress={() => store?.updateExhaustFans({ NotApplicable: !store?.exhaustFans.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.exhaustFans.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.exhaustFans.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Units" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Unit" 
                  onPress={() => store?.addExhaustFan(0, [])}
                  disabled={exhaustFansList.length >= 3}
                />
              </View>
              
              <View style={$listContainer}>
                {exhaustFansList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Unit ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <TextField
                          label="Quantity"
                          placeholder="Enter quantity"
                          keyboardType="decimal-pad"
                          value={unit.quantity?.toString() ?? ""}
                          onChangeText={(val) => store?.updateExhaustFan(unit.id, { 
                            quantity: val ? parseInt(val, 10) : 0 
                          })}
                        />

                        <ChecklistField
                          label="Location"
                          items={createChecklistItems(EXHAUST_LOCATION_OPTIONS, unit.location.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.location.slice(),
                            (newArray) => store?.updateExhaustFan(unit.id, { location: newArray })
                          )}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Unit"
                            onPress={() => store?.removeExhaustFan(unit.id)}
                          />
                        </View>
                      </View>
                    }
                  />
                ))}
              </View>

              {/* Shared Fields */}
              <View style={themed($sharedFieldsSection)}>
                <Text preset="formLabel" text="Shared Information" style={themed($subSectionHeader)} />
                
                <TextField
                  label="Observations/Issues"
                  placeholder="Enter observations or issues"
                  value={store?.exhaustFans.observationsIssues ?? ""}
                  onChangeText={(val) => store?.updateExhaustFans({ observationsIssues: val })}
                  multiline
                  minRows={2}
                />

                <TextField
                  label="Areas Served"
                  placeholder="Enter areas served"
                  value={store?.exhaustFans.areasServed ?? ""}
                  onChangeText={(val) => store?.updateExhaustFans({ areasServed: val })}
                  multiline
                  minRows={2}
                />

                <ChecklistField
                  label="Maintenance Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.exhaustFans.maintenanceResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.exhaustFans.maintenanceResponsibility.slice(),
                    (newArray) => store?.updateExhaustFans({ maintenanceResponsibility: newArray })
                  )}
                />

                <ChecklistField
                  label="Replacement Responsibility"
                  items={createChecklistItems(
                    RESPONSIBILITY_OPTIONS,
                    store?.exhaustFans.replacementResponsibility.slice() ?? []
                  )}
                  onToggle={createArrayToggleHandler(
                    store?.exhaustFans.replacementResponsibility.slice(),
                    (newArray) => store?.updateExhaustFans({ replacementResponsibility: newArray })
                  )}
                />
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
            placeholder="Additional notes about misc units"
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

const $sharedFieldsSection: ViewStyle = {
  gap: 16,
  marginTop: 24,
  paddingTop: 16,
  borderTopWidth: 2,
  borderTopColor: "#E0E0E0",
}
