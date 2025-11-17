# Step 5 Usage Guide: Parking, Paving, Sidewalks

## Overview

Step 5 implements **dynamic material selection** with condition assessments. Unlike static accordions, this step uses MST maps to store only the materials that are actually selected by the inspector.

## Architecture

### Dynamic Material Pattern

Each main accordion (Pavement, Entrance Aprons, Curbing, etc.) uses:
```typescript
materials: types.map(ConditionAssessmentwithEffAge)
```

**Benefits:**
- ✅ Only stores selected materials (clean data)
- ✅ No empty rows in database
- ✅ Flexible - easy to add new material types
- ✅ Offline-friendly sync

## Usage Examples

### 1. Basic Information Accordion

Standard static fields for parking counts and ADA compliance:

```typescript
const { basicInformation } = step5

// Update parking spaces
basicInformation.update({
  amountOfParkingSpaces: 150,
  openLotSpaces: 100,
  carportSpaces: 30,
  garageSpaces: 20,
  tuckUnder: false,
  regADASpaces: 8,
  vanSpaces: 2,
})

// Update ADA signage
basicInformation.update({
  ADASignage: true,
  missingADASigns: 3,
  ADAVanSignage: true,
  missingADAVanSigns: 1,
  ADARampSignage: "Yes",
  publicAccess: "Yes",
  whereNeeded: "Main entrance and side lot"
})
```

### 2. Pavement Accordion (Dynamic Materials)

```typescript
const { pavement } = step5

// Inspector checks "Asphalt" - add material with assessment
pavement.updateMaterial("Asphalt", {
  condition: "fair",
  repairStatus: "ST",
  effectiveAge: 12,
  amountToRepair: "25000"
})

// Inspector checks "Concrete" - add another material
pavement.updateMaterial("Concrete", {
  condition: "good",
  repairStatus: "RR",
  effectiveAge: 8,
  amountToRepair: "5000"
})

// Inspector unchecks "Asphalt" - remove it
pavement.removeMaterial("Asphalt")

// Check what materials are selected
const selectedMaterials = Array.from(pavement.materials.keys())
// Result: ["Concrete"]

// Get a specific material's assessment
const concreteAssessment = pavement.materials.get("Concrete")
console.log(concreteAssessment.condition) // "good"
console.log(concreteAssessment.effectiveAge) // 8
```

### 3. Entrance Aprons (with N/A option)

```typescript
const { entranceAprons } = step5

// Mark as Not Applicable
entranceAprons.updateNotApplicable(true)
// This automatically clears all materials

// If applicable, add materials
entranceAprons.updateNotApplicable(false)
entranceAprons.updateMaterial("Concrete striping", {
  condition: "poor",
  repairStatus: "IR",
  effectiveAge: 15,
  amountToRepair: "3000"
})
```

### 4. Sidewalks/Walkways (with Checkboxes and Railing)

```typescript
const { sidewalksWalkways } = step5

// Update material checkboxes (Metal, Wood, Vinyl)
sidewalksWalkways.updateMaterialCheckbox("Metal", true)
sidewalksWalkways.updateMaterialCheckbox("Wood", false)
sidewalksWalkways.updateMaterialCheckbox("Vinyl", true)

// Add material assessments (using different material types for the actual sidewalk materials)
sidewalksWalkways.updateMaterial("Concrete", {
  condition: "fair",
  repairStatus: "ST",
  effectiveAge: 10,
  amountToRepair: "15000"
})

sidewalksWalkways.updateMaterial("Brick Paver", {
  condition: "good",
  repairStatus: "RR",
  effectiveAge: 5,
  amountToRepair: "8000"
})

// Add railing assessment (nested)
sidewalksWalkways.updateRailing("yes")
sidewalksWalkways.updateRailingDetails({
  railingType: "Metal",
  assessment: {
    condition: "fair",
    repairStatus: "ST",
    amountToRepair: "2000"
  }
})

// If no railing
sidewalksWalkways.updateRailing("no")
```

### 5. Steps/Stairs (with Material Options and Railing)

```typescript
const { stepsStairs } = step5

// Update material options (Y/N for Metal, Wood, Vinyl, Granite, Steel)
stepsStairs.updateMaterialOption("Metal", true)
stepsStairs.updateMaterialOption("Wood", false)
stepsStairs.updateMaterialOption("Granite", true)

// Add material assessments
stepsStairs.updateMaterial("Concrete", {
  condition: "good",
  repairStatus: "NA",
  effectiveAge: 3,
  amountToRepair: ""
})

// Add railing assessment (nested)
stepsStairs.updateRailing("yes")
stepsStairs.updateRailingDetails({
  railingType: "Steel",
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  }
})
```

## UI Implementation Patterns

### Pattern 1: Material Checkboxes

