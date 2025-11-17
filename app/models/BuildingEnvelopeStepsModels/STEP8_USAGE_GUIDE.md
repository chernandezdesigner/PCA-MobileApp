# Step 8 Usage Guide: Windows

## Overview

Step 8 handles windows with a **checklist pattern** for window types (like ProjectSummaryStore's document checklist) and standard accordions for glazing/panes and frame type.

## Architecture

### Window Type Checklist Pattern
Following the same pattern as `ProjectSummaryStore.updateDocumentChecklist()`:
```typescript
windowsTypeChecklist: types.map(types.boolean)
// Key = window type (e.g., "Vinyl", "Wood", "Aluminum")
// Value = boolean (whether this window type exists)

// Actions
updateWindowType(windowType: string, checked: boolean)
updateAssessment(data)  // Overall assessment for all checked types
clearWindowTypes()
```

### Other Accordions (Standard Pattern)
- **Glazing & Panes**: Simple fields + assessment
- **Frame Type**: Simple field + assessment

## Window Type Options

Common window types:
- Single Hung
- Double Hung
- Casement
- Sliding
- Fixed/Picture
- Awning
- Hopper
- Bay/Bow
- Jalousie
- Skylight

## Usage Examples

### 1. Windows Type Accordion (Checklist Pattern)

```typescript
const { windowsType } = step8

// Check individual window types (like updateDocumentChecklist)
windowsType.updateWindowType("Single Hung", true)
windowsType.updateWindowType("Double Hung", true)
windowsType.updateWindowType("Casement", false)  // Uncheck

// Update the overall assessment for all checked window types
windowsType.updateAssessment({
  condition: "fair",
  repairStatus: "ST",
  amountToRepair: "15000"
})

// Clear all window types
windowsType.clearWindowTypes()

// Check what window types are selected
const selectedWindowTypes = Array.from(windowsType.windowsTypeChecklist.keys())
  .filter(type => windowsType.windowsTypeChecklist.get(type))
// Result: ["Single Hung", "Double Hung"]

// Check if specific window type is selected
const hasCasement = windowsType.windowsTypeChecklist.get("Casement") === true
```

### 2. Glazing & Panes Accordion

```typescript
step8.updateGlazingAndPanes({
  glazingType: "Double Glazed",
  panesType: "Tempered",
  assessment: {
    condition: "good",
    repairStatus: "NA",
    amountToRepair: ""
  }
})
```

### 3. Frame Type Accordion

```typescript
step8.updateFrameType({
  frameType: "Vinyl",
  assessment: {
    condition: "fair",
    repairStatus: "RR",
    amountToRepair: "8000"
  }
})
```

## UI Implementation

### Window Type Checklist (Like Document Checklist)

```jsx
const windowTypes = [
  "Single Hung",
  "Double Hung",
  "Casement",
  "Sliding",
  "Fixed/Picture",
  "Awning",
  "Hopper",
  "Bay/Bow",
  "Jalousie",
  "Skylight"
]

// Render checkboxes
{windowTypes.map(type => (
  <Checkbox
    key={type}
    checked={windowsType.windowsTypeChecklist.get(type) === true}
    label={type}
    onChange={(checked) => {
      windowsType.updateWindowType(type, checked)
    }}
  />
))}

{/* Show assessment section if at least one window type is checked */}
{Array.from(windowsType.windowsTypeChecklist.values()).some(v => v) && (
  <View style={styles.assessmentSection}>
    <Text style={styles.sectionTitle}>Overall Window Assessment</Text>
    <ConditionAssessmentFields
      assessment={windowsType.assessment}
      onUpdate={(data) => windowsType.updateAssessment(data)}
    />
  </View>
)}
```

### Glazing & Panes Section

```jsx
<TextInput
  label="Glazing Type"
  value={glazingAndPanes.glazingType}
  placeholder="e.g., Double Glazed, Single Glazed"
  onChangeText={(text) => {
    step8.updateGlazingAndPanes({
      glazingType: text,
      panesType: glazingAndPanes.panesType,
      assessment: glazingAndPanes.assessment
    })
  }}
/>

<TextInput
  label="Panes Type"
  value={glazingAndPanes.panesType}
  placeholder="e.g., Tempered, Laminated"
  onChangeText={(text) => {
    step8.updateGlazingAndPanes({
      glazingType: glazingAndPanes.glazingType,
      panesType: text,
      assessment: glazingAndPanes.assessment
    })
  }}
/>

<ConditionAssessmentFields
  assessment={glazingAndPanes.assessment}
  onUpdate={(data) => {
    step8.updateGlazingAndPanes({
      glazingType: glazingAndPanes.glazingType,
      panesType: glazingAndPanes.panesType,
      assessment: data
    })
  }}
/>
```

## Data Structure in MST

```typescript
{
  windowsType: {
    windowsTypeChecklist: {
      "Single Hung": true,
      "Double Hung": true,
      "Casement": false,
      "Sliding": true
    },
    assessment: {
      condition: "fair",
      repairStatus: "ST",
      amountToRepair: "15000"
    }
  },
  glazingAndPanes: {
    glazingType: "Double Glazed",
    panesType: "Tempered",
    assessment: {
      condition: "good",
      repairStatus: "NA",
      amountToRepair: ""
    }
  },
  frameType: {
    frameType: "Vinyl",
    assessment: {
      condition: "fair",
      repairStatus: "RR",
      amountToRepair: "8000"
    }
  }
}
```

## Querying Data

```typescript
// Get all checked window types
const checkedTypes = Array.from(step8.windowsType.windowsTypeChecklist.entries())
  .filter(([_, checked]) => checked)
  .map(([type, _]) => type)
// Result: ["Single Hung", "Double Hung", "Sliding"]

// Count how many window types are checked
const typeCount = Array.from(step8.windowsType.windowsTypeChecklist.values())
  .filter(v => v).length

// Check if any window types are selected
const hasWindowTypes = Array.from(step8.windowsType.windowsTypeChecklist.values())
  .some(v => v)

// Get window type names as comma-separated string
const typeNames = Array.from(step8.windowsType.windowsTypeChecklist.entries())
  .filter(([_, checked]) => checked)
  .map(([type, _]) => type)
  .join(", ")
// Result: "Single Hung, Double Hung, Sliding"
```

## React Hook Form Integration

```typescript
import { useForm } from "react-hook-form"
import { observer } from "mobx-react-lite"

const Step8Screen = observer(() => {
  const { assessmentStore } = useStores()
  const step8 = assessmentStore.currentAssessment.buildingEnvelope.step8
  
  const onSubmit = () => {
    // Window types are already saved via direct method calls
    // Navigate to next step
    assessmentStore.currentAssessment.buildingEnvelope.goToStep("step9")
  }
  
  return (
    <ScrollView>
      {/* Window Type Checklist */}
      <Accordion title="Windows Type">
        {windowTypes.map(type => (
          <Checkbox
            key={type}
            checked={step8.windowsType.windowsTypeChecklist.get(type) === true}
            label={type}
            onChange={(checked) => {
              step8.windowsType.updateWindowType(type, checked)
            }}
          />
        ))}
        
        {/* Overall assessment for all checked types */}
        {Array.from(step8.windowsType.windowsTypeChecklist.values()).some(v => v) && (
          <ConditionAssessmentFields
            assessment={step8.windowsType.assessment}
            onUpdate={(data) => step8.windowsType.updateAssessment(data)}
          />
        )}
      </Accordion>
      
      {/* Glazing & Panes */}
      <Accordion title="Glazing & Panes">
        <TextInput
          label="Glazing Type"
          value={step8.glazingAndPanes.glazingType}
          onChangeText={(text) => {
            step8.updateGlazingAndPanes({
              glazingType: text,
              panesType: step8.glazingAndPanes.panesType,
              assessment: step8.glazingAndPanes.assessment
            })
          }}
        />
        {/* ... */}
      </Accordion>
      
      {/* Frame Type */}
      <Accordion title="Frame Type">
        <TextInput
          label="Frame Type"
          value={step8.frameType.frameType}
          onChangeText={(text) => {
            step8.updateFrameType({
              frameType: text,
              assessment: step8.frameType.assessment
            })
          }}
        />
        {/* ... */}
      </Accordion>
      
      <Button onPress={onSubmit}>Next Step</Button>
    </ScrollView>
  )
})
```

## Validation Examples

```typescript
// Ensure at least one window type is selected
const validateWindowTypes = () => {
  const hasCheckedTypes = Array.from(step8.windowsType.windowsTypeChecklist.values())
    .some(v => v)
  
  if (!hasCheckedTypes) {
    return "Please select at least one window type"
  }
  
  // If window types are checked, ensure assessment is complete
  if (hasCheckedTypes) {
    const { condition, repairStatus } = step8.windowsType.assessment
    if (!condition || !repairStatus) {
      return "Please complete the window assessment"
    }
  }
  
  return null // Valid
}
```

## Key Differences from Other Steps

| Feature | Step8 Windows | Other Steps |
|---------|---------------|-------------|
| Window Type Selection | ✅ Checklist pattern (map of booleans) | N/A |
| Assessment Scope | One assessment for ALL checked window types | One assessment per item |
| Update Pattern | Individual: `updateWindowType(type, checked)` | Batch: `update({ fields... })` |
| Similar To | ProjectSummaryStore.updateDocumentChecklist | Standard accordion pattern |

## Benefits

✅ **Familiar Pattern** - Same as document checklist in ProjectSummary
✅ **Flexible** - Easy to add/remove window types
✅ **Clean Data** - Only stores checked types
✅ **Simple Assessment** - One assessment covers all window types (makes sense for windows)
✅ **Type-Safe** - Full TypeScript support

---

The checklist pattern is perfect for window types since you're tracking which types exist, then giving an overall assessment for the windows as a whole! 🪟

