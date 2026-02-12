import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// INTERIOR CONDITIONS - Step 4: Apartment Property
// ============================================

// ============================================
// 1. APARTMENT UNIT FINISHES ACCORDION
// ============================================

export const ApartmentUnitFinishesAccordionModel = types.model("ApartmentUnitFinishesAccordion", {
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
// 2. APARTMENT RESTROOM FINISHES ACCORDION
// ============================================

export const ApartmentRestroomFinishesAccordionModel = types.model("ApartmentRestroomFinishesAccordion", {
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
// 3. APARTMENT KITCHEN FINISHES ACCORDION
// ============================================

export const ApartmentKitchenFinishesAccordionModel = types.model("ApartmentKitchenFinishesAccordion", {
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
// 4. APARTMENT INTERIOR DOORS ACCORDION
// ============================================

export const ApartmentInteriorDoorsAccordionModel = types.model("ApartmentInteriorDoorsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  wardrobeType: types.optional(types.string, ""), // single-select from ApartmentWardrobeOptions
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      wardrobeType?: string
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.wardrobeType !== undefined) self.wardrobeType = data.wardrobeType
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 5. APARTMENT CLUBHOUSE/LOBBY FINISHES ACCORDION
// ============================================

export const ApartmentClubhouseLobbyFinishesAccordionModel = types.model("ApartmentClubhouseLobbyFinishesAccordion", {
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
// 6. APARTMENT CORRIDOR FINISHES ACCORDION
// ============================================

export const ApartmentCorridorFinishesAccordionModel = types.model("ApartmentCorridorFinishesAccordion", {
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
// 7. APARTMENT COMMON RESTROOMS FINISHES ACCORDION
// ============================================

export const ApartmentCommonRestroomsFinishesAccordionModel = types.model("ApartmentCommonRestroomsFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// 8. APARTMENT EXERCISE ROOM FINISHES ACCORDION
// ============================================

export const ApartmentExerciseRoomFinishesAccordionModel = types.model("ApartmentExerciseRoomFinishesAccordion", {
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
// 9. APARTMENT COMMON KITCHEN FINISHES ACCORDION
// ============================================

export const ApartmentCommonKitchenFinishesAccordionModel = types.model("ApartmentCommonKitchenFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 10. APARTMENT LAUNDRY ROOM FINISHES ACCORDION
// ============================================

export const ApartmentLaundryRoomFinishesAccordionModel = types.model("ApartmentLaundryRoomFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 11. APARTMENT MANAGER UNIT FINISHES ACCORDION
// ============================================

export const ApartmentManagerUnitFinishesAccordionModel = types.model("ApartmentManagerUnitFinishesAccordion", {
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
// 12. APARTMENT LOBBY FF&E ACCORDION
// ============================================

export const ApartmentLobbyFFEAccordionModel = types.model("ApartmentLobbyFFEAccordion", {
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
// 13. APARTMENT BUSINESS CENTER ACCORDION
// ============================================

export const ApartmentBusinessCenterAccordionModel = types.model("ApartmentBusinessCenterAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 14. APARTMENT COMMON AREA LAUNDRY EQUIPMENT ACCORDION
// ============================================

export const ApartmentCommonAreaLaundryEquipmentAccordionModel = types.model("ApartmentCommonAreaLaundryEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  ownership: types.optional(types.string, ""), // single-select from ApartmentLaundryOwnershipOptions
  providedBy: types.optional(types.string, ""), // single-select from ApartmentLaundryProvidedByOptions
  location: types.optional(types.string, ""), // single-select from ApartmentLaundryLocationOptions
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      ownership?: string
      providedBy?: string
      location?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.ownership !== undefined) self.ownership = data.ownership
      if (data.providedBy !== undefined) self.providedBy = data.providedBy
      if (data.location !== undefined) self.location = data.location
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 15. APARTMENT KITCHEN EQUIPMENT ACCORDION
// ============================================

export const ApartmentKitchenEquipmentAccordionModel = types.model("ApartmentKitchenEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  cabinets: types.optional(types.string, ""), // single-select from ApartmentKitchenCabinetsOptions
  counterTops: types.optional(types.string, ""), // single-select from ApartmentKitchenCounterTopsOptions
  rangeType: types.optional(types.string, ""), // single-select from ApartmentKitchenRangeOptions
  hoodType: types.optional(types.string, ""), // single-select from ApartmentKitchenHoodOptions
  equipment: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      cabinets?: string
      counterTops?: string
      rangeType?: string
      hoodType?: string
      equipment?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.cabinets !== undefined) self.cabinets = data.cabinets
      if (data.counterTops !== undefined) self.counterTops = data.counterTops
      if (data.rangeType !== undefined) self.rangeType = data.rangeType
      if (data.hoodType !== undefined) self.hoodType = data.hoodType
      if (data.equipment !== undefined) self.equipment.replace(data.equipment)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// 16. APARTMENT BATHROOM ACCORDION
// ============================================

export const ApartmentBathroomAccordionModel = types.model("ApartmentBathroomAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  bathtubType: types.optional(types.string, ""), // single-select from ApartmentBathtubOptions
  tubSurroundsType: types.optional(types.string, ""), // single-select from ApartmentTubSurroundsOptions
  rollInShowersType: types.optional(types.string, ""), // single-select from ApartmentRollInShowersOptions
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
// 17. APARTMENT FURNISHED ITEMS ACCORDION
// ============================================

export const ApartmentFurnishedItemsAccordionModel = types.model("ApartmentFurnishedItemsAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  tvType: types.optional(types.string, ""), // single-select from ApartmentFurnishedApartmentTVOptions
  assessment: types.optional(ConditionAssessment, {}),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      items?: string[]
      tvType?: string
      assessment?: Record<string, any>
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.items !== undefined) self.items.replace(data.items)
      if (data.tvType !== undefined) self.tvType = data.tvType
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
    },
  }))

// ============================================
// APARTMENT PROPERTY SUB-MODEL
// ============================================

export const ApartmentPropertyModel = types.model("ApartmentProperty", {
  // Unit Finishes (Accordions 1-4)
  unitFinishes: types.optional(ApartmentUnitFinishesAccordionModel, {}),
  restroomFinishes: types.optional(ApartmentRestroomFinishesAccordionModel, {}),
  kitchenFinishes: types.optional(ApartmentKitchenFinishesAccordionModel, {}),
  interiorDoors: types.optional(ApartmentInteriorDoorsAccordionModel, {}),

  // Common Area Finishes (Accordions 5-11)
  clubhouseLobbyFinishes: types.optional(ApartmentClubhouseLobbyFinishesAccordionModel, {}),
  corridorFinishes: types.optional(ApartmentCorridorFinishesAccordionModel, {}),
  commonRestroomsFinishes: types.optional(ApartmentCommonRestroomsFinishesAccordionModel, {}),
  exerciseRoomFinishes: types.optional(ApartmentExerciseRoomFinishesAccordionModel, {}),
  commonKitchenFinishes: types.optional(ApartmentCommonKitchenFinishesAccordionModel, {}),
  laundryRoomFinishes: types.optional(ApartmentLaundryRoomFinishesAccordionModel, {}),
  managerUnitFinishes: types.optional(ApartmentManagerUnitFinishesAccordionModel, {}),

  // FF&E (Accordions 12-14)
  lobbyFFE: types.optional(ApartmentLobbyFFEAccordionModel, {}),
  businessCenter: types.optional(ApartmentBusinessCenterAccordionModel, {}),
  commonAreaLaundryEquipment: types.optional(ApartmentCommonAreaLaundryEquipmentAccordionModel, {}),

  // Equipment & Fixtures (Accordions 15-17)
  kitchenEquipment: types.optional(ApartmentKitchenEquipmentAccordionModel, {}),
  bathroom: types.optional(ApartmentBathroomAccordionModel, {}),
  furnishedItems: types.optional(ApartmentFurnishedItemsAccordionModel, {}),
})
  .actions((self) => ({
    updateUnitFinishes(data: Parameters<typeof self.unitFinishes.updateAccordion>[0]) {
      self.unitFinishes.updateAccordion(data)
    },
    updateRestroomFinishes(data: Parameters<typeof self.restroomFinishes.updateAccordion>[0]) {
      self.restroomFinishes.updateAccordion(data)
    },
    updateKitchenFinishes(data: Parameters<typeof self.kitchenFinishes.updateAccordion>[0]) {
      self.kitchenFinishes.updateAccordion(data)
    },
    updateInteriorDoors(data: Parameters<typeof self.interiorDoors.updateAccordion>[0]) {
      self.interiorDoors.updateAccordion(data)
    },
    updateClubhouseLobbyFinishes(data: Parameters<typeof self.clubhouseLobbyFinishes.updateAccordion>[0]) {
      self.clubhouseLobbyFinishes.updateAccordion(data)
    },
    updateCorridorFinishes(data: Parameters<typeof self.corridorFinishes.updateAccordion>[0]) {
      self.corridorFinishes.updateAccordion(data)
    },
    updateCommonRestroomsFinishes(data: Parameters<typeof self.commonRestroomsFinishes.updateAccordion>[0]) {
      self.commonRestroomsFinishes.updateAccordion(data)
    },
    updateExerciseRoomFinishes(data: Parameters<typeof self.exerciseRoomFinishes.updateAccordion>[0]) {
      self.exerciseRoomFinishes.updateAccordion(data)
    },
    updateCommonKitchenFinishes(data: Parameters<typeof self.commonKitchenFinishes.updateAccordion>[0]) {
      self.commonKitchenFinishes.updateAccordion(data)
    },
    updateLaundryRoomFinishes(data: Parameters<typeof self.laundryRoomFinishes.updateAccordion>[0]) {
      self.laundryRoomFinishes.updateAccordion(data)
    },
    updateManagerUnitFinishes(data: Parameters<typeof self.managerUnitFinishes.updateAccordion>[0]) {
      self.managerUnitFinishes.updateAccordion(data)
    },
    updateLobbyFFE(data: Parameters<typeof self.lobbyFFE.updateAccordion>[0]) {
      self.lobbyFFE.updateAccordion(data)
    },
    updateBusinessCenter(data: Parameters<typeof self.businessCenter.updateAccordion>[0]) {
      self.businessCenter.updateAccordion(data)
    },
    updateCommonAreaLaundryEquipment(data: Parameters<typeof self.commonAreaLaundryEquipment.updateAccordion>[0]) {
      self.commonAreaLaundryEquipment.updateAccordion(data)
    },
    updateKitchenEquipment(data: Parameters<typeof self.kitchenEquipment.updateAccordion>[0]) {
      self.kitchenEquipment.updateAccordion(data)
    },
    updateBathroom(data: Parameters<typeof self.bathroom.updateAccordion>[0]) {
      self.bathroom.updateAccordion(data)
    },
    updateFurnishedItems(data: Parameters<typeof self.furnishedItems.updateAccordion>[0]) {
      self.furnishedItems.updateAccordion(data)
    },
  }))
