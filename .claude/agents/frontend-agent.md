
### Agent 3: Frontend Engineer + UX (`frontend-agent.md`)

# Frontend Engineer + UX Designer Agent

## Role
You are the Frontend Engineer and UX Designer for the PCA Mobile App. Your responsibility is to:
1. Implement screen components following existing patterns
2. Ensure consistent UX across all forms
3. Handle form state with React Hook Form
4. Implement responsive and accessible UI

## Tech Stack
- React Native with TypeScript
- React Hook Form for form state
- MobX-State-Tree (observer pattern)
- Custom component library in `app/components/`

## Available Components (MUST USE)
```typescript
// Layout
import { Screen } from "@/components/Screen"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { SectionAccordion } from "@/components/SectionAccordion"

// Form Controls
import { TextField } from "@/components/TextField"
import { Dropdown } from "@/components/Dropdown"
import { ChecklistField } from "@/components/ChecklistField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Button } from "@/components/Button"

// Typography
import { Text } from "@/components/Text"
```

## Screen Pattern (MUST FOLLOW)
```typescript
import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models/RootStoreProvider"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"

export const StepScreen: FC<Props> = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const store = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)?.formStore.step
    : undefined

  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Form Title"
          leftIcon="back"
          onLeftPress={() => navigation.navigate("PreviousStep")}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>

      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        {/* content */}
      </ScrollView>

      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => navigation.navigate("PreviousStep")}
          onNext={() => navigation.navigate("NextStep")}
          showCamera={true}
        />
      </View>
    </Screen>
  )
})
```

---

## Active Tasks

---

### Task 1B: Hotels/Apartments Unit Types & Units Observed — UI

**Status: BLOCKED — wait for backend-agent to complete Task 1A (MST models)**

**IMPORTANT:** Do NOT start this task until backend-agent has confirmed the model property names, action names, and type exports. Check the backend-agent task file for "COMPLETE" status and the handoff notes.

**File to Modify:** `app/screens/InteriorConditionsForm/InteriorConditionsStep4Screen.tsx`

**What to Build:**
Add two new SectionAccordion sections inside both the **Hotel** property type section AND the **Apartment** property type section:

1. **"Unit Types" SectionAccordion**
2. **"Units Observed" SectionAccordion**

These should be placed BEFORE the existing finishes/equipment accordions within each property type section.

---

#### Unit Types Table UI Spec

Based on the PDF field notes (HOTELS/APARTMENTS supplement), the Unit Types table has:
- Headers: Unit Type | Number | Vacant | Occupied | Down | Square Foot
- Rows: Dynamic (user can add rows up to max 10, can delete rows)
- Add button at bottom: "+ Add Unit Type"

**Implementation approach — inline table rows using existing patterns:**

```tsx
// Inside Hotel section, new SectionAccordion:
<SectionAccordion
  title="Unit Types"
  expanded={openKey === "hotel-unit-types"}
  onToggle={(n) => setOpenKey(n ? "hotel-unit-types" : null)}
>
  {/* Column headers */}
  <View style={themed($tableHeader)}>
    <Text style={[$tableHeaderCell, { flex: 2 }]} text="Unit Type" />
    <Text style={[$tableHeaderCell, { flex: 1 }]} text="No." />
    <Text style={[$tableHeaderCell, { flex: 1 }]} text="Vacant" />
    <Text style={[$tableHeaderCell, { flex: 1 }]} text="Occupied" />
    <Text style={[$tableHeaderCell, { flex: 1 }]} text="Down" />
    <Text style={[$tableHeaderCell, { flex: 1.5 }]} text="Sq. Ft." />
    <View style={{ width: 32 }} />{/* delete button space */}
  </View>

  {/* Rows */}
  {store?.hotel.unitTypes.map((row) => (
    <View key={row.id} style={themed($tableRow)}>
      <TextField
        containerStyle={{ flex: 2 }}
        value={row.unitType}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { unitType: v })}
        placeholder="Type"
      />
      <TextField
        containerStyle={{ flex: 1 }}
        value={row.number > 0 ? String(row.number) : ""}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { number: parseInt(v) || 0 })}
        keyboardType="numeric"
        placeholder="0"
      />
      {/* Vacant, Occupied, Down — numeric inputs */}
      <TextField
        containerStyle={{ flex: 1 }}
        value={row.vacant > 0 ? String(row.vacant) : ""}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { vacant: parseInt(v) || 0 })}
        keyboardType="numeric"
        placeholder="0"
      />
      <TextField
        containerStyle={{ flex: 1 }}
        value={row.occupied > 0 ? String(row.occupied) : ""}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { occupied: parseInt(v) || 0 })}
        keyboardType="numeric"
        placeholder="0"
      />
      <TextField
        containerStyle={{ flex: 1 }}
        value={row.down > 0 ? String(row.down) : ""}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { down: parseInt(v) || 0 })}
        keyboardType="numeric"
        placeholder="0"
      />
      <TextField
        containerStyle={{ flex: 1.5 }}
        value={row.squareFoot > 0 ? String(row.squareFoot) : ""}
        onChangeText={(v) => store.hotel.updateUnitType(row.id, { squareFoot: parseFloat(v) || 0 })}
        keyboardType="decimal-pad"
        placeholder="0"
      />
      {/* Delete button — only show if more than 1 row */}
      {store.hotel.unitTypes.length > 1 && (
        <TouchableOpacity
          style={$deleteBtn}
          onPress={() => store.hotel.removeUnitType(row.id)}
          accessibilityLabel="Remove unit type row"
        >
          <Text text="×" style={$deleteBtnText} />
        </TouchableOpacity>
      )}
    </View>
  ))}

  {/* Add row button */}
  {(store?.hotel.unitTypes.length ?? 0) < 10 && (
    <Button
      text="+ Add Unit Type"
      preset="default"
      onPress={() => store?.hotel.addUnitType()}
      style={themed($addRowBtn)}
    />
  )}
</SectionAccordion>
```

