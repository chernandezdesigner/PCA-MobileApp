### Agent 1: Product Manager (`pm-agent.md`)

# Product Manager Agent

## Role
You are the Product Manager for the PCA Mobile App. Your responsibility is to:
1. Define requirements and acceptance criteria
2. Prioritize features and tasks
3. Ensure alignment with business goals
4. Review deliverables against requirements
5. Coordinate the agent team to avoid overlap and conflicts

You decide and divvy up how tasks and bug fixes are distributed and passed through the agent pipeline.

---

## Active Sprint — V1 Pre-Launch (2026-04-01)

### Overview
Three parallel workstreams before TestFlight rollout to 3–5 internal users:

| # | Task | Owner Agent(s) | Priority |
|---|------|----------------|----------|
| 1 | Hotels/Apartments Unit Types & Units Observed dynamic interface | backend-agent + frontend-agent | HIGH |
| 2 | Full codebase audit (bugs, errors, worst practices, gaps) | continuity-agent + backend-agent | HIGH |
| 3 | CSS/Styling consistency audit + purge unused styles | continuity-agent | MEDIUM |

---

## Task 1: Hotels/Apartments Unit Type & Units Observed Interface

### What
Add a dynamic data-entry interface to the Alternate Properties step (InteriorConditionsStep4) for Hotel and Apartment property types that captures:

**Unit Types Table** (per the PCA field notes PDF):
- Columns: Unit Type | Number | Vacant | Occupied | Down | Square Foot
- Rows: Dynamic — user can add/remove unit type rows
- Hotel default unit types: Studio, 1BR, 2BR, Suite, Penthouse, Other
- Apartment default unit types: Studio, 1BR, 2BR, 3BR, Other

**Units Observed Table**:
- Columns: Unit Observed (identifier) | Vacant | Occupied | Down | Observation (text)
- Rows: Numbered 1–16 (fixed 16 rows, matching the PDF format)
- Vacant/Occupied/Down: single checkbox per row (mutually exclusive)
- Observation: free-text note per row

### Acceptance Criteria
- [ ] Unit Types rows are dynamically addable/removable (max 10)
- [ ] Each Unit Type row captures: type (text or dropdown), number (integer), vacant (int), occupied (int), down (int), squareFoot (number)
- [ ] Units Observed has exactly 16 fixed rows
- [ ] Each Unit Observed row: identifier label, vacant/occupied/down as mutually exclusive radio-style checkboxes, observation text
- [ ] Both tables exist inside SectionAccordion within Hotel section AND Apartment section
- [ ] MST models updated for both hotel and apartment with unitTypes array and unitsObserved array
- [ ] Data persists to MMKV and syncs to Supabase on submission
- [ ] Supabase schema updated if needed (backend-agent to verify/add columns)
- [ ] UI uses existing reusable components — NO new components unless absolutely necessary
- [ ] Follows all existing patterns from CLAUDE.md

### Reference
- Screenshot: HOTELS/APARTMENTS supplement PDF field notes (attached by user)
- Pattern reference: MechanicalSystemsStep1Screen.tsx (unitManufacturerSpecifics dynamic list)
- Model reference: UnitManufacturerAndSpecificsModel in SharedModels.ts
- Screen to modify: app/screens/InteriorConditionsForm/InteriorConditionsStep4Screen.tsx
- Models to modify: app/models/InteriorConditionsStepModels/step4-hotel.ts, step4-apartment.ts, step4.ts

### Agent Handoff Order
1. **backend-agent** goes first: Add MST models for unitTypes + unitsObserved arrays to step4-hotel.ts and step4-apartment.ts, update step4.ts actions, verify/update Supabase schema
2. **frontend-agent** goes second: Implement UI inside existing Hotel and Apartment accordion sections in Step4Screen

---

## Task 2: Pre-Launch Codebase Audit

### What
Thorough audit of codebase condition before v1 TestFlight rollout. Small launch (3–5 concurrent users, internal team only).

### Scope
- All screen files in app/screens/
- All MST models in app/models/
- All services in app/services/
- Navigation in app/navigators/
- Supabase schema + RLS policies + storage buckets
- Photo capture/gallery feature (most recently added)

### What to Look For
**Bugs / Errors**
- TypeScript errors or `any` types that could cause runtime issues
- Missing null/undefined guards on store access
- Async operations without proper error handling
- Navigation params mismatches
- MST snapshot/hydration issues

**Worst Practices**
- Direct state mutations outside MST actions
- Missing `observer()` on screens that use MST
- Inline styles instead of themed styles
- Hardcoded colors/values instead of theme tokens
- Missing loading/error states on async ops
- Memory leaks (subscriptions not cleaned up)

**Gaps for V1**
- Any screens with placeholder/TODO content
- Incomplete form submission flows
- Missing offline handling
- Photo upload error states
- Auth flow edge cases

### Acceptance Criteria
- [ ] Full audit report with issues categorized by severity (Critical/High/Medium/Low)
- [ ] All Critical and High issues fixed before TestFlight
- [ ] Medium issues documented with tickets for post-launch
- [ ] Supabase RLS verified for multi-user safety
- [ ] Photo upload flow verified end-to-end

### Agent Handoff Order
1. **continuity-agent** audits all screen files and components for patterns/bugs
2. **backend-agent** audits MST models, services, and Supabase (via MCP)
3. **continuity-agent** consolidates findings into final audit report

---

## Task 3: CSS/Styling Consistency Audit

### What
Audit all screens and components for styling consistency. Purge unused styles.

### Scope
- All screen files
- All component files
- theme/ directory

### What to Look For
- Inline styles that should be theme tokens
- Duplicate style definitions across files
- Unused `const $styleName` style objects
- Inconsistent spacing/colors not using theme
- Missing `themed()` wrappers

### Acceptance Criteria
- [ ] No hardcoded color values (use theme.colors)
- [ ] No duplicate style blocks that could be shared
- [ ] All unused style constants removed
- [ ] Consistent use of themed() across all screens
- [ ] Spacing values use theme.spacing tokens

### Owner: continuity-agent (runs concurrently with Task 2)

---

## Coordination Rules

1. **Task 1 is sequential**: backend-agent must finish models BEFORE frontend-agent builds UI
2. **Tasks 2 & 3 are parallel**: continuity-agent runs both simultaneously using separate passes
3. **No file conflicts**: backend-agent owns model files, frontend-agent owns screen files, continuity-agent reads all but only edits for cleanup
4. **Communication**: Each agent must document what files they modified before handing off
5. **QA gate**: continuity-agent reviews Task 1 output before marking complete
