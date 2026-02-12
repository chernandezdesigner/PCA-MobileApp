import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// INTERIOR CONDITIONS - Step 4: Hotel Property
// ============================================

// ============================================
// 1. HOTEL UNIT FINISHES ACCORDION
// ============================================

export const HotelUnitFinishesAccordionModel = types.model("HotelUnitFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 2. HOTEL COMMON AREA LISTS ACCORDION
// ============================================

export const HotelCommonAreaListsAccordionModel = types.model("HotelCommonAreaListsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
    },
  }))

// ============================================
// 3. HOTEL ADMIN OFFICE FINISHES ACCORDION
// ============================================

export const HotelAdminOfficeFinishesAccordionModel = types.model("HotelAdminOfficeFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 4. HOTEL LOUNGE FINISHES ACCORDION
// ============================================

export const HotelLoungeFinishesAccordionModel = types.model("HotelLoungeFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 5. HOTEL RESTROOMS FINISHES ACCORDION
// ============================================

export const HotelRestroomsFinishesAccordionModel = types.model("HotelRestroomsFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 6. HOTEL KITCHEN FINISHES ACCORDION
// ============================================

export const HotelKitchenFinishesAccordionModel = types.model("HotelKitchenFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 7. HOTEL GUEST LAUNDRY ACCORDION
// ============================================

export const HotelGuestLaundryAccordionModel = types.model("HotelGuestLaundryAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  finishes: types.optional(types.array(types.string), []),
  location: types.optional(types.string, ""), // single-select from HotelGuestLaundryLocationOptions
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      finishes?: string[]
      location?: string
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.finishes !== undefined) self.finishes.replace(data.finishes)
      if (data.location !== undefined) self.location = data.location
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 8. HOTEL COMMERCIAL LAUNDRY ACCORDION
// ============================================

export const HotelCommercialLaundryAccordionModel = types.model("HotelCommercialLaundryAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  finishes: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      finishes?: string[]
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.finishes !== undefined) self.finishes.replace(data.finishes)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 9. HOTEL LOBBY FF&E ACCORDION
// ============================================

export const HotelLobbyFFEAccordionModel = types.model("HotelLobbyFFEAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// 10. HOTEL COMMERCIAL LAUNDRY EQUIPMENT ACCORDION
// ============================================

export const HotelCommercialLaundryEquipmentAccordionModel = types.model("HotelCommercialLaundryEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// 11. HOTEL GUEST LAUNDRY EQUIPMENT ACCORDION
// ============================================

export const HotelGuestLaundryEquipmentAccordionModel = types.model("HotelGuestLaundryEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  fridgeFreezer: types.optional(types.string, ""), // single-select from HotelGuestLaundryFridgeFreezerOptions
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      fridgeFreezer?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.fridgeFreezer !== undefined) self.fridgeFreezer = data.fridgeFreezer
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 12. HOTEL COMMERCIAL KITCHEN EQUIPMENT ACCORDION
// ============================================

export const HotelCommercialKitchenEquipmentAccordionModel = types.model("HotelCommercialKitchenEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  dishwasherOwnership: types.optional(types.string, ""), // single-select from HotelCommercialKitchenDishwasherOptions
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      dishwasherOwnership?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.dishwasherOwnership !== undefined) self.dishwasherOwnership = data.dishwasherOwnership
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 13. HOTEL GUEST ROOM SOFT GOODS ACCORDION
// ============================================

export const HotelGuestRoomSoftGoodsAccordionModel = types.model("HotelGuestRoomSoftGoodsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 14. HOTEL GUEST ROOM HARD GOODS ACCORDION
// ============================================

export const HotelGuestRoomHardGoodsAccordionModel = types.model("HotelGuestRoomHardGoodsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  tvType: types.optional(types.string, ""), // single-select from HotelGuestRoomTVOptions
  wardrobeType: types.optional(types.string, ""), // single-select from HotelGuestRoomWardrobeOptions
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      tvType?: string
      wardrobeType?: string
      otherSpecification?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.tvType !== undefined) self.tvType = data.tvType
      if (data.wardrobeType !== undefined) self.wardrobeType = data.wardrobeType
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 15. HOTEL GUEST ROOM KITCHEN ACCORDION
// ============================================

export const HotelGuestRoomKitchenAccordionModel = types.model("HotelGuestRoomKitchenAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  cabinets: types.optional(types.string, ""), // single-select from HotelGuestRoomKitchenCabinetsOptions
  counterTops: types.optional(types.string, ""), // single-select from HotelGuestRoomKitchenCounterTopsOptions
  equipment: types.optional(types.array(types.string), []),
  rangeType: types.optional(types.string, ""), // single-select from HotelGuestRoomKitchenRangeOptions
  hoodType: types.optional(types.string, ""), // single-select from HotelGuestRoomKitchenHoodOptions
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      cabinets?: string
      counterTops?: string
      equipment?: string[]
      rangeType?: string
      hoodType?: string
      otherSpecification?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.cabinets !== undefined) self.cabinets = data.cabinets
      if (data.counterTops !== undefined) self.counterTops = data.counterTops
      if (data.equipment !== undefined) self.equipment.replace(data.equipment)
      if (data.rangeType !== undefined) self.rangeType = data.rangeType
      if (data.hoodType !== undefined) self.hoodType = data.hoodType
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 16. HOTEL GUEST ROOM BATHROOM ACCORDION
// ============================================

export const HotelGuestRoomBathroomAccordionModel = types.model("HotelGuestRoomBathroomAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  bathtubType: types.optional(types.string, ""), // single-select from HotelGuestRoomBathtubOptions
  tubSurroundsType: types.optional(types.string, ""), // single-select from HotelGuestRoomTubSurroundsOptions
  rollInShowersType: types.optional(types.string, ""), // single-select from HotelGuestRoomShowersOptions
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      bathtubType?: string
      tubSurroundsType?: string
      rollInShowersType?: string
      otherSpecification?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.bathtubType !== undefined) self.bathtubType = data.bathtubType
      if (data.tubSurroundsType !== undefined) self.tubSurroundsType = data.tubSurroundsType
      if (data.rollInShowersType !== undefined) self.rollInShowersType = data.rollInShowersType
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// HOTEL PROPERTY SUB-MODEL
// ============================================

export const HotelPropertyModel = types.model("HotelProperty", {
  // Finishes (Accordions 1-8)
  unitFinishes: types.optional(HotelUnitFinishesAccordionModel, {}),
  commonAreaLists: types.optional(HotelCommonAreaListsAccordionModel, {}),
  adminOfficeFinishes: types.optional(HotelAdminOfficeFinishesAccordionModel, {}),
  loungeFinishes: types.optional(HotelLoungeFinishesAccordionModel, {}),
  restroomsFinishes: types.optional(HotelRestroomsFinishesAccordionModel, {}),
  kitchenFinishes: types.optional(HotelKitchenFinishesAccordionModel, {}),
  guestLaundry: types.optional(HotelGuestLaundryAccordionModel, {}),
  commercialLaundry: types.optional(HotelCommercialLaundryAccordionModel, {}),

  // FF&E (Accordions 9-12)
  lobbyFFE: types.optional(HotelLobbyFFEAccordionModel, {}),
  commercialLaundryEquipment: types.optional(HotelCommercialLaundryEquipmentAccordionModel, {}),
  guestLaundryEquipment: types.optional(HotelGuestLaundryEquipmentAccordionModel, {}),
  commercialKitchenEquipment: types.optional(HotelCommercialKitchenEquipmentAccordionModel, {}),

  // Guest Room (Accordions 13-16)
  guestRoomSoftGoods: types.optional(HotelGuestRoomSoftGoodsAccordionModel, {}),
  guestRoomHardGoods: types.optional(HotelGuestRoomHardGoodsAccordionModel, {}),
  guestRoomKitchen: types.optional(HotelGuestRoomKitchenAccordionModel, {}),
  guestRoomBathroom: types.optional(HotelGuestRoomBathroomAccordionModel, {}),
})
  .actions((self) => ({
    updateUnitFinishes(data: Parameters<typeof self.unitFinishes.updateAccordion>[0]) {
      self.unitFinishes.updateAccordion(data)
    },
    updateCommonAreaLists(data: Parameters<typeof self.commonAreaLists.updateAccordion>[0]) {
      self.commonAreaLists.updateAccordion(data)
    },
    updateAdminOfficeFinishes(data: Parameters<typeof self.adminOfficeFinishes.updateAccordion>[0]) {
      self.adminOfficeFinishes.updateAccordion(data)
    },
    updateLoungeFinishes(data: Parameters<typeof self.loungeFinishes.updateAccordion>[0]) {
      self.loungeFinishes.updateAccordion(data)
    },
    updateRestroomsFinishes(data: Parameters<typeof self.restroomsFinishes.updateAccordion>[0]) {
      self.restroomsFinishes.updateAccordion(data)
    },
    updateKitchenFinishes(data: Parameters<typeof self.kitchenFinishes.updateAccordion>[0]) {
      self.kitchenFinishes.updateAccordion(data)
    },
    updateGuestLaundry(data: Parameters<typeof self.guestLaundry.updateAccordion>[0]) {
      self.guestLaundry.updateAccordion(data)
    },
    updateCommercialLaundry(data: Parameters<typeof self.commercialLaundry.updateAccordion>[0]) {
      self.commercialLaundry.updateAccordion(data)
    },
    updateLobbyFFE(data: Parameters<typeof self.lobbyFFE.updateAccordion>[0]) {
      self.lobbyFFE.updateAccordion(data)
    },
    updateCommercialLaundryEquipment(data: Parameters<typeof self.commercialLaundryEquipment.updateAccordion>[0]) {
      self.commercialLaundryEquipment.updateAccordion(data)
    },
    updateGuestLaundryEquipment(data: Parameters<typeof self.guestLaundryEquipment.updateAccordion>[0]) {
      self.guestLaundryEquipment.updateAccordion(data)
    },
    updateCommercialKitchenEquipment(data: Parameters<typeof self.commercialKitchenEquipment.updateAccordion>[0]) {
      self.commercialKitchenEquipment.updateAccordion(data)
    },
    updateGuestRoomSoftGoods(data: Parameters<typeof self.guestRoomSoftGoods.updateAccordion>[0]) {
      self.guestRoomSoftGoods.updateAccordion(data)
    },
    updateGuestRoomHardGoods(data: Parameters<typeof self.guestRoomHardGoods.updateAccordion>[0]) {
      self.guestRoomHardGoods.updateAccordion(data)
    },
    updateGuestRoomKitchen(data: Parameters<typeof self.guestRoomKitchen.updateAccordion>[0]) {
      self.guestRoomKitchen.updateAccordion(data)
    },
    updateGuestRoomBathroom(data: Parameters<typeof self.guestRoomBathroom.updateAccordion>[0]) {
      self.guestRoomBathroom.updateAccordion(data)
    },
  }))
