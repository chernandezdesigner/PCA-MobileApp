import { types } from "mobx-state-tree"

// ============================================
// INTERIOR CONDITIONS - Step 3: Mold & Moisture
// ============================================

// Simple flat structure - no accordions needed
// Each condition type has: checkbox, size, location

// ============================================
// MOLD CONDITION MODEL (Reusable for all 4 types)
// ============================================

export const MoldConditionModel = types.model("MoldCondition", {
  hasCondition: types.optional(types.boolean, false),
  sizeSF: types.optional(types.number, 0),
  location: types.optional(types.string, ""),
})
  .actions((self) => ({
    update(data: {
      hasCondition?: boolean
      sizeSF?: number
      location?: string
    }) {
      if (data.hasCondition !== undefined) self.hasCondition = data.hasCondition
      if (data.sizeSF !== undefined) self.sizeSF = data.sizeSF
      if (data.location !== undefined) self.location = data.location
    },
  }))

// ============================================
// MAIN STEP MODEL
// ============================================

export const InteriorConditionsStep3 = types.model("InteriorConditionsStep3", {
  // Top-level N/A
  NotApplicable: types.optional(types.boolean, false),
  
  // 4 Mold/Moisture Conditions
  commercialMoistureLessThan10SF: types.optional(MoldConditionModel, {}),
  commercialMoistureGreaterOrEqual10SF: types.optional(MoldConditionModel, {}),
  commercialMoldLessThan10SF: types.optional(MoldConditionModel, {}),
  commercialMoldGreaterOrEqual10SF: types.optional(MoldConditionModel, {}),
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
  .actions((self) => ({
    touch() {
      self.lastModified = new Date()
    },
    
    updateTopLevel(data: {
      NotApplicable?: boolean
    }) {
      if (data.NotApplicable !== undefined) self.NotApplicable = data.NotApplicable
      self.lastModified = new Date()
    },
    
    // ============================================
    // CONDITION UPDATE ACTIONS
    // ============================================
    
    updateCommercialMoistureLessThan10SF(data: {
      hasCondition?: boolean
      sizeSF?: number
      location?: string
    }) {
      self.commercialMoistureLessThan10SF.update(data)
      self.lastModified = new Date()
    },
    
    updateCommercialMoistureGreaterOrEqual10SF(data: {
      hasCondition?: boolean
      sizeSF?: number
      location?: string
    }) {
      self.commercialMoistureGreaterOrEqual10SF.update(data)
      self.lastModified = new Date()
    },
    
    updateCommercialMoldLessThan10SF(data: {
      hasCondition?: boolean
      sizeSF?: number
      location?: string
    }) {
      self.commercialMoldLessThan10SF.update(data)
      self.lastModified = new Date()
    },
    
    updateCommercialMoldGreaterOrEqual10SF(data: {
      hasCondition?: boolean
      sizeSF?: number
      location?: string
    }) {
      self.commercialMoldGreaterOrEqual10SF.update(data)
      self.lastModified = new Date()
    },
    
    updateComments(value: string) {
      self.comments = value
      self.lastModified = new Date()
    },
  }))

