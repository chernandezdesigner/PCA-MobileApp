# Building Envelope Models Documentation

## Overview

The Building Envelope form consists of 10 steps, with **Step 3** and **Step 3B** representing Primary and Secondary Roofing sections respectively. Both roofing steps share identical accordion structures and field definitions to maintain consistency with the physical inspection form.

## Architecture Decision: Separate Steps vs. Dynamic Array

### Why We Chose Separate Steps (Step3 & Step3B)

After careful analysis of offline-first requirements, form complexity, and UX considerations, we implemented **Option 1: Separate Steps** rather than a dynamic array approach.

**Key Benefits:**
- ✅ **Clear UX Mapping**: Physical form has 2 distinct sections → App has 2 distinct steps
- ✅ **Better Data Isolation**: No risk of array index conflicts during offline sync
- ✅ **Simpler Navigation**: Linear step progression (1 → 2 → 3 → 3B → 4...)
- ✅ **Easier Validation**: React Hook Form validates each step independently
- ✅ **Better Offline Sync**: PowerSync handles flat structures better than nested arrays
- ✅ **Performance**: Prevents rendering 22+ accordions simultaneously
- ✅ **Future-Proof**: If roofs need different fields later, no refactoring needed

## Implementation Details

### Shared Structure

Both `BuildingEnvelopeStep3` (Primary Roof) and `BuildingEnvelopeStep3B` (Secondary Roof) share:

**Top-Level Fields:**
- `warranty` (boolean) - Roof under warranty?
- `materialLabor` (boolean) - Material & labor warranty?
- `remainingYears` (number) - Years remaining on warranty
- `roofType` (string) - Primary roof type selection
- `otherType` (string) - Custom roof type if "Other" selected

**Accordion Models (11 total):**
1. **Material** - Roof material type & condition assessment
2. **Shingles** - Shingle type & condition assessment
3. **Secondary Roof** - Sub-roof details (has own NotApplicable flag)
4. **Parapets** - Parapet type & condition assessment
5. **Roof Leaks** - Location & repair assessment
6. **Flashing** - Flashing type & condition assessment
7. **Curb Mounted** - Curb-mounted equipment & condition
8. **Roof Structures** - Structural elements & condition
9. **Mech Screen** - Mechanical screen (has NotApplicable flag)
10. **Drainage** - Drainage system type & condition
11. **Insulation** - Insulation type & condition

**Assessment Types:**
- `ConditionAssessment` - Used by most accordions (condition + repairStatus + amountToRepair)
- `RepairAssessment` - Used by Roof Leaks (repairStatus + amountToRepair only)

### Key Differences Between Step3 and Step3B

| Feature | Step 3 (Primary Roof) | Step 3B (Secondary Roof) |
|---------|----------------------|--------------------------|
| Required | Always | Optional (N/A toggle) |
| Model Name | `BuildingEnvelopeStep3` | `BuildingEnvelopeStep3B` |
| Step-Level N/A Flag | No | Yes (`stepNotApplicable`) |
| All Other Fields | Identical | Identical |

## Usage Examples

### Accessing the Stores

```typescript
// In a screen component
import { useStores } from "../models"

const MyScreen = observer(() => {
  const { assessmentStore } = useStores()
  const currentAssessment = assessmentStore.currentAssessment
  
  // Access Primary Roof (Step 3)
  const primaryRoof = currentAssessment.buildingEnvelope.step3
  
  // Access Secondary Roof (Step 3B)
  const secondaryRoof = currentAssessment.buildingEnvelope.step3B
})
```

### Updating Top-Level Fields

```typescript
// Update warranty information
primaryRoof.updateWarranty(true)
primaryRoof.updateMaterialLabor(true)
primaryRoof.updateRemainingYears(15)
primaryRoof.updateRoofType("Built-Up")
primaryRoof.updateOtherType("") // Clear if not "Other"

// Update comments
primaryRoof.updateComments("Roof shows signs of normal wear...")
```

### Updating Accordion Data

```typescript
// Update Material accordion
primaryRoof.updateMaterial({
  materialType: "EPDM",
  assessment: {
    condition: "good",
    repairStatus: "RR",
    amountToRepair: "5000"
  }
})

// Update Shingles accordion
primaryRoof.updateShingles({
  shinglesType: "Asphalt",
  assessment: {
    condition: "fair",
    repairStatus: "ST",
    amountToRepair: "12000"
  }
})

// Update Secondary Roof accordion (within primary roof step)
primaryRoof.updateSecondaryRoof({
  NotApplicable: false,
  secondaryRoofType: "Metal",
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  }
})
```

### Handling Step3B (Secondary Roof)

```typescript
// Mark entire step as N/A
secondaryRoof.updateStepNotApplicable(true)

// If NOT N/A, fill out same as Step 3
if (!secondaryRoof.stepNotApplicable) {
  secondaryRoof.updateWarranty(false)
  secondaryRoof.updateRoofType("Flat")
  secondaryRoof.updateMaterial({
    materialType: "TPO",
    assessment: { condition: "fair", repairStatus: "ST", amountToRepair: "8000" }
  })
  // ... etc
}
```

### Navigation Between Steps

