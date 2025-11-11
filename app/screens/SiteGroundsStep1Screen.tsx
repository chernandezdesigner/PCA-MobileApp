import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Dropdown } from "@/components/Dropdown"
import { ChecklistCard, ChecklistItem } from "@/components/ChecklistCard"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Controller, useForm, useWatch } from "react-hook-form"
import type { SiteGroundsFormNavigatorParamList } from "@/navigators/SiteGroundsFormNavigator"

// Static dropdown options for Surface To field
const SURFACE_TO_OPTIONS = [
  { label: "Ditch", value: "Ditch" },
  { label: "Stream", value: "Stream" },
  { label: "Retention pond", value: "Retention pond" },
  { label: "Detention pond", value: "Detention pond" },
  { label: "Parking Garage Sump", value: "Parking Garage Sump" },
  { label: "Drywell", value: "Drywell" },
]

// Checklist item IDs
const CHECKLIST_ITEMS = [
  { id: "concreteSwales", label: "Concrete swales" },
  { id: "surfaceDrains", label: "Surface drains" },
  { id: "curbInlets", label: "Curb inlets" },
  { id: "adjacentProperty", label: "Adjacent property" },
]

interface SiteGroundsStep1ScreenProps extends NativeStackScreenProps<SiteGroundsFormNavigatorParamList, "SiteGroundsStep1"> {}

export const SiteGroundsStep1Screen: FC<SiteGroundsStep1ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.siteGrounds.step1

  // Form types
  type ConditionT = "good" | "fair" | "poor"
  type RepairT = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"

  type AssessmentVals = {
    condition: ConditionT
    repairStatus: RepairT
    amountToRepair: string
  }

  type Step1FormValues = {
    assessment: AssessmentVals
    undergroundToMunicipalStormSystem: boolean
    surfaceTo: string
    checklist: Record<string, { checked: boolean; comments: string }>
    comments: string
  }

  // Initialize default values from store
  const defaultValues = useMemo<Step1FormValues>(
    () => ({
      assessment: {
        condition: (store?.assessment.condition as ConditionT | undefined) ?? undefined as any,
        repairStatus: (store?.assessment.repairStatus as RepairT | undefined) ?? undefined as any,
        amountToRepair: store?.assessment.amountToRepair ?? "",
      },
      undergroundToMunicipalStormSystem: store?.undergroundToMunicipalStormSystem ?? false,
      surfaceTo: store?.surfaceTo ?? "",
      checklist: CHECKLIST_ITEMS.reduce((acc, item) => {
        const storeItem = store?.checklist.get(item.id)
        acc[item.id] = {
          checked: storeItem?.checked ?? false,
          comments: storeItem?.comments ?? "",
        }
        return acc
      }, {} as Record<string, { checked: boolean; comments: string }>),
      comments: store?.comments ?? "",
    }),
    [rootStore.activeAssessmentId], // Only recalculate when assessment changes
  )

  const { control, watch, reset, setValue } = useForm<Step1FormValues>({
    defaultValues,
    mode: "onChange",
  })

  // Initialize form from store only on mount or when assessment changes
  useEffect(() => {
    reset(defaultValues)
  }, [rootStore.activeAssessmentId]) // Only reset when switching assessments

  // Autosave with debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const v = values as Required<Step1FormValues>
        store?.update({
          assessment: v.assessment as any,
          undergroundToMunicipalStormSystem: v.undergroundToMunicipalStormSystem,
          surfaceTo: v.surfaceTo,
          checklist: v.checklist,
          comments: v.comments,
        })
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  // Transform checklist data for ChecklistCard component
  // Use useWatch for real-time reactivity
  const checklistData = useWatch({ control, name: "checklist" })
  const checklistItems: ChecklistItem[] = CHECKLIST_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    checked: checklistData?.[item.id]?.checked ?? false,
    comments: checklistData?.[item.id]?.comments ?? "",
  }))

  const handleChecklistToggle = (id: string, checked: boolean) => {
    setValue(`checklist.${id}.checked` as any, checked, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
  }

  const handleChecklistComment = (id: string, text: string) => {
    setValue(`checklist.${id}.comments` as any, text, { shouldDirty: true, shouldTouch: true })
  }

  const handleSelectAll = () => {
    CHECKLIST_ITEMS.forEach((item) => {
      setValue(`checklist.${item.id}.checked` as any, true, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    })
  }

  const handleClearAll = () => {
    CHECKLIST_ITEMS.forEach((item) => {
      setValue(`checklist.${item.id}.checked` as any, false, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    })
  }

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("SiteGroundsStep2" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Site & Grounds"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={$content} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Drainage & Erosion" style={themed($titleStyle)} />
          <ProgressBar current={1} total={4} />
        </View>

        <View style={$fieldGroup}>
          {/* Main Condition Assessment */}
          <View style={$section}>
            <Text preset="formLabel" text="Condition" style={themed($label)} />
            <Controller
              control={control}
              name="assessment.condition"
              render={({ field: { value, onChange } }) => (
                <ConditionAssessment value={value} onChange={onChange} />
              )}
            />
          </View>

          {/* Repair Status */}
          <View style={$section}>
            <Text preset="formLabel" text="Repair Status" style={themed($label)} />
            <Controller
              control={control}
              name="assessment.repairStatus"
              render={({ field: { value, onChange } }) => (
                <RepairStatus value={value} onChange={onChange} />
              )}
            />
          </View>

          {/* Amount to Repair */}
          <Controller
            control={control}
            name="assessment.amountToRepair"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Amount to Repair ($)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                returnKeyType="next"
                blurOnSubmit={false}
              />
            )}
          />

          {/* Underground to Municipal Storm System */}
          <View style={$section}>
            <View style={$checkboxRow}>
              <Text preset="formLabel" text="Underground to municipal storm system?" style={themed($label)} />
              <Controller
                control={control}
                name="undergroundToMunicipalStormSystem"
                render={({ field: { value, onChange } }) => (
                  <Checkbox value={value} onValueChange={onChange} />
                )}
              />
            </View>
          </View>

          {/* Surface To Dropdown */}
          <Controller
            control={control}
            name="surfaceTo"
            render={({ field: { value, onChange, onBlur } }) => (
              <Dropdown
                label="Surface to:"
                value={value}
                onValueChange={(newValue) => {
                  onChange(newValue)
                  onBlur()
                }}
                options={SURFACE_TO_OPTIONS}
              />
            )}
          />

          {/* Checklist */}
          <View style={$section}>
            <ChecklistCard
              title="Drainage Features"
              items={checklistItems}
              showComments={true}
              onToggle={handleChecklistToggle}
              onChangeComment={handleChecklistComment}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
          </View>

          {/* Comments */}
          <Controller
            control={control}
            name="comments"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Comments"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            )}
          />
        </View>
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav onBack={onBack} onNext={onNext} showCamera={true} />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenInner: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  padding: 16,
  gap: 16,
}

const $scrollArea: ViewStyle = {
  flex: 1,
  paddingTop: 72,
  paddingBottom: 96,
}

const $fieldGroup: ViewStyle = {
  gap: 16,
}

const $section: ViewStyle = {
  gap: 8,
}

const $checkboxRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
}

const $stickyHeader: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

const $stickyFooter: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

const $introBlock: ViewStyle = {
  paddingBottom: 32,
}

const $titleStyle: ThemedStyle<any> = ({ colors }) => ({
  color: colors.palette.primary2 as any,
  fontSize: 24,
  fontFamily: undefined,
})

const $label: ThemedStyle<any> = ({ colors }) => ({
  color: colors.palette.neutral800,
  marginBottom: 4,
})
