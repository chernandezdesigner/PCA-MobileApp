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
import { Dropdown } from "@/components/Dropdown"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, AllowedStylesT } from "@/theme/types"
import type { Instance } from "mobx-state-tree"
import type { InteriorConditionsStep4 } from "@/models/InteriorConditionsStepModels/step4"

// Hotel Options
import {
  HotelUnitFinishesOptions,
  HotelCommonAreaListsOptions,
  HotelAdminOfficeFinishesOptions,
  HotelLoungeFinishesOptions,
  HotelRestroomsFinishesOptions,
  HotelKitchenFinishesOptions,
  HotelGuestLaundryFinishesOptions,
  HotelGuestLaundryLocationOptions,
  HotelCommercialLaundryFinishesOptions,
  HotelLobbyFFEOptions,
  HotelCommercialLaundryEquipmentOptions,
  HotelGuestLaundryEquipmentOptions,
  HotelGuestLaundryFridgeFreezerOptions,
  HotelCommercialKitchenDishwasherOptions,
  HotelCommercialKitchenEquipmentOptions,
  HotelGuestRoomSoftGoodsOptions,
  HotelGuestRoomHardGoodsOptions,
  HotelGuestRoomTVOptions,
  HotelGuestRoomWardrobeOptions,
  HotelGuestRoomKitchenCabinetsOptions,
  HotelGuestRoomKitchenCounterTopsOptions,
  HotelGuestRoomKitchenRangeOptions,
  HotelGuestRoomKitchenHoodOptions,
  HotelGuestRoomKitchenEquipmentOptions,
  HotelGuestRoomBathtubOptions,
  HotelGuestRoomTubSurroundsOptions,
  HotelGuestRoomShowersOptions,
  HotelGuestRoomBathroomOptions,
} from "@/constants/interiorConditionOptions"

// Apartment Options
import {
  ApartmentUnitFinishesOptions,
  ApartmentRestroomFinishesOptions,
  ApartmentKitchenFinishesOptions,
  ApartmentInteriorDoorsOptions,
  ApartmentWardrobeOptions,
  ApartmentClubhouseLobbyFinishesOptions,
  ApartmentCorridorFinishesOptions,
  ApartmentCommonRestroomsFinishesOptions,
  ApartmentExerciseRoomFinishesOptions,
  ApartmentCommonKitchenFinishesOptions,
  ApartmentLaundryRoomFinishesOptions,
  ApartmentManagerUnitFinishesOptions,
  ApartmentLobbyFFEOptions,
  ApartmentBusinessCenterOptions,
  ApartmentCommonAreaLaundryEquipmentOptions,
  ApartmentLaundryOwnershipOptions,
  ApartmentLaundryProvidedByOptions,
  ApartmentLaundryLocationOptions,
  ApartmentKitchenCabinetsOptions,
  ApartmentKitchenCounterTopsOptions,
  ApartmentKitchenRangeOptions,
  ApartmentKitchenHoodOptions,
  ApartmentKitchenEquipmentOptions,
  ApartmentBathtubOptions,
  ApartmentTubSurroundsOptions,
  ApartmentRollInShowersOptions,
  ApartmentBathroomOptions,
  ApartmentFurnishedApartmentItemsOptions,
  ApartmentFurnishedApartmentTVOptions,
} from "@/constants/interiorConditionOptions"

// ============================================
// TYPES
// ============================================

type Step4Store = Instance<typeof InteriorConditionsStep4>
type ThemedFn = <T>(styleOrStyleFn: AllowedStylesT<T>) => T

// ============================================
// SHARED HELPERS
// ============================================

const buildItems = (options: readonly { id: string; label: string }[], storeData: string[]): ChecklistItem[] =>
  options.map((opt) => ({ id: opt.id, label: opt.label, checked: storeData.includes(opt.id) }))

const toggleItem = (storeData: string[], id: string, checked: boolean): string[] =>
  checked ? [...storeData, id] : storeData.filter((item: string) => item !== id)

// ============================================
// PROPERTY TYPE TOGGLE CONFIG
// ============================================

const PROPERTY_TYPES = [
  { key: "hotel", label: "Hotel" },
  { key: "apartment", label: "Apartment" },
  { key: "storage", label: "Storage" },
  { key: "mobileHomes", label: "Mobile Homes" },
  { key: "nursingHomes", label: "Nursing Homes" },
  { key: "multiFamily", label: "Multi-Family" },
] as const

type PropertyTypeKey = typeof PROPERTY_TYPES[number]["key"]

// ============================================
// MAIN SCREEN COMPONENT
// ============================================

