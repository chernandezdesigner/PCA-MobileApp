# Step 7 Usage Guide: Building Stairs, Balconies & Patios

## Overview

Step 7 handles stairs (exterior/interior), balconies, and patios/plaza with:
- **Stairs (Exterior/Interior)**: Simple static accordions - materialType + assessment + nested railing
- **Balconies**: Dynamic material selection + optional assessment items (cantilever, integral, ext, coating) + nested railing
- **Patios/Plaza**: Dynamic material selection + nested railing
- **Shared RailingDetailsModel** across all 4 accordions (railingType + balusterSpacing + assessment)

## Architecture

### Stairs (Simple Static Pattern)
Stairs Exterior and Stairs Interior use simple static fields:
```typescript
NotApplicable: boolean
materialType: string  // e.g., "Concrete (cast in-place)", "Wood", "Steel"
assessment: ConditionAssessment
railing: "yes" | "no"
railingDetails: RailingDetailsModel (optional)
```

### Balconies & Patios/Plaza (Dynamic Material Pattern)
Balconies and Patios use dynamic material selection:
```typescript
materials: types.map(ConditionAssessment)
```

### Railing Model
Follows the same pattern as step2.ts:
- `railingType` (string) - e.g., "Steel", "Wood", "Metal"
- `balusterSpacing` (string)
- `assessment` (ConditionAssessment)

### Optional Assessment Items (Balconies Only)
Cantilever, Integral, Ext, and Coating each have:
- `applicable` (boolean) - whether this item exists
- `assessment` (ConditionAssessment) - condition details if applicable

## Material Type Options

Based on the form:

**Stairs Exterior:**
- Concrete (cast in-place)
- Wood
- Steel
- Pre-cast concrete treads
- Metal pans w/ concrete fill

**Stairs Interior:**
- Concrete (cast in-place)
- Wood
- Steel
- Pre-cast concrete treads
- Metal pans w/ concrete fill

**Balconies:**
- Concrete (cast in-place)
- Concrete (pre-cast)
- Steel
- Wood

**Patios/Plaza:**
- Concrete (pavers)
- Concrete (cast in-place)
- Brick pavers
- Wood

## Usage Examples

### 1. Stairs Exterior Accordion (Simple Static)

```typescript
const { stairsExterior } = step7

// Update all fields at once
step7.updateStairsExterior({
  NotApplicable: false,
  materialType: "Concrete (cast in-place)",
  assessment: {
    condition: "fair",
    repairStatus: "ST",
    amountToRepair: "12000"
  },
  railing: "yes",
  railingDetails: {
    railingType: "Steel",
    balusterSpacing: "4 inches",
    assessment: {
      condition: "fair",
      repairStatus: "ST",
      amountToRepair: "3000"
    }
  }
})

// Or update individual fields
step7.updateStairsExterior({
  materialType: "Steel"
})

step7.updateStairsExterior({
  assessment: {
    condition: "good",
    repairStatus: "RR",
    amountToRepair: "8000"
  }
})

// Mark as N/A
step7.updateStairsExterior({
  NotApplicable: true
})
```

### 2. Stairs Interior Accordion (Simple Static)

```typescript
const { stairsInterior } = step7

// Same pattern as exterior stairs
step7.updateStairsInterior({
  NotApplicable: false,
  materialType: "Wood",
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  },
  railing: "yes",
  railingDetails: {
    railingType: "Wood",
    balusterSpacing: "6 inches",
    assessment: {
      condition: "good",
      repairStatus: "NA",
      amountToRepair: ""
    }
  }
})
```

### 3. Balconies Accordion (with Additional Assessment Items)

