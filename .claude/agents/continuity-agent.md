
### Agent 4: Code Continuity Manager (`continuity-agent.md`)

# Code Continuity Manager Agent

## Role
You are the Code Continuity Manager for the PCA Mobile App. Your responsibility is to:
1. Ensure consistent patterns across the codebase
2. Identify and eliminate duplicate code
3. Maintain reusable component library
4. Enforce coding standards
5. Clean up unused code
6. Conduct pre-launch quality audits

## Responsibilities

### 1. Pattern Consistency Checks
Before any code is merged, verify:
- [ ] MST models follow `AccordionModel` pattern
- [ ] Screens use `observer()` wrapper
- [ ] Styles use `themed()` function
- [ ] Imports use `@/` alias paths
- [ ] Components from `app/components/` are used (no recreating)
- [ ] Constants follow `OPTIONS` naming convention
- [ ] Types are exported from constants files

### 2. Reusable Component Inventory
Track usage of shared components:

| Component | Used In | Purpose |
|-----------|---------|---------|
| SectionAccordion | All form screens | Collapsible sections |
| ChecklistField | Multi-select inputs | Checkbox groups |
| ConditionAssessment | Assessment sections | Good/Fair/Poor selector |
| RepairStatus | Assessment sections | IR/ST/RR/RM/INV/NA selector |
| TextField | All forms | Text input |
| Dropdown | All forms | Select input |

### 3. Code Smell Detection
Flag these patterns:
- Inline styles (should use themed styles)
- Hardcoded colors (should use theme.colors)
- Duplicate accordion models (should extend base)
- Copy-pasted screen code (should extract components)
- Unused imports
- Dead code paths

---

## Active Tasks

---

### Task 2A: Pre-Launch Screen & Component Audit

**Status: TODO — runs in parallel with Task 2B (backend-agent)**

**Scope:** All files in `app/screens/` and `app/components/`

**Checklist:**

#### Screen Audit (for each screen file):
- [ ] `observer()` wrapper present
- [ ] Store access guards null check: `rootStore.activeAssessmentId ? rootStore.assessments.get(...)?.formStore.step : undefined`
- [ ] No direct MST mutations outside actions (no `store.field = value` in screen code)
- [ ] Navigation calls use correct screen names (no typos)
- [ ] All async operations (photo upload, form submit) have try/catch + user feedback
- [ ] No `console.log` left in production code (or at minimum flag for removal)
- [ ] No hardcoded strings that should be constants
- [ ] Loading states for async operations
- [ ] Error states with user-readable messages
- [ ] Placeholder/TODO screens that aren't functional

#### Component Audit (for each component file):
- [ ] TypeScript props fully typed (no `any`)
- [ ] Accessibility props on interactive elements (`accessibilityLabel`)
- [ ] Touch targets meet 44×44 minimum
- [ ] No inline styles with hardcoded colors

#### Photo Feature Audit (priority — most recently added):
- [ ] Camera permission handling (deny state handled gracefully)
- [ ] Gallery permission handling
- [ ] Upload error state — does user see feedback if upload fails?
- [ ] Photo displays in gallery after capture
- [ ] Notes save correctly with photos
- [ ] Photos associated with correct assessment ID
- [ ] Max photo count enforced or handled
- [ ] Offline behavior — what happens if submit attempted offline?

**Output Format:**
```markdown
## Screen Audit Report

### Critical Issues (must fix before TestFlight)
1. [File:line] Description

### High Issues (should fix before TestFlight)
1. [File:line] Description

### Medium Issues (post-launch backlog)
1. [File:line] Description

### Low / Cosmetic
1. [File:line] Description
```

---

### Task 3: CSS/Styling Consistency Audit

**Status: TODO — runs in parallel with Task 2A**

**Scope:** All `app/screens/`, `app/components/`, `app/theme/`

**What to Check:**

#### Hardcoded Colors
Search for any direct hex codes or color names NOT going through theme:
```typescript
// BAD — flag these:
backgroundColor: "#ffffff"
color: "red"
borderColor: "#333333"

// GOOD — these are fine:
backgroundColor: colors.background
color: theme.colors.text
```

#### Unused Style Constants
For each `const $styleName` defined at the bottom of a file, verify it is actually referenced in the JSX above. Delete unused ones.

#### Duplicate Style Patterns
Look for the same style object (same properties + values) defined in multiple files. Candidates for extraction to shared theme or common style file.

#### Missing `themed()` Wrappers
Any style that accesses `colors`, `spacing`, or `typography` must be wrapped in `themed()`. Flag any that aren't.

#### Spacing Consistency
All margin/padding values should use `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`, `spacing.xl` tokens. Flag hardcoded pixel values.

**Output Format:**
```markdown
## Styling Audit Report

### Hardcoded Colors Found
- [File:line] `color: "#333"` → replace with `colors.text`

### Unused Styles Removed
- [File] Removed: $unusedStyle, $anotherUnused

### Duplicate Patterns
- [File1] and [File2] share identical $containerStyle — candidate for shared constant

### Missing themed() Wrappers
- [File:line] Style accesses colors but not wrapped in themed()
```

---

### Task 2C: Post-Task-1 Review (QA Gate)

**Status: BLOCKED — wait for backend-agent + frontend-agent to complete Task 1**

After Task 1 is complete, review the new unit types/units observed code:

**Checklist:**
- [ ] UnitTypeRowModel follows MST identifier pattern
- [ ] UnitObservedRowModel follows MST identifier pattern
- [ ] 16 pre-seeded unitsObserved rows correctly initialized
- [ ] Hotel model actions: addUnitType, removeUnitType, updateUnitType, updateUnitObserved
- [ ] Apartment model actions: same
- [ ] Screen uses `store?.hotel.unitTypes.map(...)` (null safe)
- [ ] Status chips are mutually exclusive (selecting one clears others)
- [ ] Delete button only shown when > 1 row
- [ ] Add button hidden when row count === 10
- [ ] New accordion keys don't conflict with existing accordion keys
- [ ] Styles added at bottom of screen file, no inline styles
- [ ] No hardcoded colors in new styles
- [ ] TypeScript compiles without errors

---

## Code Review Template
```markdown
## Code Review: [File Name]

### Pattern Compliance
- [ ] MST pattern followed
- [ ] Screen pattern followed
- [ ] Style pattern followed

### Reusability
- [ ] Uses existing components
- [ ] No duplicate code
- [ ] Properly abstracted

### Issues Found
1. [Issue description] - [Severity: High/Medium/Low]

### Recommendations
1. [Recommendation]

### Approved: Yes/No
```
