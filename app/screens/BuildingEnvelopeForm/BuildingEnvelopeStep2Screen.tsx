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
import { Checkbox } from "@/components/Toggle/Checkbox"
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
import {
  lateralWallsOptions,
  groundFloorDeckingOptions,
  upperFloorDeckingOptions,
  mezzanineOptions,
  roofframingwoodOptions,
  roofframingsteelOptions,
  sheathingOptions,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep2ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep2"> {}

export const BuildingEnvelopeStep2Screen: FC<BuildingEnvelopeStep2ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step2

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

  type Step2FormValues = {
    wallsLateral: { lateralWalls: string[]; assessment: AssessmentVals }
    groundFloorDecking: { groundFloorDecking: string[]; assessment: AssessmentVals }
    upperFloorDecking: { upperFloorDecking: string[]; assessment: AssessmentVals }
    mezzanine: { mezzanine: string[]; assessment: AssessmentVals }
    roofFraming: { 
      roofFramingwood: string[]
      roofFramingsteel: string[]
      concreteframecolumnsandbeams: boolean
      assessment: AssessmentVals 
    }
    sheathing: { sheathing: string[]; assessment: AssessmentVals }
    comments: string
  }

  // Initialize default values from store
  const defaultValues = useMemo<Step2FormValues>(
    () => ({
      wallsLateral: {
        lateralWalls: store?.wallsLateral.lateralWalls.slice() ?? [],
        assessment: {
          condition: (store?.wallsLateral.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.wallsLateral.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.wallsLateral.assessment.amountToRepair ?? "",
        },
      },
      groundFloorDecking: {
        groundFloorDecking: store?.groundFloorDecking.groundFloorDecking.slice() ?? [],
        assessment: {
          condition: (store?.groundFloorDecking.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.groundFloorDecking.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.groundFloorDecking.assessment.amountToRepair ?? "",
        },
      },
      upperFloorDecking: {
        upperFloorDecking: store?.upperFloorDecking.upperFloorDecking.slice() ?? [],
        assessment: {
          condition: (store?.upperFloorDecking.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.upperFloorDecking.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.upperFloorDecking.assessment.amountToRepair ?? "",
        },
      },
      mezzanine: {
        mezzanine: store?.mezzanine.mezzanine.slice() ?? [],
        assessment: {
          condition: (store?.mezzanine.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.mezzanine.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.mezzanine.assessment.amountToRepair ?? "",
        },
      },
      roofFraming: {
        roofFramingwood: store?.roofFraming.roofFramingwood.slice() ?? [],
        roofFramingsteel: store?.roofFraming.roofFramingsteel.slice() ?? [],
        concreteframecolumnsandbeams: store?.roofFraming.concreteframecolumnsandbeams ?? false,
        assessment: {
          condition: (store?.roofFraming.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.roofFraming.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.roofFraming.assessment.amountToRepair ?? "",
        },
      },
      sheathing: {
        sheathing: store?.sheathing.sheathing.slice() ?? [],
        assessment: {
          condition: (store?.sheathing.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.sheathing.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.sheathing.assessment.amountToRepair ?? "",
        },
      },
      comments: store?.comments ?? "",
    }),
    [rootStore.activeAssessmentId],
  )

  const { control, reset, watch, setValue } = useForm<Step2FormValues>({
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
        const v = values as Step2FormValues

        // Helper to filter out undefined values from assessment
        const filterAssessment = (assessment: any) => {
          const filtered: any = {}
          if (assessment?.condition !== undefined) filtered.condition = assessment.condition
          if (assessment?.repairStatus !== undefined) filtered.repairStatus = assessment.repairStatus
          if (assessment?.amountToRepair !== undefined) filtered.amountToRepair = assessment.amountToRepair
          return Object.keys(filtered).length > 0 ? filtered : undefined
        }

        if (v.wallsLateral) {
          const assessment = filterAssessment(v.wallsLateral.assessment)
          store?.updateWallsLateral({
            lateralWalls: v.wallsLateral.lateralWalls,
            ...(assessment && { assessment }),
          })
        }
        if (v.groundFloorDecking) {
          const assessment = filterAssessment(v.groundFloorDecking.assessment)
          store?.updateGroundFloorDecking({
            groundFloorDecking: v.groundFloorDecking.groundFloorDecking,
            ...(assessment && { assessment }),
          })
        }
        if (v.upperFloorDecking) {
          const assessment = filterAssessment(v.upperFloorDecking.assessment)
          store?.updateUpperFloorDecking({
            upperFloorDecking: v.upperFloorDecking.upperFloorDecking,
            ...(assessment && { assessment }),
          })
        }
        if (v.mezzanine) {
          const assessment = filterAssessment(v.mezzanine.assessment)
          store?.updateMezzanine({
            mezzanine: v.mezzanine.mezzanine,
            ...(assessment && { assessment }),
          })
        }
        if (v.roofFraming) {
          const assessment = filterAssessment(v.roofFraming.assessment)
          store?.updateRoofFraming({
            roofFramingwood: v.roofFraming.roofFramingwood,
            roofFramingsteel: v.roofFraming.roofFramingsteel,
            concreteframecolumnsandbeams: v.roofFraming.concreteframecolumnsandbeams,
            ...(assessment && { assessment }),
          })
        }
        if (v.sheathing) {
          const assessment = filterAssessment(v.sheathing.assessment)
          store?.updateSheathing({
            sheathing: v.sheathing.sheathing,
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
  const lateralWallsData = useWatch({ control, name: "wallsLateral.lateralWalls" })
  const groundFloorDeckingData = useWatch({ control, name: "groundFloorDecking.groundFloorDecking" })
  const upperFloorDeckingData = useWatch({ control, name: "upperFloorDecking.upperFloorDecking" })
  const mezzanineData = useWatch({ control, name: "mezzanine.mezzanine" })
  const roofFramingWoodData = useWatch({ control, name: "roofFraming.roofFramingwood" })
  const roofFramingSteelData = useWatch({ control, name: "roofFraming.roofFramingsteel" })
  const sheathingData = useWatch({ control, name: "sheathing.sheathing" })

  const lateralWallItems: ChecklistItem[] = lateralWallsOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: lateralWallsData?.includes(opt.id) ?? false,
  }))

  const groundFloorDeckingItems: ChecklistItem[] = groundFloorDeckingOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: groundFloorDeckingData?.includes(opt.id) ?? false,
  }))

  const upperFloorDeckingItems: ChecklistItem[] = upperFloorDeckingOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: upperFloorDeckingData?.includes(opt.id) ?? false,
  }))

  const mezzanineItems: ChecklistItem[] = mezzanineOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: mezzanineData?.includes(opt.id) ?? false,
  }))

  const roofFramingWoodItems: ChecklistItem[] = roofframingwoodOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: roofFramingWoodData?.includes(opt.id) ?? false,
  }))

  const roofFramingSteelItems: ChecklistItem[] = roofframingsteelOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: roofFramingSteelData?.includes(opt.id) ?? false,
  }))

  const sheathingItems: ChecklistItem[] = sheathingOptions.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: sheathingData?.includes(opt.id) ?? false,
  }))

  // Helper to toggle array values
  const createArrayToggleHandler = (fieldPath: any, currentArray: string[] | undefined) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      setValue(fieldPath, newArray, { shouldDirty: true, shouldTouch: true })
    }
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep1" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Superstructure" style={themed($titleStyle)} />
          <ProgressBar current={2} total={10} />
        </View>

        <SectionAccordion
          title="Walls (Lateral)"
          expanded={openKey === "wallsLateral"}
          onToggle={(n) => setOpenKey(n ? "wallsLateral" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Lateral Wall Types"
              items={lateralWallItems}
              onToggle={createArrayToggleHandler("wallsLateral.lateralWalls", lateralWallsData)}
            />

            {lateralWallsData?.includes("other") && (
              <TextField
                label="Specify Other Lateral Wall Type"
                placeholder="Describe the wall type..."
                value={store?.wallsLateral.otherSpecification ?? ""}
                onChangeText={(txt) => store?.updateWallsLateral({ otherSpecification: txt })}
                multiline
                numberOfLines={2}
              />
            )}

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.wallsLateral.assessment.condition as any}
                onChange={(v) => store?.updateWallsLateral({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.wallsLateral.assessment.repairStatus as any}
                onChange={(v) => store?.updateWallsLateral({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="wallsLateral.assessment.amountToRepair"
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
          title="Ground Floor Decking"
          expanded={openKey === "groundFloor"}
          onToggle={(n) => setOpenKey(n ? "groundFloor" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Decking Types"
              items={groundFloorDeckingItems}
              onToggle={createArrayToggleHandler("groundFloorDecking.groundFloorDecking", groundFloorDeckingData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.groundFloorDecking.assessment.condition as any}
                onChange={(v) => store?.updateGroundFloorDecking({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.groundFloorDecking.assessment.repairStatus as any}
                onChange={(v) => store?.updateGroundFloorDecking({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="groundFloorDecking.assessment.amountToRepair"
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
          title="Upper Floor Decking"
          expanded={openKey === "upperFloor"}
          onToggle={(n) => setOpenKey(n ? "upperFloor" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Decking Types"
              items={upperFloorDeckingItems}
              onToggle={createArrayToggleHandler("upperFloorDecking.upperFloorDecking", upperFloorDeckingData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.upperFloorDecking.assessment.condition as any}
                onChange={(v) => store?.updateUpperFloorDecking({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.upperFloorDecking.assessment.repairStatus as any}
                onChange={(v) => store?.updateUpperFloorDecking({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="upperFloorDecking.assessment.amountToRepair"
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
          title="Mezzanine"
          expanded={openKey === "mezzanine"}
          onToggle={(n) => setOpenKey(n ? "mezzanine" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Mezzanine Types"
              items={mezzanineItems}
              onToggle={createArrayToggleHandler("mezzanine.mezzanine", mezzanineData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.mezzanine.assessment.condition as any}
                onChange={(v) => store?.updateMezzanine({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.mezzanine.assessment.repairStatus as any}
                onChange={(v) => store?.updateMezzanine({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="mezzanine.assessment.amountToRepair"
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
          title="Roof Framing"
          expanded={openKey === "roofFraming"}
          onToggle={(n) => setOpenKey(n ? "roofFraming" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Roof Framing - Wood"
              items={roofFramingWoodItems}
              onToggle={createArrayToggleHandler("roofFraming.roofFramingwood", roofFramingWoodData)}
            />

            <ChecklistField
              label="Roof Framing - Steel"
              items={roofFramingSteelItems}
              onToggle={createArrayToggleHandler("roofFraming.roofFramingsteel", roofFramingSteelData)}
            />

            <View style={themed($checkboxRow)}>
              <Text preset="formLabel" text="Concrete frame (columns and beams)?" />
              <Controller
                control={control}
                name="roofFraming.concreteframecolumnsandbeams"
                render={({ field: { value, onChange } }) => (
                  <Checkbox value={value} onValueChange={onChange} />
                )}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.roofFraming.assessment.condition as any}
                onChange={(v) => store?.updateRoofFraming({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.roofFraming.assessment.repairStatus as any}
                onChange={(v) => store?.updateRoofFraming({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="roofFraming.assessment.amountToRepair"
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
          title="Sheathing"
          expanded={openKey === "sheathing"}
          onToggle={(n) => setOpenKey(n ? "sheathing" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Sheathing Types"
              items={sheathingItems}
              onToggle={createArrayToggleHandler("sheathing.sheathing", sheathingData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.sheathing.assessment.condition as any}
                onChange={(v) => store?.updateSheathing({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.sheathing.assessment.repairStatus as any}
                onChange={(v) => store?.updateSheathing({ assessment: { repairStatus: v } })}
              />
            </View>

            <Controller
              control={control}
              name="sheathing.assessment.amountToRepair"
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
                placeholder="Note any structural concerns, floor issues, or wall conditions"
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
        <StickyFooterNav
          onBack={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep1" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep3" as never, { transition: "slide_from_right" } as never)
          }}
          showCamera={true}
        />
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
