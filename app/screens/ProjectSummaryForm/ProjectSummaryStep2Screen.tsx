import { FC, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { Controller, useForm } from "react-hook-form"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { Dropdown } from "@/components/Dropdown"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useDrawerControl } from "@/context/DrawerContext"
interface ProjectSummaryStep2ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep2"> {}

type Step2FormValues = {
  acreage: number | string
  numberSignDown: number
  yearRenovated: number
  numberOfBuildings: number
  netSqFt: number | string
  numberOfUnits: number
  GSF: number | string
  numberOfVacantUnits: number
  yearBuilt: number
  leaseType: string
  recentCapitalImprovements: string
}

export const ProjectSummaryStep2Screen: FC<ProjectSummaryStep2ScreenProps> = observer(() => {
  // Pull in navigation via hook
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { openDrawer } = useDrawerControl()

  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  const defaultValues = useMemo<Step2FormValues>(() => ({
    acreage: projectSummaryStore?.acreage ?? 0,
    numberSignDown: projectSummaryStore?.numberSignDown ?? 0,
    yearRenovated: projectSummaryStore?.yearRenovated ?? 0,
    numberOfBuildings: projectSummaryStore?.numberOfBuildings ?? 0,
    netSqFt: projectSummaryStore?.netSqFt ?? 0,
    numberOfUnits: projectSummaryStore?.numberOfUnits ?? 0,
    GSF: projectSummaryStore?.GSF ?? 0,
    numberOfVacantUnits: projectSummaryStore?.numberOfVacantUnits ?? 0,
    yearBuilt: projectSummaryStore?.yearBuilt ?? 0,
    leaseType: projectSummaryStore?.leaseType ?? "",
    recentCapitalImprovements: projectSummaryStore?.recentCapitalImprovements ?? "",
  }), [rootStore.activeAssessmentId]) // Only recalculate when assessment changes

  const { control, handleSubmit, watch, reset } = useForm<Step2FormValues>({
    defaultValues,
    mode: "onChange",
  })

  // Initialize form from store only on mount or when assessment changes
  useEffect(() => {
    reset(defaultValues)
  }, [rootStore.activeAssessmentId]) // Only reset when switching assessments

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        // Convert any intermediate string values to numbers before saving to MST store
        const sanitized = {
          ...values,
          acreage: Number(values.acreage) || 0,
          netSqFt: Number(values.netSqFt) || 0,
          GSF: Number(values.GSF) || 0,
        }
        projectSummaryStore?.updateStep2(sanitized)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, projectSummaryStore])

  const onNext = handleSubmit(() => {
    // slide forward
    // @ts-expect-error route params for animation
    navigation.navigate("ProjectSummaryStep3" as never, { transition: "slide_from_right" } as never)
  })
  const onBack = () => {
    // slide back
    // @ts-expect-error route params for animation
    navigation.navigate("ProjectSummaryStep1" as never, { transition: "slide_from_left" } as never)
  }


  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Project Summary" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="menu" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={$content} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Unit Info" style={themed($titleStyle)} />
          <ProgressBar current={2} total={4} />
        </View>
        <View style={$fieldGroup}>
        <Controller
          control={control}
          name="acreage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Acreage"
              placeholder="0.0"
              value={String(value ?? "")}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^0-9.]/g, "")
                if (cleaned === "" || cleaned.endsWith(".")) {
                  onChange(cleaned)
                } else {
                  onChange(Number(cleaned) || 0)
                }
              }}
              onBlur={() => {
                onChange(Number(value) || 0)
                onBlur()
              }}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="numberSignDown"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Sign Downs"
              placeholder="0"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="yearRenovated"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Year Renovated"
              placeholder="Year"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfBuildings"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Buildings"
              placeholder="0"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="netSqFt"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Net Square Feet"
              placeholder="Square feet"
              value={String(value ?? "")}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^0-9.]/g, "")
                if (cleaned === "" || cleaned.endsWith(".")) {
                  onChange(cleaned)
                } else {
                  onChange(Number(cleaned) || 0)
                }
              }}
              onBlur={() => {
                onChange(Number(value) || 0)
                onBlur()
              }}
              keyboardType="decimal-pad"
            />
          )}
        />



        <Controller
          control={control}
          name="numberOfUnits"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Units"
              placeholder="0"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="GSF"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="GSF"
              placeholder="Square feet"
              value={String(value ?? "")}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^0-9.]/g, "")
                if (cleaned === "" || cleaned.endsWith(".")) {
                  onChange(cleaned)
                } else {
                  onChange(Number(cleaned) || 0)
                }
              }}
              onBlur={() => {
                onChange(Number(value) || 0)
                onBlur()
              }}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfVacantUnits"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Vacant Units"
              placeholder="0"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="yearBuilt"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Year Built"
              placeholder="Year"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt) || 0)}
              onBlur={onBlur}
              keyboardType="decimal-pad"
            />
          )}
        />

<Controller
          control={control}
          name="leaseType"
          render={({ field: { value, onChange, onBlur } }) => (
            <Dropdown
              label="Lease Type"
              value={value}
              onValueChange={(newValue) => {
                onChange(newValue)
                onBlur()
              }}
              options={[
                { label: "Modified Triple Net", value: "Modified Triple Net" },
                { label: "True Triple Net", value: "True Triple Net" },
                { label: "Gross", value: "Gross" },
                { label: "Net", value: "Net" },
              ]}
            />
          )}
        />

        <Controller
          control={control}
          name="recentCapitalImprovements"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Recent Capital Improvements"
              placeholder="Describe recent improvements"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              style={{ minHeight: 100, textAlignVertical: "top" }}
              containerStyle={{ flex: 1 }}
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

const $content: ViewStyle = {
  padding: 16,
  paddingTop: 88, // 72 (header height) + 16 (spacing)
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 16,
}

const $fieldGroup: ViewStyle = {
  gap: 12,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $scrollArea: ViewStyle = { flex: 1 }
const $progressHeaderText: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any })
const $titleStyle: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any, fontSize: 24 })
const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $introBlock: ViewStyle = { paddingTop: 16, paddingBottom: 32 }