```jsx
// Define available material types for this accordion
const pavementMaterials = [
  "Gravel",
  "Brick Paver",
  "Asphalt",
  "Concrete",
  "Asphalt Seal Coat/Striping",
  "Concrete striping"
]

// Render checkboxes
{pavementMaterials.map(material => (
  <Checkbox
    key={material}
    checked={pavement.materials.has(material)}
    label={material}
    onChange={(checked) => {
      if (checked) {
        // Add material with empty assessment
        pavement.updateMaterial(material, {
          condition: undefined,
          repairStatus: undefined,
          effectiveAge: 0,
          amountToRepair: ""
        })
      } else {
        // Remove material
        pavement.removeMaterial(material)
      }
    }}
  />
))}
```

### Pattern 2: Dynamic Assessment Rows

```jsx
// Only render assessment inputs for checked materials
{Array.from(pavement.materials.entries()).map(([materialType, assessment]) => (
  <View key={materialType} style={styles.assessmentRow}>
    <Text>{materialType}</Text>
    
    {/* Condition dropdown: Good/Fair/Poor */}
    <Picker
      selectedValue={assessment.condition}
      onValueChange={(value) => {
        pavement.updateMaterial(materialType, {
          ...getSnapshot(assessment),
          condition: value
        })
      }}
    >
      <Picker.Item label="Good" value="good" />
      <Picker.Item label="Fair" value="fair" />
      <Picker.Item label="Poor" value="poor" />
    </Picker>
    
    {/* Repair Status: IR/ST/RR/RM/INV/NA */}
    <Picker
      selectedValue={assessment.repairStatus}
      onValueChange={(value) => {
        pavement.updateMaterial(materialType, {
          ...getSnapshot(assessment),
          repairStatus: value
        })
      }}
    >
      <Picker.Item label="IR" value="IR" />
      <Picker.Item label="ST" value="ST" />
      {/* ... other options */}
    </Picker>
    
    {/* Effective Age */}
    <TextInput
      value={String(assessment.effectiveAge)}
      keyboardType="numeric"
      onChangeText={(text) => {
        pavement.updateMaterial(materialType, {
          ...getSnapshot(assessment),
          effectiveAge: parseInt(text) || 0
        })
      }}
    />
    
    {/* Amount to Repair */}
    <TextInput
      value={assessment.amountToRepair}
      keyboardType="numeric"
      placeholder="$"
      onChangeText={(text) => {
        pavement.updateMaterial(materialType, {
          ...getSnapshot(assessment),
          amountToRepair: text
        })
      }}
    />
  </View>
))}
```

### Pattern 3: Conditional Railing Display

```jsx
// Show railing Y/N toggle
<RadioGroup
  value={sidewalksWalkways.railing}
  onValueChange={(value) => sidewalksWalkways.updateRailing(value)}
>
  <Radio value="yes">Yes</Radio>
  <Radio value="no">No</Radio>
</RadioGroup>

{/* Only show railing assessment when "yes" is selected */}
{sidewalksWalkways.railing === "yes" && (
  <View style={styles.nestedSection}>
    <Text>Railing Type</Text>
    <TextInput
      value={sidewalksWalkways.railingDetails?.railingType || ""}
      onChangeText={(text) => {
        sidewalksWalkways.updateRailingDetails({
          railingType: text,
          assessment: sidewalksWalkways.railingDetails?.assessment || {}
        })
      }}
    />
    
    {/* Railing condition assessment */}
    <ConditionAssessmentFields
      assessment={sidewalksWalkways.railingDetails?.assessment}
      onUpdate={(data) => {
        sidewalksWalkways.updateRailingDetails({
          railingType: sidewalksWalkways.railingDetails?.railingType || "",
          assessment: data
        })
      }}
    />
  </View>
)}
```

## React Hook Form Integration

```typescript
import { useForm, Controller } from "react-hook-form"
import { observer } from "mobx-react-lite"
import { getSnapshot } from "mobx-state-tree"

const Step5Screen = observer(() => {
  const { assessmentStore } = useStores()
  const step5 = assessmentStore.currentAssessment.buildingEnvelope.step5
  
  const { control, handleSubmit } = useForm({
    defaultValues: {
      // Basic Information
      amountOfParkingSpaces: step5.basicInformation.amountOfParkingSpaces,
      // ... other fields
      
      // Material selections (convert map to object for form state)
      pavementMaterials: Array.from(step5.pavement.materials.keys()),
    }
  })
  
  const onSubmit = (data) => {
    // Update basic info
    step5.updateBasicInformation(data)
    
    // Material selections are already updated via onChange handlers
    
    // Navigate to next step
    assessmentStore.currentAssessment.buildingEnvelope.goToStep("step6")
  }
  
  return (
    <ScrollView>
      {/* Basic Information fields */}
      <Controller
        control={control}
        name="amountOfParkingSpaces"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={String(value)}
            onChangeText={(text) => onChange(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        )}
      />
      
      {/* Dynamic material selection */}
      {pavementMaterials.map(material => (
        <Checkbox
          key={material}
          checked={step5.pavement.materials.has(material)}
          onChange={(checked) => {
            if (checked) {
              step5.pavement.updateMaterial(material, {
                condition: undefined,
                repairStatus: undefined,
                effectiveAge: 0,
                amountToRepair: ""
              })
            } else {
              step5.pavement.removeMaterial(material)
            }
          }}
        >
          {material}
        </Checkbox>
      ))}
      
      {/* Dynamic assessment rows */}
      {Array.from(step5.pavement.materials.entries()).map(([materialType, assessment]) => (
        <AssessmentRow
          key={materialType}
          materialType={materialType}
          assessment={assessment}
          onUpdate={(data) => step5.pavement.updateMaterial(materialType, data)}
        />
      ))}
      
      <Button onPress={handleSubmit(onSubmit)}>Next</Button>
    </ScrollView>
  )
})
```

