import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { Checkbox } from "@/components/Toggle/Checkbox"
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
import { SURFACE_TO_OPTIONS, DRAINAGE_FEATURES_OPTIONS } from "@/constants/siteGroundsOptions"

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
    surfaceTo: string[]
    drainageFeatures: string[]
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
      surfaceTo: store?.surfaceTo.slice() ?? [],
      drainageFeatures: store?.drainageFeatures.slice() ?? [],
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
          drainageFeatures: v.drainageFeatures,
          comments: v.comments,
        })
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  // Transform checklist data for ChecklistCard components
  // Use useWatch for real-time reactivity
  const surfaceToData = useWatch({ control, name: "surfaceTo" })
  const drainageFeaturesData = useWatch({ control, name: "drainageFeatures" })

  const surfaceToItems: ChecklistItem[] = SURFACE_TO_OPTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    checked: surfaceToData?.includes(item.id) ?? false,
  }))

  const drainageFeatureItems: ChecklistItem[] = DRAINAGE_FEATURES_OPTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    checked: drainageFeaturesData?.includes(item.id) ?? false,
  }))

  const handleSurfaceToToggle = (id: string, checked: boolean) => {
    const current = surfaceToData ?? []
    if (checked) {
      setValue("surfaceTo", [...current, id], { shouldDirty: true, shouldTouch: true })
    } else {
      setValue("surfaceTo", current.filter((item) => item !== id), { shouldDirty: true, shouldTouch: true })
    }
  }

  const handleDrainageFeatureToggle = (id: string, checked: boolean) => {
    const current = drainageFeaturesData ?? []
    if (checked) {
      setValue("drainageFeatures", [...current, id], { shouldDirty: true, shouldTouch: true })
    } else {
      setValue("drainageFeatures", current.filter((item) => item !== id), { shouldDirty: true, shouldTouch: true })
    }
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
                placeholder="Dollar amount"
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

          {/* Surface To Checklist */}
          <View style={$section}>
            <ChecklistCard
              title="Surface to:"
              items={surfaceToItems}
              showComments={false}
              onToggle={handleSurfaceToToggle}
            />
          </View>

          {/* Drainage Features Checklist */}
          <View style={$section}>
            <ChecklistCard
              title="Drainage Features"
              items={drainageFeatureItems}
              showComments={false}
              onToggle={handleDrainageFeatureToggle}
            />
          </View>

          {/* Comments */}
          <Controller
            control={control}
            name="comments"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Comments"
                placeholder="Note any drainage issues, ponding water, or maintenance concerns"
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
  paddingTop: 88, // 72 (header height) + 16 (spacing)
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 16,
}

const $scrollArea: ViewStyle = {
  flex: 1,
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
  paddingTop: 16,
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
