import { FC, useState, useMemo } from "react"
import { View, ViewStyle, ScrollView, TextStyle, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dropdown } from "@/components/Dropdown"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { ChecklistField } from "@/components/ChecklistField"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import {
  ELEVATOR_TYPE_OPTIONS,
  MACHINERY_LOCATION_OPTIONS,
  ELEVATOR_LIGHTS_OPTIONS,
  ELEVATOR_FLOOR_OPTIONS,
  ELEVATOR_SAFETY_STOPS_OPTIONS,
  ELEVATOR_WALL_OPTIONS,
  INSPECTION_CERTIFICATE_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep8ScreenProps
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep8"> {}

export const MechanicalSystemsStep8Screen: FC<MechanicalSystemsStep8ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const { onCamera, photoCount } = usePhotoCapture("mechanical_systems", 8)
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step8

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Dropdown options for elevator type
  const elevatorTypeDropdownOptions = useMemo(
    () => ELEVATOR_TYPE_OPTIONS.map((o) => ({ label: o.label, value: o.id })),
    [],
  )

  // Get elevator lists
  const passengerElevatorsList = store?.passengerElevators.elevators.slice() ?? []
  const serviceElevatorsList = store?.serviceElevators.elevators.slice() ?? []

  // Helper for array toggle
  const createArrayToggleHandler = (currentArray: string[] | undefined, onChange: (newArray: string[]) => void) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      onChange(newArray)
    }
  }

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep9" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep7" as never, { transition: "slide_from_left" } as never)
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
          <Text preset="subheading" text="Elevators & Conveying Systems" style={themed($titleStyle)} />
          <ProgressBar current={8} total={9} />
        </View>

        {/* ============================================ */}
        {/* PASSENGER ELEVATORS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Passenger Elevators"
          expanded={!store?.passengerElevators.NotApplicable && openKey === "passengerElevators"}
          onToggle={(n) => {
            if (!store?.passengerElevators.NotApplicable) {
              setOpenKey(n ? "passengerElevators" : null)
            }
          }}
          headerStyle={
            store?.passengerElevators.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.passengerElevators.NotApplicable ?? false))}
              onPress={() => store?.updatePassengerElevatorsAccordion({ NotApplicable: !store?.passengerElevators.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.passengerElevators.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.passengerElevators.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Elevators" style={themed($subSectionHeader)} />
                <Button
                  text="Add Elevator"
                  onPress={() => store?.addPassengerElevator()}
                  disabled={passengerElevatorsList.length >= 5}
                />
              </View>

              <View style={$listContainer}>
                {passengerElevatorsList.map((elevator, index) => (
                  <Card
                    key={elevator.id}
                    HeadingComponent={<Text weight="bold" text={`Elevator ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <Dropdown
                          label="Type"
                          options={elevatorTypeDropdownOptions}
                          value={elevator.type}
                          onValueChange={(val) => store?.updatePassengerElevator(elevator.id, { type: val })}
                        />

                        <View style={$row}>
                          <TextField
                            label="QTY"
                            placeholder="#"
                            keyboardType="decimal-pad"
                            value={elevator.quantity?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updatePassengerElevator(elevator.id, { quantity: val ? parseInt(val, 10) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Manufacturer"
                            placeholder="Enter manufacturer"
                            value={elevator.manufacturer ?? ""}
                            onChangeText={(val) =>
                              store?.updatePassengerElevator(elevator.id, { manufacturer: val })
                            }
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <ChecklistField
                          label="Machinery Location"
                          items={MACHINERY_LOCATION_OPTIONS.map((opt) => ({
                            id: opt.id,
                            label: opt.label,
                            checked: elevator.machineryLocation?.includes(opt.id) ?? false,
                          }))}
                          onToggle={createArrayToggleHandler(
                            elevator.machineryLocation?.slice() ?? [],
                            (newArray) => store?.updatePassengerElevator(elevator.id, { machineryLocation: newArray })
                          )}
                        />

                        <View style={$row}>
                          <TextField
                            label="Speed"
                            placeholder="FPM"
                            keyboardType="decimal-pad"
                            value={elevator.speed?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updatePassengerElevator(elevator.id, { speed: val ? parseFloat(val) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity"
                            placeholder="LBS"
                            keyboardType="decimal-pad"
                            value={elevator.capacity?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updatePassengerElevator(elevator.id, { capacity: val ? parseFloat(val) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={elevator.assessment?.condition as any}
                            onChange={(v) => store?.updatePassengerElevator(elevator.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={elevator.assessment?.repairStatus as any}
                            onChange={(v) => store?.updatePassengerElevator(elevator.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="decimal-pad"
                          value={elevator.amountToReplaceRepair?.toString() ?? ""}
                          onChangeText={(val) =>
                            store?.updatePassengerElevator(elevator.id, { amountToReplaceRepair: val ? parseFloat(val) : 0 })
                          }
                        />
                      </View>
                    }
                    FooterComponent={
                      passengerElevatorsList.length > 1 ? (
                        <Button
                          text="Remove"
                          preset="default"
                          onPress={() => store?.removePassengerElevator(elevator.id)}
                        />
                      ) : undefined
                    }
                    style={$unitCard}
                  />
                ))}
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* SERVICE ELEVATORS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Service Elevators"
          expanded={!store?.serviceElevators.NotApplicable && openKey === "serviceElevators"}
          onToggle={(n) => {
            if (!store?.serviceElevators.NotApplicable) {
              setOpenKey(n ? "serviceElevators" : null)
            }
          }}
          headerStyle={
            store?.serviceElevators.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.serviceElevators.NotApplicable ?? false))}
              onPress={() => store?.updateServiceElevatorsAccordion({ NotApplicable: !store?.serviceElevators.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.serviceElevators.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.serviceElevators.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$sectionHeaderRow}>
                <Text preset="formLabel" text="Elevators" style={themed($subSectionHeader)} />
                <Button
                  text="Add Elevator"
                  onPress={() => store?.addServiceElevator()}
                  disabled={serviceElevatorsList.length >= 5}
                />
              </View>

              <View style={$listContainer}>
                {serviceElevatorsList.map((elevator, index) => (
                  <Card
                    key={elevator.id}
                    HeadingComponent={<Text weight="bold" text={`Elevator ${index + 1}`} />}
                    ContentComponent={
                      <View style={$cardFields}>
                        <Dropdown
                          label="Type"
                          options={elevatorTypeDropdownOptions}
                          value={elevator.type}
                          onValueChange={(val) => store?.updateServiceElevator(elevator.id, { type: val })}
                        />

                        <View style={$row}>
                          <TextField
                            label="QTY"
                            placeholder="#"
                            keyboardType="decimal-pad"
                            value={elevator.quantity?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updateServiceElevator(elevator.id, { quantity: val ? parseInt(val, 10) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Manufacturer"
                            placeholder="Enter manufacturer"
                            value={elevator.manufacturer ?? ""}
                            onChangeText={(val) =>
                              store?.updateServiceElevator(elevator.id, { manufacturer: val })
                            }
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <ChecklistField
                          label="Machinery Location"
                          items={MACHINERY_LOCATION_OPTIONS.map((opt) => ({
                            id: opt.id,
                            label: opt.label,
                            checked: elevator.machineryLocation?.includes(opt.id) ?? false,
                          }))}
                          onToggle={createArrayToggleHandler(
                            elevator.machineryLocation?.slice() ?? [],
                            (newArray) => store?.updateServiceElevator(elevator.id, { machineryLocation: newArray })
                          )}
                        />

                        <View style={$row}>
                          <TextField
                            label="Speed"
                            placeholder="FPM"
                            keyboardType="decimal-pad"
                            value={elevator.speed?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updateServiceElevator(elevator.id, { speed: val ? parseFloat(val) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                          <TextField
                            label="Capacity"
                            placeholder="LBS"
                            keyboardType="decimal-pad"
                            value={elevator.capacity?.toString() ?? ""}
                            onChangeText={(val) =>
                              store?.updateServiceElevator(elevator.id, { capacity: val ? parseFloat(val) : 0 })
                            }
                            containerStyle={$halfWidth}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Condition" />
                          <ConditionAssessment
                            value={elevator.assessment?.condition as any}
                            onChange={(v) => store?.updateServiceElevator(elevator.id, { assessment: { condition: v } })}
                          />
                        </View>

                        <View style={themed($controlGroup)}>
                          <Text preset="formLabel" text="Repair Status" />
                          <RepairStatus
                            value={elevator.assessment?.repairStatus as any}
                            onChange={(v) => store?.updateServiceElevator(elevator.id, { assessment: { repairStatus: v } })}
                          />
                        </View>

                        <TextField
                          label="Amount to Replace/Repair ($)"
                          placeholder="Dollar amount"
                          keyboardType="decimal-pad"
                          value={elevator.amountToReplaceRepair?.toString() ?? ""}
                          onChangeText={(val) =>
                            store?.updateServiceElevator(elevator.id, { amountToReplaceRepair: val ? parseFloat(val) : 0 })
                          }
                        />
                      </View>
                    }
                    FooterComponent={
                      serviceElevatorsList.length > 1 ? (
                        <Button
                          text="Remove"
                          preset="default"
                          onPress={() => store?.removeServiceElevator(elevator.id)}
                        />
                      ) : undefined
                    }
                    style={$unitCard}
                  />
                ))}
              </View>
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* ESCALATORS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Escalators"
          expanded={!store?.escalators.NotApplicable && openKey === "escalators"}
          onToggle={(n) => {
            if (!store?.escalators.NotApplicable) {
              setOpenKey(n ? "escalators" : null)
            }
          }}
          headerStyle={
            store?.escalators.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.escalators.NotApplicable ?? false))}
              onPress={() => store?.updateEscalatorsAccordion({ NotApplicable: !store?.escalators.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.escalators.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.escalators.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={$row}>
                <TextField
                  label="Quantity"
                  placeholder="#"
                  keyboardType="decimal-pad"
                  value={store?.escalators.quantity?.toString() ?? ""}
                  onChangeText={(val) =>
                    store?.updateEscalatorsAccordion({ quantity: val ? parseInt(val, 10) : 0 })
                  }
                  containerStyle={$halfWidth}
                />
                <TextField
                  label="Manufacturer"
                  placeholder="Enter manufacturer"
                  value={store?.escalators.manufacturer ?? ""}
                  onChangeText={(val) => store?.updateEscalatorsAccordion({ manufacturer: val })}
                  containerStyle={$halfWidth}
                />
              </View>

              <ChecklistField
                label="Elevator Controls Compliant?"
                items={[
                  { id: "yes", label: "Yes", checked: store?.escalators.elevatorControlsCompliant ?? false },
                ]}
                onToggle={(id, checked) => store?.updateEscalatorsAccordion({ elevatorControlsCompliant: checked })}
              />

              <ChecklistField
                label="Telephone for Emergency?"
                items={[
                  { id: "yes", label: "Yes", checked: store?.escalators.telephoneForEmergency ?? false },
                ]}
                onToggle={(id, checked) => store?.updateEscalatorsAccordion({ telephoneForEmergency: checked })}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.escalators.assessment.condition as any}
                  onChange={(v) => store?.updateEscalatorsAccordion({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.escalators.assessment.repairStatus as any}
                  onChange={(v) => store?.updateEscalatorsAccordion({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.escalators.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEscalatorsAccordion({ amountToReplaceRepair: val ? parseFloat(val) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* CAB FINISHES */}
        {/* ============================================ */}
        <SectionAccordion
          title="Cab Finishes"
          expanded={!store?.cabFinishes.NotApplicable && openKey === "cabFinishes"}
          onToggle={(n) => {
            if (!store?.cabFinishes.NotApplicable) {
              setOpenKey(n ? "cabFinishes" : null)
            }
          }}
          headerStyle={
            store?.cabFinishes.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.cabFinishes.NotApplicable ?? false))}
              onPress={() => store?.updateCabFinishesAccordion({ NotApplicable: !store?.cabFinishes.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.cabFinishes.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.cabFinishes.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Lights"
                items={ELEVATOR_LIGHTS_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.cabFinishes.lights?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.cabFinishes.lights?.slice() ?? [],
                  (newArray) => store?.updateCabFinishesAccordion({ lights: newArray })
                )}
              />

              <ChecklistField
                label="Floor"
                items={ELEVATOR_FLOOR_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.cabFinishes.floor?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.cabFinishes.floor?.slice() ?? [],
                  (newArray) => store?.updateCabFinishesAccordion({ floor: newArray })
                )}
              />

              {store?.cabFinishes.floor?.includes("other") && (
                <TextField
                  label="Other Floor Specification"
                  placeholder="Specify floor type"
                  value={store?.cabFinishes.floorOtherSpecification ?? ""}
                  onChangeText={(val) => store?.updateCabFinishesAccordion({ floorOtherSpecification: val })}
                />
              )}

              <ChecklistField
                label="Safety Stops"
                items={ELEVATOR_SAFETY_STOPS_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.cabFinishes.safetyStops?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.cabFinishes.safetyStops?.slice() ?? [],
                  (newArray) => store?.updateCabFinishesAccordion({ safetyStops: newArray })
                )}
              />

              <ChecklistField
                label="Wall"
                items={ELEVATOR_WALL_OPTIONS.map((opt) => ({
                  id: opt.id,
                  label: opt.label,
                  checked: store?.cabFinishes.wall?.includes(opt.id) ?? false,
                }))}
                onToggle={createArrayToggleHandler(
                  store?.cabFinishes.wall?.slice() ?? [],
                  (newArray) => store?.updateCabFinishesAccordion({ wall: newArray })
                )}
              />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.cabFinishes.assessment.condition as any}
                  onChange={(v) => store?.updateCabFinishesAccordion({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.cabFinishes.assessment.repairStatus as any}
                  onChange={(v) => store?.updateCabFinishesAccordion({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Replace/Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.cabFinishes.amountToReplaceRepair?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateCabFinishesAccordion({ amountToReplaceRepair: val ? parseFloat(val) : 0 })
                }
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* LAST INSPECTION & CERTIFICATES */}
        {/* ============================================ */}
        <View style={themed($outsideAccordionsSection)}>
          <TextField
            label="Last Inspection"
            placeholder="Enter date (MM/DD/YYYY)"
            value={store?.lastInspection ?? ""}
            onChangeText={(val) => store?.updateTopLevel({ lastInspection: val })}
          />

          <ChecklistField
            label="Inspection Certificate(s)"
            items={INSPECTION_CERTIFICATE_OPTIONS.map((opt) => ({
              id: opt.id,
              label: opt.label,
              checked: store?.inspectionCertificates?.includes(opt.id) ?? false,
            }))}
            onToggle={createArrayToggleHandler(
              store?.inspectionCertificates?.slice() ?? [],
              (newArray) => store?.updateTopLevel({ inspectionCertificates: newArray })
            )}
          />
        </View>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($outsideAccordionsSection)}>
          <TextField
            label="Comments"
            placeholder="Enter any additional comments..."
            value={store?.comments ?? ""}
            onChangeText={(val) => store?.updateComments(val)}
            multiline
            numberOfLines={4}
          />
    </View>
      </ScrollView>

      <View style={$stickyFooter}>
        <StickyFooterNav onBack={onBack} onNext={onNext} showCamera={true} onCamera={onCamera} photoCount={photoCount} />
      </View>
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

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: 88,
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 0,
})

const $introBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 32,
  gap: 8,
}

const $paddedBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  marginBottom: spacing.md,
})

const $titleStyle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.palette.primary2,
  fontSize: 24,
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

const $sectionHeaderRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
}

const $subSectionHeader: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
  fontWeight: "600",
})

const $listContainer: ViewStyle = {
  gap: 16,
}

const $unitCard: ViewStyle = {
  marginBottom: 8,
}

const $cardFields: ViewStyle = {
  gap: 12,
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