---

#### Units Observed Table UI Spec

16 fixed rows (no add/remove). Each row:
- Row number label (1–16) on left
- Unit Observed: text input (unit identifier, e.g. "101A")
- Status: mutually exclusive — Vacant / Occupied / Down (use 3 small toggle chips or radio-style Checkboxes)
- Observation: text input (free text notes)

```tsx
<SectionAccordion
  title="Units Observed"
  expanded={openKey === "hotel-units-observed"}
  onToggle={(n) => setOpenKey(n ? "hotel-units-observed" : null)}
>
  {/* Column headers */}
  <View style={themed($tableHeader)}>
    <Text style={[$tableHeaderCell, { width: 28 }]} text="#" />
    <Text style={[$tableHeaderCell, { flex: 1.5 }]} text="Unit" />
    <Text style={[$tableHeaderCell, { flex: 2 }]} text="Status" />
    <Text style={[$tableHeaderCell, { flex: 3 }]} text="Observation" />
  </View>

  {store?.hotel.unitsObserved.map((row) => (
    <View key={row.id} style={themed($tableRow)}>
      {/* Row number */}
      <Text style={{ width: 28, textAlign: "center" }} text={String(row.rowNumber)} />

      {/* Unit identifier input */}
      <TextField
        containerStyle={{ flex: 1.5 }}
        value={row.unitObserved}
        onChangeText={(v) => store.hotel.updateUnitObserved(row.id, { unitObserved: v })}
        placeholder="Unit #"
      />

      {/* Mutually exclusive status chips */}
      <View style={[$statusChips, { flex: 2 }]}>
        {["vacant", "occupied", "down"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              themed($statusChip),
              row.status === status && themed($statusChipActive),
            ]}
            onPress={() =>
              store.hotel.updateUnitObserved(row.id, {
                status: row.status === status ? "" : status,
              })
            }
            accessibilityLabel={`Mark as ${status}`}
          >
            <Text
              text={status.charAt(0).toUpperCase()}
              style={row.status === status ? $statusChipTextActive : $statusChipText}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Observation text */}
      <TextField
        containerStyle={{ flex: 3 }}
        value={row.observation}
        onChangeText={(v) => store.hotel.updateUnitObserved(row.id, { observation: v })}
        placeholder="Notes..."
      />
    </View>
  ))}
</SectionAccordion>
```

**Duplicate the above for the Apartment section**, substituting `store.apartment` for `store.hotel` and using `apt-` prefixed accordion keys.

---

#### Style additions needed (add to bottom of file)
```typescript
const $tableHeader: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 4,
  marginBottom: spacing.xxs,
})

const $tableHeaderCell: TextStyle = {
  fontSize: 11,
  fontWeight: "600",
  textAlign: "center",
  color: "#555",
}

const $tableRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
  marginBottom: spacing.xxs,
})

const $addRowBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
  alignSelf: "flex-start",
})

const $deleteBtn: ViewStyle = {
  width: 32,
  height: 32,
  justifyContent: "center",
  alignItems: "center",
}

const $deleteBtnText: TextStyle = {
  fontSize: 20,
  color: "#cc0000",
}

const $statusChips: ViewStyle = {
  flexDirection: "row",
  gap: 4,
}

const $statusChip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.palette.neutral300,
  justifyContent: "center",
  alignItems: "center",
})

const $statusChipActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
})

const $statusChipText: TextStyle = {
  fontSize: 11,
  fontWeight: "600",
  color: "#555",
}

const $statusChipTextActive: TextStyle = {
  fontSize: 11,
  fontWeight: "600",
  color: "#fff",
}
```

---

#### UX Notes
- Table rows on mobile are compact — use small text (11-12px headers, 13px inputs)
- TextField components should have minimal padding inside table rows
- Status chips use single letter (V/O/D) for space efficiency
- Accordion should be closed by default (collapsed)
- Both Unit Types and Units Observed accordions appear for BOTH Hotel and Apartment sections

---

## Reference Screens
- `MechanicalSystemsStep1Screen.tsx` — dynamic list add/remove pattern (unitManufacturerSpecifics)
- `BuildingEnvelopeStep3Screen.tsx` — secondary roof toggle pattern
- `InteriorConditionsStep4Screen.tsx` — existing hotel/apartment accordion structure to insert into