```typescript
const { balconies } = step7

// Add materials
balconies.updateMaterial("Concrete (cast in-place)", {
  condition: "fair",
  repairStatus: "ST",
  amountToRepair: "8000"
})

balconies.updateMaterial("Steel", {
  condition: "good",
  repairStatus: "RR",
  amountToRepair: "2000"
})

// Update optional assessment items (each has applicable flag + assessment)
balconies.updateCantilever({
  applicable: true,
  assessment: {
    condition: "fair",
    repairStatus: "ST",
    amountToRepair: "5000"
  }
})

balconies.updateIntegral({
  applicable: false,
  assessment: {}
})

balconies.updateExt({
  applicable: true,
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  }
})

balconies.updateCoating({
  applicable: true,
  assessment: {
    condition: "poor",
    repairStatus: "IR",
    amountToRepair: "12000"
  }
})

// Add railing
balconies.updateRailing("yes")
balconies.updateRailingDetails({
  railingType: "Steel",
  balusterSpacing: "5 inches",
  assessment: {
    condition: "fair",
    repairStatus: "ST",
    amountToRepair: "4000"
  }
})
```

### 4. Patios/Plaza Accordion

```typescript
const { patiosPlaza } = step7

patiosPlaza.updateMaterial("Concrete (pavers)", {
  condition: "good",
  repairStatus: "RR",
  amountToRepair: "3000"
})

patiosPlaza.updateMaterial("Brick pavers", {
  condition: "fair",
  repairStatus: "ST",
  amountToRepair: "6000"
})

patiosPlaza.updateRailing("yes")
patiosPlaza.updateRailingDetails({
  railingType: "Steel and Wood",
  balusterSpacing: "4.5 inches",
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  }
})
```

## UI Implementation Patterns

### Pattern 1: Material Selection with Checkboxes

```jsx
const stairsMaterials = [
  "Concrete (cast in-place)",
  "Wood",
  "Steel",
  "Pre-cast concrete treads",
  "Metal pans w/ concrete fill"
]

// Render material checkboxes
{stairsMaterials.map(material => (
  <Checkbox
    key={material}
    checked={stairsExterior.materials.has(material)}
    label={material}
    onChange={(checked) => {
      if (checked) {
        stairsExterior.updateMaterial(material, {
          condition: undefined,
          repairStatus: undefined,
          amountToRepair: ""
        })
      } else {
        stairsExterior.removeMaterial(material)
      }
    }}
  />
))}

// Render assessment rows for selected materials
{Array.from(stairsExterior.materials.entries()).map(([materialType, assessment]) => (
  <AssessmentRow
    key={materialType}
    label={materialType}
    assessment={assessment}
    onUpdate={(data) => stairsExterior.updateMaterial(materialType, data)}
  />
))}
```

### Pattern 2: Railing Section

```jsx
// Railing Yes/No toggle
<RadioGroup
  value={stairsExterior.railing}
  onValueChange={(value) => stairsExterior.updateRailing(value)}
>
  <Radio value="yes">Yes</Radio>
  <Radio value="no">No</Radio>
</RadioGroup>

{/* Show railing details when "yes" is selected */}
{stairsExterior.railing === "yes" && (
  <View style={styles.nestedSection}>
    <Text style={styles.sectionTitle}>Railing Details</Text>
    
    {/* Railing Type input */}
    <TextInput
      label="Railing Type"
      value={stairsExterior.railingDetails?.railingType || ""}
      placeholder='e.g., "Steel", "Wood", "Metal"'
      onChangeText={(text) => {
        stairsExterior.updateRailingDetails({
          railingType: text,
          balusterSpacing: stairsExterior.railingDetails?.balusterSpacing || "",
          assessment: stairsExterior.railingDetails?.assessment || {}
        })
      }}
    />
    
    {/* Baluster spacing input */}
    <TextInput
      label="Baluster Spacing"
      value={stairsExterior.railingDetails?.balusterSpacing || ""}
      placeholder='e.g., "4 inches"'
      onChangeText={(text) => {
        stairsExterior.updateRailingDetails({
          railingType: stairsExterior.railingDetails?.railingType || "",
          balusterSpacing: text,
          assessment: stairsExterior.railingDetails?.assessment || {}
        })
      }}
    />
    
    {/* Railing condition assessment */}
    <Text style={styles.subsectionTitle}>Railing Condition</Text>
    <ConditionAssessmentFields
      assessment={stairsExterior.railingDetails?.assessment}
      onUpdate={(data) => {
        stairsExterior.updateRailingDetails({
          railingType: stairsExterior.railingDetails?.railingType || "",
          balusterSpacing: stairsExterior.railingDetails?.balusterSpacing || "",
          assessment: data
        })
      }}
    />
  </View>
)}
```

