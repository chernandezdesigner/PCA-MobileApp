import { FC, useEffect, useMemo, useRef, useState } from "react"
import { Animated, FlatList, Modal, TouchableOpacity, View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { TextField } from "@/components/TextField"
import { PressableIcon } from "@/components/Icon"
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

  const [materialsModalVisible, setMaterialsModalVisible] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  function toggleCommentsRow(id: string) {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Derive renderable materials by combining constants with store map state
  const materials = useMemo(() => (
    PROBLEMATIC_MATERIALS.map((m) => {
      const s = projectSummaryStore?.problematicMaterials.get(m.id)
      return {
        id: m.id,
        name: m.label,
        provided: s?.provided ?? false,
        comments: s?.comments ?? "",
      }
    })
  ), [projectSummaryStore?.lastModified])

  const providedCount = useMemo(
    () => materials.reduce((acc, m) => acc + (m.provided ? 1 : 0), 0),
    [materials],
  )

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
  }), [projectSummaryStore?.lastModified])

  const { control, watch, reset } = useForm<UtilitiesFormValues>({ defaultValues, mode: "onChange" })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

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
        onOpen={() => setMaterialsModalVisible(true)}
        onToggle={(id, checked) => {
          const found = materials.find((m) => m.id === id)
          if (found) projectSummaryStore?.updateProblematicMaterial(id, checked, found.comments ?? "")
        }}
        onChangeComment={(id, text) => {
          const found = materials.find((m) => m.id === id)
          if (found) projectSummaryStore?.updateProblematicMaterial(id, found.provided, text)
        }}
      />

      {/* Utilities */}
      <Text preset="subheading" text="Utilities" />
      <View style={$fieldsGrid}>
        <Controller
          control={control}
          name="domesticWater"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Domestic Water" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="domesticSewage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Domestic Sewage" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="stormWaterDrainage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Storm Water Drainage" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="electricity"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Electricity" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="naturalGas"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Natural Gas" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="heatingOil"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Heating Oil" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="propane"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Propane" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="wellSystem"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Well System" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="septicSystem"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Septic System" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />
        <Controller
          control={control}
          name="wastewaterTreatmentPlant"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Wastewater Treatment Plant" value={value} onChangeText={onChange} onBlur={onBlur} />
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
        onNext={() => {}}
        nextDisabled
        showCamera={true}
      />
    </View>
    {/* Modal for full materials list */}
    <Modal visible={materialsModalVisible} animationType="slide" onRequestClose={() => setMaterialsModalVisible(false)}>
      <Screen preset="fixed" style={{ flex: 1 }} contentContainerStyle={$modalContainer}>
        <View style={$rowBetween}>
          <Text preset="subheading" text="Problematic Materials" />
          <Button text="Done" onPress={() => setMaterialsModalVisible(false)} />
        </View>
        <View style={$flex1}>
          <ListWithFadingDot
            data={materials}
            keyExtractor={(m: { id: string }) => m.id}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />}
            renderItem={({ item, index }: { item: { id: string; name: string; provided: boolean; comments?: string }; index: number }) => (
              <View style={[$rowWrapper, index % 2 === 1 ? themed($altRow) : undefined]}>
                <TouchableOpacity
                  onPress={() => projectSummaryStore?.updateProblematicMaterial(item.id, !item.provided, item.comments ?? "")}
                  style={$docRow}
                >
                  <Text text={item.name} />
                  <View style={$row}>
                    <Checkbox
                      value={item.provided}
                      onValueChange={(v) => projectSummaryStore?.updateProblematicMaterial(item.id, v, item.comments ?? "")}
                    />
                    <View style={$pill(item.provided)}>
                      <Text text={item.provided ? "Yes" : "No"} />
                    </View>
                    <PressableIcon
                      icon="more"
                      size={18}
                      onPress={() => toggleCommentsRow(item.id)}
                      containerStyle={themed($commentIconContainer(!!expandedRows[item.id]))}
                    />
                  </View>
                </TouchableOpacity>
                {expandedRows[item.id] && (
                  <View style={$commentContainer}>
                    <TextField
                      placeholder="Add comments..."
                      multiline
                      value={item.comments ?? ""}
                      onChangeText={(t) => projectSummaryStore?.updateProblematicMaterial(item.id, item.provided, t)}
                    />
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </Screen>
    </Modal>
    </Screen>
  )
})

// Reuse the floating scroll dot list from Step 3
function ListWithFadingDot(props: any) {
  const { data, renderItem, keyExtractor, ItemSeparatorComponent, style, contentContainerStyle } = props
  const [listHeight, setListHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const scrollY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

  function handleScroll(e: any) {
    const y = e.nativeEvent.contentOffset.y || 0
    scrollY.setValue(y)
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }).start()
    fadeTimeout.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start()
    }, 650)
  }

  const maxScroll = Math.max(1, contentHeight - listHeight)
  const travel = Math.max(0, listHeight - 24) // 24 = dot height here
  const translateY = scrollY.interpolate({ inputRange: [0, maxScroll], outputRange: [0, travel], extrapolate: "clamp" })

  return (
    <View style={[$flex1, { position: "relative" }, style]} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        decelerationRate="fast"
        style={$flex1}
      />
      {contentHeight > listHeight && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 4,
            width: 6,
            height: 24,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.35)",
            opacity,
            transform: [{ translateY }],
          }}
        />
      )}
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  padding: 16,
  gap: 16,
}

const $sectionContent: ViewStyle = {
  gap: 12,
  marginTop: 16,
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $rowBetween: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $headerRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $fieldsGrid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  columnGap: 12,
  rowGap: 12,
}

const $modalContainer: ViewStyle = {
  padding: 16,
  gap: 16,
  flex: 1,
}

const $docRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 16,
  paddingVertical: 12,
}

const $rowWrapper: ViewStyle = {
  // Wrapper so alternating background spans the expanded comment area too
}

const $docPreviewContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  maxHeight: 240,
  backgroundColor: colors.palette.checklistBackground,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.palette.gray3,
})

const $docPreviewContentPadding: ViewStyle = { paddingVertical: 8 }

const $pill = (on: boolean): ViewStyle => ({
  height: 32,
  minWidth: 64,
  paddingHorizontal: 12,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: on ? "#dbeafe" : "#e5e7eb",
})

const $altRow: ThemedStyle<any> = ({ colors }) => ({
  backgroundColor: colors.palette.checklistAlternatingBackground,
})

const $commentContainer: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 12,
}

const $commentIconContainer = (active: boolean): ThemedStyle<any> => ({ colors, isDark }) => ({
  width: 40,
  height: 36,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  backgroundColor: active ? (isDark ? "rgba(99,102,241,0.25)" : "#eef2ff") : "transparent",
  borderColor: active ? (isDark ? "#a5b4fc" : "#c7d2fe") : (isDark ? "#4b5563" : "#e5e7eb"),
})

const $flex1: ViewStyle = { flex: 1 }

const $progressHeaderText: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any })
const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $scrollArea: ViewStyle = { paddingTop: 72, paddingBottom: 96 }
const $titleStyle: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2, fontSize: 24 })
const $introBlock: ViewStyle = { paddingBottom: 32 }
const $countLight: ViewStyle = { opacity: 0.7 }