## Data Structure in MST

```typescript
// What gets stored in the MST store
{
  basicInformation: {
    amountOfParkingSpaces: 150,
    openLotSpaces: 100,
    // ... other static fields
  },
  pavement: {
    materials: {
      "Asphalt": {
        condition: "fair",
        repairStatus: "ST",
        effectiveAge: 12,
        amountToRepair: "25000"
      },
      "Concrete": {
        condition: "good",
        repairStatus: "RR",
        effectiveAge: 8,
        amountToRepair: "5000"
      }
    }
  },
  sidewalksWalkways: {
    NotApplicable: false,
    materials: {
      "Concrete": { condition: "fair", repairStatus: "ST", effectiveAge: 10, amountToRepair: "15000" }
    },
    materialCheckboxes: {
      "Metal": true,
      "Vinyl": true
    },
    railing: "yes",
    railingDetails: {
      railingType: "Metal",
      assessment: {
        condition: "fair",
        repairStatus: "ST",
        amountToRepair: "2000"
      }
    }
  }
}
```

## Querying Data

```typescript
// Get all materials for a category
const allPavementMaterials = Array.from(step5.pavement.materials.keys())
// ["Asphalt", "Concrete"]

// Check if a specific material is selected
const hasAsphalt = step5.pavement.materials.has("Asphalt")

// Get material count
const materialCount = step5.pavement.materials.size

// Get all assessments with material names
const materialAssessments = Array.from(step5.pavement.materials.entries()).map(
  ([materialType, assessment]) => ({
    material: materialType,
    condition: assessment.condition,
    repairStatus: assessment.repairStatus,
    effectiveAge: assessment.effectiveAge,
    amountToRepair: assessment.amountToRepair,
  })
)

// Check if railing is applicable
const hasRailing = step5.sidewalksWalkways.railing === "yes"
if (hasRailing && step5.sidewalksWalkways.railingDetails) {
  console.log(step5.sidewalksWalkways.railingDetails.railingType)
}
```

## Material Type Constants

For consistency across your app, define material type constants:

```typescript
// constants/materialTypes.ts
export const PAVEMENT_MATERIALS = [
  "Gravel",
  "Brick Paver",
  "Asphalt",
  "Concrete",
  "Asphalt Seal Coat/Striping",
  "Concrete striping"
] as const

export const ENTRANCE_APRON_MATERIALS = [
  "N/A",
  "Asphalt",
  "Concrete",
  "Brick Paver",
  "Gravel"
] as const

export const CURBING_MATERIALS = [
  "N/A",
  "Asphalt",
  "Concrete",
  "Stone"
] as const

export const SIDEWALK_MATERIALS = [
  "N/A",
  "Asphalt",
  "Concrete",
  "Brick Paver",
  "Slate Paver",
  "Conc. Paver"
] as const
```

## Tips & Best Practices

1. **Initialize with Empty Assessment**: When adding a material, provide empty assessment to avoid undefined errors:
   ```typescript
   pavement.updateMaterial("Asphalt", {
     condition: undefined,
     repairStatus: undefined,
     effectiveAge: 0,
     amountToRepair: ""
   })
   ```

2. **Use getSnapshot for Updates**: When updating a single field, spread the existing assessment:
   ```typescript
   import { getSnapshot } from "mobx-state-tree"
   
   pavement.updateMaterial(materialType, {
     ...getSnapshot(assessment),
     condition: "fair"  // Only update condition
   })
   ```

3. **Clear Materials on N/A**: The models automatically clear materials when marking as N/A, but you can manually clear if needed:
   ```typescript
   entranceAprons.clearMaterials()
   ```

4. **Validate Before Save**: Check that selected materials have complete assessments:
   ```typescript
   const incompleteMaterials = Array.from(pavement.materials.entries())
     .filter(([_, assessment]) => !assessment.condition || !assessment.repairStatus)
     .map(([materialType, _]) => materialType)
   
   if (incompleteMaterials.length > 0) {
     alert(`Please complete assessments for: ${incompleteMaterials.join(", ")}`)
   }
   ```

5. **Offline Sync**: Maps sync cleanly as key-value pairs. PowerSync will handle them as nested objects in Supabase.

---

This dynamic material pattern keeps your data clean, your UI responsive, and your offline sync simple! 🚀