export const InteriorConditionsStep4Screen: FC = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.interiorConditions?.step4

  // Separate openKey state per property type section
  const [hotelOpenKey, setHotelOpenKey] = useState<string | null>(null)
  const [apartmentOpenKey, setApartmentOpenKey] = useState<string | null>(null)

  const toggleMap: Record<PropertyTypeKey, { selected: boolean; toggle: (v: boolean) => void }> = {
    hotel: {
      selected: store?.hotelSelected ?? false,
      toggle: (v) => store?.toggleHotel(v),
    },
    apartment: {
      selected: store?.apartmentSelected ?? false,
      toggle: (v) => store?.toggleApartment(v),
    },
    storage: {
      selected: store?.storageSelected ?? false,
      toggle: (v) => store?.toggleStorage(v),
    },
    mobileHomes: {
      selected: store?.mobileHomesSelected ?? false,
      toggle: (v) => store?.toggleMobileHomes(v),
    },
    nursingHomes: {
      selected: store?.nursingHomesSelected ?? false,
      toggle: (v) => store?.toggleNursingHomes(v),
    },
    multiFamily: {
      selected: store?.multiFamilySelected ?? false,
      toggle: (v) => store?.toggleMultiFamily(v),
    },
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Interior Conditions"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("InteriorConditionsStep3" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>

      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Alternate Properties" style={themed($titleStyle)} />
          <ProgressBar current={4} total={4} />
        </View>

        {/* ============================================ */}
        {/* PROPERTY TYPE TOGGLES */}
        {/* ============================================ */}
        <View style={themed($toggleSection)}>
          <Text preset="formLabel" text="Select Property Types" />
          <View style={$toggleRow}>
            {PROPERTY_TYPES.map((pt) => {
              const isSelected = toggleMap[pt.key].selected
              return (
                <TouchableOpacity
                  key={pt.key}
                  style={themed($toggleChip(isSelected))}
                  onPress={() => toggleMap[pt.key].toggle(!isSelected)}
                  accessibilityLabel={`${pt.label} property type`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    text={pt.label}
                    style={themed($toggleChipText(isSelected))}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* ============================================ */}
        {/* HOTEL SECTION */}
        {/* ============================================ */}
        {store?.isHotelSelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Hotel" style={themed($propertySectionTitle)} />
            <HotelAccordions
              store={store}
              openKey={hotelOpenKey}
              setOpenKey={setHotelOpenKey}
              themed={themed}
            />
          </View>
        )}

        {/* ============================================ */}
        {/* APARTMENT SECTION */}
        {/* ============================================ */}
        {store?.isApartmentSelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Apartment" style={themed($propertySectionTitle)} />
            <ApartmentAccordions
              store={store}
              openKey={apartmentOpenKey}
              setOpenKey={setApartmentOpenKey}
              themed={themed}
            />
          </View>
        )}

        {/* ============================================ */}
        {/* PLACEHOLDER SECTIONS */}
        {/* ============================================ */}
        {store?.isStorageSelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Storage" style={themed($propertySectionTitle)} />
            <View style={themed($placeholderBlock)}>
              <Text text="Coming soon" style={themed($placeholderText)} />
            </View>
          </View>
        )}

        {store?.isMobileHomesSelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Mobile Homes" style={themed($propertySectionTitle)} />
            <View style={themed($placeholderBlock)}>
              <Text text="Coming soon" style={themed($placeholderText)} />
            </View>
          </View>
        )}

        {store?.isNursingHomesSelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Nursing Homes" style={themed($propertySectionTitle)} />
            <View style={themed($placeholderBlock)}>
              <Text text="Coming soon" style={themed($placeholderText)} />
            </View>
          </View>
        )}

        {store?.isMultiFamilySelected && (
          <View style={themed($propertyTypeSection)}>
            <Text preset="subheading" text="Multi-Family" style={themed($propertySectionTitle)} />
            <View style={themed($placeholderBlock)}>
              <Text text="Coming soon" style={themed($placeholderText)} />
            </View>
          </View>
        )}

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about alternate properties"
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
            navigation.navigate("InteriorConditionsStep3" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={openDrawer}
          nextButtonText="Next Form"
          showCamera={true}
        />
      </View>
    </Screen>
  )
})

// ============================================
// HOTEL ACCORDIONS SUB-COMPONENT
// ============================================

