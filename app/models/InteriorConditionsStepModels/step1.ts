import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// INTERIOR CONDITIONS - Step 1: Commercial Tenant Unit Finishes
// ============================================

// ============================================
// TENANT FLOORS, WALLS & CEILINGS ACCORDION
// ============================================

export const TenantFinishesAccordionModel = types.model("TenantFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Carpet, Sheet Vinyl, Ceramic Tile, VCT, Quarry Tile, Marble
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Walls, Wallpaper, Ceramic Tile, Wood paneling
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Marlite, Painted Drywall Ceiling, ACT, Decorative Panel Tiles
  
  // Other
  other: types.optional(types.array(types.string), []), // Mirrors, Other
  otherSpecification: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.walls !== undefined) self.walls.replace(data.walls)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.other !== undefined) self.other.replace(data.other)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// RESTROOM FLOORS, WALLS & CEILINGS ACCORDION
// ============================================

export const RestroomFinishesAccordionModel = types.model("RestroomFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  quantity: types.optional(types.number, 0), // QTY field
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Quarry Tile, Sheet Vinyl, Painted Drywall Walls, Ceramic Tile, Marlite
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Clg., Ceramic Wainscot, Metal partitions, P-Lam partitions
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // VCT, ACT, Wallpaper, Wood paneling, Mirrors
  
  // Other
  other: types.optional(types.array(types.string), []), // Decorative Panel Tiles, Other
  otherSpecification: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      quantity?: number
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.quantity !== undefined) self.quantity = data.quantity
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.walls !== undefined) self.walls.replace(data.walls)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.other !== undefined) self.other.replace(data.other)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// KITCHEN FLOORS, WALLS & CEILINGS ACCORDION
// ============================================

export const KitchenFinishesAccordionModel = types.model("KitchenFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors (same options as Tenant)
  floors: types.optional(types.array(types.string), []), // Carpet, Sheet Vinyl, Ceramic Tile, VCT, Quarry Tile, Marble
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Walls, Wallpaper, Ceramic Tile, Wood paneling
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Marlite, Painted Drywall Ceiling, ACT, Decorative Panel Tiles
  
  // Other
  other: types.optional(types.array(types.string), []), // Mirrors, Other
  otherSpecification: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.walls !== undefined) self.walls.replace(data.walls)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.other !== undefined) self.other.replace(data.other)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// WAREHOUSE FLOORS, WALLS & CEILINGS ACCORDION
// ============================================

export const WarehouseFinishesAccordionModel = types.model("WarehouseFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Unfinished Concrete Flooring, Painted Drywall Walls, VCT
  
  // Unfinished
  unfinished: types.optional(types.array(types.string), []), // Walls, Ceiling
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Painted Drywall Clg., ACT, Sheet Vinyl
  
  // Other
  other: types.optional(types.array(types.string), []), // Other
  otherSpecification: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      floors?: string[]
      unfinished?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.unfinished !== undefined) self.unfinished.replace(data.unfinished)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.other !== undefined) self.other.replace(data.other)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.effectiveAge !== undefined) self.effectiveAge = data.effectiveAge
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const InteriorConditionsStep1 = types.model("InteriorConditionsStep1", {
  // Top-level field
  lastRenovated: types.optional(types.string, ""),
  
  // Accordions
  tenantFinishes: types.optional(TenantFinishesAccordionModel, {}),
  restroomFinishes: types.optional(RestroomFinishesAccordionModel, {}),
  kitchenFinishes: types.optional(KitchenFinishesAccordionModel, {}),
  warehouseFinishes: types.optional(WarehouseFinishesAccordionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTopLevel(data: {
      lastRenovated?: string
    }) {
      if (data.lastRenovated !== undefined) self.lastRenovated = data.lastRenovated
      self.lastModified = new Date()
    },
    
    // ============================================
    // ACCORDION UPDATE ACTIONS
    // ============================================
    
    updateTenantFinishes(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.tenantFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateRestroomFinishes(data: {
      NotApplicable?: boolean
      quantity?: number
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.restroomFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateKitchenFinishes(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.kitchenFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateWarehouseFinishes(data: {
      NotApplicable?: boolean
      floors?: string[]
      unfinished?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.warehouseFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

