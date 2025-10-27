import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, Platform, StyleSheet, ScrollView } from "react-native"
import { useForm, Controller } from "react-hook-form"
import { observer } from "mobx-react-lite"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { Dropdown } from "@/components/Dropdown"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models/RootStoreProvider"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { format as formatDateFns } from "date-fns/format"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useDrawerControl } from "@/context/DrawerContext"

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
  inspectionDate: Date
  inspectionTime: string
  inspectorName: string
  inspectorNumber: string
  surroundingProperties: string
}

export const ProjectSummaryStep1Screen: FC<ProjectSummaryStep1ScreenProps> = observer(() => {
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const defaultValues = useMemo<Step1FormValues>(() => ({
    projectName: projectSummaryStore?.projectName ?? "",
    projectNumber: projectSummaryStore?.projectNumber ?? "",
    propertyAddress: projectSummaryStore?.propertyAddress ?? "",
    propertyCity: projectSummaryStore?.propertyCity ?? "",
    propertyState: projectSummaryStore?.propertyState ?? "",
    propertyZip: projectSummaryStore?.propertyZip ?? "",
    weather: projectSummaryStore?.weather ?? "",
    temperature: projectSummaryStore?.temperature ?? 0,
    inspectionDate: projectSummaryStore?.inspectionDate ?? new Date(),
    inspectionTime: projectSummaryStore?.inspectionTime ?? "",
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
  const onBack = () => navigation.goBack()

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Project Summary" leftIcon="back" onLeftPress={onBack} rightIcon="view" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={$content} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Basic Info" style={themed($titleStyle)} />
          <ProgressBar current={1} total={4} />
        </View>
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

        <View style={$threeColumnContainer}>
          <Controller
            control={control}
            name="propertyCity"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField 
                label="City" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur}
                containerStyle={$cityField}
              />
            )}
          />

          <Controller
            control={control}
            name="propertyState"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField 
                label="State" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur}
                containerStyle={$stateField}
              />
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
                containerStyle={$zipField}
              />
            )}
          />
        </View>

        <View style={$twoColumnContainer}>
          <Controller
            control={control}
            name="weather"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField 
                label="Weather" 
                value={value} 
                onChangeText={onChange} 
                onBlur={onBlur}
                containerStyle={$weatherField}
              />
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
                containerStyle={$temperatureField}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="inspectionDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                label="Inspection Date"
                value={formatDateFns(value, "MMM dd, yyyy")}
                onChangeText={() => {}}
                onBlur={onBlur}
                showSoftInputOnFocus={false}
                onFocus={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    if (Platform.OS === "android") setShowDatePicker(false)
                    if (event.type === "dismissed") return
                    if (selectedDate) {
                      onChange(selectedDate)
                      onBlur()
                    }
                  }}
                  onTouchCancel={() => setShowDatePicker(false)}
                />
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="inspectionTime"
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                label="Inspection Time"
                value={value}
                onChangeText={() => {}}
                onBlur={onBlur}
                keyboardType="number-pad"
                showSoftInputOnFocus={false}
                onFocus={() => setShowTimePicker(true)}
              />
              {showTimePicker && (
                <DateTimePicker
                  value={value ? new Date(`1970-01-01T${value}:00`) : new Date()}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                    if (Platform.OS === "android") setShowTimePicker(false)
                    if (event.type === "dismissed") return
                    if (selectedDate) {
                      const formatted = formatDateFns(selectedDate, "HH:mm")
                      onChange(formatted)
                      onBlur()
                    }
                  }}
                  onTouchCancel={() => setShowTimePicker(false)}
                />
              )}
            </>
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
            <Dropdown
              label="Surrounding Properties"
              value={value}
              onValueChange={(newValue) => {
                onChange(newValue)
                onBlur()
              }}
              options={[
                { label: "Residential", value: "Residential" },
                { label: "Commercial", value: "Commercial" },
                { label: "Industrial", value: "Industrial" },
                { label: "Mixed Use", value: "Mixed Use" },
              ]}
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
  gap: 16,
}

const $fieldGroup: ViewStyle = {
  gap: 12,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $threeColumnContainer: ViewStyle = {
  ...$row,
}

const $twoColumnContainer: ViewStyle = {
  ...$row,
}

const $cityField: ViewStyle = {
  flex: 2,
}

const $stateField: ViewStyle = {
  flex: 1,
}

const $zipField: ViewStyle = {
  flex: 1,
}

const $weatherField: ViewStyle = {
  flex: 1,
}

const $temperatureField: ViewStyle = {
  flex: 1,
}

const $scrollArea: ViewStyle = { flex: 1, paddingTop: 72, paddingBottom: 96 }
const $progressHeaderText: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any })
const $titleStyle: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any, fontSize: 24, fontFamily: undefined })
const $screenInner: ViewStyle = { flex: 1 }

const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $introBlock: ViewStyle = { paddingBottom: 32 }