```typescript
// In BuildingEnvelopeStore
const buildingEnvelope = currentAssessment.buildingEnvelope

// Go to a specific step
buildingEnvelope.goToStep("step3")   // Primary Roof
buildingEnvelope.goToStep("step3B")  // Secondary Roof
buildingEnvelope.goToStep("step4")   // Next step after roofing

// Check current step
const isOnSecondaryRoof = buildingEnvelope.currentStep === "step3B"
```

### React Hook Form Integration Example

```typescript
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

const Step3Screen = observer(() => {
  const { assessmentStore } = useStores()
  const step3 = assessmentStore.currentAssessment.buildingEnvelope.step3
  
  const { control, handleSubmit } = useForm({
    defaultValues: {
      warranty: step3.warranty,
      materialLabor: step3.materialLabor,
      remainingYears: step3.remainingYears,
      roofType: step3.roofType,
      otherType: step3.otherType,
      // ... accordion default values
    }
  })
  
  const onSubmit = (data) => {
    // Update MST store
    step3.updateWarranty(data.warranty)
    step3.updateMaterialLabor(data.materialLabor)
    step3.updateRemainingYears(data.remainingYears)
    step3.updateRoofType(data.roofType)
    step3.updateOtherType(data.otherType)
    
    // Update accordions
    step3.updateMaterial({
      materialType: data.materialType,
      assessment: data.materialAssessment
    })
    // ... update other accordions
    
    // Navigate to next step
    assessmentStore.currentAssessment.buildingEnvelope.goToStep("step3B")
  }
  
  return (
    // Your form UI here
  )
})
```

## Data Persistence & Sync Considerations

### Offline-First Benefits

1. **Flat Structure**: Each step is a direct property of BuildingEnvelopeStore
   - No array indices to track
   - No risk of concurrent array modifications
   - Simpler CRDT reconciliation

2. **Independent Sync**: Steps can sync independently
   ```typescript
   // Each step has lastModified timestamp
   step3.lastModified  // Tracks when primary roof was last updated
   step3B.lastModified // Tracks when secondary roof was last updated
   ```

3. **Clear Conflict Resolution**: Last-write-wins per step
   - If two devices edit step3, last sync wins
   - Step3B remains unaffected

### Autosave Strategy

```typescript
// Option 1: Save on navigation (current approach)
const handleNext = () => {
  // Data is already in MST store from form updates
  buildingEnvelope.goToStep("step3B")
}

// Option 2: Autosave on field blur (recommended for data safety)
const handleFieldBlur = (fieldName, value) => {
  step3[`update${fieldName}`](value)
  step3.touch() // Updates lastModified
}

// Option 3: Periodic autosave (every 30s)
useEffect(() => {
  const interval = setInterval(() => {
    if (isDirty) {
      saveFormToMST()
    }
  }, 30000)
  return () => clearInterval(interval)
}, [isDirty])
```

## Shared Code Explanation

### RoofingSharedProperties

A TypeScript object containing all MST property definitions shared between Step3 and Step3B:
- Prevents duplication
- Ensures both steps stay in sync
- Single source of truth for roofing structure

### createRoofingActions()

A factory function that generates all update actions for roofing steps:
- Returns consistent action methods
- Automatically updates `lastModified` timestamp
- Step3B extends these actions with `updateStepNotApplicable()`

### Why This Pattern?

```typescript
// ❌ BAD: Copy-paste entire model
export const BuildingEnvelopeStep3B = types.model({
  stepNotApplicable: types.optional(types.boolean, false),
  warranty: types.optional(types.boolean, false),
  // ... 100+ lines of duplicate code
})

// ✅ GOOD: Share structure, extend as needed
export const BuildingEnvelopeStep3B = types.model({
  stepNotApplicable: types.optional(types.boolean, false),
  ...RoofingSharedProperties,
})
.actions((self) => ({
  ...createRoofingActions(self),
  updateStepNotApplicable(value: boolean) {
    self.stepNotApplicable = value
    self.lastModified = new Date()
  },
}))
```

## Future Steps (4-10)

As you implement the remaining Building Envelope steps:

1. Create models in their respective files (`step4.ts`, `step5.ts`, etc.)
2. Import them in `BuildingEnvelopeStore.ts`
3. Add them to the store's props:
   ```typescript
   step4: types.optional(BuildingEnvelopeStep4, {}),
   step5: types.optional(BuildingEnvelopeStep5, {}),
   // ... etc
   ```

## Questions or Need Help?

If roofing accordions need different fields in the future:
1. Update `RoofingSharedProperties` to add new fields
2. Both Step3 and Step3B will automatically inherit them
3. Update `createRoofingActions()` to add corresponding update methods

For debugging:
```typescript
// Check what data is in a step
console.log(getSnapshot(step3))

// Verify last modification time
console.log(step3.lastModified)

// Check if secondary roof is applicable
console.log(step3B.stepNotApplicable)
```

## Summary

This implementation prioritizes:
- **Data safety** over code brevity
- **Clear separation** over clever abstractions  
- **Offline-first sync** over complex nested structures
- **Maintainability** over minimal code duplication

The slight code duplication between Step3 and Step3B is intentional and beneficial for your offline-first, field-inspection use case.

