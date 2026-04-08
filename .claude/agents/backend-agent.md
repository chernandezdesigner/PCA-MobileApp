
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
```typescript
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

### Dynamic List Model Pattern (Reference: UnitManufacturerAndSpecificsModel)
For arrays of user-managed rows (add/remove/update):
```typescript
import { types, Instance } from "mobx-state-tree"
import { v4 as uuidv4 } from "uuid"

export const ItemRowModel = types.model("ItemRow", {
  id: types.identifier,
  field1: types.optional(types.string, ""),
  field2: types.optional(types.number, 0),
})
.actions((self) => ({
  update(data: Partial<Omit<Instance<typeof ItemRowModel>, "id">>) {
    Object.assign(self, data)
  },
}))

// In parent model:
items: types.optional(types.array(ItemRowModel), []),

// Actions:
addItem() {
  self.items.push(ItemRowModel.create({ id: uuidv4() }))
  self.lastModified = new Date()
},
removeItem(id: string) {
  const idx = self.items.findIndex((i) => i.id === id)
  if (idx !== -1) self.items.splice(idx, 1)
  self.lastModified = new Date()
},
updateItem(id: string, data: Partial<...>) {
  const item = self.items.find((i) => i.id === id)
  if (item) item.update(data)
  self.lastModified = new Date()
},
```

---

## Active Tasks

---

### Task 1A: Hotels/Apartments Unit Types & Units Observed — MST Models

**Status: TODO**

**Context:**
The Alternate Properties step (step 4) already has hotel and apartment MST models with accordion data. We need to ADD unit types and units observed arrays to both the hotel and apartment property models.

**Files to Modify:**
- `app/models/InteriorConditionsStepModels/step4-hotel.ts`
- `app/models/InteriorConditionsStepModels/step4-apartment.ts`
- `app/models/InteriorConditionsStepModels/step4.ts` (if new actions needed at top level)

**What to Add:**

#### A. UnitTypeRowModel (shared, add near top of step4-hotel.ts or a new shared location)
```typescript
// Fields per PDF: Unit Type | Number | Vacant | Occupied | Down | Square Foot
export const UnitTypeRowModel = types.model("UnitTypeRow", {
  id: types.identifier,
  unitType: types.optional(types.string, ""),       // e.g. "Studio", "1BR", custom
  number: types.optional(types.number, 0),          // total count of this unit type
  vacant: types.optional(types.number, 0),
  occupied: types.optional(types.number, 0),
  down: types.optional(types.number, 0),
  squareFoot: types.optional(types.number, 0),
})
.actions((self) => ({
  update(data: Partial<Omit<Instance<typeof UnitTypeRowModel>, "id">>) {
    Object.assign(self, data)
  },
}))
```

#### B. UnitObservedRowModel (shared)
```typescript
// Fields per PDF: Unit Observed | Vacant | Occupied | Down | Observation
// 16 fixed rows — create with pre-seeded IDs "unit-1" through "unit-16"
export const UnitObservedRowModel = types.model("UnitObservedRow", {
  id: types.identifier,
  rowNumber: types.optional(types.number, 0),       // display number 1-16
  unitObserved: types.optional(types.string, ""),   // unit identifier (e.g. "101A")
  status: types.optional(types.string, ""),         // "vacant" | "occupied" | "down" | ""
  observation: types.optional(types.string, ""),    // free text
})
.actions((self) => ({
  update(data: Partial<Omit<Instance<typeof UnitObservedRowModel>, "id">>) {
    Object.assign(self, data)
  },
}))
```

#### C. Add to HotelPropertyModel in step4-hotel.ts
```typescript
// Unit Types table (dynamic, max 10 rows)
unitTypes: types.optional(types.array(UnitTypeRowModel), () => [
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "Studio" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "1BR" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "2BR" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "Suite" }),
]),

// Units Observed table (fixed 16 rows, pre-seeded)
unitsObserved: types.optional(types.array(UnitObservedRowModel), () =>
  Array.from({ length: 16 }, (_, i) =>
    UnitObservedRowModel.create({ id: `hotel-unit-obs-${i + 1}`, rowNumber: i + 1 })
  )
),
```

#### D. Add to ApartmentPropertyModel in step4-apartment.ts
```typescript
// Unit Types table (dynamic, max 10 rows)
unitTypes: types.optional(types.array(UnitTypeRowModel), () => [
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "Studio" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "1BR" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "2BR" }),
  UnitTypeRowModel.create({ id: uuidv4(), unitType: "3BR" }),
]),

// Units Observed table (fixed 16 rows, pre-seeded)
unitsObserved: types.optional(types.array(UnitObservedRowModel), () =>
  Array.from({ length: 16 }, (_, i) =>
    UnitObservedRowModel.create({ id: `apt-unit-obs-${i + 1}`, rowNumber: i + 1 })
  )
),
```

#### E. Add actions to both HotelPropertyModel and ApartmentPropertyModel
```typescript
// Unit Types actions
addUnitType() {
  if (self.unitTypes.length < 10) {
    self.unitTypes.push(UnitTypeRowModel.create({ id: uuidv4() }))
    self.lastModified = new Date()
  }
},
removeUnitType(id: string) {
  const idx = self.unitTypes.findIndex((u) => u.id === id)
  if (idx !== -1) self.unitTypes.splice(idx, 1)
  self.lastModified = new Date()
},
updateUnitType(id: string, data: Partial<Omit<Instance<typeof UnitTypeRowModel>, "id">>) {
  const row = self.unitTypes.find((u) => u.id === id)
  if (row) row.update(data)
  self.lastModified = new Date()
},

// Units Observed actions (no add/remove — fixed 16 rows)
updateUnitObserved(id: string, data: Partial<Omit<Instance<typeof UnitObservedRowModel>, "id">>) {
  const row = self.unitsObserved.find((u) => u.id === id)
  if (row) row.update(data)
  self.lastModified = new Date()
},
```

**Supabase Verification:**
- Access Supabase via MCP to check the `assessments` or `interior_conditions_step4` table schema
- Verify that hotel/apartment JSONB columns will capture the new unitTypes and unitsObserved arrays
- If schema needs explicit columns, add migration
- Check RLS policies allow authenticated users to insert/update their own assessments

**After completing this task, communicate to frontend-agent:**
- Exact model property names used
- Exact action names
- Any type exports needed

---

### Task 2B: Pre-Launch Backend Audit

**Status: TODO — runs after Task 1A**

**Scope:**
1. Audit all MST models for:
   - Missing `types.optional` (could cause hydration failures)
   - Missing `lastModified` touches in actions
   - Any `types.frozen()` misuse
   - Array models missing `.replace()` in update actions

2. Audit app/services/ for:
   - Supabase client setup (anon key exposure, proper env vars)
   - Photo upload service error handling
   - Any missing try/catch on async operations

3. Supabase audit (via MCP):
   - All tables have RLS enabled
   - RLS policies are correct for multi-user (each user only sees their own assessments)
   - Storage bucket policies for photos
   - Check for any missing indexes on frequently queried columns
   - Verify photo table schema matches what the app sends

4. MMKV persistence:
   - Verify all stores are properly serialized/deserialized
   - Check for any circular reference issues

**Output:** List of findings with severity ratings passed to continuity-agent for consolidation.
