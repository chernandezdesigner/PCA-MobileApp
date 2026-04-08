# PCA Mobile App - Claude Code Configuration

## Project Overview
Offline-first Property Condition Assessment (PCA) mobile app for field inspectors built with React Native, TypeScript, Ignite boilerplate, MobX-State-Tree, React Hook Form, and Supabase.

## Tech Stack
- React Native with Expo
- TypeScript (strict mode)
- MobX-State-Tree (MST) for state management
- React Hook Form for form handling
- Supabase (PostgreSQL + Storage + Auth)
- MMKV for local persistence

## Architecture

### Directory Structure
app/
├── components/ # Reusable UI components
├── constants/ # Form options and enums
├── models/ # MST stores and models
│ ├── StepModels/ # Per-form step models
│ └── Store.ts # Form-level stores
├── navigators/ # React Navigation stacks
├── screens/ # Screen components
│ └── Form/ # Per-form screen folders
├── services/ # API and external services
└── theme/ # Styling and theming


### Data Flow
1. User interacts with form → React Hook Form (transient state)
2. On navigation/save → MST Store (business logic + local state)
3. MST persists to → MMKV Storage (survives app restart)
4. On submit → Supabase (cloud sync)

### Assessment States
- `draft`: Local only, editable
- `submitted`: Uploaded to Supabase
- `synced`: Fully synced via PowerSync (future)

## Coding Standards

### MST Model Pattern
export const AccordionModel = types.model("AccordionName", {
  NotApplicable: types.optional(types.boolean, false),
  items: types.optional(types.array(types.string), []),
  otherSpecification: types.optional(types.string, ""),
  assessment: types.optional(ConditionAssessment, {}),
  effectiveAge: types.optional(types.number, 0),
})
.actions((self) => ({
  updateAccordion(data: { /* typed params */ }) {
    // Update logic with lastModified touch
  },
}))


## Screen Pattern 
export const StepScreen: FC<Props> = observer(() => {
  const { themed } = useAppTheme()
  const rootStore = useStores()
  const store = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)?.formStore.step
    : undefined
  const [openKey, setOpenKey] = useState<string | null>(null)
  
  return (
    <Screen style={$root} preset="fixed">
      <View style={$stickyHeader}>
        <HeaderBar title="Form Name" />
      </View>
      <ScrollView>
        <ProgressBar current={N} total={TOTAL} />
        {/* Accordions */}
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav />
      </View>
    </Screen>
  )
})

## Constants Pattern 
export const OPTION_NAME = [
  { id: "optionId", label: "Option Label" },
] as const

export type OptionId = typeof OPTION_NAME[number]["id"]

## Forms Structure
Project Summary (4 steps) - Property info, contacts, dates
Site Grounds (4 steps) - Exterior site conditions
Building Envelope (10 steps) - Structure, roofing, walls
Mechanical Systems (9 steps) - HVAC, plumbing, electrical
Interior Conditions (4 steps) - Finishes, common areas, mold, alt properties

## Current Task: V1 Pre-Launch Sprint (2026-04-01)

### Task 1 — Hotels/Apartments Unit Types & Units Observed (HIGH)
Add dynamic unit types table + 16-row units observed table to InteriorConditionsStep4 for Hotel and Apartment property types, matching the HOTELS/APARTMENTS supplement PDF field format.
- **backend-agent**: MST models first (UnitTypeRowModel, UnitObservedRowModel, add to step4-hotel.ts + step4-apartment.ts)
- **frontend-agent**: UI after models complete (table rows, status chips, add/remove buttons in SectionAccordion)

### Task 2 — Pre-Launch Codebase Audit (HIGH)
Full audit of screens, models, services, and Supabase for bugs, worst practices, and v1 gaps.
- **continuity-agent**: Screen + component audit
- **backend-agent**: MST model + Supabase audit (via MCP)

### Task 3 — CSS/Styling Consistency Audit (MEDIUM)
Audit all styles for hardcoded colors, unused style constants, missing themed() wrappers.
- **continuity-agent**: Runs in parallel with Task 2

### Agent Execution Order
1. backend-agent: Task 1A (MST models) → notify frontend-agent when done
2. frontend-agent: Task 1B (UI) — starts after backend-agent completes Task 1A
3. continuity-agent: Tasks 2A + 3 (screen audit + style audit) — runs in parallel
4. backend-agent: Task 2B (Supabase audit) — runs in parallel
5. continuity-agent: Task 2C (QA review of Task 1 output) — runs last


## Important Rules
ALWAYS use existing components from app/components/
ALWAYS follow MST patterns from existing step models
NEVER create duplicate components
ALWAYS import from @/ alias paths
ALWAYS wrap screens with observer()
ALWAYS use themed() for styles