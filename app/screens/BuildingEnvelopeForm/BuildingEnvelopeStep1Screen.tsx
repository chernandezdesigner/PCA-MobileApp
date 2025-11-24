import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { ChecklistField } from "@/components/ChecklistField"
import type { ChecklistItem } from "@/components/ChecklistCard"
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
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import { FOUNDATION_SUBSTRUCTURE_OPTIONS, BASMENT_OPTIONS } from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep1ScreenProps 
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep1"> {}

export const BuildingEnvelopeStep1Screen: FC<BuildingEnvelopeStep1ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step1

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Form types
  type ConditionT = "good" | "fair" | "poor"
  type RepairT = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"

  type AssessmentVals = {
    condition: ConditionT
    repairStatus: RepairT
    amountToRepair: string
  }

  type Step1FormValues = {
    foundationSubstructure: {
      foundationTypes: string[]
      assessment: AssessmentVals
    }
    basement: {
      basementTypes: string[]
      assessment: AssessmentVals
    }
    comments: string
  }

  // Initialize default values from store
  const defaultValues = useMemo<Step1FormValues>(
    () => ({
      foundationSubstructure: {
        foundationTypes: store?.foundationSubstructure.foundationTypes.slice() ?? [],
        assessment: {
          condition: (store?.foundationSubstructure.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.foundationSubstructure.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.foundationSubstructure.assessment.amountToRepair ?? "",
        },
      },
      basement: {
        basementTypes: store?.basement.basementTypes.slice() ?? [],
        assessment: {
          condition: (store?.basement.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.basement.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.basement.assessment.amountToRepair ?? "",
        },
      },
      comments: store?.comments ?? "",
    }),
    [rootStore.activeAssessmentId],
  )

  const { control, reset, watch, setValue } = useForm<Step1FormValues>({
    defaultValues,
    mode: "onChange",
  })

  // Initialize form from store only on mount or when assessment changes
  useEffect(() => {
    reset(defaultValues)
  }, [rootStore.activeAssessmentId])

  // Autosave with debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const v = values as Step1FormValues

        // Helper to filter out undefined values from assessment
        const filterAssessment = (assessment: any) => {
          const filtered: any = {}
          if (assessment?.condition !== undefined) filtered.condition = assessment.condition
          if (assessment?.repairStatus !== undefined) filtered.repairStatus = assessment.repairStatus
          if (assessment?.amountToRepair !== undefined) filtered.amountToRepair = assessment.amountToRepair
          return Object.keys(filtered).length > 0 ? filtered : undefined
        }

        if (v.foundationSubstructure) {
          const assessment = filterAssessment(v.foundationSubstructure.assessment)
          store?.updateFoundationSubstructure({
            foundationTypes: v.foundationSubstructure.foundationTypes,
            ...(assessment && { assessment }),
          })
        }
        if (v.basement) {
          const assessment = filterAssessment(v.basement.assessment)
          store?.updateBasement({
            basementTypes: v.basement.basementTypes,
            ...(assessment && { assessment }),
          })
        }
        if (v.comments !== undefined) {
          store?.updateComments(v.comments)
        }
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  // Transform data for checklist fields
  const foundationTypesData = useWatch({ control, name: "foundationSubstructure.foundationTypes" })
  const basementTypesData = useWatch({ control, name: "basement.basementTypes" })

  const foundationTypeItems: ChecklistItem[] = FOUNDATION_SUBSTRUCTURE_OPTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    checked: foundationTypesData?.includes(item.id) ?? false,
  }))

  const basementTypeItems: ChecklistItem[] = BASMENT_OPTIONS.map((item) => ({
    id: item.id,
    label: item.label,
    checked: basementTypesData?.includes(item.id) ?? false,
  }))

  // Helper to toggle array values
  const createArrayToggleHandler = (fieldPath: any, currentArray: string[] | undefined) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      setValue(fieldPath, newArray, { shouldDirty: true, shouldTouch: true })
    }
  }

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("BuildingEnvelopeStep2" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Foundation & Substructure" style={themed($titleStyle)} />
          <ProgressBar current={1} total={10} />
        </View>

        <SectionAccordion
          title="Foundation/Substructure"
          expanded={openKey === "foundation"}
          onToggle={(n) => setOpenKey(n ? "foundation" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Foundation Types"
              items={foundationTypeItems}
              onToggle={createArrayToggleHandler("foundationSubstructure.foundationTypes", foundationTypesData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.foundationSubstructure.assessment.condition as any}
                onChange={(v) => store?.updateFoundationSubstructure({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.foundationSubstructure.assessment.repairStatus as any}
                onChange={(v) => store?.updateFoundationSubstructure({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="foundationSubstructure.assessment.amountToRepair"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Basement"
          expanded={openKey === "basement"}
          onToggle={(n) => setOpenKey(n ? "basement" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Basement Types"
              items={basementTypeItems}
              onToggle={createArrayToggleHandler("basement.basementTypes", basementTypesData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.basement.assessment.condition as any}
                onChange={(v) => store?.updateBasement({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.basement.assessment.repairStatus as any}
                onChange={(v) => store?.updateBasement({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="basement.assessment.amountToRepair"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <Controller
            control={control}
            name="comments"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Comments"
                placeholder="Note any foundation issues, settlement, or structural concerns"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                minRows={2}
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
  paddingTop: 88, // Header height (72) + spacing (16)
  paddingBottom: 96, // Footer height
  gap: 0,
}

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $sectionBody: ViewStyle = {
  gap: 16,
  paddingBottom: 16,
  paddingTop: 8,
}

const $controlGroup: ViewStyle = {
  gap: 8,
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

const $paddedBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 16,
  gap: 8,
}

const $commentsBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 24,
  gap: 8,
}

const $titleStyle: ThemedStyle<any> = ({ colors }) => ({
  color: colors.palette.primary2 as any,
  fontSize: 24,
  fontFamily: undefined,
})
