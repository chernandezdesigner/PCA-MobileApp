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
  BOILER_HEAT_TYPE_OPTIONS,
  BOILER_FUEL_TYPE_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep4ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep4"> {}

export const MechanicalSystemsStep4Screen: FC<MechanicalSystemsStep4ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step4

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep5" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  // Get unit lists
  const heatBoilersList = store?.heatBoilers.units.slice() ?? []
  const plumbingWaterBoilersList = store?.plumbingWaterBoilers.units.slice() ?? []

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
          <Text preset="subheading" text="Boilers" style={themed($titleStyle)} />
          <ProgressBar current={4} total={9} />
        </View>

        {/* ============================================ */}
        {/* HEAT BOILERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Boilers - Heat"
          expanded={!store?.heatBoilers.NotApplicable && openKey === "heatBoilers"}
          onToggle={(n) => {
            if (!store?.heatBoilers.NotApplicable) {
              setOpenKey(n ? "heatBoilers" : null)
            }
          }}
          headerStyle={
            store?.heatBoilers.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.heatBoilers.NotApplicable ?? false))}
              onPress={() => store?.updateHeatBoilers({ NotApplicable: !store?.heatBoilers.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.heatBoilers.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.heatBoilers.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Boilers" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Boiler" 
                  onPress={() => store?.addHeatBoiler(0, 0, 0, 0, "", [], [], "")}
                  disabled={heatBoilersList.length >= 2}
                />
              </View>
              
              <View style={$listContainer}>
                {heatBoilersList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Boiler ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity Each (BTU)"
                            placeholder="Enter capacity"
                            keyboardType="numeric"
                            value={unit.capacityBTU?.toString() ?? ""}
                            onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                              capacityBTU: val ? parseInt(val, 10) : 0 
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
                            onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                              yearInstall: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Year Rebuild (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearRebuild?.toString() ?? ""}
                            onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                              yearRebuild: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <TextField
                          label="Manufacturer(s) and ID/Location(s) of Each"
                          placeholder="Enter manufacturer and location details"
                          value={unit.manufacturerIdLocation}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { manufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <ChecklistField
                          label="Type"
                          items={createChecklistItems(BOILER_HEAT_TYPE_OPTIONS, unit.boilerType.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.boilerType.slice(),
                            (newArray) => store?.updateHeatBoiler(unit.id, { boilerType: newArray })
                          )}
                        />

                        <ChecklistField
                          label="Fuel Type"
                          items={createChecklistItems(BOILER_FUEL_TYPE_OPTIONS, unit.fuelType.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.fuelType.slice(),
                            (newArray) => store?.updateHeatBoiler(unit.id, { fuelType: newArray })
                          )}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updateHeatBoiler(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updateHeatBoiler(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Water Pumps - Manufacturer(s) and ID/Location(s)"
                          placeholder="Enter water pump manufacturer and location details"
                          value={unit.waterPumpsManufacturerIdLocation}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { waterPumpsManufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Water Pumps Condition" />
                          <ConditionAssessment
                            value={unit.waterPumpsAssessment.condition as any}
                            onChange={(v) => store?.updateHeatBoiler(unit.id, { waterPumpsAssessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Water Pumps Repair Status" />
                          <RepairStatus
                            value={unit.waterPumpsAssessment.repairStatus as any}
                            onChange={(v) => store?.updateHeatBoiler(unit.id, { waterPumpsAssessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Water Pumps Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.waterPumpsAssessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { 
                            waterPumpsAssessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Observations"
                          placeholder="Enter observations"
                          value={unit.observations ?? ""}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { observations: val })}
                          multiline
                          minRows={2}
                        />

                        <TextField
                          label="Areas Served"
                          placeholder="Enter areas served"
                          value={unit.areasServed ?? ""}
                          onChangeText={(val) => store?.updateHeatBoiler(unit.id, { areasServed: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Boiler"
                            onPress={() => store?.removeHeatBoiler(unit.id)}
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
        {/* PLUMBING WATER BOILERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Boilers - Plumbing Water"
          expanded={!store?.plumbingWaterBoilers.NotApplicable && openKey === "plumbingWaterBoilers"}
          onToggle={(n) => {
            if (!store?.plumbingWaterBoilers.NotApplicable) {
              setOpenKey(n ? "plumbingWaterBoilers" : null)
            }
          }}
          headerStyle={
            store?.plumbingWaterBoilers.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.plumbingWaterBoilers.NotApplicable ?? false))}
              onPress={() => store?.updatePlumbingWaterBoilers({ NotApplicable: !store?.plumbingWaterBoilers.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.plumbingWaterBoilers.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.plumbingWaterBoilers.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Boilers" style={themed($subSectionHeader)} />
                <Button 
                  text="Add Boiler" 
                  onPress={() => store?.addPlumbingWaterBoiler(0, 0, 0, 0, "", [], [], "")}
                  disabled={plumbingWaterBoilersList.length >= 2}
                />
              </View>
              
              <View style={$listContainer}>
                {plumbingWaterBoilersList.map((unit, index) => (
                  <Card
                    key={unit.id}
                    HeadingComponent={<Text weight="bold" text={`Boiler ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <View style={$row}>
                          <TextField
                            label="Quantity"
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={unit.quantity?.toString() ?? ""}
                            onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                              quantity: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity Each (BTU)"
                            placeholder="Enter capacity"
                            keyboardType="numeric"
                            value={unit.capacityBTU?.toString() ?? ""}
                            onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                              capacityBTU: val ? parseInt(val, 10) : 0 
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
                            onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                              yearInstall: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Year Rebuild (ea.)"
                            placeholder="Year"
                            keyboardType="numeric"
                            value={unit.yearRebuild?.toString() ?? ""}
                            onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                              yearRebuild: val ? parseInt(val, 10) : 0 
                            })}
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <TextField
                          label="Manufacturer(s) and ID/Location(s) of Each"
                          placeholder="Enter manufacturer and location details"
                          value={unit.manufacturerIdLocation}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { manufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <ChecklistField
                          label="Type"
                          items={createChecklistItems(BOILER_HEAT_TYPE_OPTIONS, unit.boilerType.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.boilerType.slice(),
                            (newArray) => store?.updatePlumbingWaterBoiler(unit.id, { boilerType: newArray })
                          )}
                        />

                        <ChecklistField
                          label="Fuel Type"
                          items={createChecklistItems(BOILER_FUEL_TYPE_OPTIONS, unit.fuelType.slice())}
                          onToggle={createArrayToggleHandler(
                            unit.fuelType.slice(),
                            (newArray) => store?.updatePlumbingWaterBoiler(unit.id, { fuelType: newArray })
                          )}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={unit.assessment.condition as any}
                            onChange={(v) => store?.updatePlumbingWaterBoiler(unit.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={unit.assessment.repairStatus as any}
                            onChange={(v) => store?.updatePlumbingWaterBoiler(unit.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.assessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                            assessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Water Pumps - Manufacturer(s) and ID/Location(s)"
                          placeholder="Enter water pump manufacturer and location details"
                          value={unit.waterPumpsManufacturerIdLocation}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { waterPumpsManufacturerIdLocation: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Water Pumps Condition" />
                          <ConditionAssessment
                            value={unit.waterPumpsAssessment.condition as any}
                            onChange={(v) => store?.updatePlumbingWaterBoiler(unit.id, { waterPumpsAssessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Water Pumps Repair Status" />
                          <RepairStatus
                            value={unit.waterPumpsAssessment.repairStatus as any}
                            onChange={(v) => store?.updatePlumbingWaterBoiler(unit.id, { waterPumpsAssessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Water Pumps Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="numeric"
                          value={unit.waterPumpsAssessment.amountToRepair ?? ""}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { 
                            waterPumpsAssessment: { amountToRepair: val } 
                          })}
                        />

                        <TextField
                          label="Observations"
                          placeholder="Enter observations"
                          value={unit.observations ?? ""}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { observations: val })}
                          multiline
                          minRows={2}
                        />

                        <TextField
                          label="Areas Served"
                          placeholder="Enter areas served"
                          value={unit.areasServed ?? ""}
                          onChangeText={(val) => store?.updatePlumbingWaterBoiler(unit.id, { areasServed: val })}
                          multiline
                          minRows={2}
                        />

                        <View style={$alignEnd}>
                          <Button
                            preset="reversed"
                            text="Remove Boiler"
                            onPress={() => store?.removePlumbingWaterBoiler(unit.id)}
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
            placeholder="Additional notes about boilers"
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
