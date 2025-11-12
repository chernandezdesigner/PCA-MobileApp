# ChecklistCard Row Alignment Fix

## Issue
Checklist rows had misaligned items - the checkbox (32x32), pill (44px), and three-dot menu button (44x44) had different heights causing vertical misalignment across all forms.

## Solution

### Changes Made to `app/components/ChecklistCard.tsx`

#### 1. **Wrapped Checkbox in Container**
```typescript
// Before: Checkbox rendered directly
<Checkbox value={item.checked} onValueChange={(v) => onToggle(item.id, v)} />

// After: Checkbox wrapped for proper centering
<View style={themed($checkboxWrapper)}>
  <Checkbox value={item.checked} onValueChange={(v) => onToggle(item.id, v)} />
</View>
```

The `$checkboxWrapper` ensures the 32x32 checkbox is centered within a 44x44 touch target area.

#### 2. **Created Dedicated Controls Row**
```typescript
const $controlsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs, // 8px between controls
  flexShrink: 0, // Don't shrink controls
})
```

This ensures all interactive elements (checkbox, pill, button) stay properly aligned and don't compress.

#### 3. **Added Checkbox Wrapper Style**
```typescript
const $checkboxWrapper: ThemedStyle<ViewStyle> = () => ({
  // Wrapper to center checkbox vertically with other 44px elements
  minHeight: 44,
  justifyContent: "center",
  alignItems: "center",
  minWidth: 44, // Match touch target size
})
```

Centers the 32px checkbox within a 44x44 area to match pill and button heights.

#### 4. **Improved Row Height Consistency**
```typescript
const $rowBetween: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md, // 16px
  paddingVertical: spacing.xs, // 8px - reduced for tighter rows
  minHeight: 56, // Ensure consistent row height (44px pill + 12px padding)
})
```

Ensures consistent row height across all items while keeping proper padding.

#### 5. **Enhanced Label Styling**
```typescript
const $itemLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
  flex: 1,
  marginRight: 12,
  lineHeight: 20, // Consistent line height for alignment
})
```

Proper line height ensures text aligns nicely with the row.

---

## Impact

### ✅ **All Forms Automatically Fixed**
Since all screens use the centralized `ChecklistCard` component, the fix applies to:

1. **ProjectSummaryStep3Screen** - Documentation checklist
2. **ProjectSummaryStep4Screen** - Problematic Materials checklist
3. **SiteGroundsStep1Screen** - Any checklists
4. **SiteGroundsStep2Screen** - Any checklists
5. **SiteGroundsStep3Screen** - Any checklists
6. **SiteGroundsStep4Screen** - Any checklists

### ✅ **Consistent Alignment**
- Checkbox: Centered in 44x44 area
- Pill: 44px height maintained
- Menu button: 44x44 maintained
- All elements vertically aligned

### ✅ **Proper Touch Targets**
- All interactive elements meet 44x44 minimum
- Proper spacing between controls (8px)
- No overlapping or cramped layout

### ✅ **Visual Consistency**
- Uniform row heights across all items
- Proper padding and spacing
- Clean, professional appearance

---

## Before & After

### Before:
```
Label Text    [checkbox]  No  ...  ← Misaligned vertically
              (32x32)  (44px) (44x44)
```

### After:
```
Label Text    [ checkbox ]  No  ...  ← Perfectly aligned
              (44x44 area) (44px) (44x44)
```

---

## Technical Details

### Element Sizing
- **Checkbox**: 32x32 native size, wrapped in 44x44 container
- **Pill**: 44px minHeight (accessibility standard)
- **Menu Button**: 44x44 (accessibility standard)
- **Row**: 56px minHeight (44px + 12px padding)

### Spacing
- Between controls: 8px (`spacing.xs`)
- Row padding: 16px horizontal, 8px vertical
- Label margin: 12px to the right

### Alignment Strategy
All elements use `alignItems: "center"` in their container to ensure vertical centering regardless of individual element sizes.

---

## No Breaking Changes

- ✅ All existing ChecklistCard usage remains unchanged
- ✅ Same props API
- ✅ Backward compatible
- ✅ Only visual improvements

---

## Files Modified

1. ✅ `app/components/ChecklistCard.tsx` - Component improvements

## Files Using ChecklistCard (auto-updated)

1. ✅ `app/screens/ProjectSummaryStep3Screen.tsx` - Documentation
2. ✅ `app/screens/ProjectSummaryStep4Screen.tsx` - Problematic Materials
3. ✅ Any other screens using ChecklistCard component

---

## Testing Checklist

- [x] No linter errors in ChecklistCard.tsx
- [x] Proper TypeScript types
- [x] Accessibility standards met (44x44 touch targets)
- [x] Visual alignment verified
- [x] All screens using ChecklistCard benefit from fix

