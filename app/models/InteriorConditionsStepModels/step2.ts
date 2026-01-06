import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

// ============================================
// INTERIOR CONDITIONS - Step 2: Common Area Finishes
// ============================================

// ============================================
// LOBBY / OFFICE / MISC FLOORS, WALLS & CEILINGS ACCORDION
// ============================================

export const LobbyOfficeFinishesAccordionModel = types.model("LobbyOfficeFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Carpet, Sheet Vinyl, Ceramic Tile, VCT, Quarry Tile, Marble
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Walls, Wallpaper, Ceramic Tile, Wood paneling
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Marlite, Painted Drywall Ceiling, ACT, Decorative Panel Tiles
  
  // Other (includes Terrazzo Flooring)
  other: types.optional(types.array(types.string), []), // Mirrors, Terrazzo Flooring, Other
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
// BACK OF HOUSE, CORRIDOR, MECHANICAL ROOMS ACCORDION
// ============================================

export const BackOfHouseFinishesAccordionModel = types.model("BackOfHouseFinishesAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Carpet, Sheet Vinyl, Ceramic Tile, VCT, Quarry Tile, Marble
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Walls, Wallpaper, Ceramic Tile, Wood paneling
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Marlite, Painted Drywall Ceiling, ACT, Decorative Panel Tiles
  
  // Other (includes Terrazzo Flooring)
  other: types.optional(types.array(types.string), []), // Mirrors, Terrazzo Flooring, Other
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
// COMMON AREA RESTROOMS ACCORDION
// ============================================

export const CommonAreaRestroomsAccordionModel = types.model("CommonAreaRestroomsAccordion", {
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
// FURNITURE, FIXTURES, AND EQUIPMENT ACCORDION
// ============================================

export const FurnitureFixturesEquipmentAccordionModel = types.model("FurnitureFixturesEquipmentAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  items: types.optional(types.array(types.string), []), // Sofas, Chairs, Lamps, Decorations, Bathroom Fixtures, Other
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
// EXERCISE ROOM ACCORDION
// ============================================

export const ExerciseRoomAccordionModel = types.model("ExerciseRoomAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Carpet, Rubber Mat, Sheet Vinyl, VCT
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Mirrored Walls, Vinyl-Cov. Walls, Painted Drywall Walls
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // Painted Drywall Ceiling, ACT
  
  // Other
  other: types.optional(types.array(types.string), []), // Other
  otherSpecification: types.optional(types.string, ""),
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
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
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.walls !== undefined) self.walls.replace(data.walls)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.other !== undefined) self.other.replace(data.other)
      if (data.otherSpecification !== undefined) self.otherSpecification = data.otherSpecification
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// COMMON KITCHEN ACCORDION
// ============================================

export const CommonKitchenAccordionModel = types.model("CommonKitchenAccordion", {
  NotApplicable: types.optional(types.boolean, false),
  
  // Floors
  floors: types.optional(types.array(types.string), []), // Unfinished, Ceramic Tile, Sheet Vinyl, Quarry Tile
  
  // Walls
  walls: types.optional(types.array(types.string), []), // Painted Drywall Walls, Vinyl-Cov. Walls, Marlite Walls, Ceramic Wainscot
  
  // Ceilings
  ceilings: types.optional(types.array(types.string), []), // VCT, Painted Drywall Ceiling, ACT
  
  assessment: types.optional(ConditionAssessment, {}),
  amountToReplaceRepair: types.optional(types.number, 0),
})
  .actions((self) => ({
    updateAccordion(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.floors !== undefined) self.floors.replace(data.floors)
      if (data.walls !== undefined) self.walls.replace(data.walls)
      if (data.ceilings !== undefined) self.ceilings.replace(data.ceilings)
      if (data.assessment) Object.assign(self.assessment as any, data.assessment)
      if (data.amountToReplaceRepair !== undefined) self.amountToReplaceRepair = data.amountToReplaceRepair
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const InteriorConditionsStep2 = types.model("InteriorConditionsStep2", {
  // Top-level fields
  NotApplicable: types.optional(types.boolean, false),
  lastRenovation: types.optional(types.string, ""),
  lobby: types.optional(types.string, ""),
  
  // Accordions
  lobbyOfficeFinishes: types.optional(LobbyOfficeFinishesAccordionModel, {}),
  backOfHouseFinishes: types.optional(BackOfHouseFinishesAccordionModel, {}),
  commonAreaRestrooms: types.optional(CommonAreaRestroomsAccordionModel, {}),
  furnitureFixturesEquipment: types.optional(FurnitureFixturesEquipmentAccordionModel, {}),
  exerciseRoom: types.optional(ExerciseRoomAccordionModel, {}),
  commonKitchen: types.optional(CommonKitchenAccordionModel, {}),
  
  // Amenities
  amenities: types.optional(types.array(types.string), []), // Mailboxes, Directory, Other
  amenitiesOtherSpecification: types.optional(types.string, ""),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTopLevel(data: {
      NotApplicable?: boolean
      lastRenovation?: string
      lobby?: string
      amenities?: string[]
      amenitiesOtherSpecification?: string
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      if (data.lastRenovation !== undefined) self.lastRenovation = data.lastRenovation
      if (data.lobby !== undefined) self.lobby = data.lobby
      if (data.amenities !== undefined) self.amenities.replace(data.amenities)
      if (data.amenitiesOtherSpecification !== undefined) self.amenitiesOtherSpecification = data.amenitiesOtherSpecification
      self.lastModified = new Date()
    },
    
    // ============================================
    // ACCORDION UPDATE ACTIONS
    // ============================================
    
    updateLobbyOfficeFinishes(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.lobbyOfficeFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateBackOfHouseFinishes(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      effectiveAge?: number
    }) {
      self.backOfHouseFinishes.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateCommonAreaRestrooms(data: {
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
      self.commonAreaRestrooms.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateFurnitureFixturesEquipment(data: {
      NotApplicable?: boolean
      items?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.furnitureFixturesEquipment.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateExerciseRoom(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      other?: string[]
      otherSpecification?: string
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.exerciseRoom.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateCommonKitchen(data: {
      NotApplicable?: boolean
      floors?: string[]
      walls?: string[]
      ceilings?: string[]
      assessment?: Record<string, any>
      amountToReplaceRepair?: number
    }) {
      self.commonKitchen.updateAccordion(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