### Pattern 3: Balconies Optional Assessment Items

```jsx
// Cantilever - Checkbox + Assessment
<Checkbox
  checked={balconies.cantilever.applicable}
  label="Cantilever"
  onChange={(checked) => {
    balconies.updateCantilever({
      applicable: checked,
      assessment: checked ? {} : balconies.cantilever.assessment
    })
  }}
/>
{balconies.cantilever.applicable && (
  <ConditionAssessmentFields
    assessment={balconies.cantilever.assessment}
    onUpdate={(data) => {
      balconies.updateCantilever({
        applicable: true,
        assessment: data
      })
    }}
  />
)}

// Integral - Checkbox + Assessment
<Checkbox
  checked={balconies.integral.applicable}
  label="Integral"
  onChange={(checked) => {
    balconies.updateIntegral({
      applicable: checked,
      assessment: checked ? {} : balconies.integral.assessment
    })
  }}
/>
{balconies.integral.applicable && (
  <ConditionAssessmentFields
    assessment={balconies.integral.assessment}
    onUpdate={(data) => {
      balconies.updateIntegral({
        applicable: true,
        assessment: data
      })
    }}
  />
)}

// Ext - Checkbox + Assessment
<Checkbox
  checked={balconies.ext.applicable}
  label="Ext"
  onChange={(checked) => {
    balconies.updateExt({
      applicable: checked,
      assessment: checked ? {} : balconies.ext.assessment
    })
  }}
/>
{balconies.ext.applicable && (
  <ConditionAssessmentFields
    assessment={balconies.ext.assessment}
    onUpdate={(data) => {
      balconies.updateExt({
        applicable: true,
        assessment: data
      })
    }}
  />
)}

// Coating - Checkbox + Assessment
<Checkbox
  checked={balconies.coating.applicable}
  label="Coating"
  onChange={(checked) => {
    balconies.updateCoating({
      applicable: checked,
      assessment: checked ? {} : balconies.coating.assessment
    })
  }}
/>
{balconies.coating.applicable && (
  <ConditionAssessmentFields
    assessment={balconies.coating.assessment}
    onUpdate={(data) => {
      balconies.updateCoating({
        applicable: true,
        assessment: data
      })
    }}
  />
)}
```

## React Hook Form Integration

```typescript
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

const Step7Screen = observer(() => {
  const { assessmentStore } = useStores()
  const step7 = assessmentStore.currentAssessment.buildingEnvelope.step7
  
  const onSubmit = () => {
    // Materials are already saved via direct method calls
    // Just navigate to next step
    assessmentStore.currentAssessment.buildingEnvelope.goToStep("step8")
  }
  
  return (
    <ScrollView>
      {/* Stairs Exterior Accordion */}
      <Accordion title="Stairs Exterior (connected to building)">
        {/* N/A toggle */}
        <Checkbox
          checked={step7.stairsExterior.NotApplicable}
          label="Not Applicable"
          onChange={(checked) => step7.stairsExterior.updateNotApplicable(checked)}
        />
        
        {!step7.stairsExterior.NotApplicable && (
          <>
            {/* Material checkboxes + dynamic assessment rows */}
            {stairsMaterials.map(material => (
              <MaterialRow
                key={material}
                material={material}
                accordion={step7.stairsExterior}
              />
            ))}
            
            {/* Railing section */}
            <RailingSection accordion={step7.stairsExterior} />
          </>
        )}
      </Accordion>
      
      {/* Other accordions... */}
      
      <Button onPress={onSubmit}>Next Step</Button>
    </ScrollView>
  )
})
```

## Data Structure in MST

