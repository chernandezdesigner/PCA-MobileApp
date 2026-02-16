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
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  DOOR_TYPE_OPTIONS,
  DOOR_HARDWARE_HANDLE_OPTIONS,
  DOOR_HARDWARE_OPERATION_OPTIONS,
  DOOR_FRAME_OPTIONS,
  DOOR_HARDWARE_TYPE_OPTIONS,
  BALCONY_PATIO_DOOR_TYPE_OPTIONS,
  BALCONY_PATIO_DOOR_GLAZING_OPTIONS,
  OVERHEAD_DOOR_MATERIAL_OPTIONS,
  OVERHEAD_DOOR_STYLE_OPTIONS,
  OVERHEAD_DOOR_OPERATION_OPTIONS,
  DOCK_EQUIPMENT_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep9ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep9"> {}

export const BuildingEnvelopeStep9Screen: FC<BuildingEnvelopeStep9ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step9

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Doors data
  const doorTypesData = store?.doors.doorTypes ?? []
  const doorTypesItems: ChecklistItem[] = DOOR_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: doorTypesData.includes(opt.id),
  }))

  const doorHandleData = store?.doors.handleTypes ?? []
  const doorHandleItems: ChecklistItem[] = DOOR_HARDWARE_HANDLE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: doorHandleData.includes(opt.id),
  }))

  const doorOperationData = store?.doors.operationTypes ?? []
  const doorOperationItems: ChecklistItem[] = DOOR_HARDWARE_OPERATION_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: doorOperationData.includes(opt.id),
  }))

  const doorFrameData = store?.doors.frameTypes ?? []
  const doorFrameItems: ChecklistItem[] = DOOR_FRAME_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: doorFrameData.includes(opt.id),
  }))

  // Service Doors data
  const serviceDoorTypesData = store?.serviceDoors.doorTypes ?? []
  const serviceDoorTypesItems: ChecklistItem[] = DOOR_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: serviceDoorTypesData.includes(opt.id),
  }))

  const serviceDoorHandleData = store?.serviceDoors.handleTypes ?? []
  const serviceDoorHandleItems: ChecklistItem[] = DOOR_HARDWARE_HANDLE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: serviceDoorHandleData.includes(opt.id),
  }))

  const serviceDoorOperationData = store?.serviceDoors.operationTypes ?? []
  const serviceDoorOperationItems: ChecklistItem[] = DOOR_HARDWARE_OPERATION_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: serviceDoorOperationData.includes(opt.id),
  }))

  const serviceDoorFrameData = store?.serviceDoors.frameTypes ?? []
  const serviceDoorFrameItems: ChecklistItem[] = DOOR_FRAME_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: serviceDoorFrameData.includes(opt.id),
  }))

  // Hardware Type data
  const hardwareTypeData = store?.hardwareType.hardwareTypes ?? []
  const hardwareTypeItems: ChecklistItem[] = DOOR_HARDWARE_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: hardwareTypeData.includes(opt.id),
  }))

  // Balcony/Patio Door data
  const balconyDoorTypesData = store?.balconyPatioDoor.doorTypes ?? []
  const balconyDoorTypesItems: ChecklistItem[] = BALCONY_PATIO_DOOR_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: balconyDoorTypesData.includes(opt.id),
  }))

  const balconyDoorGlazingData = store?.balconyPatioDoor.glazing ?? []
  const balconyDoorGlazingItems: ChecklistItem[] = BALCONY_PATIO_DOOR_GLAZING_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: balconyDoorGlazingData.includes(opt.id),
  }))

  // Overhead Door data
  const overheadDoorMaterialData = store?.overheadDoor.material ?? []
  const overheadDoorMaterialItems: ChecklistItem[] = OVERHEAD_DOOR_MATERIAL_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: overheadDoorMaterialData.includes(opt.id),
  }))

  const overheadDoorStyleData = store?.overheadDoor.style ?? []
  const overheadDoorStyleItems: ChecklistItem[] = OVERHEAD_DOOR_STYLE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: overheadDoorStyleData.includes(opt.id),
  }))

  const overheadDoorOperationData = store?.overheadDoor.operation ?? []
  const overheadDoorOperationItems: ChecklistItem[] = OVERHEAD_DOOR_OPERATION_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: overheadDoorOperationData.includes(opt.id),
  }))

  // Dock Equipment data
  const dockEquipmentData = store?.dockEquipment.equipment ?? []
  const dockEquipmentItems: ChecklistItem[] = DOCK_EQUIPMENT_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: dockEquipmentData.includes(opt.id),
  }))

  // Toggle handlers for Doors
  const toggleDoorTypes = (id: string, checked: boolean) => {
    const current = doorTypesData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDoors({ doorTypes: newArray })
  }

  const toggleDoorHandle = (id: string, checked: boolean) => {
    const current = doorHandleData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDoors({ handleTypes: newArray })
  }

  const toggleDoorOperation = (id: string, checked: boolean) => {
    const current = doorOperationData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDoors({ operationTypes: newArray })
  }

  const toggleDoorFrame = (id: string, checked: boolean) => {
    const current = doorFrameData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDoors({ frameTypes: newArray })
  }

  // Toggle handlers for Service Doors
  const toggleServiceDoorTypes = (id: string, checked: boolean) => {
    const current = serviceDoorTypesData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateServiceDoors({ doorTypes: newArray })
  }

  const toggleServiceDoorHandle = (id: string, checked: boolean) => {
    const current = serviceDoorHandleData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateServiceDoors({ handleTypes: newArray })
  }

  const toggleServiceDoorOperation = (id: string, checked: boolean) => {
    const current = serviceDoorOperationData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateServiceDoors({ operationTypes: newArray })
  }

  const toggleServiceDoorFrame = (id: string, checked: boolean) => {
    const current = serviceDoorFrameData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateServiceDoors({ frameTypes: newArray })
  }

  // Toggle handlers for other sections
  const toggleHardwareType = (id: string, checked: boolean) => {
    const current = hardwareTypeData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateHardwareType({ hardwareTypes: newArray })
  }

  const toggleBalconyDoorTypes = (id: string, checked: boolean) => {
    const current = balconyDoorTypesData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateBalconyPatioDoor({ doorTypes: newArray })
  }

  const toggleBalconyDoorGlazing = (id: string, checked: boolean) => {
    const current = balconyDoorGlazingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateBalconyPatioDoor({ glazing: newArray })
  }

  const toggleOverheadDoorMaterial = (id: string, checked: boolean) => {
    const current = overheadDoorMaterialData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateOverheadDoor({ material: newArray })
  }

  const toggleOverheadDoorStyle = (id: string, checked: boolean) => {
    const current = overheadDoorStyleData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateOverheadDoor({ style: newArray })
  }

  const toggleOverheadDoorOperation = (id: string, checked: boolean) => {
    const current = overheadDoorOperationData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateOverheadDoor({ operation: newArray })
  }

  const toggleDockEquipment = (id: string, checked: boolean) => {
    const current = dockEquipmentData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateDockEquipment({ equipment: newArray })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep8" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Doors" style={themed($titleStyle)} />
          <ProgressBar current={9} total={10} />
        </View>

        {/* Doors Accordion */}
        <SectionAccordion
          title="Doors"
          expanded={openKey === "doors"}
          onToggle={(n) => setOpenKey(n ? "doors" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Door Type" items={doorTypesItems} onToggle={toggleDoorTypes} />

            <ChecklistField label="Hardware - Handle" items={doorHandleItems} onToggle={toggleDoorHandle} />

            <ChecklistField label="Hardware - Operation" items={doorOperationItems} onToggle={toggleDoorOperation} />

            <ChecklistField label="Frame" items={doorFrameItems} onToggle={toggleDoorFrame} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.doors.assessment.condition as any}
                onChange={(v) => store?.updateDoors({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.doors.assessment.repairStatus as any}
                onChange={(v) => store?.updateDoors({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.doors.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateDoors({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        {/* Service Doors Accordion */}
        <SectionAccordion
          title="Service Doors"
          expanded={openKey === "serviceDoors"}
          onToggle={(n) => setOpenKey(n ? "serviceDoors" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Door Type" items={serviceDoorTypesItems} onToggle={toggleServiceDoorTypes} />

            <ChecklistField label="Hardware - Handle" items={serviceDoorHandleItems} onToggle={toggleServiceDoorHandle} />

            <ChecklistField label="Hardware - Operation" items={serviceDoorOperationItems} onToggle={toggleServiceDoorOperation} />

            <ChecklistField label="Frame" items={serviceDoorFrameItems} onToggle={toggleServiceDoorFrame} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.serviceDoors.assessment.condition as any}
                onChange={(v) => store?.updateServiceDoors({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.serviceDoors.assessment.repairStatus as any}
                onChange={(v) => store?.updateServiceDoors({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.serviceDoors.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateServiceDoors({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        {/* Hardware Type Accordion */}
        <SectionAccordion
          title="Hardware Type"
          expanded={openKey === "hardwareType"}
          onToggle={(n) => setOpenKey(n ? "hardwareType" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Hardware Type" items={hardwareTypeItems} onToggle={toggleHardwareType} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.hardwareType.assessment.condition as any}
                onChange={(v) => store?.updateHardwareType({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.hardwareType.assessment.repairStatus as any}
                onChange={(v) => store?.updateHardwareType({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.hardwareType.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHardwareType({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        {/* Balcony/Patio Door Accordion */}
        <SectionAccordion
          title="Balconies/Patios Doors"
          expanded={!store?.balconyPatioDoor.NotApplicable && openKey === "balconyPatioDoor"}
          onToggle={(n) => {
            if (!store?.balconyPatioDoor.NotApplicable) {
              setOpenKey(n ? "balconyPatioDoor" : null)
            }
          }}
          headerStyle={
            store?.balconyPatioDoor.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.balconyPatioDoor.NotApplicable ?? false))}
              onPress={() => store?.updateBalconyPatioDoor({ NotApplicable: !store?.balconyPatioDoor.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.balconyPatioDoor.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.balconyPatioDoor.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Door Type" items={balconyDoorTypesItems} onToggle={toggleBalconyDoorTypes} />

              <ChecklistField label="Glazing" items={balconyDoorGlazingItems} onToggle={toggleBalconyDoorGlazing} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.balconyPatioDoor.assessment.condition as any}
                  onChange={(v) => store?.updateBalconyPatioDoor({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.balconyPatioDoor.assessment.repairStatus as any}
                  onChange={(v) => store?.updateBalconyPatioDoor({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.balconyPatioDoor.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateBalconyPatioDoor({ assessment: { amountToRepair: txt } })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* Overhead Door Accordion */}
        <SectionAccordion
          title="Overhead Door"
          expanded={!store?.overheadDoor.NotApplicable && openKey === "overheadDoor"}
          onToggle={(n) => {
            if (!store?.overheadDoor.NotApplicable) {
              setOpenKey(n ? "overheadDoor" : null)
            }
          }}
          headerStyle={
            store?.overheadDoor.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.overheadDoor.NotApplicable ?? false))}
              onPress={() => store?.updateOverheadDoor({ NotApplicable: !store?.overheadDoor.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.overheadDoor.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.overheadDoor.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Material" items={overheadDoorMaterialItems} onToggle={toggleOverheadDoorMaterial} />

              <ChecklistField label="Style" items={overheadDoorStyleItems} onToggle={toggleOverheadDoorStyle} />

              <ChecklistField label="Operation" items={overheadDoorOperationItems} onToggle={toggleOverheadDoorOperation} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.overheadDoor.assessment.condition as any}
                  onChange={(v) => store?.updateOverheadDoor({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.overheadDoor.assessment.repairStatus as any}
                  onChange={(v) => store?.updateOverheadDoor({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.overheadDoor.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateOverheadDoor({ assessment: { amountToRepair: txt } })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* Dock Equipment Accordion */}
        <SectionAccordion
          title="Dock Equipment"
          expanded={!store?.dockEquipment.NotApplicable && openKey === "dockEquipment"}
          onToggle={(n) => {
            if (!store?.dockEquipment.NotApplicable) {
              setOpenKey(n ? "dockEquipment" : null)
            }
          }}
          headerStyle={
            store?.dockEquipment.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.dockEquipment.NotApplicable ?? false))}
              onPress={() => store?.updateDockEquipment({ NotApplicable: !store?.dockEquipment.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.dockEquipment.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.dockEquipment.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField label="Equipment" items={dockEquipmentItems} onToggle={toggleDockEquipment} />

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.dockEquipment.assessment.condition as any}
                  onChange={(v) => store?.updateDockEquipment({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.dockEquipment.assessment.repairStatus as any}
                  onChange={(v) => store?.updateDockEquipment({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="decimal-pad"
                value={store?.dockEquipment.assessment.amountToRepair ?? ""}
                onChangeText={(txt) => store?.updateDockEquipment({ assessment: { amountToRepair: txt } })}
              />
            </View>
          )}
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Note any door conditions, hardware issues, or concerns"
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
            navigation.navigate("BuildingEnvelopeStep8" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep10" as never, { transition: "slide_from_right" } as never)
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
