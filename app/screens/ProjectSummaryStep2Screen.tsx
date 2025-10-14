import { FC, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle } from "react-native"
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
interface ProjectSummaryStep2ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep2"> {}

type Step2FormValues = {
  acreage: number
  numberSignDown: number
  yearRenovated: number
  numberOfBuildings: number
  netSqFt: number
  numberOfUnits: number
  GSF: number
  numberOfVacantUnits: number
  yearBuilt: number
  leaseType: string
  recentCapitalImprovements: string
}

export const ProjectSummaryStep2Screen: FC<ProjectSummaryStep2ScreenProps> = observer(() => {
  // Pull in navigation via hook
  const navigation = useNavigation()

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
  }), [projectSummaryStore?.lastModified])

  const { control, handleSubmit, watch, reset } = useForm<Step2FormValues>({
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        projectSummaryStore?.updateStep2(values)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, projectSummaryStore])

  const onNext = handleSubmit(() => {
    navigation.navigate("ProjectSummaryStep3" as never)
  })


  return (
    <Screen style={$root} preset="scroll" contentContainerStyle={$content}>
      <Text preset="heading" text="Unit Info" />

      <View style={$fieldGroup}>
        <Controller
          control={control}
          name="acreage"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Acreage"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="numberSignDown"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Sign Downs"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="yearRenovated"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Year Renovated"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfBuildings"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Buildings"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="netSqFt"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Net Square Feet"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />



        <Controller
          control={control}
          name="numberOfUnits"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Units"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="GSF"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="GSF"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="numberOfVacantUnits"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Number of Vacant Units"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="yearBuilt"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Year Built"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
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
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              style={{ minHeight: 100, textAlignVertical: "top" }}
              containerStyle={{ flex: 1 }}
            />
          )}
        />

        <Button preset="filled" text="Next" onPress={onNext} />
      
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  padding: 16,
  gap: 16,
}

const $fieldGroup: ViewStyle = {
  gap: 12,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}
