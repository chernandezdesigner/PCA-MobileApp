import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TextStyle, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Dropdown } from "@/components/Dropdown"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { ChecklistField } from "@/components/ChecklistField"
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
  SMOKE_DETECTOR_OPTIONS,
  FIXTURES,
  SPRINKLER_LOCATION_OPTIONS,
  NEAREST_FIRE_HYDRANT_OPTIONS,
  FIRE_EXIT_STAIRWELL_FINISH_OPTIONS,
  ANSUL_DISCHARGE_OPTIONS,
  FIRE_PROTECTION_SYSTEM_TYPE_OPTIONS,
  FIRE_PROTECTION_CONDITION_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep9ScreenProps
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep9"> {}

export const MechanicalSystemsStep9Screen: FC<MechanicalSystemsStep9ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step9

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Helper for array toggle
  const createArrayToggleHandler = (currentArray: string[] | undefined, onChange: (newArray: string[]) => void) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      onChange(newArray)
    }
  }

  // Dropdown options for system type
  const systemTypeOptions = FIRE_PROTECTION_SYSTEM_TYPE_OPTIONS.map((o) => ({ label: o.label, value: o.id }))

  const onNext = () => {
    // Navigate to next form or completion
    openDrawer()
  }

  const onBack = () => navigation.goBack()

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
          <Text preset="subheading" text="Fire Protection" style={themed($titleStyle)} />
          <ProgressBar current={9} total={9} />
        </View>

        {/* ============================================ */}
        {/* SMOKE DETECTORS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Smoke Detectors"
          expanded={!store?.smokeDetectors?.NotApplicable && openKey === "smokeDetectors"}
          onToggle={(n) => {
            if (!store?.smokeDetectors?.NotApplicable) {
              setOpenKey(n ? "smokeDetectors" : null)
            }
          }}
          headerStyle={
            store?.smokeDetectors?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.smokeDetectors?.NotApplicable ?? false))}
              onPress={() => store?.updateSmokeDetectors({ NotApplicable: !store?.smokeDetectors?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.smokeDetectors?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.smokeDetectors?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Type & Location"
                items={SMOKE_DETECTOR_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.smokeDetectors?.smokeDetectorOptions?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.smokeDetectors?.smokeDetectorOptions?.slice() ?? [],
                  (newArray) => store?.updateSmokeDetectors({ smokeDetectorOptions: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.smokeDetectors?.assessment?.condition as any}
                  onChange={(v) => store?.updateSmokeDetectors({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.smokeDetectors?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateSmokeDetectors({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.smokeDetectors?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateSmokeDetectors({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FIRE ALARM PANEL */}
        {/* ============================================ */}
        <SectionAccordion
          title="Fire Alarm Panel"
          expanded={!store?.fireAlarmPanel?.NotApplicable && openKey === "fireAlarmPanel"}
          onToggle={(n) => {
            if (!store?.fireAlarmPanel?.NotApplicable) {
              setOpenKey(n ? "fireAlarmPanel" : null)
            }
          }}
          headerStyle={
            store?.fireAlarmPanel?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.fireAlarmPanel?.NotApplicable ?? false))}
              onPress={() => store?.updateFireAlarmPanel({ NotApplicable: !store?.fireAlarmPanel?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.fireAlarmPanel?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.fireAlarmPanel?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Location"
                  placeholder="Enter location"
                  value={store?.fireAlarmPanel?.location ?? ""}
                  onChangeText={(val) => store?.updateFireAlarmPanel({ location: val })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Age"
                  placeholder="Years"
                  keyboardType="numeric"
                  value={store?.fireAlarmPanel?.age?.toString() ?? ""}
                  onChangeText={(val) =>
                    store?.updateFireAlarmPanel({ age: val ? parseInt(val, 10) : 0 })
                  }
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.fireAlarmPanel?.assessment?.condition as any}
                  onChange={(v) => store?.updateFireAlarmPanel({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.fireAlarmPanel?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateFireAlarmPanel({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.fireAlarmPanel?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateFireAlarmPanel({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FIRE EXTINGUISHERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Fire Extinguishers"
          expanded={!store?.fireExtinguishers?.NotApplicable && openKey === "fireExtinguishers"}
          onToggle={(n) => {
            if (!store?.fireExtinguishers?.NotApplicable) {
              setOpenKey(n ? "fireExtinguishers" : null)
            }
          }}
          headerStyle={
            store?.fireExtinguishers?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.fireExtinguishers?.NotApplicable ?? false))}
              onPress={() => store?.updateFireExtinguishers({ NotApplicable: !store?.fireExtinguishers?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.fireExtinguishers?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.fireExtinguishers?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <TextField
                label="Inspection Date"
                placeholder="MM/DD/YYYY"
                value={store?.fireExtinguishers?.inspectionDate ?? ""}
                onChangeText={(val) => store?.updateFireExtinguishers({ inspectionDate: val })}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.fireExtinguishers?.assessment?.condition as any}
                  onChange={(v) => store?.updateFireExtinguishers({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.fireExtinguishers?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateFireExtinguishers({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.fireExtinguishers?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateFireExtinguishers({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FIXTURES */}
        {/* ============================================ */}
        <SectionAccordion
          title="Fixtures"
          expanded={!store?.fixtures?.NotApplicable && openKey === "fixtures"}
          onToggle={(n) => {
            if (!store?.fixtures?.NotApplicable) {
              setOpenKey(n ? "fixtures" : null)
            }
          }}
          headerStyle={
            store?.fixtures?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.fixtures?.NotApplicable ?? false))}
              onPress={() => store?.updateFixtures({ NotApplicable: !store?.fixtures?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.fixtures?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.fixtures?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Fixtures"
                items={FIXTURES.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.fixtures?.fixtures?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.fixtures?.fixtures?.slice() ?? [],
                  (newArray) => store?.updateFixtures({ fixtures: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.fixtures?.assessment?.condition as any}
                  onChange={(v) => store?.updateFixtures({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.fixtures?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateFixtures({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.fixtures?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateFixtures({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* SPRINKLERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Sprinklers"
          expanded={!store?.sprinklers?.NotApplicable && openKey === "sprinklers"}
          onToggle={(n) => {
            if (!store?.sprinklers?.NotApplicable) {
              setOpenKey(n ? "sprinklers" : null)
            }
          }}
          headerStyle={
            store?.sprinklers?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.sprinklers?.NotApplicable ?? false))}
              onPress={() => store?.updateSprinklers({ NotApplicable: !store?.sprinklers?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.sprinklers?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.sprinklers?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Back-flow Preventer"
                items={[
                  { id: "yes", label: "Yes", checked: store?.sprinklers?.hasBackflowPreventer ?? false },
                ]}
                onToggle={(id, checked) => store?.updateSprinklers({ hasBackflowPreventer: checked })}
              />

              <TextField
                label="Standpipe Location(s)"
                placeholder="Enter locations"
                value={store?.sprinklers?.standpipeLocations ?? ""}
                onChangeText={(val) => store?.updateSprinklers({ standpipeLocations: val })}
              />

              <ChecklistField
                label="Location"
                items={SPRINKLER_LOCATION_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.sprinklers?.location?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.sprinklers?.location?.slice() ?? [],
                  (newArray) => store?.updateSprinklers({ location: newArray })
                )}
              />

              <TextField
                label="Sprinkler Head Manuf. List"
                placeholder="Enter manufacturer(s)"
                value={store?.sprinklers?.sprinklerHeadManufacturerList ?? ""}
                onChangeText={(val) => store?.updateSprinklers({ sprinklerHeadManufacturerList: val })}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.sprinklers?.assessment?.condition as any}
                  onChange={(v) => store?.updateSprinklers({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.sprinklers?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateSprinklers({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.sprinklers?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateSprinklers({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FIRE PUMP */}
        {/* ============================================ */}
        <SectionAccordion
          title="Fire Pump"
          expanded={!store?.firePump?.NotApplicable && openKey === "firePump"}
          onToggle={(n) => {
            if (!store?.firePump?.NotApplicable) {
              setOpenKey(n ? "firePump" : null)
            }
          }}
          headerStyle={
            store?.firePump?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.firePump?.NotApplicable ?? false))}
              onPress={() => store?.updateFirePump({ NotApplicable: !store?.firePump?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.firePump?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.firePump?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <ChecklistField
                  label="Diesel"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.firePump?.diesel ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateFirePump({ diesel: checked })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Tank Gallons"
                  placeholder="#"
                  keyboardType="numeric"
                  value={store?.firePump?.tankGallons?.toString() ?? ""}
                  onChangeText={(val) =>
                    store?.updateFirePump({ tankGallons: val ? parseInt(val, 10) : 0 })
                  }
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={$row}>
                <ChecklistField
                  label="GPM Electric"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.firePump?.gpmElectric ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateFirePump({ gpmElectric: checked })}
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Storage Tank Location"
                  placeholder="Enter location"
                  value={store?.firePump?.storageTankLocation ?? ""}
                  onChangeText={(val) => store?.updateFirePump({ storageTankLocation: val })}
                  containerStyle={$halfWidth}
                />
              </View>

              <ChecklistField
                label="Nearest Fire Hydrant"
                items={NEAREST_FIRE_HYDRANT_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.firePump?.nearestFireHydrant?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.firePump?.nearestFireHydrant?.slice() ?? [],
                  (newArray) => store?.updateFirePump({ nearestFireHydrant: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.firePump?.assessment?.condition as any}
                  onChange={(v) => store?.updateFirePump({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.firePump?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateFirePump({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.firePump?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateFirePump({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* SMOKE EVAC SYSTEM */}
        {/* ============================================ */}
        <SectionAccordion
          title="Smoke Evac System"
          expanded={!store?.smokeEvacSystem?.NotApplicable && openKey === "smokeEvacSystem"}
          onToggle={(n) => {
            if (!store?.smokeEvacSystem?.NotApplicable) {
              setOpenKey(n ? "smokeEvacSystem" : null)
            }
          }}
          headerStyle={
            store?.smokeEvacSystem?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.smokeEvacSystem?.NotApplicable ?? false))}
              onPress={() => store?.updateSmokeEvacSystem({ NotApplicable: !store?.smokeEvacSystem?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.smokeEvacSystem?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.smokeEvacSystem?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <ChecklistField
                  label="Smoke Evac System"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.smokeEvacSystem?.hasSmokeEvacSystem ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateSmokeEvacSystem({ hasSmokeEvacSystem: checked })}
                  containerStyle={$halfWidth}
                />
                <ChecklistField
                  label="Stair Pressurization"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.smokeEvacSystem?.hasStairPressurization ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateSmokeEvacSystem({ hasStairPressurization: checked })}
                  containerStyle={$halfWidth}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.smokeEvacSystem?.assessment?.condition as any}
                  onChange={(v) => store?.updateSmokeEvacSystem({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.smokeEvacSystem?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateSmokeEvacSystem({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.smokeEvacSystem?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateSmokeEvacSystem({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* FIRE EXIT STAIRWELL */}
        {/* ============================================ */}
        <SectionAccordion
          title="Fire Exit Stairwell"
          expanded={!store?.fireExitStairwell?.NotApplicable && openKey === "fireExitStairwell"}
          onToggle={(n) => {
            if (!store?.fireExitStairwell?.NotApplicable) {
              setOpenKey(n ? "fireExitStairwell" : null)
            }
          }}
          headerStyle={
            store?.fireExitStairwell?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.fireExitStairwell?.NotApplicable ?? false))}
              onPress={() => store?.updateFireExitStairwell({ NotApplicable: !store?.fireExitStairwell?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.fireExitStairwell?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.fireExitStairwell?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Fire Exit Stairwell"
                items={[
                  { id: "yes", label: "Yes", checked: store?.fireExitStairwell?.hasFireExitStairwell ?? false },
                ]}
                onToggle={(id, checked) => store?.updateFireExitStairwell({ hasFireExitStairwell: checked })}
              />

              <ChecklistField
                label="Finish"
                items={FIRE_EXIT_STAIRWELL_FINISH_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.fireExitStairwell?.finish?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.fireExitStairwell?.finish?.slice() ?? [],
                  (newArray) => store?.updateFireExitStairwell({ finish: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.fireExitStairwell?.assessment?.condition as any}
                  onChange={(v) => store?.updateFireExitStairwell({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.fireExitStairwell?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateFireExitStairwell({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.fireExitStairwell?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateFireExitStairwell({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* ANSUL SYSTEM */}
        {/* ============================================ */}
        <SectionAccordion
          title="Ansul System"
          expanded={!store?.ansulSystem?.NotApplicable && openKey === "ansulSystem"}
          onToggle={(n) => {
            if (!store?.ansulSystem?.NotApplicable) {
              setOpenKey(n ? "ansulSystem" : null)
            }
          }}
          headerStyle={
            store?.ansulSystem?.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.ansulSystem?.NotApplicable ?? false))}
              onPress={() => store?.updateAnsulSystem({ NotApplicable: !store?.ansulSystem?.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.ansulSystem?.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.ansulSystem?.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <ChecklistField
                  label="Ansul System"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.ansulSystem?.hasAnsulSystem ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateAnsulSystem({ hasAnsulSystem: checked })}
                  containerStyle={$halfWidth}
                />
                <ChecklistField
                  label="Tenant Owned?"
                  items={[
                    { id: "yes", label: "Yes", checked: store?.ansulSystem?.tenantOwned ?? false },
                  ]}
                  onToggle={(id, checked) => store?.updateAnsulSystem({ tenantOwned: checked })}
                  containerStyle={$halfWidth}
                />
              </View>

              <ChecklistField
                label="Discharge To"
                items={ANSUL_DISCHARGE_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.ansulSystem?.dischargeTo?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.ansulSystem?.dischargeTo?.slice() ?? [],
                  (newArray) => store?.updateAnsulSystem({ dischargeTo: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.ansulSystem?.assessment?.condition as any}
                  onChange={(v) => store?.updateAnsulSystem({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.ansulSystem?.assessment?.repairStatus as any}
                  onChange={(v) => store?.updateAnsulSystem({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.ansulSystem?.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateAnsulSystem({ amountToReplaceRepair: val ? parseInt(val, 10) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* TOP-LEVEL FIELDS (Below Accordions) */}
        {/* ============================================ */}
        <View style={themed($outsideAccordionsSection)}>
          <Dropdown
            label="System Type"
            options={systemTypeOptions}
            value={store?.systemType ?? ""}
            onValueChange={(val) => store?.updateTopLevel({ systemType: val })}
          />

          <ChecklistField
            label="System Condition"
            items={FIRE_PROTECTION_CONDITION_OPTIONS.map((opt) => ({
              id: opt.id,
              label: opt.label,
              checked: store?.systemCondition?.includes(opt.id) ?? false,
            }))}
            onToggle={createArrayToggleHandler(
              store?.systemCondition?.slice() ?? [],
              (newArray) => store?.updateTopLevel({ systemCondition: newArray })
            )}
          />

          <View style={$row}>
            <TextField
              label="% Sprinklered"
              placeholder="%"
              keyboardType="numeric"
              value={store?.percentSprinklered?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTopLevel({ percentSprinklered: val ? parseInt(val, 10) : 0 })
              }
              containerStyle={$halfWidth}
            />
            <TextField
              label="Last Inspection"
              placeholder="MM/DD/YYYY"
              value={store?.lastInspection ?? ""}
              onChangeText={(val) => store?.updateTopLevel({ lastInspection: val })}
              containerStyle={$halfWidth}
            />
          </View>
        </View>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($outsideAccordionsSection)}>
          <TextField
            label="Additional Comments"
            placeholder="Enter any additional comments..."
            value={store?.additionalComments ?? ""}
            onChangeText={(val) => store?.updateAdditionalComments(val)}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <StickyFooterNav
        leftLabel="Back"
        rightLabel="Complete"
        onLeftPress={onBack}
        onRightPress={onNext}
      />
    </Screen>
  )
})

// ============================================
// STYLES
// ============================================

const $root: ViewStyle = {
  flex: 1,
}

const $screenInner: ViewStyle = {
  flex: 1,
}

const $stickyHeader: ViewStyle = {
  zIndex: 10,
}

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $paddedBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  marginBottom: spacing.md,
})

const $titleStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $sectionBody: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  gap: spacing.md,
})

const $outsideAccordionsSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  marginTop: spacing.md,
  gap: spacing.md,
})

const $controlGroup: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $halfWidth: ViewStyle = {
  flex: 1,
}

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  opacity: 0.7,
})

const $naButton =
  (isActive: boolean): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    backgroundColor: isActive ? colors.palette.angry500 : colors.palette.neutral300,
  })

const $naButtonText =
  (isActive: boolean): ThemedStyle<TextStyle> =>
  ({ colors }) => ({
    color: isActive ? colors.palette.neutral100 : colors.palette.neutral700,
    fontWeight: "600",
    fontSize: 12,
  })
