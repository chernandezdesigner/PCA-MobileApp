import { FC, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { observer } from "mobx-react-lite"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models/RootStoreProvider"

interface ProjectSummaryStep1ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep1"> {}

type Step1FormValues = {
  projectName: string
  projectNumber: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  weather: string
  temperature: number
  inspectorName: string
  inspectorNumber: string
  surroundingProperties: string
}

export const ProjectSummaryStep1Screen: FC<ProjectSummaryStep1ScreenProps> = observer(() => {
  const navigation = useNavigation()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  const defaultValues = useMemo<Step1FormValues>(() => ({
    projectName: projectSummaryStore?.projectName ?? "",
    projectNumber: projectSummaryStore?.projectNumber ?? "",
    propertyAddress: projectSummaryStore?.propertyAddress ?? "",
    propertyCity: projectSummaryStore?.propertyCity ?? "",
    propertyState: projectSummaryStore?.propertyState ?? "",
    propertyZip: projectSummaryStore?.propertyZip ?? "",
    weather: projectSummaryStore?.weather ?? "",
    temperature: projectSummaryStore?.temperature ?? 0,
    inspectorName: projectSummaryStore?.inspectorName ?? "",
    inspectorNumber: projectSummaryStore?.inspectorNumber ?? "",
    surroundingProperties: projectSummaryStore?.surroundingProperties ?? "",
  }), [projectSummaryStore?.lastModified])

  const { control, handleSubmit, watch, reset } = useForm<Step1FormValues>({
    defaultValues,
    mode: "onChange",
  })

  // Keep form in sync if store changes externally
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  // Autosave with small debounce
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        projectSummaryStore?.updateStep1(values)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, projectSummaryStore])

  const onNext = handleSubmit(() => {
    navigation.navigate("ProjectSummaryStep2" as never)
  })

  return (
    <Screen style={$root} preset="scroll" contentContainerStyle={$content}>
      <Text preset="heading" text="Project Summary - Step 1" />

      <View style={$fieldGroup}>
        <Controller
          control={control}
          name="projectName"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Project Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="projectNumber"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Project Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          )}
        />

        <Controller
          control={control}
          name="propertyAddress"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Property Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="propertyCity"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="City" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />

        <Controller
          control={control}
          name="propertyState"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="State" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />

        <Controller
          control={control}
          name="propertyZip"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="ZIP Code"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="weather"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Weather" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />

        <Controller
          control={control}
          name="temperature"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Temperature (°F)"
              value={String(value ?? "")}
              onChangeText={(txt) => onChange(Number(txt.replace(/[^0-9.-]/g, "")) || 0)}
              onBlur={onBlur}
              keyboardType="numeric"
            />
          )}
        />

        <Controller
          control={control}
          name="inspectorName"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Inspector Name" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />

        <Controller
          control={control}
          name="inspectorNumber"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField label="Inspector Number" value={value} onChangeText={onChange} onBlur={onBlur} />
          )}
        />

        <Controller
          control={control}
          name="surroundingProperties"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="Surrounding Properties"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
            />
          )}
        />
      </View>

      <Button preset="filled" text="Next" onPress={onNext} />
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