```typescript
{
  stairsExterior: {
    NotApplicable: false,
    materials: {
      "Concrete (cast in-place)": {
        condition: "fair",
        repairStatus: "ST",
        amountToRepair: "12000"
      },
      "Steel": {
        condition: "good",
        repairStatus: "RR",
        amountToRepair: "5000"
      }
    },
    railing: "yes",
    railingDetails: {
      steel: true,
      wood: false,
      balusterSpacing: "4 inches",
      assessment: {
        condition: "fair",
        repairStatus: "ST",
        amountToRepair: "3000"
      }
    }
  },
  balconies: {
    NotApplicable: false,
    materials: {
      "Concrete (cast in-place)": { condition: "fair", repairStatus: "ST", amountToRepair: "8000" }
    },
    cantilever: true,
    integral: false,
    ext: true,
    coating: false,
    railing: "yes",
    railingDetails: {
      steel: true,
      wood: true,
      balusterSpacing: "5 inches",
      assessment: { condition: "fair", repairStatus: "ST", amountToRepair: "4000" }
    }
  }
}
```

## Querying Data

```typescript
// Get all selected materials for an accordion
const exteriorStairMaterials = Array.from(step7.stairsExterior.materials.keys())
// ["Concrete (cast in-place)", "Steel"]

// Check if railing is present
const hasRailing = step7.stairsExterior.railing === "yes"

// Get railing details if present
if (hasRailing && step7.stairsExterior.railingDetails) {
  const { steel, wood, balusterSpacing, assessment } = step7.stairsExterior.railingDetails
  console.log(`Steel: ${steel}, Wood: ${wood}, Spacing: ${balusterSpacing}`)
  console.log(`Railing condition: ${assessment.condition}`)
}

// Check balcony options
const { cantilever, integral, ext, coating } = step7.balconies
console.log(`Cantilever: ${cantilever}, Integral: ${integral}`)

// Get all materials across all accordions
const allMaterials = {
  stairsExterior: Array.from(step7.stairsExterior.materials.keys()),
  stairsInterior: Array.from(step7.stairsInterior.materials.keys()),
  balconies: Array.from(step7.balconies.materials.keys()),
  patiosPlaza: Array.from(step7.patiosPlaza.materials.keys()),
}
```

## Validation Examples

```typescript
// Ensure at least one material is selected if not N/A
const validateStairsExterior = () => {
  if (!step7.stairsExterior.NotApplicable) {
    if (step7.stairsExterior.materials.size === 0) {
      return "Please select at least one material type or mark as N/A"
    }
    
    // Check that all selected materials have complete assessments
    for (const [materialType, assessment] of step7.stairsExterior.materials.entries()) {
      if (!assessment.condition || !assessment.repairStatus) {
        return `Please complete assessment for ${materialType}`
      }
    }
    
    // If railing is yes, ensure railing details are complete
    if (step7.stairsExterior.railing === "yes") {
      const { railingDetails } = step7.stairsExterior
      if (!railingDetails || (!railingDetails.steel && !railingDetails.wood)) {
        return "Please select Steel or Wood for railing"
      }
      if (!railingDetails.balusterSpacing) {
        return "Please enter baluster spacing"
      }
      if (!railingDetails.assessment.condition || !railingDetails.assessment.repairStatus) {
        return "Please complete railing assessment"
      }
    }
  }
  return null // Valid
}
```

## Key Differences from Other Steps

| Feature | Step7 | Previous Steps |
|---------|-------|----------------|
| Material Storage | Dynamic map | Static fields |
| Railing Model | Steel/Wood checkboxes + spacing + assessment | Just type + assessment |
| Railing Shared | RailingDetailsModel used by all 4 accordions | Each step had own railing model |
| Additional Options | Balconies has cantilever/integral/ext/coating | N/A |
| Update Pattern | Direct methods on accordions | Wrapper methods on step |

## Benefits

✅ **Dynamic Materials** - Only stores what's checked
✅ **Enhanced Railings** - Captures Steel/Wood + spacing + assessment
✅ **Code Reuse** - Single RailingDetailsModel for all accordions
✅ **Flexible** - Easy to add new material types
✅ **Clean Data** - No empty objects in store
✅ **Offline-Friendly** - Simple map structure

---

Step 7 combines the best of both worlds: dynamic material selection from step5 and nested assessments from step2, with an enhanced railing model! 🚀

