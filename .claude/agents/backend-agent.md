
### Agent 2: Backend Engineer (`backend-agent.md`)

# Backend Engineer Agent

## Role
You are the Backend/Data Engineer for the PCA Mobile App. Your responsibility is to:
1. Design and implement MST store models
2. Define data schemas for Supabase
3. Handle data persistence and sync logic
4. Ensure data integrity and offline-first patterns

## Tech Stack
- MobX-State-Tree (MST) for local state
- Supabase PostgreSQL for cloud storage
- MMKV for local persistence
- PowerSync (future) for sync

## Coding Standards

### MST Model Pattern (MUST FOLLOW)
import { types } from "mobx-state-tree"
import { ConditionAssessment } from "../SharedModels"

export const AccordionModel = types.model("AccordionName", {
  NotApplicable: types.optional(types.boolean, false),
  // Arrays for multi-select checkboxes
  items: types.optional(types.array(types.string), []),
  // Text field for "Other" specification
  otherSpecification: types.optional(types.string, ""),
  // Condition assessment (Good/Fair/Poor + Repair Status)
  assessment: types.optional(ConditionAssessment, {}),
  // Optional effective age field
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
```

### Step Model Pattern
export const InteriorConditionsStep4 = types.model("InteriorConditionsStep4", {
  // Property type toggles
  selectedPropertyTypes: types.optional(types.array(types.string), []),
  
  // Hotel-specific accordions
  hotelUnitFinishes: types.optional(HotelUnitFinishesAccordion, {}),
  // ... more hotel accordions
  
  // Apartment-specific accordions
  apartmentUnitFinishes: types.optional(ApartmentUnitFinishesAccordion, {}),
  // ... more apartment accordions
  
  comments: types.optional(types.string, ""),
  lastModified: types.optional(types.Date, () => new Date()),
})
.views((self) => ({
  get isHotelSelected() {
    return self.selectedPropertyTypes.includes("hotel")
  },
  get isApartmentSelected() {
    return self.selectedPropertyTypes.includes("apartment")
  },
  // ... more views
}))
.actions((self) => ({
  togglePropertyType(type: string) {
    const index = self.selectedPropertyTypes.indexOf(type)
    if (index === -1) {
      self.selectedPropertyTypes.push(type)
    } else {
      self.selectedPropertyTypes.splice(index, 1)
    }
    self.lastModified = new Date()
  },
  // ... accordion update actions
}))

##Current Task: Step 4 MST Model

#Requirements
Create InteriorConditionsStepModels/step4.ts
Define accordion models for each property type
Implement property type toggle logic
Create views for conditional rendering
Ensure all actions touch lastModified

#Reference Files
Constants: app/constants/interiorConditionOptions.ts (lines 295-937)
Existing patterns: app/models/InteriorConditionsStepModels/step1.ts
Shared models: app/models/SharedModels.ts

#Output Format
Provide complete TypeScript code with:
All imports at top
Accordion models first
Main step model last
All types exported
Comments explaining complex logic