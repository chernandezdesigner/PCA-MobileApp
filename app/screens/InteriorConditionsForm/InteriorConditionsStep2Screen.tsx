import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
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
import { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import {
  LOBBY_FLOOR_OPTIONS,
  LOBBY_WALL_OPTIONS,
  LOBBY_CEILING_OPTIONS,
  LOBBY_OTHER_OPTIONS,
  BACK_OF_HOUSE_FLOOR_OPTIONS,
  BACK_OF_HOUSE_WALL_OPTIONS,
  BACK_OF_HOUSE_CEILING_OPTIONS,
  BACK_OF_HOUSE_OTHER_OPTIONS,
  COMMON_AREA_RESTROOM_FLOOR_OPTIONS,
  COMMON_AREA_RESTROOM_WALL_OPTIONS,
  COMMON_AREA_RESTROOM_CEILING_OPTIONS,
  COMMON_AREA_RESTROOM_OTHER_OPTIONS,
  AMENITIES_OPTIONS,
  FURNITURE_FIXTURES_EQUIPMENT_OPTIONS,
  EXERCISE_ROOM_FLOOR_OPTIONS,
  EXERCISE_ROOM_WALL_OPTIONS,
  EXERCISE_ROOM_CEILING_OPTIONS,
  EXERCISE_ROOM_OTHER_OPTIONS,
  COMMON_KITCHEN_FLOOR_OPTIONS,
  COMMON_KITCHEN_WALL_OPTIONS,
  COMMON_KITCHEN_CEILING_OPTIONS,
} from "@/constants/interiorConditionOptions"

export const InteriorConditionsStep2Screen: FC = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const { onCamera, photoCount } = usePhotoCapture("interior_conditions", 2)
  const rootStore = useStores()
  const store = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)?.interiorConditions?.step2
    : undefined

  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("InteriorConditionsStep3" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("InteriorConditionsStep1" as never, { transition: "slide_from_left" } as never)
  }

  const isNA = store?.NotApplicable ?? false

  // --- Checklist item builders ---

  const lobbyFloorItems: ChecklistItem[] = LOBBY_FLOOR_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.lobbyOfficeFinishes.floors.includes(opt.id) ?? false,
  }))
  const lobbyWallItems: ChecklistItem[] = LOBBY_WALL_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.lobbyOfficeFinishes.walls.includes(opt.id) ?? false,
  }))
  const lobbyCeilingItems: ChecklistItem[] = LOBBY_CEILING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.lobbyOfficeFinishes.ceilings.includes(opt.id) ?? false,
  }))
  const lobbyOtherItems: ChecklistItem[] = LOBBY_OTHER_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.lobbyOfficeFinishes.other.includes(opt.id) ?? false,
  }))

  const bohFloorItems: ChecklistItem[] = BACK_OF_HOUSE_FLOOR_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.backOfHouseFinishes.floors.includes(opt.id) ?? false,
  }))
  const bohWallItems: ChecklistItem[] = BACK_OF_HOUSE_WALL_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.backOfHouseFinishes.walls.includes(opt.id) ?? false,
  }))
  const bohCeilingItems: ChecklistItem[] = BACK_OF_HOUSE_CEILING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.backOfHouseFinishes.ceilings.includes(opt.id) ?? false,
  }))
  const bohOtherItems: ChecklistItem[] = BACK_OF_HOUSE_OTHER_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.backOfHouseFinishes.other.includes(opt.id) ?? false,
  }))

  const restroomFloorItems: ChecklistItem[] = COMMON_AREA_RESTROOM_FLOOR_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonAreaRestrooms.floors.includes(opt.id) ?? false,
  }))
  const restroomWallItems: ChecklistItem[] = COMMON_AREA_RESTROOM_WALL_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonAreaRestrooms.walls.includes(opt.id) ?? false,
  }))
  const restroomCeilingItems: ChecklistItem[] = COMMON_AREA_RESTROOM_CEILING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonAreaRestrooms.ceilings.includes(opt.id) ?? false,
  }))
  const restroomOtherItems: ChecklistItem[] = COMMON_AREA_RESTROOM_OTHER_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonAreaRestrooms.other.includes(opt.id) ?? false,
  }))

  const ffeItems: ChecklistItem[] = FURNITURE_FIXTURES_EQUIPMENT_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.furnitureFixturesEquipment.items.includes(opt.id) ?? false,
  }))

  const exerciseFloorItems: ChecklistItem[] = EXERCISE_ROOM_FLOOR_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.exerciseRoom.floors.includes(opt.id) ?? false,
  }))
  const exerciseWallItems: ChecklistItem[] = EXERCISE_ROOM_WALL_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.exerciseRoom.walls.includes(opt.id) ?? false,
  }))
  const exerciseCeilingItems: ChecklistItem[] = EXERCISE_ROOM_CEILING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.exerciseRoom.ceilings.includes(opt.id) ?? false,
  }))
  const exerciseOtherItems: ChecklistItem[] = EXERCISE_ROOM_OTHER_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.exerciseRoom.other.includes(opt.id) ?? false,
  }))

  const kitchenFloorItems: ChecklistItem[] = COMMON_KITCHEN_FLOOR_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonKitchen.floors.includes(opt.id) ?? false,
  }))
  const kitchenWallItems: ChecklistItem[] = COMMON_KITCHEN_WALL_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonKitchen.walls.includes(opt.id) ?? false,
  }))
  const kitchenCeilingItems: ChecklistItem[] = COMMON_KITCHEN_CEILING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.commonKitchen.ceilings.includes(opt.id) ?? false,
  }))

  const amenitiesItems: ChecklistItem[] = AMENITIES_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: store?.amenities.includes(opt.id) ?? false,
  }))

  // --- Toggle helpers ---

  const toggleArray = (current: string[] | undefined, id: string, checked: boolean): string[] => {
    const arr = current ? [...current] : []
    return checked ? [...arr, id] : arr.filter(item => item !== id)
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Interior Conditions"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>

      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Common Area Finishes" style={themed($titleStyle)} />
          <ProgressBar current={2} total={4} />
        </View>

        {/* ============================================ */}
        {/* TOP-LEVEL N/A TOGGLE */}
        {/* ============================================ */}
        <View style={themed($paddedBlock)}>
          <TouchableOpacity
            style={themed($topNaButton(isNA))}
            onPress={() => store?.updateTopLevel({ NotApplicable: !isNA })}
          >
            <Text
              text={isNA ? "Section Marked N/A - Tap to Enable" : "Mark Entire Section N/A"}
              style={themed($topNaButtonText(isNA))}
            />
          </TouchableOpacity>
        </View>

        {!isNA && (
          <>
            {/* ============================================ */}
            {/* TOP-LEVEL FIELDS */}
            {/* ============================================ */}
            <View style={themed($paddedBlock)}>
              <TextField
                label="Last Renovation"
                placeholder="Enter last renovation date or year"
                value={store?.lastRenovation ?? ""}
                onChangeText={(val) => store?.updateTopLevel({ lastRenovation: val })}
              />
              <TextField
                label="Lobby"
                placeholder="Describe lobby"
                value={store?.lobby ?? ""}
                onChangeText={(val) => store?.updateTopLevel({ lobby: val })}
              />
              <ChecklistField
                label="Amenities"
                items={amenitiesItems}
                onToggle={(id, checked) => {
                  const newArr = toggleArray(store?.amenities.slice(), id, checked)
                  store?.updateTopLevel({ amenities: newArr })
                }}
              />
              {store?.amenities.includes("other") && (
                <TextField
                  label="Amenities - Other Specification"
                  placeholder="Specify other amenities"
                  value={store?.amenitiesOtherSpecification ?? ""}
                  onChangeText={(val) => store?.updateTopLevel({ amenitiesOtherSpecification: val })}
                />
              )}
            </View>

            {/* ============================================ */}
            {/* LOBBY / OFFICE / MISC FINISHES */}
            {/* ============================================ */}
            <SectionAccordion
              title="Lobby / Office / Misc Finishes"
              expanded={!store?.lobbyOfficeFinishes.NotApplicable && openKey === "lobbyOfficeFinishes"}
              onToggle={(n) => {
                if (!store?.lobbyOfficeFinishes.NotApplicable) {
                  setOpenKey(n ? "lobbyOfficeFinishes" : null)
                }
              }}
              headerStyle={
                store?.lobbyOfficeFinishes.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.lobbyOfficeFinishes.NotApplicable ?? false))}
                  onPress={() => store?.updateLobbyOfficeFinishes({ NotApplicable: !store?.lobbyOfficeFinishes.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.lobbyOfficeFinishes.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.lobbyOfficeFinishes.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField
                    label="Floors"
                    items={lobbyFloorItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.lobbyOfficeFinishes.floors.slice(), id, checked)
                      store?.updateLobbyOfficeFinishes({ floors: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Walls"
                    items={lobbyWallItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.lobbyOfficeFinishes.walls.slice(), id, checked)
                      store?.updateLobbyOfficeFinishes({ walls: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Ceilings"
                    items={lobbyCeilingItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.lobbyOfficeFinishes.ceilings.slice(), id, checked)
                      store?.updateLobbyOfficeFinishes({ ceilings: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Other"
                    items={lobbyOtherItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.lobbyOfficeFinishes.other.slice(), id, checked)
                      store?.updateLobbyOfficeFinishes({ other: newArr })
                    }}
                  />
                  {store?.lobbyOfficeFinishes.other.includes("other") && (
                    <TextField
                      label="Other Specification"
                      placeholder="Specify other"
                      value={store?.lobbyOfficeFinishes.otherSpecification ?? ""}
                      onChangeText={(val) => store?.updateLobbyOfficeFinishes({ otherSpecification: val })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.lobbyOfficeFinishes.assessment.condition as any}
                      onChange={(v) => store?.updateLobbyOfficeFinishes({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.lobbyOfficeFinishes.assessment.repairStatus as any}
                      onChange={(v) => store?.updateLobbyOfficeFinishes({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Effective Age (Years)"
                    placeholder="Enter effective age"
                    keyboardType="decimal-pad"
                    value={store?.lobbyOfficeFinishes.effectiveAge ? store.lobbyOfficeFinishes.effectiveAge.toString() : ""}
                    onChangeText={(val) => store?.updateLobbyOfficeFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* BACK OF HOUSE / CORRIDOR / MECHANICAL ROOMS */}
            {/* ============================================ */}
            <SectionAccordion
              title="Back of House / Corridor / Mechanical Rooms"
              expanded={!store?.backOfHouseFinishes.NotApplicable && openKey === "backOfHouseFinishes"}
              onToggle={(n) => {
                if (!store?.backOfHouseFinishes.NotApplicable) {
                  setOpenKey(n ? "backOfHouseFinishes" : null)
                }
              }}
              headerStyle={
                store?.backOfHouseFinishes.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.backOfHouseFinishes.NotApplicable ?? false))}
                  onPress={() => store?.updateBackOfHouseFinishes({ NotApplicable: !store?.backOfHouseFinishes.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.backOfHouseFinishes.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.backOfHouseFinishes.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField
                    label="Floors"
                    items={bohFloorItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.backOfHouseFinishes.floors.slice(), id, checked)
                      store?.updateBackOfHouseFinishes({ floors: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Walls"
                    items={bohWallItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.backOfHouseFinishes.walls.slice(), id, checked)
                      store?.updateBackOfHouseFinishes({ walls: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Ceilings"
                    items={bohCeilingItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.backOfHouseFinishes.ceilings.slice(), id, checked)
                      store?.updateBackOfHouseFinishes({ ceilings: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Other"
                    items={bohOtherItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.backOfHouseFinishes.other.slice(), id, checked)
                      store?.updateBackOfHouseFinishes({ other: newArr })
                    }}
                  />
                  {store?.backOfHouseFinishes.other.includes("other") && (
                    <TextField
                      label="Other Specification"
                      placeholder="Specify other"
                      value={store?.backOfHouseFinishes.otherSpecification ?? ""}
                      onChangeText={(val) => store?.updateBackOfHouseFinishes({ otherSpecification: val })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.backOfHouseFinishes.assessment.condition as any}
                      onChange={(v) => store?.updateBackOfHouseFinishes({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.backOfHouseFinishes.assessment.repairStatus as any}
                      onChange={(v) => store?.updateBackOfHouseFinishes({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Effective Age (Years)"
                    placeholder="Enter effective age"
                    keyboardType="decimal-pad"
                    value={store?.backOfHouseFinishes.effectiveAge ? store.backOfHouseFinishes.effectiveAge.toString() : ""}
                    onChangeText={(val) => store?.updateBackOfHouseFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* COMMON AREA RESTROOMS */}
            {/* ============================================ */}
            <SectionAccordion
              title="Common Area Restrooms"
              expanded={!store?.commonAreaRestrooms.NotApplicable && openKey === "commonAreaRestrooms"}
              onToggle={(n) => {
                if (!store?.commonAreaRestrooms.NotApplicable) {
                  setOpenKey(n ? "commonAreaRestrooms" : null)
                }
              }}
              headerStyle={
                store?.commonAreaRestrooms.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.commonAreaRestrooms.NotApplicable ?? false))}
                  onPress={() => store?.updateCommonAreaRestrooms({ NotApplicable: !store?.commonAreaRestrooms.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.commonAreaRestrooms.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.commonAreaRestrooms.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <TextField
                    label="Quantity"
                    placeholder="Enter quantity"
                    keyboardType="decimal-pad"
                    value={store?.commonAreaRestrooms.quantity ? store.commonAreaRestrooms.quantity.toString() : ""}
                    onChangeText={(val) => store?.updateCommonAreaRestrooms({ quantity: val ? parseInt(val, 10) : 0 })}
                  />
                  <ChecklistField
                    label="Floors"
                    items={restroomFloorItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonAreaRestrooms.floors.slice(), id, checked)
                      store?.updateCommonAreaRestrooms({ floors: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Walls"
                    items={restroomWallItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonAreaRestrooms.walls.slice(), id, checked)
                      store?.updateCommonAreaRestrooms({ walls: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Ceilings"
                    items={restroomCeilingItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonAreaRestrooms.ceilings.slice(), id, checked)
                      store?.updateCommonAreaRestrooms({ ceilings: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Other"
                    items={restroomOtherItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonAreaRestrooms.other.slice(), id, checked)
                      store?.updateCommonAreaRestrooms({ other: newArr })
                    }}
                  />
                  {store?.commonAreaRestrooms.other.includes("other") && (
                    <TextField
                      label="Other Specification"
                      placeholder="Specify other"
                      value={store?.commonAreaRestrooms.otherSpecification ?? ""}
                      onChangeText={(val) => store?.updateCommonAreaRestrooms({ otherSpecification: val })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.commonAreaRestrooms.assessment.condition as any}
                      onChange={(v) => store?.updateCommonAreaRestrooms({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.commonAreaRestrooms.assessment.repairStatus as any}
                      onChange={(v) => store?.updateCommonAreaRestrooms({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Effective Age (Years)"
                    placeholder="Enter effective age"
                    keyboardType="decimal-pad"
                    value={store?.commonAreaRestrooms.effectiveAge ? store.commonAreaRestrooms.effectiveAge.toString() : ""}
                    onChangeText={(val) => store?.updateCommonAreaRestrooms({ effectiveAge: val ? parseInt(val, 10) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* FURNITURE, FIXTURES & EQUIPMENT */}
            {/* ============================================ */}
            <SectionAccordion
              title="Furniture, Fixtures & Equipment"
              expanded={!store?.furnitureFixturesEquipment.NotApplicable && openKey === "furnitureFixturesEquipment"}
              onToggle={(n) => {
                if (!store?.furnitureFixturesEquipment.NotApplicable) {
                  setOpenKey(n ? "furnitureFixturesEquipment" : null)
                }
              }}
              headerStyle={
                store?.furnitureFixturesEquipment.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.furnitureFixturesEquipment.NotApplicable ?? false))}
                  onPress={() => store?.updateFurnitureFixturesEquipment({ NotApplicable: !store?.furnitureFixturesEquipment.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.furnitureFixturesEquipment.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.furnitureFixturesEquipment.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField
                    label="Items"
                    items={ffeItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.furnitureFixturesEquipment.items.slice(), id, checked)
                      store?.updateFurnitureFixturesEquipment({ items: newArr })
                    }}
                  />
                  {store?.furnitureFixturesEquipment.items.includes("other") && (
                    <TextField
                      label="Other Specification"
                      placeholder="Specify other"
                      value={store?.furnitureFixturesEquipment.otherSpecification ?? ""}
                      onChangeText={(val) => store?.updateFurnitureFixturesEquipment({ otherSpecification: val })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.furnitureFixturesEquipment.assessment.condition as any}
                      onChange={(v) => store?.updateFurnitureFixturesEquipment({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.furnitureFixturesEquipment.assessment.repairStatus as any}
                      onChange={(v) => store?.updateFurnitureFixturesEquipment({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Replace/Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.furnitureFixturesEquipment.amountToReplaceRepair ? store.furnitureFixturesEquipment.amountToReplaceRepair.toString() : ""}
                    onChangeText={(val) => store?.updateFurnitureFixturesEquipment({ amountToReplaceRepair: val ? parseFloat(val) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* EXERCISE ROOM */}
            {/* ============================================ */}
            <SectionAccordion
              title="Exercise Room"
              expanded={!store?.exerciseRoom.NotApplicable && openKey === "exerciseRoom"}
              onToggle={(n) => {
                if (!store?.exerciseRoom.NotApplicable) {
                  setOpenKey(n ? "exerciseRoom" : null)
                }
              }}
              headerStyle={
                store?.exerciseRoom.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.exerciseRoom.NotApplicable ?? false))}
                  onPress={() => store?.updateExerciseRoom({ NotApplicable: !store?.exerciseRoom.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.exerciseRoom.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.exerciseRoom.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField
                    label="Floors"
                    items={exerciseFloorItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.exerciseRoom.floors.slice(), id, checked)
                      store?.updateExerciseRoom({ floors: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Walls"
                    items={exerciseWallItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.exerciseRoom.walls.slice(), id, checked)
                      store?.updateExerciseRoom({ walls: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Ceilings"
                    items={exerciseCeilingItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.exerciseRoom.ceilings.slice(), id, checked)
                      store?.updateExerciseRoom({ ceilings: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Other"
                    items={exerciseOtherItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.exerciseRoom.other.slice(), id, checked)
                      store?.updateExerciseRoom({ other: newArr })
                    }}
                  />
                  {store?.exerciseRoom.other.includes("other") && (
                    <TextField
                      label="Other Specification"
                      placeholder="Specify other"
                      value={store?.exerciseRoom.otherSpecification ?? ""}
                      onChangeText={(val) => store?.updateExerciseRoom({ otherSpecification: val })}
                    />
                  )}

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.exerciseRoom.assessment.condition as any}
                      onChange={(v) => store?.updateExerciseRoom({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.exerciseRoom.assessment.repairStatus as any}
                      onChange={(v) => store?.updateExerciseRoom({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Replace/Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.exerciseRoom.amountToReplaceRepair ? store.exerciseRoom.amountToReplaceRepair.toString() : ""}
                    onChangeText={(val) => store?.updateExerciseRoom({ amountToReplaceRepair: val ? parseFloat(val) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* COMMON KITCHEN */}
            {/* ============================================ */}
            <SectionAccordion
              title="Common Kitchen"
              expanded={!store?.commonKitchen.NotApplicable && openKey === "commonKitchen"}
              onToggle={(n) => {
                if (!store?.commonKitchen.NotApplicable) {
                  setOpenKey(n ? "commonKitchen" : null)
                }
              }}
              headerStyle={
                store?.commonKitchen.NotApplicable
                  ? themed($naHeaderStyle)
                  : undefined
              }
              RightComponent={
                <TouchableOpacity
                  style={themed($naButton(store?.commonKitchen.NotApplicable ?? false))}
                  onPress={() => store?.updateCommonKitchen({ NotApplicable: !store?.commonKitchen.NotApplicable })}
                >
                  <Text
                    text="N/A"
                    style={themed($naButtonText(store?.commonKitchen.NotApplicable ?? false))}
                  />
                </TouchableOpacity>
              }
            >
              {!store?.commonKitchen.NotApplicable && (
                <View style={themed($sectionBody)}>
                  <ChecklistField
                    label="Floors"
                    items={kitchenFloorItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonKitchen.floors.slice(), id, checked)
                      store?.updateCommonKitchen({ floors: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Walls"
                    items={kitchenWallItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonKitchen.walls.slice(), id, checked)
                      store?.updateCommonKitchen({ walls: newArr })
                    }}
                  />
                  <ChecklistField
                    label="Ceilings"
                    items={kitchenCeilingItems}
                    onToggle={(id, checked) => {
                      const newArr = toggleArray(store?.commonKitchen.ceilings.slice(), id, checked)
                      store?.updateCommonKitchen({ ceilings: newArr })
                    }}
                  />

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Condition" />
                    <ConditionAssessment
                      value={store?.commonKitchen.assessment.condition as any}
                      onChange={(v) => store?.updateCommonKitchen({ assessment: { condition: v } })}
                    />
                  </View>

                  <View style={themed($controlGroup)}>
                    <Text preset="formLabel" text="Repair Status" />
                    <RepairStatus
                      value={store?.commonKitchen.assessment.repairStatus as any}
                      onChange={(v) => store?.updateCommonKitchen({ assessment: { repairStatus: v } })}
                    />
                  </View>

                  <TextField
                    label="Amount to Replace/Repair ($)"
                    placeholder="Dollar amount"
                    keyboardType="decimal-pad"
                    value={store?.commonKitchen.amountToReplaceRepair ? store.commonKitchen.amountToReplaceRepair.toString() : ""}
                    onChangeText={(val) => store?.updateCommonKitchen({ amountToReplaceRepair: val ? parseFloat(val) : 0 })}
                  />
                </View>
              )}
            </SectionAccordion>

            {/* ============================================ */}
            {/* COMMENTS */}
            {/* ============================================ */}
            <View style={themed($commentsBlock)}>
              <TextField
                label="Comments"
                placeholder="Additional notes about common area finishes"
                value={store?.comments ?? ""}
                onChangeText={(val) => store?.updateComments(val)}
                multiline
                minRows={2}
              />
            </View>
          </>
        )}
      </ScrollView>

      <View style={$stickyFooter}>
        <StickyFooterNav onBack={onBack} onNext={onNext} showCamera={true} onCamera={onCamera} photoCount={photoCount} />
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

const $topNaButton = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 8,
  backgroundColor: isActive ? colors.palette.primary2 : colors.palette.neutral300,
  alignItems: "center",
})

const $topNaButtonText = (isActive: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isActive ? colors.palette.neutral100 : colors.text,
  fontSize: 14,
  fontWeight: "600",
})