const HotelAccordions: FC<{
  store: Step4Store | undefined
  openKey: string | null
  setOpenKey: (key: string | null) => void
  themed: ThemedFn
}> = observer(({ store, openKey, setOpenKey, themed }) => {
  const hotel = store?.hotel

  return (
    <>
      {/* 1. Unit Finishes */}
      <SectionAccordion
        title="Unit Finishes"
        expanded={!hotel?.unitFinishes.NotApplicable && openKey === "hotel-unitFinishes"}
        onToggle={(n) => {
          if (!hotel?.unitFinishes.NotApplicable) setOpenKey(n ? "hotel-unitFinishes" : null)
        }}
        headerStyle={hotel?.unitFinishes.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.unitFinishes.NotApplicable ?? false))}
            onPress={() => store?.updateHotelUnitFinishes({ NotApplicable: !hotel?.unitFinishes.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.unitFinishes.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.unitFinishes.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(HotelUnitFinishesOptions, hotel?.unitFinishes.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelUnitFinishes({
                items: toggleItem(hotel?.unitFinishes.items?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.unitFinishes.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other finish..."
                value={hotel?.unitFinishes.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelUnitFinishes({ otherSpecification: txt })}
              />
            )}
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.unitFinishes.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelUnitFinishes({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.unitFinishes.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelUnitFinishes({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.unitFinishes.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelUnitFinishes({ assessment: { amountToRepair: txt } })}
            />
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={hotel?.unitFinishes.effectiveAge ? String(hotel.unitFinishes.effectiveAge) : ""}
              onChangeText={(txt) => store?.updateHotelUnitFinishes({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 2. Common Area Lists */}
      <SectionAccordion
        title="Common Area Lists"
        expanded={!hotel?.commonAreaLists.NotApplicable && openKey === "hotel-commonAreaLists"}
        onToggle={(n) => {
          if (!hotel?.commonAreaLists.NotApplicable) setOpenKey(n ? "hotel-commonAreaLists" : null)
        }}
        headerStyle={hotel?.commonAreaLists.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.commonAreaLists.NotApplicable ?? false))}
            onPress={() => store?.updateHotelCommonAreaLists({ NotApplicable: !hotel?.commonAreaLists.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.commonAreaLists.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.commonAreaLists.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Common Areas"
              items={buildItems(HotelCommonAreaListsOptions, hotel?.commonAreaLists.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelCommonAreaLists({
                items: toggleItem(hotel?.commonAreaLists.items?.slice() ?? [], id, checked),
              })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 3. Admin Office Finishes */}
      <StandardFinishesAccordion
        title="Admin Office Finishes"
        accordionKey="hotel-adminOfficeFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={hotel?.adminOfficeFinishes}
        options={HotelAdminOfficeFinishesOptions}
        updateFn="updateHotelAdminOfficeFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 4. Lounge Finishes */}
      <StandardFinishesAccordion
        title="Lounge Finishes"
        accordionKey="hotel-loungeFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={hotel?.loungeFinishes}
        options={HotelLoungeFinishesOptions}
        updateFn="updateHotelLoungeFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 5. Restrooms Finishes */}
      <StandardFinishesAccordion
        title="Restrooms Finishes"
        accordionKey="hotel-restroomsFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={hotel?.restroomsFinishes}
        options={HotelRestroomsFinishesOptions}
        updateFn="updateHotelRestroomsFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 6. Kitchen Finishes */}
      <StandardFinishesAccordion
        title="Kitchen Finishes"
        accordionKey="hotel-kitchenFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={hotel?.kitchenFinishes}
        options={HotelKitchenFinishesOptions}
        updateFn="updateHotelKitchenFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 7. Guest Laundry */}
      <SectionAccordion
        title="Guest Laundry"
        expanded={!hotel?.guestLaundry.NotApplicable && openKey === "hotel-guestLaundry"}
        onToggle={(n) => {
          if (!hotel?.guestLaundry.NotApplicable) setOpenKey(n ? "hotel-guestLaundry" : null)
        }}
        headerStyle={hotel?.guestLaundry.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestLaundry.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestLaundry({ NotApplicable: !hotel?.guestLaundry.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestLaundry.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestLaundry.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(HotelGuestLaundryFinishesOptions, hotel?.guestLaundry.finishes?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestLaundry({
                finishes: toggleItem(hotel?.guestLaundry.finishes?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.guestLaundry.finishes?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other finish..."
                value={hotel?.guestLaundry.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelGuestLaundry({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="Location"
              value={hotel?.guestLaundry.location ?? ""}
              onValueChange={(val) => store?.updateHotelGuestLaundry({ location: val })}
              options={HotelGuestLaundryLocationOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestLaundry.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestLaundry({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestLaundry.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestLaundry({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestLaundry.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestLaundry({ assessment: { amountToRepair: txt } })}
            />
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={hotel?.guestLaundry.effectiveAge ? String(hotel.guestLaundry.effectiveAge) : ""}
              onChangeText={(txt) => store?.updateHotelGuestLaundry({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 8. Commercial Laundry */}
      <SectionAccordion
        title="Commercial Laundry"
        expanded={!hotel?.commercialLaundry.NotApplicable && openKey === "hotel-commercialLaundry"}
        onToggle={(n) => {
          if (!hotel?.commercialLaundry.NotApplicable) setOpenKey(n ? "hotel-commercialLaundry" : null)
        }}
        headerStyle={hotel?.commercialLaundry.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.commercialLaundry.NotApplicable ?? false))}
            onPress={() => store?.updateHotelCommercialLaundry({ NotApplicable: !hotel?.commercialLaundry.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.commercialLaundry.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.commercialLaundry.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(HotelCommercialLaundryFinishesOptions, hotel?.commercialLaundry.finishes?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelCommercialLaundry({
                finishes: toggleItem(hotel?.commercialLaundry.finishes?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.commercialLaundry.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelCommercialLaundry({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.commercialLaundry.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelCommercialLaundry({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.commercialLaundry.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelCommercialLaundry({ assessment: { amountToRepair: txt } })}
            />
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={hotel?.commercialLaundry.effectiveAge ? String(hotel.commercialLaundry.effectiveAge) : ""}
              onChangeText={(txt) => store?.updateHotelCommercialLaundry({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 9. Lobby FF&E */}
      <SectionAccordion
        title="Lobby FF&E"
        expanded={!hotel?.lobbyFFE.NotApplicable && openKey === "hotel-lobbyFFE"}
        onToggle={(n) => {
          if (!hotel?.lobbyFFE.NotApplicable) setOpenKey(n ? "hotel-lobbyFFE" : null)
        }}
        headerStyle={hotel?.lobbyFFE.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.lobbyFFE.NotApplicable ?? false))}
            onPress={() => store?.updateHotelLobbyFFE({ NotApplicable: !hotel?.lobbyFFE.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.lobbyFFE.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.lobbyFFE.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="FF&E Items"
              items={buildItems(HotelLobbyFFEOptions, hotel?.lobbyFFE.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelLobbyFFE({
                items: toggleItem(hotel?.lobbyFFE.items?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.lobbyFFE.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={hotel?.lobbyFFE.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelLobbyFFE({ otherSpecification: txt })}
              />
            )}
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.lobbyFFE.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelLobbyFFE({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.lobbyFFE.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelLobbyFFE({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.lobbyFFE.amountToReplaceRepair ? String(hotel.lobbyFFE.amountToReplaceRepair) : ""}
              onChangeText={(txt) => store?.updateHotelLobbyFFE({ amountToReplaceRepair: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 10. Commercial Laundry Equipment */}
      <SectionAccordion
        title="Commercial Laundry Equipment"
        expanded={!hotel?.commercialLaundryEquipment.NotApplicable && openKey === "hotel-commercialLaundryEquipment"}
        onToggle={(n) => {
          if (!hotel?.commercialLaundryEquipment.NotApplicable) setOpenKey(n ? "hotel-commercialLaundryEquipment" : null)
        }}
        headerStyle={hotel?.commercialLaundryEquipment.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.commercialLaundryEquipment.NotApplicable ?? false))}
            onPress={() => store?.updateHotelCommercialLaundryEquipment({ NotApplicable: !hotel?.commercialLaundryEquipment.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.commercialLaundryEquipment.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.commercialLaundryEquipment.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Equipment"
              items={buildItems(HotelCommercialLaundryEquipmentOptions, hotel?.commercialLaundryEquipment.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelCommercialLaundryEquipment({
                items: toggleItem(hotel?.commercialLaundryEquipment.items?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.commercialLaundryEquipment.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelCommercialLaundryEquipment({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.commercialLaundryEquipment.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelCommercialLaundryEquipment({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.commercialLaundryEquipment.amountToReplaceRepair ? String(hotel.commercialLaundryEquipment.amountToReplaceRepair) : ""}
              onChangeText={(txt) => store?.updateHotelCommercialLaundryEquipment({ amountToReplaceRepair: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 11. Guest Laundry Equipment */}
      <SectionAccordion
        title="Guest Laundry Equipment"
        expanded={!hotel?.guestLaundryEquipment.NotApplicable && openKey === "hotel-guestLaundryEquipment"}
        onToggle={(n) => {
          if (!hotel?.guestLaundryEquipment.NotApplicable) setOpenKey(n ? "hotel-guestLaundryEquipment" : null)
        }}
        headerStyle={hotel?.guestLaundryEquipment.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestLaundryEquipment.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestLaundryEquipment({ NotApplicable: !hotel?.guestLaundryEquipment.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestLaundryEquipment.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestLaundryEquipment.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Equipment"
              items={buildItems(HotelGuestLaundryEquipmentOptions, hotel?.guestLaundryEquipment.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestLaundryEquipment({
                items: toggleItem(hotel?.guestLaundryEquipment.items?.slice() ?? [], id, checked),
              })}
            />
            <Dropdown
              label="Fridge/Freezer Type"
              value={hotel?.guestLaundryEquipment.fridgeFreezer ?? ""}
              onValueChange={(val) => store?.updateHotelGuestLaundryEquipment({ fridgeFreezer: val })}
              options={HotelGuestLaundryFridgeFreezerOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestLaundryEquipment.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestLaundryEquipment({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestLaundryEquipment.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestLaundryEquipment({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestLaundryEquipment.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestLaundryEquipment({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 12. Commercial Kitchen Equipment */}
      <SectionAccordion
        title="Commercial Kitchen Equipment"
        expanded={!hotel?.commercialKitchenEquipment.NotApplicable && openKey === "hotel-commercialKitchenEquipment"}
        onToggle={(n) => {
          if (!hotel?.commercialKitchenEquipment.NotApplicable) setOpenKey(n ? "hotel-commercialKitchenEquipment" : null)
        }}
        headerStyle={hotel?.commercialKitchenEquipment.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.commercialKitchenEquipment.NotApplicable ?? false))}
            onPress={() => store?.updateHotelCommercialKitchenEquipment({ NotApplicable: !hotel?.commercialKitchenEquipment.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.commercialKitchenEquipment.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.commercialKitchenEquipment.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Equipment"
              items={buildItems(HotelCommercialKitchenEquipmentOptions, hotel?.commercialKitchenEquipment.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelCommercialKitchenEquipment({
                items: toggleItem(hotel?.commercialKitchenEquipment.items?.slice() ?? [], id, checked),
              })}
            />
            <Dropdown
              label="Dishwasher Ownership"
              value={hotel?.commercialKitchenEquipment.dishwasherOwnership ?? ""}
              onValueChange={(val) => store?.updateHotelCommercialKitchenEquipment({ dishwasherOwnership: val })}
              options={HotelCommercialKitchenDishwasherOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.commercialKitchenEquipment.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelCommercialKitchenEquipment({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.commercialKitchenEquipment.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelCommercialKitchenEquipment({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.commercialKitchenEquipment.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelCommercialKitchenEquipment({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 13. Guest Room Soft Goods */}
      <SectionAccordion
        title="Guest Room Soft Goods"
        expanded={!hotel?.guestRoomSoftGoods.NotApplicable && openKey === "hotel-guestRoomSoftGoods"}
        onToggle={(n) => {
          if (!hotel?.guestRoomSoftGoods.NotApplicable) setOpenKey(n ? "hotel-guestRoomSoftGoods" : null)
        }}
        headerStyle={hotel?.guestRoomSoftGoods.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestRoomSoftGoods.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestRoomSoftGoods({ NotApplicable: !hotel?.guestRoomSoftGoods.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestRoomSoftGoods.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestRoomSoftGoods.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Soft Goods"
              items={buildItems(HotelGuestRoomSoftGoodsOptions, hotel?.guestRoomSoftGoods.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestRoomSoftGoods({
                items: toggleItem(hotel?.guestRoomSoftGoods.items?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.guestRoomSoftGoods.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={hotel?.guestRoomSoftGoods.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelGuestRoomSoftGoods({ otherSpecification: txt })}
              />
            )}
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestRoomSoftGoods.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestRoomSoftGoods({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestRoomSoftGoods.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestRoomSoftGoods({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestRoomSoftGoods.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestRoomSoftGoods({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 14. Guest Room Hard Goods */}
      <SectionAccordion
        title="Guest Room Hard Goods"
        expanded={!hotel?.guestRoomHardGoods.NotApplicable && openKey === "hotel-guestRoomHardGoods"}
        onToggle={(n) => {
          if (!hotel?.guestRoomHardGoods.NotApplicable) setOpenKey(n ? "hotel-guestRoomHardGoods" : null)
        }}
        headerStyle={hotel?.guestRoomHardGoods.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestRoomHardGoods.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestRoomHardGoods({ NotApplicable: !hotel?.guestRoomHardGoods.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestRoomHardGoods.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestRoomHardGoods.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Hard Goods"
              items={buildItems(HotelGuestRoomHardGoodsOptions, hotel?.guestRoomHardGoods.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestRoomHardGoods({
                items: toggleItem(hotel?.guestRoomHardGoods.items?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.guestRoomHardGoods.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={hotel?.guestRoomHardGoods.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelGuestRoomHardGoods({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="TV Type"
              value={hotel?.guestRoomHardGoods.tvType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomHardGoods({ tvType: val })}
              options={HotelGuestRoomTVOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Wardrobe Type"
              value={hotel?.guestRoomHardGoods.wardrobeType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomHardGoods({ wardrobeType: val })}
              options={HotelGuestRoomWardrobeOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestRoomHardGoods.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestRoomHardGoods({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestRoomHardGoods.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestRoomHardGoods({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestRoomHardGoods.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestRoomHardGoods({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 15. Guest Room Kitchen */}
      <SectionAccordion
        title="Guest Room Kitchen"
        expanded={!hotel?.guestRoomKitchen.NotApplicable && openKey === "hotel-guestRoomKitchen"}
        onToggle={(n) => {
          if (!hotel?.guestRoomKitchen.NotApplicable) setOpenKey(n ? "hotel-guestRoomKitchen" : null)
        }}
        headerStyle={hotel?.guestRoomKitchen.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestRoomKitchen.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestRoomKitchen({ NotApplicable: !hotel?.guestRoomKitchen.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestRoomKitchen.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestRoomKitchen.NotApplicable && (
          <View style={themed($sectionBody)}>
            <Dropdown
              label="Cabinets"
              value={hotel?.guestRoomKitchen.cabinets ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomKitchen({ cabinets: val })}
              options={HotelGuestRoomKitchenCabinetsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Counter Tops"
              value={hotel?.guestRoomKitchen.counterTops ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomKitchen({ counterTops: val })}
              options={HotelGuestRoomKitchenCounterTopsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <ChecklistField
              label="Equipment"
              items={buildItems(HotelGuestRoomKitchenEquipmentOptions, hotel?.guestRoomKitchen.equipment?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestRoomKitchen({
                equipment: toggleItem(hotel?.guestRoomKitchen.equipment?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.guestRoomKitchen.equipment?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other equipment..."
                value={hotel?.guestRoomKitchen.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelGuestRoomKitchen({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="Range Type"
              value={hotel?.guestRoomKitchen.rangeType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomKitchen({ rangeType: val })}
              options={HotelGuestRoomKitchenRangeOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Hood Type"
              value={hotel?.guestRoomKitchen.hoodType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomKitchen({ hoodType: val })}
              options={HotelGuestRoomKitchenHoodOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestRoomKitchen.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestRoomKitchen({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestRoomKitchen.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestRoomKitchen({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestRoomKitchen.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestRoomKitchen({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 16. Guest Room Bathroom */}
      <SectionAccordion
        title="Guest Room Bathroom"
        expanded={!hotel?.guestRoomBathroom.NotApplicable && openKey === "hotel-guestRoomBathroom"}
        onToggle={(n) => {
          if (!hotel?.guestRoomBathroom.NotApplicable) setOpenKey(n ? "hotel-guestRoomBathroom" : null)
        }}
        headerStyle={hotel?.guestRoomBathroom.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(hotel?.guestRoomBathroom.NotApplicable ?? false))}
            onPress={() => store?.updateHotelGuestRoomBathroom({ NotApplicable: !hotel?.guestRoomBathroom.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(hotel?.guestRoomBathroom.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!hotel?.guestRoomBathroom.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Bathroom Items"
              items={buildItems(HotelGuestRoomBathroomOptions, hotel?.guestRoomBathroom.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateHotelGuestRoomBathroom({
                items: toggleItem(hotel?.guestRoomBathroom.items?.slice() ?? [], id, checked),
              })}
            />
            {hotel?.guestRoomBathroom.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={hotel?.guestRoomBathroom.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateHotelGuestRoomBathroom({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="Bathtub Type"
              value={hotel?.guestRoomBathroom.bathtubType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomBathroom({ bathtubType: val })}
              options={HotelGuestRoomBathtubOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Tub Surrounds"
              value={hotel?.guestRoomBathroom.tubSurroundsType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomBathroom({ tubSurroundsType: val })}
              options={HotelGuestRoomTubSurroundsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Roll-in Showers"
              value={hotel?.guestRoomBathroom.rollInShowersType ?? ""}
              onValueChange={(val) => store?.updateHotelGuestRoomBathroom({ rollInShowersType: val })}
              options={HotelGuestRoomShowersOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={hotel?.guestRoomBathroom.assessment.condition as any}
                onChange={(v: any) => store?.updateHotelGuestRoomBathroom({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={hotel?.guestRoomBathroom.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateHotelGuestRoomBathroom({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={hotel?.guestRoomBathroom.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateHotelGuestRoomBathroom({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>
    </>
  )
})

// ============================================
// APARTMENT ACCORDIONS SUB-COMPONENT
// ============================================

const ApartmentAccordions: FC<{
  store: Step4Store | undefined
  openKey: string | null
  setOpenKey: (key: string | null) => void
  themed: ThemedFn
}> = observer(({ store, openKey, setOpenKey, themed }) => {
  const apt = store?.apartment

  return (
    <>
      {/* 1. Unit Finishes */}
      <StandardFinishesAccordion
        title="Unit Finishes"
        accordionKey="apt-unitFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.unitFinishes}
        options={ApartmentUnitFinishesOptions}
        updateFn="updateApartmentUnitFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 2. Restroom Finishes */}
      <StandardFinishesAccordion
        title="Restroom Finishes"
        accordionKey="apt-restroomFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.restroomFinishes}
        options={ApartmentRestroomFinishesOptions}
        updateFn="updateApartmentRestroomFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 3. Kitchen Finishes */}
      <StandardFinishesAccordion
        title="Kitchen Finishes"
        accordionKey="apt-kitchenFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.kitchenFinishes}
        options={ApartmentKitchenFinishesOptions}
        updateFn="updateApartmentKitchenFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 4. Interior Doors */}
      <SectionAccordion
        title="Interior Doors"
        expanded={!apt?.interiorDoors.NotApplicable && openKey === "apt-interiorDoors"}
        onToggle={(n) => {
          if (!apt?.interiorDoors.NotApplicable) setOpenKey(n ? "apt-interiorDoors" : null)
        }}
        headerStyle={apt?.interiorDoors.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.interiorDoors.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentInteriorDoors({ NotApplicable: !apt?.interiorDoors.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.interiorDoors.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.interiorDoors.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Door Types"
              items={buildItems(ApartmentInteriorDoorsOptions, apt?.interiorDoors.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentInteriorDoors({
                items: toggleItem(apt?.interiorDoors.items?.slice() ?? [], id, checked),
              })}
            />
            {apt?.interiorDoors.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other door type..."
                value={apt?.interiorDoors.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateApartmentInteriorDoors({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="Wardrobe Type"
              value={apt?.interiorDoors.wardrobeType ?? ""}
              onValueChange={(val) => store?.updateApartmentInteriorDoors({ wardrobeType: val })}
              options={ApartmentWardrobeOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.interiorDoors.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentInteriorDoors({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.interiorDoors.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentInteriorDoors({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.interiorDoors.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentInteriorDoors({ assessment: { amountToRepair: txt } })}
            />
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={apt?.interiorDoors.effectiveAge ? String(apt.interiorDoors.effectiveAge) : ""}
              onChangeText={(txt) => store?.updateApartmentInteriorDoors({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 5. Clubhouse/Lobby Finishes */}
      <StandardFinishesAccordion
        title="Clubhouse/Lobby Finishes"
        accordionKey="apt-clubhouseLobbyFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.clubhouseLobbyFinishes}
        options={ApartmentClubhouseLobbyFinishesOptions}
        updateFn="updateApartmentClubhouseLobbyFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 6. Corridor Finishes */}
      <StandardFinishesAccordion
        title="Corridor Finishes"
        accordionKey="apt-corridorFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.corridorFinishes}
        options={ApartmentCorridorFinishesOptions}
        updateFn="updateApartmentCorridorFinishes"
        hasEffectiveAge
        themed={themed}
      />

      {/* 7. Common Restrooms Finishes */}
      <SectionAccordion
        title="Common Restrooms Finishes"
        expanded={!apt?.commonRestroomsFinishes.NotApplicable && openKey === "apt-commonRestroomsFinishes"}
        onToggle={(n) => {
          if (!apt?.commonRestroomsFinishes.NotApplicable) setOpenKey(n ? "apt-commonRestroomsFinishes" : null)
        }}
        headerStyle={apt?.commonRestroomsFinishes.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.commonRestroomsFinishes.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentCommonRestroomsFinishes({ NotApplicable: !apt?.commonRestroomsFinishes.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.commonRestroomsFinishes.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.commonRestroomsFinishes.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(ApartmentCommonRestroomsFinishesOptions, apt?.commonRestroomsFinishes.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentCommonRestroomsFinishes({
                items: toggleItem(apt?.commonRestroomsFinishes.items?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.commonRestroomsFinishes.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentCommonRestroomsFinishes({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.commonRestroomsFinishes.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentCommonRestroomsFinishes({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.commonRestroomsFinishes.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentCommonRestroomsFinishes({ assessment: { amountToRepair: txt } })}
            />
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={apt?.commonRestroomsFinishes.effectiveAge ? String(apt.commonRestroomsFinishes.effectiveAge) : ""}
              onChangeText={(txt) => store?.updateApartmentCommonRestroomsFinishes({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 8. Exercise Room Finishes */}
      <StandardFinishesAccordion
        title="Exercise Room Finishes"
        accordionKey="apt-exerciseRoomFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.exerciseRoomFinishes}
        options={ApartmentExerciseRoomFinishesOptions}
        updateFn="updateApartmentExerciseRoomFinishes"
        hasEffectiveAge={false}
        themed={themed}
      />

      {/* 9. Common Kitchen Finishes */}
      <SectionAccordion
        title="Common Kitchen Finishes"
        expanded={!apt?.commonKitchenFinishes.NotApplicable && openKey === "apt-commonKitchenFinishes"}
        onToggle={(n) => {
          if (!apt?.commonKitchenFinishes.NotApplicable) setOpenKey(n ? "apt-commonKitchenFinishes" : null)
        }}
        headerStyle={apt?.commonKitchenFinishes.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.commonKitchenFinishes.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentCommonKitchenFinishes({ NotApplicable: !apt?.commonKitchenFinishes.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.commonKitchenFinishes.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.commonKitchenFinishes.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(ApartmentCommonKitchenFinishesOptions, apt?.commonKitchenFinishes.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentCommonKitchenFinishes({
                items: toggleItem(apt?.commonKitchenFinishes.items?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.commonKitchenFinishes.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentCommonKitchenFinishes({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.commonKitchenFinishes.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentCommonKitchenFinishes({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.commonKitchenFinishes.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentCommonKitchenFinishes({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 10. Laundry Room Finishes */}
      <SectionAccordion
        title="Laundry Room Finishes"
        expanded={!apt?.laundryRoomFinishes.NotApplicable && openKey === "apt-laundryRoomFinishes"}
        onToggle={(n) => {
          if (!apt?.laundryRoomFinishes.NotApplicable) setOpenKey(n ? "apt-laundryRoomFinishes" : null)
        }}
        headerStyle={apt?.laundryRoomFinishes.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.laundryRoomFinishes.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentLaundryRoomFinishes({ NotApplicable: !apt?.laundryRoomFinishes.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.laundryRoomFinishes.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.laundryRoomFinishes.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Finishes"
              items={buildItems(ApartmentLaundryRoomFinishesOptions, apt?.laundryRoomFinishes.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentLaundryRoomFinishes({
                items: toggleItem(apt?.laundryRoomFinishes.items?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.laundryRoomFinishes.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentLaundryRoomFinishes({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.laundryRoomFinishes.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentLaundryRoomFinishes({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.laundryRoomFinishes.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentLaundryRoomFinishes({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 11. Manager Unit Finishes */}
      <StandardFinishesAccordion
        title="Manager Unit Finishes"
        accordionKey="apt-managerUnitFinishes"
        openKey={openKey}
        setOpenKey={setOpenKey}
        store={store}
        subStore={apt?.managerUnitFinishes}
        options={ApartmentManagerUnitFinishesOptions}
        updateFn="updateApartmentManagerUnitFinishes"
        hasEffectiveAge={false}
        themed={themed}
      />

      {/* 12. Lobby FF&E */}
      <SectionAccordion
        title="Lobby FF&E"
        expanded={!apt?.lobbyFFE.NotApplicable && openKey === "apt-lobbyFFE"}
        onToggle={(n) => {
          if (!apt?.lobbyFFE.NotApplicable) setOpenKey(n ? "apt-lobbyFFE" : null)
        }}
        headerStyle={apt?.lobbyFFE.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.lobbyFFE.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentLobbyFFE({ NotApplicable: !apt?.lobbyFFE.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.lobbyFFE.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.lobbyFFE.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="FF&E Items"
              items={buildItems(ApartmentLobbyFFEOptions, apt?.lobbyFFE.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentLobbyFFE({
                items: toggleItem(apt?.lobbyFFE.items?.slice() ?? [], id, checked),
              })}
            />
            {apt?.lobbyFFE.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={apt?.lobbyFFE.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateApartmentLobbyFFE({ otherSpecification: txt })}
              />
            )}
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.lobbyFFE.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentLobbyFFE({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.lobbyFFE.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentLobbyFFE({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.lobbyFFE.amountToReplaceRepair ? String(apt.lobbyFFE.amountToReplaceRepair) : ""}
              onChangeText={(txt) => store?.updateApartmentLobbyFFE({ amountToReplaceRepair: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 13. Business Center */}
      <SectionAccordion
        title="Business Center"
        expanded={!apt?.businessCenter.NotApplicable && openKey === "apt-businessCenter"}
        onToggle={(n) => {
          if (!apt?.businessCenter.NotApplicable) setOpenKey(n ? "apt-businessCenter" : null)
        }}
        headerStyle={apt?.businessCenter.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.businessCenter.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentBusinessCenter({ NotApplicable: !apt?.businessCenter.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.businessCenter.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.businessCenter.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Items"
              items={buildItems(ApartmentBusinessCenterOptions, apt?.businessCenter.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentBusinessCenter({
                items: toggleItem(apt?.businessCenter.items?.slice() ?? [], id, checked),
              })}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.businessCenter.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentBusinessCenter({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.businessCenter.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentBusinessCenter({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.businessCenter.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentBusinessCenter({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 14. Common Area Laundry Equipment */}
      <SectionAccordion
        title="Common Area Laundry Equipment"
        expanded={!apt?.commonAreaLaundryEquipment.NotApplicable && openKey === "apt-commonAreaLaundryEquipment"}
        onToggle={(n) => {
          if (!apt?.commonAreaLaundryEquipment.NotApplicable) setOpenKey(n ? "apt-commonAreaLaundryEquipment" : null)
        }}
        headerStyle={apt?.commonAreaLaundryEquipment.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.commonAreaLaundryEquipment.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentCommonAreaLaundryEquipment({ NotApplicable: !apt?.commonAreaLaundryEquipment.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.commonAreaLaundryEquipment.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.commonAreaLaundryEquipment.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Equipment"
              items={buildItems(ApartmentCommonAreaLaundryEquipmentOptions, apt?.commonAreaLaundryEquipment.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentCommonAreaLaundryEquipment({
                items: toggleItem(apt?.commonAreaLaundryEquipment.items?.slice() ?? [], id, checked),
              })}
            />
            <Dropdown
              label="Ownership"
              value={apt?.commonAreaLaundryEquipment.ownership ?? ""}
              onValueChange={(val) => store?.updateApartmentCommonAreaLaundryEquipment({ ownership: val })}
              options={ApartmentLaundryOwnershipOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Provided By"
              value={apt?.commonAreaLaundryEquipment.providedBy ?? ""}
              onValueChange={(val) => store?.updateApartmentCommonAreaLaundryEquipment({ providedBy: val })}
              options={ApartmentLaundryProvidedByOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Location"
              value={apt?.commonAreaLaundryEquipment.location ?? ""}
              onValueChange={(val) => store?.updateApartmentCommonAreaLaundryEquipment({ location: val })}
              options={ApartmentLaundryLocationOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.commonAreaLaundryEquipment.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentCommonAreaLaundryEquipment({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.commonAreaLaundryEquipment.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentCommonAreaLaundryEquipment({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.commonAreaLaundryEquipment.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentCommonAreaLaundryEquipment({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 15. Kitchen Equipment */}
      <SectionAccordion
        title="Kitchen Equipment"
        expanded={!apt?.kitchenEquipment.NotApplicable && openKey === "apt-kitchenEquipment"}
        onToggle={(n) => {
          if (!apt?.kitchenEquipment.NotApplicable) setOpenKey(n ? "apt-kitchenEquipment" : null)
        }}
        headerStyle={apt?.kitchenEquipment.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.kitchenEquipment.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentKitchenEquipment({ NotApplicable: !apt?.kitchenEquipment.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.kitchenEquipment.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.kitchenEquipment.NotApplicable && (
          <View style={themed($sectionBody)}>
            <Dropdown
              label="Cabinets"
              value={apt?.kitchenEquipment.cabinets ?? ""}
              onValueChange={(val) => store?.updateApartmentKitchenEquipment({ cabinets: val })}
              options={ApartmentKitchenCabinetsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Counter Tops"
              value={apt?.kitchenEquipment.counterTops ?? ""}
              onValueChange={(val) => store?.updateApartmentKitchenEquipment({ counterTops: val })}
              options={ApartmentKitchenCounterTopsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Range Type"
              value={apt?.kitchenEquipment.rangeType ?? ""}
              onValueChange={(val) => store?.updateApartmentKitchenEquipment({ rangeType: val })}
              options={ApartmentKitchenRangeOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Hood Type"
              value={apt?.kitchenEquipment.hoodType ?? ""}
              onValueChange={(val) => store?.updateApartmentKitchenEquipment({ hoodType: val })}
              options={ApartmentKitchenHoodOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <ChecklistField
              label="Equipment"
              items={buildItems(ApartmentKitchenEquipmentOptions, apt?.kitchenEquipment.equipment?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentKitchenEquipment({
                equipment: toggleItem(apt?.kitchenEquipment.equipment?.slice() ?? [], id, checked),
              })}
            />
            {apt?.kitchenEquipment.equipment?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other equipment..."
                value={apt?.kitchenEquipment.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateApartmentKitchenEquipment({ otherSpecification: txt })}
              />
            )}
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.kitchenEquipment.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentKitchenEquipment({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.kitchenEquipment.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentKitchenEquipment({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.kitchenEquipment.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentKitchenEquipment({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 16. Bathroom */}
      <SectionAccordion
        title="Bathroom"
        expanded={!apt?.bathroom.NotApplicable && openKey === "apt-bathroom"}
        onToggle={(n) => {
          if (!apt?.bathroom.NotApplicable) setOpenKey(n ? "apt-bathroom" : null)
        }}
        headerStyle={apt?.bathroom.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.bathroom.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentBathroom({ NotApplicable: !apt?.bathroom.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.bathroom.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.bathroom.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Bathroom Items"
              items={buildItems(ApartmentBathroomOptions, apt?.bathroom.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentBathroom({
                items: toggleItem(apt?.bathroom.items?.slice() ?? [], id, checked),
              })}
            />
            {apt?.bathroom.items?.includes("other") && (
              <TextField
                label="Specify Other"
                placeholder="Describe other item..."
                value={apt?.bathroom.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateApartmentBathroom({ otherSpecification: txt })}
              />
            )}
            <Dropdown
              label="Bathtub Type"
              value={apt?.bathroom.bathtubType ?? ""}
              onValueChange={(val) => store?.updateApartmentBathroom({ bathtubType: val })}
              options={ApartmentBathtubOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Tub Surrounds"
              value={apt?.bathroom.tubSurroundsType ?? ""}
              onValueChange={(val) => store?.updateApartmentBathroom({ tubSurroundsType: val })}
              options={ApartmentTubSurroundsOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <Dropdown
              label="Roll-in Showers"
              value={apt?.bathroom.rollInShowersType ?? ""}
              onValueChange={(val) => store?.updateApartmentBathroom({ rollInShowersType: val })}
              options={ApartmentRollInShowersOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.bathroom.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentBathroom({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.bathroom.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentBathroom({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.bathroom.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentBathroom({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>

      {/* 17. Furnished Items */}
      <SectionAccordion
        title="Furnished Items"
        expanded={!apt?.furnishedItems.NotApplicable && openKey === "apt-furnishedItems"}
        onToggle={(n) => {
          if (!apt?.furnishedItems.NotApplicable) setOpenKey(n ? "apt-furnishedItems" : null)
        }}
        headerStyle={apt?.furnishedItems.NotApplicable ? themed($naHeaderStyle) : undefined}
        RightComponent={
          <TouchableOpacity
            style={themed($naButton(apt?.furnishedItems.NotApplicable ?? false))}
            onPress={() => store?.updateApartmentFurnishedItems({ NotApplicable: !apt?.furnishedItems.NotApplicable })}
          >
            <Text text="N/A" style={themed($naButtonText(apt?.furnishedItems.NotApplicable ?? false))} />
          </TouchableOpacity>
        }
      >
        {!apt?.furnishedItems.NotApplicable && (
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Items"
              items={buildItems(ApartmentFurnishedApartmentItemsOptions, apt?.furnishedItems.items?.slice() ?? [])}
              onToggle={(id, checked) => store?.updateApartmentFurnishedItems({
                items: toggleItem(apt?.furnishedItems.items?.slice() ?? [], id, checked),
              })}
            />
            <Dropdown
              label="TV Type"
              value={apt?.furnishedItems.tvType ?? ""}
              onValueChange={(val) => store?.updateApartmentFurnishedItems({ tvType: val })}
              options={ApartmentFurnishedApartmentTVOptions.map((o) => ({ label: o.label, value: o.id }))}
            />
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={apt?.furnishedItems.assessment.condition as any}
                onChange={(v: any) => store?.updateApartmentFurnishedItems({ assessment: { condition: v } })}
              />
            </View>
            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={apt?.furnishedItems.assessment.repairStatus as any}
                onChange={(v: any) => store?.updateApartmentFurnishedItems({ assessment: { repairStatus: v } })}
              />
            </View>
            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={apt?.furnishedItems.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateApartmentFurnishedItems({ assessment: { amountToRepair: txt } })}
            />
          </View>
        )}
      </SectionAccordion>
    </>
  )
})

// ============================================
// REUSABLE STANDARD FINISHES ACCORDION
// For accordions that follow the pattern: checklist + other spec + condition + repair + amount + effectiveAge
// ============================================

const StandardFinishesAccordion: FC<{
  title: string
  accordionKey: string
  openKey: string | null
  setOpenKey: (key: string | null) => void
  store: Step4Store | undefined
  subStore: any
  options: readonly { id: string; label: string }[]
  updateFn: string
  hasEffectiveAge: boolean
  themed: ThemedFn
}> = observer(({ title, accordionKey, openKey, setOpenKey, store, subStore, options, updateFn, hasEffectiveAge, themed }) => {
  const update = (data: any) => (store as any)?.[updateFn]?.(data)
  const storeItems = subStore?.items?.slice() ?? []

  return (
    <SectionAccordion
      title={title}
      expanded={!subStore?.NotApplicable && openKey === accordionKey}
      onToggle={(n) => {
        if (!subStore?.NotApplicable) setOpenKey(n ? accordionKey : null)
      }}
      headerStyle={subStore?.NotApplicable ? themed($naHeaderStyle) : undefined}
      RightComponent={
        <TouchableOpacity
          style={themed($naButton(subStore?.NotApplicable ?? false))}
          onPress={() => update({ NotApplicable: !subStore?.NotApplicable })}
        >
          <Text text="N/A" style={themed($naButtonText(subStore?.NotApplicable ?? false))} />
        </TouchableOpacity>
      }
    >
      {!subStore?.NotApplicable && (
        <View style={themed($sectionBody)}>
          <ChecklistField
            label="Finishes"
            items={buildItems(options, storeItems)}
            onToggle={(id, checked) => update({
              items: toggleItem(storeItems, id, checked),
            })}
          />
          {storeItems.includes("other") && (
            <TextField
              label="Specify Other"
              placeholder="Describe other finish..."
              value={subStore?.otherSpecification ?? ""}
              onChangeText={(txt) => update({ otherSpecification: txt })}
            />
          )}
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={subStore?.assessment.condition as any}
              onChange={(v: any) => update({ assessment: { condition: v } })}
            />
          </View>
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={subStore?.assessment.repairStatus as any}
              onChange={(v: any) => update({ assessment: { repairStatus: v } })}
            />
          </View>
          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="decimal-pad"
            value={subStore?.assessment.amountToRepair ?? ""}
            onChangeText={(txt) => update({ assessment: { amountToRepair: txt } })}
          />
          {hasEffectiveAge && (
            <TextField
              label="Effective Age (Years)"
              placeholder="Years"
              keyboardType="decimal-pad"
              value={subStore?.effectiveAge ? String(subStore.effectiveAge) : ""}
              onChangeText={(txt) => update({ effectiveAge: Number(txt.replace(/[^0-9]/g, "")) || 0 })}
            />
          )}
        </View>
      )}
    </SectionAccordion>
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

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: 88,
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 0,
})

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

const $titleStyle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary2,
  fontSize: 24,
})

const $toggleSection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 16,
  gap: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral300,
})

const $toggleRow: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
}

const $toggleChip = (isSelected: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: isSelected ? colors.palette.primary1 : colors.palette.neutral300,
  minHeight: 44,
  justifyContent: "center",
  alignItems: "center",
})

const $toggleChipText = (isSelected: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isSelected ? colors.palette.neutral100 : colors.palette.neutral700,
  fontSize: 14,
  fontWeight: "600",
})

const $propertyTypeSection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopWidth: 2,
  borderTopColor: colors.palette.primary1,
  marginTop: 16,
})

const $propertySectionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary2,
  fontSize: 20,
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 8,
})

const $placeholderBlock: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingHorizontal: 16,
  paddingVertical: 32,
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  marginHorizontal: 16,
  marginVertical: 8,
  borderRadius: 8,
})

const $placeholderText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral500,
  fontSize: 16,
  fontStyle: "italic",
})

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  opacity: 0.6,
})

const $naButton = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  backgroundColor: isActive ? colors.palette.primary1 : colors.palette.neutral300,
  minWidth: 50,
  alignItems: "center",
  justifyContent: "center",
})

const $naButtonText = (isActive: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isActive ? colors.palette.neutral100 : colors.palette.neutral600,
  fontSize: 12,
  fontWeight: "600",
})
