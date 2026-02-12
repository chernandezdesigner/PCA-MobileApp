import { types } from "mobx-state-tree"
import { HotelPropertyModel } from "./step4-hotel"
import { ApartmentPropertyModel } from "./step4-apartment"

// ============================================
// INTERIOR CONDITIONS - Step 4: Alternate Properties
// ============================================

// ============================================
// PLACEHOLDER PROPERTY MODELS
// (Storage, Mobile Homes, Nursing Homes, Multi-Family)
// These will be expanded when constants are defined.
// ============================================

export const StoragePropertyModel = types.model("StorageProperty", {
  comments: types.optional(types.string, ""),
})
  .actions((self) => ({
    updateComments(value: string) {
      self.comments = value
    },
  }))

export const MobileHomesPropertyModel = types.model("MobileHomesProperty", {
  comments: types.optional(types.string, ""),
})
  .actions((self) => ({
    updateComments(value: string) {
      self.comments = value
    },
  }))

export const NursingHomesPropertyModel = types.model("NursingHomesProperty", {
  comments: types.optional(types.string, ""),
})
  .actions((self) => ({
    updateComments(value: string) {
      self.comments = value
    },
  }))

export const MultiFamilyPropertyModel = types.model("MultiFamilyProperty", {
  comments: types.optional(types.string, ""),
})
  .actions((self) => ({
    updateComments(value: string) {
      self.comments = value
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const InteriorConditionsStep4 = types.model("InteriorConditionsStep4", {
  // Property type toggles (data preserved when toggled off)
  hotelSelected: types.optional(types.boolean, false),
  apartmentSelected: types.optional(types.boolean, false),
  storageSelected: types.optional(types.boolean, false),
  mobileHomesSelected: types.optional(types.boolean, false),
  nursingHomesSelected: types.optional(types.boolean, false),
  multiFamilySelected: types.optional(types.boolean, false),

  // Property sub-models (always exist, shown/hidden by toggles)
  hotel: types.optional(HotelPropertyModel, {}),
  apartment: types.optional(ApartmentPropertyModel, {}),
  storage: types.optional(StoragePropertyModel, {}),
  mobileHomes: types.optional(MobileHomesPropertyModel, {}),
  nursingHomes: types.optional(NursingHomesPropertyModel, {}),
  multiFamily: types.optional(MultiFamilyPropertyModel, {}),

  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .views((self) => ({
    get isHotelSelected() {
      return self.hotelSelected
    },
    get isApartmentSelected() {
      return self.apartmentSelected
    },
    get isStorageSelected() {
      return self.storageSelected
    },
    get isMobileHomesSelected() {
      return self.mobileHomesSelected
    },
    get isNursingHomesSelected() {
      return self.nursingHomesSelected
    },
    get isMultiFamilySelected() {
      return self.multiFamilySelected
    },
    get hasAnyPropertySelected() {
      return (
        self.hotelSelected ||
        self.apartmentSelected ||
        self.storageSelected ||
        self.mobileHomesSelected ||
        self.nursingHomesSelected ||
        self.multiFamilySelected
      )
    },
  }))
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },

    // ============================================
    // TOGGLE ACTIONS (do NOT clear data on toggle off)
    // ============================================

    toggleHotel(value: boolean) {
      self.hotelSelected = value
      self.lastModified = new Date()
    },
    toggleApartment(value: boolean) {
      self.apartmentSelected = value
      self.lastModified = new Date()
    },
    toggleStorage(value: boolean) {
      self.storageSelected = value
      self.lastModified = new Date()
    },
    toggleMobileHomes(value: boolean) {
      self.mobileHomesSelected = value
      self.lastModified = new Date()
    },
    toggleNursingHomes(value: boolean) {
      self.nursingHomesSelected = value
      self.lastModified = new Date()
    },
    toggleMultiFamily(value: boolean) {
      self.multiFamilySelected = value
      self.lastModified = new Date()
    },

    // ============================================
    // HOTEL ACCORDION UPDATE ACTIONS
    // ============================================

    updateHotelUnitFinishes(data: Parameters<typeof self.hotel.updateUnitFinishes>[0]) {
      self.hotel.updateUnitFinishes(data)
      self.lastModified = new Date()
    },
    updateHotelCommonAreaLists(data: Parameters<typeof self.hotel.updateCommonAreaLists>[0]) {
      self.hotel.updateCommonAreaLists(data)
      self.lastModified = new Date()
    },
    updateHotelAdminOfficeFinishes(data: Parameters<typeof self.hotel.updateAdminOfficeFinishes>[0]) {
      self.hotel.updateAdminOfficeFinishes(data)
      self.lastModified = new Date()
    },
    updateHotelLoungeFinishes(data: Parameters<typeof self.hotel.updateLoungeFinishes>[0]) {
      self.hotel.updateLoungeFinishes(data)
      self.lastModified = new Date()
    },
    updateHotelRestroomsFinishes(data: Parameters<typeof self.hotel.updateRestroomsFinishes>[0]) {
      self.hotel.updateRestroomsFinishes(data)
      self.lastModified = new Date()
    },
    updateHotelKitchenFinishes(data: Parameters<typeof self.hotel.updateKitchenFinishes>[0]) {
      self.hotel.updateKitchenFinishes(data)
      self.lastModified = new Date()
    },
    updateHotelGuestLaundry(data: Parameters<typeof self.hotel.updateGuestLaundry>[0]) {
      self.hotel.updateGuestLaundry(data)
      self.lastModified = new Date()
    },
    updateHotelCommercialLaundry(data: Parameters<typeof self.hotel.updateCommercialLaundry>[0]) {
      self.hotel.updateCommercialLaundry(data)
      self.lastModified = new Date()
    },
    updateHotelLobbyFFE(data: Parameters<typeof self.hotel.updateLobbyFFE>[0]) {
      self.hotel.updateLobbyFFE(data)
      self.lastModified = new Date()
    },
    updateHotelCommercialLaundryEquipment(data: Parameters<typeof self.hotel.updateCommercialLaundryEquipment>[0]) {
      self.hotel.updateCommercialLaundryEquipment(data)
      self.lastModified = new Date()
    },
    updateHotelGuestLaundryEquipment(data: Parameters<typeof self.hotel.updateGuestLaundryEquipment>[0]) {
      self.hotel.updateGuestLaundryEquipment(data)
      self.lastModified = new Date()
    },
    updateHotelCommercialKitchenEquipment(data: Parameters<typeof self.hotel.updateCommercialKitchenEquipment>[0]) {
      self.hotel.updateCommercialKitchenEquipment(data)
      self.lastModified = new Date()
    },
    updateHotelGuestRoomSoftGoods(data: Parameters<typeof self.hotel.updateGuestRoomSoftGoods>[0]) {
      self.hotel.updateGuestRoomSoftGoods(data)
      self.lastModified = new Date()
    },
    updateHotelGuestRoomHardGoods(data: Parameters<typeof self.hotel.updateGuestRoomHardGoods>[0]) {
      self.hotel.updateGuestRoomHardGoods(data)
      self.lastModified = new Date()
    },
    updateHotelGuestRoomKitchen(data: Parameters<typeof self.hotel.updateGuestRoomKitchen>[0]) {
      self.hotel.updateGuestRoomKitchen(data)
      self.lastModified = new Date()
    },
    updateHotelGuestRoomBathroom(data: Parameters<typeof self.hotel.updateGuestRoomBathroom>[0]) {
      self.hotel.updateGuestRoomBathroom(data)
      self.lastModified = new Date()
    },

    // ============================================
    // APARTMENT ACCORDION UPDATE ACTIONS
    // ============================================

    updateApartmentUnitFinishes(data: Parameters<typeof self.apartment.updateUnitFinishes>[0]) {
      self.apartment.updateUnitFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentRestroomFinishes(data: Parameters<typeof self.apartment.updateRestroomFinishes>[0]) {
      self.apartment.updateRestroomFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentKitchenFinishes(data: Parameters<typeof self.apartment.updateKitchenFinishes>[0]) {
      self.apartment.updateKitchenFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentInteriorDoors(data: Parameters<typeof self.apartment.updateInteriorDoors>[0]) {
      self.apartment.updateInteriorDoors(data)
      self.lastModified = new Date()
    },
    updateApartmentClubhouseLobbyFinishes(data: Parameters<typeof self.apartment.updateClubhouseLobbyFinishes>[0]) {
      self.apartment.updateClubhouseLobbyFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentCorridorFinishes(data: Parameters<typeof self.apartment.updateCorridorFinishes>[0]) {
      self.apartment.updateCorridorFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentCommonRestroomsFinishes(data: Parameters<typeof self.apartment.updateCommonRestroomsFinishes>[0]) {
      self.apartment.updateCommonRestroomsFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentExerciseRoomFinishes(data: Parameters<typeof self.apartment.updateExerciseRoomFinishes>[0]) {
      self.apartment.updateExerciseRoomFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentCommonKitchenFinishes(data: Parameters<typeof self.apartment.updateCommonKitchenFinishes>[0]) {
      self.apartment.updateCommonKitchenFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentLaundryRoomFinishes(data: Parameters<typeof self.apartment.updateLaundryRoomFinishes>[0]) {
      self.apartment.updateLaundryRoomFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentManagerUnitFinishes(data: Parameters<typeof self.apartment.updateManagerUnitFinishes>[0]) {
      self.apartment.updateManagerUnitFinishes(data)
      self.lastModified = new Date()
    },
    updateApartmentLobbyFFE(data: Parameters<typeof self.apartment.updateLobbyFFE>[0]) {
      self.apartment.updateLobbyFFE(data)
      self.lastModified = new Date()
    },
    updateApartmentBusinessCenter(data: Parameters<typeof self.apartment.updateBusinessCenter>[0]) {
      self.apartment.updateBusinessCenter(data)
      self.lastModified = new Date()
    },
    updateApartmentCommonAreaLaundryEquipment(data: Parameters<typeof self.apartment.updateCommonAreaLaundryEquipment>[0]) {
      self.apartment.updateCommonAreaLaundryEquipment(data)
      self.lastModified = new Date()
    },
    updateApartmentKitchenEquipment(data: Parameters<typeof self.apartment.updateKitchenEquipment>[0]) {
      self.apartment.updateKitchenEquipment(data)
      self.lastModified = new Date()
    },
    updateApartmentBathroom(data: Parameters<typeof self.apartment.updateBathroom>[0]) {
      self.apartment.updateBathroom(data)
      self.lastModified = new Date()
    },
    updateApartmentFurnishedItems(data: Parameters<typeof self.apartment.updateFurnishedItems>[0]) {
      self.apartment.updateFurnishedItems(data)
      self.lastModified = new Date()
    },

    // ============================================
    // PLACEHOLDER PROPERTY UPDATE ACTIONS
    // ============================================

    updateStorageComments(value: string) {
      self.storage.updateComments(value)
      self.lastModified = new Date()
    },
    updateMobileHomesComments(value: string) {
      self.mobileHomes.updateComments(value)
      self.lastModified = new Date()
    },
    updateNursingHomesComments(value: string) {
      self.nursingHomes.updateComments(value)
      self.lastModified = new Date()
    },
    updateMultiFamilyComments(value: string) {
      self.multiFamily.updateComments(value)
      self.lastModified = new Date()
    },

    // ============================================
    // GENERAL
    // ============================================

    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))
