import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SectionAccordion } from "@/components/SectionAccordion"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/theme/context"
import type { SiteGroundsFormNavigatorParamList } from "@/navigators/SiteGroundsFormNavigator"
import { Controller, useForm } from "react-hook-form"

interface SiteGroundsStep2ScreenProps
  extends NativeStackScreenProps<SiteGroundsFormNavigatorParamList, "SiteGroundsStep2"> {}

export const SiteGroundsStep2Screen: FC<SiteGroundsStep2ScreenProps> = observer(() => {
  const { themed, theme } = useAppTheme()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.siteGrounds.step2

  // local accordion control: only one open at a time, default all closed
  const [openKey, setOpenKey] = useState<string | null>(null)

  // react-hook-form setup
  type ConditionT = "good" | "fair" | "poor"
  type RepairT = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"
  type YesNo = "yes" | "no"

  type AssessmentVals = {
    condition: ConditionT
    repairStatus: RepairT
    amountToRepair: string
  }

  type RailingDetailsVals = {
    railingType: string
    assessment: AssessmentVals
  }

  type Step2FormValues = {
    topographySlope: { slopeType: string; assessment: AssessmentVals }
    landscaping: { landscapingType: string; assessment: AssessmentVals }
    retainingWalls: {
      retainingWallsType: string
      assessment: AssessmentVals
      railing: YesNo
      railingDetails: RailingDetailsVals
    }
    screenWalls: {
      screenWallsType: string
      assessment: AssessmentVals
      railing: YesNo
      railingDetails: RailingDetailsVals
    }
    waterFeatures: {
      waterFeaturesType: string
      pumpLocation: string
      pumpAge: string
      assessment: AssessmentVals
    }
    comments: string
  }

  const defaultValues = useMemo<Step2FormValues>(
    () => ({
      topographySlope: {
        slopeType: store?.topographySlope.slopeType ?? "",
        assessment: {
          condition: (store?.topographySlope.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.topographySlope.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.topographySlope.assessment.amountToRepair ?? "",
        },
      },
      landscaping: {
        landscapingType: store?.landscaping.landscapingType ?? "",
        assessment: {
          condition: (store?.landscaping.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.landscaping.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.landscaping.assessment.amountToRepair ?? "",
        },
      },
      retainingWalls: {
        retainingWallsType: store?.retainingWalls.retainingWallsType ?? "",
        assessment: {
          condition: (store?.retainingWalls.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.retainingWalls.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.retainingWalls.assessment.amountToRepair ?? "",
        },
        railing: (store?.retainingWalls.railing as YesNo) ?? "no",
        railingDetails: {
          railingType: store?.retainingWalls.railingDetails?.railingType ?? "",
          assessment: {
            condition: (store?.retainingWalls.railingDetails?.assessment.condition as ConditionT) ?? "good",
            repairStatus: (store?.retainingWalls.railingDetails?.assessment.repairStatus as RepairT) ?? "IR",
            amountToRepair: store?.retainingWalls.railingDetails?.assessment.amountToRepair ?? "",
          },
        },
      },
      screenWalls: {
        screenWallsType: store?.screenWalls.screenWallsType ?? "",
        assessment: {
          condition: (store?.screenWalls.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.screenWalls.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.screenWalls.assessment.amountToRepair ?? "",
        },
        railing: (store?.screenWalls.railing as YesNo) ?? "no",
        railingDetails: {
          railingType: store?.screenWalls.railingDetails?.railingType ?? "",
          assessment: {
            condition: (store?.screenWalls.railingDetails?.assessment.condition as ConditionT) ?? "good",
            repairStatus: (store?.screenWalls.railingDetails?.assessment.repairStatus as RepairT) ?? "IR",
            amountToRepair: store?.screenWalls.railingDetails?.assessment.amountToRepair ?? "",
          },
        },
      },
      waterFeatures: {
        waterFeaturesType: store?.waterFeatures.waterFeaturesType ?? "",
        pumpLocation: store?.waterFeatures.pumpLocation ?? "",
        pumpAge: store?.waterFeatures.pumpAge ?? "",
        assessment: {
          condition: (store?.waterFeatures.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.waterFeatures.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.waterFeatures.assessment.amountToRepair ?? "",
        },
      },
      comments: store?.comments ?? "",
    }),
    [store?.lastModified],
  )

  const { control, reset, watch } = useForm<Step2FormValues>({ defaultValues, mode: "onChange" })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const v = values as Required<Step2FormValues>
        store?.updateTopographySlope({ slopeType: v.topographySlope.slopeType, assessment: v.topographySlope.assessment as any })
        store?.updateLandscaping({ landscapingType: v.landscaping.landscapingType, assessment: v.landscaping.assessment as any })
        store?.updateRetainingWalls({
          retainingWallsType: v.retainingWalls.retainingWallsType,
          assessment: v.retainingWalls.assessment as any,
          railing: v.retainingWalls.railing,
          railingDetails: v.retainingWalls.railing === "yes" ? (v.retainingWalls.railingDetails as any) : undefined,
        })
        store?.updateScreenWalls({
          screenWallsType: v.screenWalls.screenWallsType,
          assessment: v.screenWalls.assessment as any,
          railing: v.screenWalls.railing,
          railingDetails: v.screenWalls.railing === "yes" ? (v.screenWalls.railingDetails as any) : undefined,
        })
        store?.updateWaterFeatures({
          waterFeaturesType: v.waterFeatures.waterFeaturesType,
          pumpLocation: v.waterFeatures.pumpLocation,
          pumpAge: v.waterFeatures.pumpAge,
          assessment: v.waterFeatures.assessment as any,
        })
        store?.updateComments(v.comments)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  return (
    <Screen style={$root} preset="scroll" contentContainerStyle={themed($content)}>
      <Text preset="heading" text="Site & Grounds - Topography, Landscaping, Walls, Water" />

      <SectionAccordion
        title="Topography & Slope"
        expanded={openKey === "topography"}
        onToggle={(n) => setOpenKey(n ? "topography" : null)}
      >
        <View style={themed($sectionBody)}>
          <Controller
            control={control}
            name="topographySlope.slopeType"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Slope Type"
                placeholder="e.g., Flat, Gentle, Steep"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

            <ConditionAssessment
              value={store?.topographySlope.assessment.condition as any}
              onChange={(v) => store?.updateTopographySlope({ assessment: { condition: v } })}
            />

          <RepairStatus
            value={store?.topographySlope.assessment.repairStatus as any}
            onChange={(v) => store?.updateTopographySlope({ assessment: { repairStatus: v } })}
          />
          <Controller
            control={control}
            name="topographySlope.assessment.amountToRepair"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Amount to Repair ($)"
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
        title="Landscaping"
        expanded={openKey === "landscaping"}
        onToggle={(n) => setOpenKey(n ? "landscaping" : null)}
      >
        <View style={themed($sectionBody)}>
          <Controller
            control={control}
            name="landscaping.landscapingType"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Landscaping Type"
                placeholder="e.g., Lawn, Xeriscape"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ConditionAssessment
            value={store?.landscaping.assessment.condition as any}
            onChange={(v) => store?.updateLandscaping({ assessment: { condition: v } })}
          />
          <RepairStatus
            value={store?.landscaping.assessment.repairStatus as any}
            onChange={(v) => store?.updateLandscaping({ assessment: { repairStatus: v } })}
          />
          <Controller
            control={control}
            name="landscaping.assessment.amountToRepair"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Amount to Repair ($)"
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
        title="Retaining Walls"
        expanded={openKey === "retainingWalls"}
        onToggle={(n) => setOpenKey(n ? "retainingWalls" : null)}
      >
        <View style={themed($sectionBody)}>
          <Controller
            control={control}
            name="retainingWalls.retainingWallsType"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Retaining Walls Type"
                placeholder="e.g., Concrete, Timber"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {/** Parent-level assessment for retaining walls */}
          <ConditionAssessment
            value={store?.retainingWalls.assessment.condition as any}
            onChange={(v) => store?.updateRetainingWalls({ assessment: { condition: v } })}
          />
          <RepairStatus
            value={store?.retainingWalls.assessment.repairStatus as any}
            onChange={(v) => store?.updateRetainingWalls({ assessment: { repairStatus: v } })}
          />
          <TextField
            label="Amount to Repair ($)"
            keyboardType="numeric"
            value={store?.retainingWalls.assessment.amountToRepair}
            onChangeText={(t) => store?.updateRetainingWalls({ assessment: { amountToRepair: t } })}
          />
          <View style={themed($radioRow)}>
            <Text preset="formLabel" text="Railings?" />
            <View style={themed($radioChoices)}>
              <Text
                text="Yes"
                onPress={() => store?.updateRetainingWalls({ railing: "yes" })}
                style={[themed($radioChip), store?.retainingWalls.railing === "yes" && themed($radioChipSelected)]}
              />
              <Text
                text="No"
                onPress={() => store?.updateRetainingWalls({ railing: "no" })}
                style={[themed($radioChip), store?.retainingWalls.railing === "no" && themed($radioChipSelected)]}
              />
            </View>
          </View>
          {store?.retainingWalls.railing === "yes" && (
            <View style={themed($nestedList)}>
              <Text preset="subheading" text="Railing" />
              <View style={themed($nestedCard)}>
                <TextField
                  label="Railing Type"
                  placeholder="e.g., Metal, Wood"
                  value={store?.retainingWalls.railingDetails?.railingType ?? ""}
                  onChangeText={(t) => {
                    if (store?.retainingWalls.railingDetails) {
                      store?.retainingWalls.railingDetails.update({ railingType: t })
                    } else {
                      store?.updateRetainingWalls({ railingDetails: { railingType: t } as any })
                    }
                  }}
                />
                <ConditionAssessment
                  value={store?.retainingWalls.railingDetails?.assessment.condition as any}
                  onChange={(v) =>
                    store?.retainingWalls.railingDetails
                      ? store?.retainingWalls.railingDetails.update({ assessment: { condition: v } })
                      : store?.updateRetainingWalls({ railingDetails: { assessment: { condition: v } } as any })
                  }
                />
                <RepairStatus
                  value={store?.retainingWalls.railingDetails?.assessment.repairStatus as any}
                  onChange={(v) =>
                    store?.retainingWalls.railingDetails
                      ? store?.retainingWalls.railingDetails.update({ assessment: { repairStatus: v } })
                      : store?.updateRetainingWalls({ railingDetails: { assessment: { repairStatus: v } } as any })
                  }
                />
                <TextField
                  label="Amount to Repair ($)"
                  keyboardType="numeric"
                  value={store?.retainingWalls.railingDetails?.assessment.amountToRepair ?? ""}
                  onChangeText={(t) =>
                    store?.retainingWalls.railingDetails
                      ? store?.retainingWalls.railingDetails.update({ assessment: { amountToRepair: t } })
                      : store?.updateRetainingWalls({ railingDetails: { assessment: { amountToRepair: t } } as any })
                  }
                />
              </View>
            </View>
          )}
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Screen Walls"
        expanded={openKey === "screenWalls"}
        onToggle={(n) => setOpenKey(n ? "screenWalls" : null)}
      >
        <View style={themed($sectionBody)}>
          <Controller
            control={control}
            name="screenWalls.screenWallsType"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Screen Walls Type"
                placeholder="e.g., CMU, Fence"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {/** Parent-level assessment for screen walls */}
          <ConditionAssessment
            value={store?.screenWalls.assessment.condition as any}
            onChange={(v) => store?.updateScreenWalls({ assessment: { condition: v } })}
          />
          <RepairStatus
            value={store?.screenWalls.assessment.repairStatus as any}
            onChange={(v) => store?.updateScreenWalls({ assessment: { repairStatus: v } })}
          />
          <TextField
            label="Amount to Repair ($)"
            keyboardType="numeric"
            value={store?.screenWalls.assessment.amountToRepair}
            onChangeText={(t) => store?.updateScreenWalls({ assessment: { amountToRepair: t } })}
          />
          <View style={themed($radioRow)}>
            <Text preset="formLabel" text="Railings?" />
            <View style={themed($radioChoices)}>
              <Text
                text="Yes"
                onPress={() => store?.updateScreenWalls({ railing: "yes" })}
                style={[themed($radioChip), store?.screenWalls.railing === "yes" && themed($radioChipSelected)]}
              />
              <Text
                text="No"
                onPress={() => store?.updateScreenWalls({ railing: "no" })}
                style={[themed($radioChip), store?.screenWalls.railing === "no" && themed($radioChipSelected)]}
              />
            </View>
          </View>
          {store?.screenWalls.railing === "yes" && (
            <View style={themed($nestedList)}>
              <Text preset="subheading" text="Railing" />
              <View style={themed($nestedCard)}>
                <TextField
                  label="Railing Type"
                  value={store?.screenWalls.railingDetails?.railingType ?? ""}
                  onChangeText={(t) => {
                    if (store?.screenWalls.railingDetails) {
                      store?.screenWalls.railingDetails.update({ railingType: t })
                    } else {
                      store?.updateScreenWalls({ railingDetails: { railingType: t } as any })
                    }
                  }}
                />
                <ConditionAssessment
                  value={store?.screenWalls.railingDetails?.assessment.condition as any}
                  onChange={(v) =>
                    store?.screenWalls.railingDetails
                      ? store?.screenWalls.railingDetails.update({ assessment: { condition: v } })
                      : store?.updateScreenWalls({ railingDetails: { assessment: { condition: v } } as any })
                  }
                />
                <RepairStatus
                  value={store?.screenWalls.railingDetails?.assessment.repairStatus as any}
                  onChange={(v) =>
                    store?.screenWalls.railingDetails
                      ? store?.screenWalls.railingDetails.update({ assessment: { repairStatus: v } })
                      : store?.updateScreenWalls({ railingDetails: { assessment: { repairStatus: v } } as any })
                  }
                />
                <TextField
                  label="Amount to Repair ($)"
                  keyboardType="numeric"
                  value={store?.screenWalls.railingDetails?.assessment.amountToRepair ?? ""}
                  onChangeText={(t) =>
                    store?.screenWalls.railingDetails
                      ? store?.screenWalls.railingDetails.update({ assessment: { amountToRepair: t } })
                      : store?.updateScreenWalls({ railingDetails: { assessment: { amountToRepair: t } } as any })
                  }
                />
              </View>
            </View>
          )}
        </View>
      </SectionAccordion>

      <SectionAccordion
        title="Water Features"
        expanded={openKey === "waterFeatures"}
        onToggle={(n) => setOpenKey(n ? "waterFeatures" : null)}
      >
        <View style={themed($sectionBody)}>
          <Controller
            control={control}
            name="waterFeatures.waterFeaturesType"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Water Features Type"
                placeholder="e.g., Fountain, Pond"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="waterFeatures.pumpLocation"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField label="Pump Location" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          <Controller
            control={control}
            name="waterFeatures.pumpAge"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField label="Pump Age" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          <ConditionAssessment
            value={store?.waterFeatures.assessment.condition as any}
            onChange={(v) => store?.updateWaterFeatures({ assessment: { condition: v } })}
          />
          <RepairStatus
            value={store?.waterFeatures.assessment.repairStatus as any}
            onChange={(v) => store?.updateWaterFeatures({ assessment: { repairStatus: v } })}
          />
          <TextField
            label="Amount to Repair ($)"
            keyboardType="numeric"
            value={store?.waterFeatures.assessment.amountToRepair}
            onChangeText={(t) => store?.updateWaterFeatures({ assessment: { amountToRepair: t } })}
          />
        </View>
      </SectionAccordion>

      <Controller
        control={control}
        name="comments"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField label="Comments" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />
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

const $sectionBody: ViewStyle = {
  gap: 12,
}

const $row: ViewStyle = {
  flexDirection: "row",
}

const $radioRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $radioChoices: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $radioChip: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  borderWidth: 1,
}

const $radioChipSelected: ViewStyle = {
  borderColor: "#6366f1",
}

const $nestedList: ViewStyle = {
  gap: 12,
}

const $nestedCard: ViewStyle = {
  padding: 12,
  borderRadius: 12,
  borderWidth: 1,
}

const $nestedHeader: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $chipButton: ViewStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderWidth: 1,
  borderRadius: 8,
}

const $chipButtonText: ViewStyle = {}
