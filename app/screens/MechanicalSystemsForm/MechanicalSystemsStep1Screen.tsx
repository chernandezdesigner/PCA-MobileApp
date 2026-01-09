import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Dropdown } from "@/components/Dropdown"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import { 
  REFRIGERANT_TYPE_OPTIONS,
  HEAT_SOURCE_OPTIONS,
  RESPONSIBILITY_OPTIONS,
  HVAC_UNIT_TYPE_OPTIONS 
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep1ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep1"> {}

export const MechanicalSystemsStep1Screen: FC<MechanicalSystemsStep1ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step1

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)
  
  // Local state for mounting location selection
  const [packagedUnitsLocation, setPackagedUnitsLocation] = useState<"gradeMountedRooftop" | "rooftop">("gradeMountedRooftop")
  const [condenserLocation, setCondenserLocation] = useState<"padMountedRooftop" | "rooftop">("padMountedRooftop")
  const [heatPumpLocation, setHeatPumpLocation] = useState<"padMountedRooftop" | "rooftop">("padMountedRooftop")

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep2" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  // Dropdown options
  const refrigerantOptions = REFRIGERANT_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))
  const heatSourceOptions = HEAT_SOURCE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))
  const responsibilityOptions = RESPONSIBILITY_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))
  const hvacUnitTypeOptions = HVAC_UNIT_TYPE_OPTIONS.map(opt => ({ label: opt.label, value: opt.id }))
  
  // Mounting location options
  const packagedUnitLocationOptions = [
    { label: "Grade-mounted", value: "gradeMountedRooftop" },
    { label: "Rooftop", value: "rooftop" },
  ]
  const splitSystemLocationOptions = [
    { label: "Pad-mounted", value: "padMountedRooftop" },
    { label: "Rooftop", value: "rooftop" },
  ]

  const unitManufacturerList = store?.unitManufacturerSpecifics.slice() ?? []

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
          <Text preset="subheading" text="HVAC Individual Units" style={themed($titleStyle)} />
          <ProgressBar current={1} total={9} />
        </View>

        {/* ============================================ */}
        {/* PACKAGED UNITS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Packaged Units"
          expanded={!store?.packagedUnits.NotApplicable && openKey === "packagedUnits"}
          onToggle={(n) => {
            if (!store?.packagedUnits.NotApplicable) {
              setOpenKey(n ? "packagedUnits" : null)
            }
          }}
          headerStyle={
            store?.packagedUnits.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.packagedUnits.NotApplicable ?? false))}
              onPress={() => store?.updatePackagedUnits({ NotApplicable: !store?.packagedUnits.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.packagedUnits.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.packagedUnits.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Dropdown
                label="Mounting Location"
                options={packagedUnitLocationOptions}
                value={packagedUnitsLocation}
                onValueChange={(val) => setPackagedUnitsLocation(val as "gradeMountedRooftop" | "rooftop")}
              />
              
              <View style={themed($unitFieldsGroup)}>
                <View style={$row}>
                  <TextField
                    label="Quantity"
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    value={store?.packagedUnits[packagedUnitsLocation].quantity?.toString() ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { quantity: val ? parseInt(val, 10) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Capacity Range (Tons)"
                    placeholder="e.g., 3-5"
                    value={store?.packagedUnits[packagedUnitsLocation].capacityRangeTons ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { capacityRangeTons: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Total Capacity (Tons)"
                    placeholder="Enter total"
                    keyboardType="numeric"
                    value={store?.packagedUnits[packagedUnitsLocation].totalCapacityTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { totalCapacityTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 0-10 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.packagedUnits[packagedUnitsLocation].age0to10Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { age0to10Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Age 11-20 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.packagedUnits[packagedUnitsLocation].age11to20Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { age11to20Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 21+ Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.packagedUnits[packagedUnitsLocation].age21PlusTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { age21PlusTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <Dropdown
                  label="Refrigerant Type"
                  options={refrigerantOptions}
                  value={store?.packagedUnits[packagedUnitsLocation].refrigerantType ?? ""}
                  onValueChange={(val) => store?.updatePackagedUnits({ 
                    [packagedUnitsLocation]: { refrigerantType: val }
                  })}
                />
                {store?.packagedUnits[packagedUnitsLocation].refrigerantType === "other" && (
                  <TextField
                    label="Other Refrigerant Specification"
                    placeholder="Specify refrigerant type"
                    value={store?.packagedUnits[packagedUnitsLocation].refrigerantOtherSpec ?? ""}
                    onChangeText={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { refrigerantOtherSpec: val }
                    })}
                  />
                )}
                <Dropdown
                  label="Heat Source"
                  options={heatSourceOptions}
                  value={store?.packagedUnits[packagedUnitsLocation].heatSource ?? ""}
                  onValueChange={(val) => store?.updatePackagedUnits({ 
                    [packagedUnitsLocation]: { heatSource: val }
                  })}
                />
                <View style={$row}>
                  <Dropdown
                    label="Maintenance Responsibility"
                    options={responsibilityOptions}
                    value={store?.packagedUnits[packagedUnitsLocation].maintenanceResponsibility ?? ""}
                    onValueChange={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { maintenanceResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <Dropdown
                    label="Replacement Responsibility"
                    options={responsibilityOptions}
                    value={store?.packagedUnits[packagedUnitsLocation].replacementResponsibility ?? ""}
                    onValueChange={(val) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { replacementResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.packagedUnits[packagedUnitsLocation].assessment.condition as any}
                    onChange={(v) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { assessment: { condition: v } }
                    })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.packagedUnits[packagedUnitsLocation].assessment.repairStatus as any}
                    onChange={(v) => store?.updatePackagedUnits({ 
                      [packagedUnitsLocation]: { assessment: { repairStatus: v } }
                    })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={store?.packagedUnits[packagedUnitsLocation].assessment.amountToRepair ?? ""}
                  onChangeText={(val) => store?.updatePackagedUnits({ 
                    [packagedUnitsLocation]: { assessment: { amountToRepair: val } }
                  })}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* SPLIT SYSTEM - CONDENSER COOLING */}
        {/* ============================================ */}
        <SectionAccordion
          title="Split System - Condenser Cooling"
          expanded={!store?.splitSystemCondenser.NotApplicable && openKey === "splitSystemCondenser"}
          onToggle={(n) => {
            if (!store?.splitSystemCondenser.NotApplicable) {
              setOpenKey(n ? "splitSystemCondenser" : null)
            }
          }}
          headerStyle={
            store?.splitSystemCondenser.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.splitSystemCondenser.NotApplicable ?? false))}
              onPress={() => store?.updateSplitSystemCondenser({ NotApplicable: !store?.splitSystemCondenser.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.splitSystemCondenser.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.splitSystemCondenser.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Dropdown
                label="Mounting Location"
                options={splitSystemLocationOptions}
                value={condenserLocation}
                onValueChange={(val) => setCondenserLocation(val as "padMountedRooftop" | "rooftop")}
              />
              
              <View style={themed($unitFieldsGroup)}>
                <View style={$row}>
                  <TextField
                    label="Quantity"
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    value={store?.splitSystemCondenser[condenserLocation].quantity?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { quantity: val ? parseInt(val, 10) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Capacity Range (Tons)"
                    placeholder="e.g., 3-5"
                    value={store?.splitSystemCondenser[condenserLocation].capacityRangeTons ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { capacityRangeTons: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Total Capacity (Tons)"
                    placeholder="Enter total"
                    keyboardType="numeric"
                    value={store?.splitSystemCondenser[condenserLocation].totalCapacityTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { totalCapacityTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 0-10 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemCondenser[condenserLocation].age0to10Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { age0to10Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Age 11-20 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemCondenser[condenserLocation].age11to20Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { age11to20Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 21+ Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemCondenser[condenserLocation].age21PlusTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { age21PlusTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <Dropdown
                  label="Refrigerant Type"
                  options={refrigerantOptions}
                  value={store?.splitSystemCondenser[condenserLocation].refrigerantType ?? ""}
                  onValueChange={(val) => store?.updateSplitSystemCondenser({ 
                    [condenserLocation]: { refrigerantType: val }
                  })}
                />
                {store?.splitSystemCondenser[condenserLocation].refrigerantType === "other" && (
                  <TextField
                    label="Other Refrigerant Specification"
                    placeholder="Specify refrigerant type"
                    value={store?.splitSystemCondenser[condenserLocation].refrigerantOtherSpec ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { refrigerantOtherSpec: val }
                    })}
                  />
                )}
                <View style={$row}>
                  <Dropdown
                    label="Maintenance Responsibility"
                    options={responsibilityOptions}
                    value={store?.splitSystemCondenser[condenserLocation].maintenanceResponsibility ?? ""}
                    onValueChange={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { maintenanceResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <Dropdown
                    label="Replacement Responsibility"
                    options={responsibilityOptions}
                    value={store?.splitSystemCondenser[condenserLocation].replacementResponsibility ?? ""}
                    onValueChange={(val) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { replacementResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.splitSystemCondenser[condenserLocation].assessment.condition as any}
                    onChange={(v) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { assessment: { condition: v } }
                    })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.splitSystemCondenser[condenserLocation].assessment.repairStatus as any}
                    onChange={(v) => store?.updateSplitSystemCondenser({ 
                      [condenserLocation]: { assessment: { repairStatus: v } }
                    })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={store?.splitSystemCondenser[condenserLocation].assessment.amountToRepair ?? ""}
                  onChangeText={(val) => store?.updateSplitSystemCondenser({ 
                    [condenserLocation]: { assessment: { amountToRepair: val } }
                  })}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FURNACES */}
        {/* ============================================ */}
        <SectionAccordion
          title="Furnaces"
          expanded={!store?.furnace.NotApplicable && openKey === "furnace"}
          onToggle={(n) => {
            if (!store?.furnace.NotApplicable) {
              setOpenKey(n ? "furnace" : null)
            }
          }}
          headerStyle={
            store?.furnace.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.furnace.NotApplicable ?? false))}
              onPress={() => store?.updateFurnace({ NotApplicable: !store?.furnace.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.furnace.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.furnace.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.furnace.furnace.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateFurnace({ 
                    furnace: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Location"
                  placeholder="e.g., attic, basement"
                  value={store?.furnace.furnace.location ?? ""}
                  onChangeText={(val) => store?.updateFurnace({ 
                    furnace: { location: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <Dropdown
                label="Heat Source"
                options={heatSourceOptions}
                value={store?.furnace.furnace.heatSource ?? ""}
                onValueChange={(val) => store?.updateFurnace({ 
                  furnace: { heatSource: val }
                })}
              />
              <View style={$row}>
                <Dropdown
                  label="Maintenance Responsibility"
                  options={responsibilityOptions}
                  value={store?.furnace.furnace.maintenanceResponsibility ?? ""}
                  onValueChange={(val) => store?.updateFurnace({ 
                    furnace: { maintenanceResponsibility: val }
                  })}
                  containerStyle={$halfWidth}
                />
                <Dropdown
                  label="Replacement Responsibility"
                  options={responsibilityOptions}
                  value={store?.furnace.furnace.replacementResponsibility ?? ""}
                  onValueChange={(val) => store?.updateFurnace({ 
                    furnace: { replacementResponsibility: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* SPLIT SYSTEM - HEAT PUMP */}
        {/* ============================================ */}
        <SectionAccordion
          title="Split System - Heat Pump"
          expanded={!store?.splitSystemHeatPump.NotApplicable && openKey === "splitSystemHeatPump"}
          onToggle={(n) => {
            if (!store?.splitSystemHeatPump.NotApplicable) {
              setOpenKey(n ? "splitSystemHeatPump" : null)
            }
          }}
          headerStyle={
            store?.splitSystemHeatPump.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.splitSystemHeatPump.NotApplicable ?? false))}
              onPress={() => store?.updateSplitSystemHeatPump({ NotApplicable: !store?.splitSystemHeatPump.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.splitSystemHeatPump.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.splitSystemHeatPump.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Dropdown
                label="Mounting Location"
                options={splitSystemLocationOptions}
                value={heatPumpLocation}
                onValueChange={(val) => setHeatPumpLocation(val as "padMountedRooftop" | "rooftop")}
              />
              
              <View style={themed($unitFieldsGroup)}>
                <View style={$row}>
                  <TextField
                    label="Quantity"
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    value={store?.splitSystemHeatPump[heatPumpLocation].quantity?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { quantity: val ? parseInt(val, 10) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Capacity Range (Tons)"
                    placeholder="e.g., 3-5"
                    value={store?.splitSystemHeatPump[heatPumpLocation].capacityRangeTons ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { capacityRangeTons: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Total Capacity (Tons)"
                    placeholder="Enter total"
                    keyboardType="numeric"
                    value={store?.splitSystemHeatPump[heatPumpLocation].totalCapacityTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { totalCapacityTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 0-10 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemHeatPump[heatPumpLocation].age0to10Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { age0to10Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <View style={$row}>
                  <TextField
                    label="Age 11-20 Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemHeatPump[heatPumpLocation].age11to20Tons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { age11to20Tons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <TextField
                    label="Age 21+ Years (Tons)"
                    placeholder="Enter tonnage"
                    keyboardType="numeric"
                    value={store?.splitSystemHeatPump[heatPumpLocation].age21PlusTons?.toString() ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { age21PlusTons: val ? parseFloat(val) : 0 }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>
                <Dropdown
                  label="Refrigerant Type"
                  options={refrigerantOptions}
                  value={store?.splitSystemHeatPump[heatPumpLocation].refrigerantType ?? ""}
                  onValueChange={(val) => store?.updateSplitSystemHeatPump({ 
                    [heatPumpLocation]: { refrigerantType: val }
                  })}
                />
                {store?.splitSystemHeatPump[heatPumpLocation].refrigerantType === "other" && (
                  <TextField
                    label="Other Refrigerant Specification"
                    placeholder="Specify refrigerant type"
                    value={store?.splitSystemHeatPump[heatPumpLocation].refrigerantOtherSpec ?? ""}
                    onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { refrigerantOtherSpec: val }
                    })}
                  />
                )}
                <Dropdown
                  label="Heat Source"
                  options={heatSourceOptions}
                  value={store?.splitSystemHeatPump[heatPumpLocation].heatSource ?? ""}
                  onValueChange={(val) => store?.updateSplitSystemHeatPump({ 
                    [heatPumpLocation]: { heatSource: val }
                  })}
                />
                <View style={$row}>
                  <Dropdown
                    label="Maintenance Responsibility"
                    options={responsibilityOptions}
                    value={store?.splitSystemHeatPump[heatPumpLocation].maintenanceResponsibility ?? ""}
                    onValueChange={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { maintenanceResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                  <Dropdown
                    label="Replacement Responsibility"
                    options={responsibilityOptions}
                    value={store?.splitSystemHeatPump[heatPumpLocation].replacementResponsibility ?? ""}
                    onValueChange={(val) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { replacementResponsibility: val }
                    })}
                    containerStyle={$halfWidth}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.splitSystemHeatPump[heatPumpLocation].assessment.condition as any}
                    onChange={(v) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { assessment: { condition: v } }
                    })}
                  />
                </View>

                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.splitSystemHeatPump[heatPumpLocation].assessment.repairStatus as any}
                    onChange={(v) => store?.updateSplitSystemHeatPump({ 
                      [heatPumpLocation]: { assessment: { repairStatus: v } }
                    })}
                  />
                </View>

                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={store?.splitSystemHeatPump[heatPumpLocation].assessment.amountToRepair ?? ""}
                  onChangeText={(val) => store?.updateSplitSystemHeatPump({ 
                    [heatPumpLocation]: { assessment: { amountToRepair: val } }
                  })}
                />
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* AIR HANDLER (CFM System) */}
        {/* ============================================ */}
        <SectionAccordion
          title="Air Handler"
          expanded={!store?.airHandler.NotApplicable && openKey === "airHandler"}
          onToggle={(n) => {
            if (!store?.airHandler.NotApplicable) {
              setOpenKey(n ? "airHandler" : null)
            }
          }}
          headerStyle={
            store?.airHandler.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.airHandler.NotApplicable ?? false))}
              onPress={() => store?.updateAirHandler({ NotApplicable: !store?.airHandler.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.airHandler.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.airHandler.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.airHandler.airHandler.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Capacity Range (CFM)"
                  placeholder="e.g., 1000-2000"
                  value={store?.airHandler.airHandler.capacityRangeTons ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { capacityRangeTons: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Total Capacity (CFM)"
                  placeholder="Enter total"
                  keyboardType="numeric"
                  value={store?.airHandler.airHandler.totalCapacityTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { totalCapacityTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 0-10 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.airHandler.airHandler.age0to10Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { age0to10Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Age 11-20 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.airHandler.airHandler.age11to20Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { age11to20Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 21+ Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.airHandler.airHandler.age21PlusTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateAirHandler({ 
                    airHandler: { age21PlusTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.airHandler.airHandler.assessment.condition as any}
                  onChange={(v) => store?.updateAirHandler({ 
                    airHandler: { assessment: { condition: v } }
                  })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.airHandler.airHandler.assessment.repairStatus as any}
                  onChange={(v) => store?.updateAirHandler({ 
                    airHandler: { assessment: { repairStatus: v } }
                  })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.airHandler.airHandler.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateAirHandler({ 
                  airHandler: { assessment: { amountToRepair: val } }
                })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* PTACS (OWNER) */}
        {/* ============================================ */}
        <SectionAccordion
          title="PTACs (Owner)"
          expanded={!store?.ownerPTACs.NotApplicable && openKey === "ownerPTACs"}
          onToggle={(n) => {
            if (!store?.ownerPTACs.NotApplicable) {
              setOpenKey(n ? "ownerPTACs" : null)
            }
          }}
          headerStyle={
            store?.ownerPTACs.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.ownerPTACs.NotApplicable ?? false))}
              onPress={() => store?.updateOwnerPTACs({ NotApplicable: !store?.ownerPTACs.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.ownerPTACs.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.ownerPTACs.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.ownerPTACs.ownerPTACs.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Capacity Range (CFM)"
                  placeholder="e.g., 1000-2000"
                  value={store?.ownerPTACs.ownerPTACs.capacityRangeTons ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { capacityRangeTons: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Total Capacity (CFM)"
                  placeholder="Enter total"
                  keyboardType="numeric"
                  value={store?.ownerPTACs.ownerPTACs.totalCapacityTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { totalCapacityTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 0-10 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.ownerPTACs.ownerPTACs.age0to10Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { age0to10Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Age 11-20 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.ownerPTACs.ownerPTACs.age11to20Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { age11to20Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 21+ Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.ownerPTACs.ownerPTACs.age21PlusTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { age21PlusTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.ownerPTACs.ownerPTACs.assessment.condition as any}
                  onChange={(v) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { assessment: { condition: v } }
                  })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.ownerPTACs.ownerPTACs.assessment.repairStatus as any}
                  onChange={(v) => store?.updateOwnerPTACs({ 
                    ownerPTACs: { assessment: { repairStatus: v } }
                  })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.ownerPTACs.ownerPTACs.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateOwnerPTACs({ 
                  ownerPTACs: { assessment: { amountToRepair: val } }
                })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* PTACS (TENANT) */}
        {/* ============================================ */}
        <SectionAccordion
          title="PTACs (Tenant)"
          expanded={!store?.tenantPTACs.NotApplicable && openKey === "tenantPTACs"}
          onToggle={(n) => {
            if (!store?.tenantPTACs.NotApplicable) {
              setOpenKey(n ? "tenantPTACs" : null)
            }
          }}
          headerStyle={
            store?.tenantPTACs.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.tenantPTACs.NotApplicable ?? false))}
              onPress={() => store?.updateTenantPTACs({ NotApplicable: !store?.tenantPTACs.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.tenantPTACs.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.tenantPTACs.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.tenantPTACs.tenantPTACs.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Capacity Range (CFM)"
                  placeholder="e.g., 1000-2000"
                  value={store?.tenantPTACs.tenantPTACs.capacityRangeTons ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { capacityRangeTons: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Total Capacity (CFM)"
                  placeholder="Enter total"
                  keyboardType="numeric"
                  value={store?.tenantPTACs.tenantPTACs.totalCapacityTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { totalCapacityTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 0-10 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.tenantPTACs.tenantPTACs.age0to10Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { age0to10Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Age 11-20 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.tenantPTACs.tenantPTACs.age11to20Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { age11to20Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 21+ Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.tenantPTACs.tenantPTACs.age21PlusTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateTenantPTACs({ 
                    tenantPTACs: { age21PlusTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.tenantPTACs.tenantPTACs.assessment.condition as any}
                  onChange={(v) => store?.updateTenantPTACs({ 
                    tenantPTACs: { assessment: { condition: v } }
                  })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.tenantPTACs.tenantPTACs.assessment.repairStatus as any}
                  onChange={(v) => store?.updateTenantPTACs({ 
                    tenantPTACs: { assessment: { repairStatus: v } }
                  })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.tenantPTACs.tenantPTACs.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateTenantPTACs({ 
                  tenantPTACs: { assessment: { amountToRepair: val } }
                })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* WINDOW UNITS (OWNER) */}
        {/* ============================================ */}
        <SectionAccordion
          title="Window Units (Owner)"
          expanded={!store?.windowUnitsOwner.NotApplicable && openKey === "windowUnitsOwner"}
          onToggle={(n) => {
            if (!store?.windowUnitsOwner.NotApplicable) {
              setOpenKey(n ? "windowUnitsOwner" : null)
            }
          }}
          headerStyle={
            store?.windowUnitsOwner.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.windowUnitsOwner.NotApplicable ?? false))}
              onPress={() => store?.updateWindowUnitsOwner({ NotApplicable: !store?.windowUnitsOwner.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.windowUnitsOwner.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.windowUnitsOwner.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.windowUnitsOwner.windowUnitsOwner.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Capacity Range (CFM)"
                  placeholder="e.g., 1000-2000"
                  value={store?.windowUnitsOwner.windowUnitsOwner.capacityRangeTons ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { capacityRangeTons: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Total Capacity (CFM)"
                  placeholder="Enter total"
                  keyboardType="numeric"
                  value={store?.windowUnitsOwner.windowUnitsOwner.totalCapacityTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { totalCapacityTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 0-10 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsOwner.windowUnitsOwner.age0to10Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { age0to10Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Age 11-20 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsOwner.windowUnitsOwner.age11to20Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { age11to20Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 21+ Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsOwner.windowUnitsOwner.age21PlusTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { age21PlusTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.windowUnitsOwner.windowUnitsOwner.assessment.condition as any}
                  onChange={(v) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { assessment: { condition: v } }
                  })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.windowUnitsOwner.windowUnitsOwner.assessment.repairStatus as any}
                  onChange={(v) => store?.updateWindowUnitsOwner({ 
                    windowUnitsOwner: { assessment: { repairStatus: v } }
                  })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.windowUnitsOwner.windowUnitsOwner.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateWindowUnitsOwner({ 
                  windowUnitsOwner: { assessment: { amountToRepair: val } }
                })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* WINDOW UNITS (TENANT) */}
        {/* ============================================ */}
        <SectionAccordion
          title="Window Units (Tenant)"
          expanded={!store?.windowUnitsTenant.NotApplicable && openKey === "windowUnitsTenant"}
          onToggle={(n) => {
            if (!store?.windowUnitsTenant.NotApplicable) {
              setOpenKey(n ? "windowUnitsTenant" : null)
            }
          }}
          headerStyle={
            store?.windowUnitsTenant.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.windowUnitsTenant.NotApplicable ?? false))}
              onPress={() => store?.updateWindowUnitsTenant({ NotApplicable: !store?.windowUnitsTenant.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.windowUnitsTenant.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.windowUnitsTenant.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                  value={store?.windowUnitsTenant.windowUnitsTenant.quantity?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { quantity: val ? parseInt(val, 10) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Capacity Range (CFM)"
                  placeholder="e.g., 1000-2000"
                  value={store?.windowUnitsTenant.windowUnitsTenant.capacityRangeTons ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { capacityRangeTons: val }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Total Capacity (CFM)"
                  placeholder="Enter total"
                  keyboardType="numeric"
                  value={store?.windowUnitsTenant.windowUnitsTenant.totalCapacityTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { totalCapacityTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 0-10 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsTenant.windowUnitsTenant.age0to10Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { age0to10Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>
              <View style={$row}>
                <TextField
                  label="Age 11-20 Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsTenant.windowUnitsTenant.age11to20Tons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { age11to20Tons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age 21+ Years (CFM)"
                  placeholder="Enter CFM"
                  keyboardType="numeric"
                  value={store?.windowUnitsTenant.windowUnitsTenant.age21PlusTons?.toString() ?? ""}
                  onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { age21PlusTons: val ? parseFloat(val) : 0 }
                  })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.windowUnitsTenant.windowUnitsTenant.assessment.condition as any}
                  onChange={(v) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { assessment: { condition: v } }
                  })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.windowUnitsTenant.windowUnitsTenant.assessment.repairStatus as any}
                  onChange={(v) => store?.updateWindowUnitsTenant({ 
                    windowUnitsTenant: { assessment: { repairStatus: v } }
                  })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.windowUnitsTenant.windowUnitsTenant.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateWindowUnitsTenant({ 
                  windowUnitsTenant: { assessment: { amountToRepair: val } }
                })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* UNIT MANUFACTURER & SPECIFICS (Dynamic List) */}
        {/* ============================================ */}
        <View style={themed($paddedBlock)}>
          <View style={$sectionHeaderRow}>
            <Text preset="subheading" text="Unit Manufacturer & Specifics" />
            <Button 
              text="Add Unit" 
              onPress={() => store?.addUnitManufacturerSpecific("", 0, "", 0, 0, "")} 
            />
          </View>
          <View style={$listContainer}>
            {unitManufacturerList.map((item, index) => (
              <Card
                key={item.id}
                HeadingComponent={<Text weight="bold" text={`Unit ${index + 1}`} />}
                ContentComponent={
                  <View style={$cardFields}>
                    <TextField
                      label="Manufacturer"
                      placeholder="Unit manufacturer"
                      value={item.manufacturer}
                      onChangeText={(val) => store?.updateUnitManufacturerSpecific(item.id, { manufacturer: val })}
                    />
                    <View style={$row}>
                      <TextField
                        label="# Units"
                        placeholder="Quantity"
                        keyboardType="numeric"
                        value={item.quantity?.toString() ?? ""}
                        onChangeText={(val) => store?.updateUnitManufacturerSpecific(item.id, { 
                          quantity: val ? parseInt(val, 10) : 0 
                        })}
                        containerStyle={$halfWidth}
                      />
                      <TextField
                        label="Tenant Space"
                        placeholder="Tenant space location"
                        value={item.tenantSpace}
                        onChangeText={(val) => store?.updateUnitManufacturerSpecific(item.id, { tenantSpace: val })}
                        containerStyle={$halfWidth}
                      />
                    </View>
                    <View style={$row}>
                      <TextField
                        label="Approx. Tonnage"
                        placeholder="Tonnage"
                        keyboardType="numeric"
                        value={item.approxTonnage?.toString() ?? ""}
                        onChangeText={(val) => store?.updateUnitManufacturerSpecific(item.id, { 
                          approxTonnage: val ? parseFloat(val) : 0 
                        })}
                        containerStyle={$halfWidth}
                      />
                      <TextField
                        label="Approx. Age"
                        placeholder="Years"
                        keyboardType="numeric"
                        value={item.approxAge?.toString() ?? ""}
                        onChangeText={(val) => store?.updateUnitManufacturerSpecific(item.id, { 
                          approxAge: val ? parseInt(val, 10) : 0 
                        })}
                        containerStyle={$halfWidth}
                      />
                    </View>
                    <Dropdown
                      label="Type"
                      options={hvacUnitTypeOptions}
                      value={item.type}
                      onValueChange={(val) => store?.updateUnitManufacturerSpecific(item.id, { type: val })}
                    />
                    <View style={$alignEnd}>
                      <Button
                        preset="reversed"
                        text="Remove"
                        onPress={() => store?.removeUnitManufacturerSpecific(item.id)}
                      />
                    </View>
                  </View>
                }
              />
            ))}
          </View>
        </View>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about HVAC systems"
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

const $unitFieldsGroup: ViewStyle = {
  gap: 16,
}

const $sectionHeaderRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
}

const $listContainer: ViewStyle = {
  gap: 12,
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
