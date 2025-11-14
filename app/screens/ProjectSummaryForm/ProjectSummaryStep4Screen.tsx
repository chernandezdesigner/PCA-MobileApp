import { FC, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { Controller, useForm } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { ChecklistCard } from "@/components/ChecklistCard"
import { useDrawerControl } from "@/context/DrawerContext"

interface ProjectSummaryStep4ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep4"> {}

type UtilitiesFormValues = {
  domesticWater: string
  domesticSewage: string
  stormWaterDrainage: string
  electricity: string
  naturalGas: string
  heatingOil: string
  propane: string
  wellSystem: string
  septicSystem: string
  wastewaterTreatmentPlant: string
}

// Local, static catalog of problematic materials
const PROBLEMATIC_MATERIALS = [
  { id: "frtPlywood", label: "FRT Plywood" },
  { id: "compositeWoodSiding", label: "Composite Wood Siding" },
  { id: "eifs", label: "EIFS" },
  { id: "chineseDrywall", label: "Chinese Drywall" },
  { id: "lessThan60AMPElectricService", label: "Less than 60 AMP Electric Service" },
  { id: "aluminumBranchWiring", label: "Aluminum Branch Wiring" },
  { id: "fusedElectricalSubpanels", label: "Fused Electrical sub-panels" },
  { id: "recalledBreakerPanels", label: "Recalled Breaker Panels" },
  { id: "polybutyleneWaterPiping", label: "Polybutylene Water Piping" },
  { id: "galvanizedSteelWaterPiping", label: "Galvanized Steel Water Piping" },
  { id: "leadPipingFittings", label: "Lead Piping / Fittings" },
  { id: "absSanitarySewerLines", label: "ABS Sanitary Sewer Lines" },
  { id: "recalledFireSprinkelerHeads", label: "Recalled Fire Sprinkeler Heads" },
  { id: "recalledInWallElectricHeaters", label: "Recalled In-wall Electric Heaters" },
] as const

export const ProjectSummaryStep4Screen: FC<ProjectSummaryStep4ScreenProps> = observer(() => {
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  // Derive renderable materials by combining constants with store map state
  // Remove useMemo to allow observer to handle reactivity
  const materials = PROBLEMATIC_MATERIALS.map((m) => {
    const s = projectSummaryStore?.problematicMaterials.get(m.id)
    return {
      id: m.id,
      name: m.label,
      provided: s?.provided ?? false,
      comments: s?.comments ?? "",
    }
  })

  // Handlers for select all / clear all
  function handleMaterialSelectAll() {
    PROBLEMATIC_MATERIALS.forEach((m) => {
      const current = materials.find((mat) => mat.id === m.id)
      projectSummaryStore?.updateProblematicMaterial(m.id, true, current?.comments ?? "")
    })
  }

  function handleMaterialClearAll() {
    PROBLEMATIC_MATERIALS.forEach((m) => {
      const current = materials.find((mat) => mat.id === m.id)
      projectSummaryStore?.updateProblematicMaterial(m.id, false, current?.comments ?? "")
    })
  }

  // Utilities form setup with autosave
  const defaultValues = useMemo<UtilitiesFormValues>(() => ({
    domesticWater: projectSummaryStore?.domesticWater ?? "",
    domesticSewage: projectSummaryStore?.domesticSewage ?? "",
    stormWaterDrainage: projectSummaryStore?.stormWaterDrainage ?? "",
    electricity: projectSummaryStore?.electricity ?? "",
    naturalGas: projectSummaryStore?.naturalGas ?? "",
    heatingOil: projectSummaryStore?.heatingOil ?? "",
    propane: projectSummaryStore?.propane ?? "",
    wellSystem: projectSummaryStore?.wellSystem ?? "",
    septicSystem: projectSummaryStore?.septicSystem ?? "",
    wastewaterTreatmentPlant: projectSummaryStore?.wastewaterTreatmentPlant ?? "",
  }), [rootStore.activeAssessmentId]) // Only recalculate when assessment changes

  const { control, watch, reset } = useForm<UtilitiesFormValues>({ defaultValues, mode: "onChange" })
  
  // Initialize form from store only on mount or when assessment changes
  useEffect(() => { 
    reset(defaultValues) 
  }, [rootStore.activeAssessmentId]) // Only reset when switching assessments

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const sub = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => projectSummaryStore?.updateStep4Utilities(values), 300)
    })
    return () => sub.unsubscribe()
  }, [watch, projectSummaryStore])

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Project Summary" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="menu" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={$content} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Problematic Materials & Utilities" style={themed($titleStyle)} />
          <ProgressBar current={4} total={4} />
        </View>

      {/* Problematic Materials (refactored) */}
      <ChecklistCard
        title="Problematic Materials"
        items={materials.map((m) => ({ id: m.id, label: m.name, checked: m.provided, comments: m.comments }))}
        showComments
        onToggle={(id, checked) => {
          const found = materials.find((m) => m.id === id)
          if (found) projectSummaryStore?.updateProblematicMaterial(id, checked, found.comments ?? "")
        }}
        onChangeComment={(id, text) => {
          const found = materials.find((m) => m.id === id)
          if (found) projectSummaryStore?.updateProblematicMaterial(id, found.provided, text)
        }}
        onSelectAll={handleMaterialSelectAll}
        onClearAll={handleMaterialClearAll}
      />

      {/* Utilities */}
      <Text preset="subheading" text="Utilities" />
      <View style={$fieldsGrid}>
        <Controller
          control={control}
          name="domesticWater"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Domestic Water" placeholder="Water source" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="domesticSewage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Domestic Sewage" placeholder="Sewage system" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="stormWaterDrainage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Storm Water Drainage" placeholder="Drainage system" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="electricity"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Electricity" placeholder="Provider name" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="naturalGas"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Natural Gas" placeholder="Provider name" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="heatingOil"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Heating Oil" placeholder="Source or N/A" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="propane"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Propane" placeholder="Source or N/A" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="wellSystem"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Well System" placeholder="Details or N/A" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="septicSystem"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Septic System" placeholder="Details or N/A" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="wastewaterTreatmentPlant"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Wastewater Treatment Plant" placeholder="Details or N/A" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
      </View>


    </ScrollView>
    <View style={$stickyFooter}>
      <StickyFooterNav
        onBack={() => {
          // slide back
          // @ts-expect-error route params for animation
          navigation.navigate("ProjectSummaryStep3" as never, { transition: "slide_from_left" } as never)
        }}
        onNext={openDrawer}
        nextButtonText="Next Form"
        showCamera={true}
      />
    </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  padding: 16,
  paddingTop: 88, // 72 (header height) + 16 (spacing)
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 16,
}

const $fieldsGrid: ViewStyle = {
  gap: 12,
  // Full-width stacked layout for mobile (consistent with other form screens)
}

const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $scrollArea: ViewStyle = { flex: 1 }
const $titleStyle: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2, fontSize: 24 })
const $introBlock: ViewStyle = { paddingTop: 16, paddingBottom: 32 }
