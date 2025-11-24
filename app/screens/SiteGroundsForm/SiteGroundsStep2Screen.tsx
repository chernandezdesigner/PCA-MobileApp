import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity } from "react-native"
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
import type { ThemedStyle } from "@/theme/types"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Checkbox } from "@/components/Toggle/Checkbox"
import type { ChecklistItem } from "@/components/ChecklistCard"
import { ChecklistField } from "@/components/ChecklistField"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import {
  TOPOGRAPHY_SLOPE_OPTIONS,
  LANDSCAPING_OPTIONS,
  RETAINING_WALL_MATERIALS,
  SCREEN_WALL_MATERIALS,
  RAILING_MATERIALS,
  WATER_FEATURE_OPTIONS,
  PUMP_LOCATION_OPTIONS,
} from "@/constants/siteGroundsOptions"

interface SiteGroundsStep2ScreenProps
  extends NativeStackScreenProps<SiteGroundsFormNavigatorParamList, "SiteGroundsStep2"> {}

export const SiteGroundsStep2Screen: FC<SiteGroundsStep2ScreenProps> = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
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
    railingMaterials: string[]
    assessment: AssessmentVals
  }

  type Step2FormValues = {
    topographySlope: { topographySlopes: string[]; assessment: AssessmentVals }
    landscaping: { landscaping: string[]; assessment: AssessmentVals }
    retainingWalls: {
      retainingWallMaterials: string[]
      assessment: AssessmentVals
      railing: YesNo
      railingDetails: RailingDetailsVals
    }
    screenWalls: {
      screenWallMaterials: string[]
      assessment: AssessmentVals
      railing: YesNo
      railingDetails: RailingDetailsVals
    }
    waterFeatures: {
      waterFeatures: string[]
      pumpLocations: string[]
      pumpAge: string
      assessment: AssessmentVals
    }
    comments: string
  }

  const defaultValues = useMemo<Step2FormValues>(
    () => ({
      topographySlope: {
        topographySlopes: store?.topographySlope.topographySlopes.slice() ?? [],
        assessment: {
          condition: (store?.topographySlope.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.topographySlope.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.topographySlope.assessment.amountToRepair ?? "",
        },
      },
      landscaping: {
        landscaping: store?.landscaping.landscaping.slice() ?? [],
        assessment: {
          condition: (store?.landscaping.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.landscaping.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.landscaping.assessment.amountToRepair ?? "",
        },
      },
      retainingWalls: {
        retainingWallMaterials: store?.retainingWalls.retainingWallMaterials.slice() ?? [],
        assessment: {
          condition: (store?.retainingWalls.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.retainingWalls.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.retainingWalls.assessment.amountToRepair ?? "",
        },
        railing: (store?.retainingWalls.railing as YesNo) ?? "no",
        railingDetails: {
          railingMaterials: store?.retainingWalls.railingDetails?.railingMaterials.slice() ?? [],
          assessment: {
            condition: (store?.retainingWalls.railingDetails?.assessment.condition as ConditionT) ?? undefined as any,
            repairStatus: (store?.retainingWalls.railingDetails?.assessment.repairStatus as RepairT) ?? undefined as any,
            amountToRepair: store?.retainingWalls.railingDetails?.assessment.amountToRepair ?? "",
          },
        },
      },
      screenWalls: {
        screenWallMaterials: store?.screenWalls.screenWallMaterials.slice() ?? [],
        assessment: {
          condition: (store?.screenWalls.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.screenWalls.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.screenWalls.assessment.amountToRepair ?? "",
        },
        railing: (store?.screenWalls.railing as YesNo) ?? "no",
        railingDetails: {
          railingMaterials: store?.screenWalls.railingDetails?.railingMaterials.slice() ?? [],
          assessment: {
            condition: (store?.screenWalls.railingDetails?.assessment.condition as ConditionT) ?? undefined as any,
            repairStatus: (store?.screenWalls.railingDetails?.assessment.repairStatus as RepairT) ?? undefined as any,
            amountToRepair: store?.screenWalls.railingDetails?.assessment.amountToRepair ?? "",
          },
        },
      },
      waterFeatures: {
        waterFeatures: store?.waterFeatures.waterFeatures.slice() ?? [],
        pumpLocations: store?.waterFeatures.pumpLocations.slice() ?? [],
        pumpAge: store?.waterFeatures.pumpAge ?? "",
        assessment: {
          condition: (store?.waterFeatures.assessment.condition as ConditionT) ?? undefined as any,
          repairStatus: (store?.waterFeatures.assessment.repairStatus as RepairT) ?? undefined as any,
          amountToRepair: store?.waterFeatures.assessment.amountToRepair ?? "",
        },
      },
      comments: store?.comments ?? "",
    }),
    [rootStore.activeAssessmentId], // Only recalculate when assessment changes
  )

  const { control, reset, watch, setValue } = useForm<Step2FormValues>({ defaultValues, mode: "onChange" })
  
  // Initialize form from store only on mount or when assessment changes
  useEffect(() => { 
    reset(defaultValues) 
  }, [rootStore.activeAssessmentId]) // Only reset when switching assessments

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
        
        if (v.topographySlope) {
          const assessment = filterAssessment(v.topographySlope.assessment)
          store?.updateTopographySlope({ 
            topographySlopes: v.topographySlope.topographySlopes, 
            ...(assessment && { assessment })
          })
        }
        if (v.landscaping) {
          const assessment = filterAssessment(v.landscaping.assessment)
          store?.updateLandscaping({ 
            landscaping: v.landscaping.landscaping, 
            ...(assessment && { assessment })
          })
        }
        if (v.retainingWalls) {
          const assessment = filterAssessment(v.retainingWalls.assessment)
          const railingAssessment = v.retainingWalls.railing === "yes" && v.retainingWalls.railingDetails 
            ? filterAssessment(v.retainingWalls.railingDetails.assessment)
            : undefined
          store?.updateRetainingWalls({
            retainingWallMaterials: v.retainingWalls.retainingWallMaterials,
            ...(assessment && { assessment }),
            railing: v.retainingWalls.railing,
            ...(v.retainingWalls.railing === "yes" && v.retainingWalls.railingDetails && {
              railingDetails: {
                railingMaterials: v.retainingWalls.railingDetails.railingMaterials,
                ...(railingAssessment && { assessment: railingAssessment })
              }
            }),
          })
        }
        if (v.screenWalls) {
          const assessment = filterAssessment(v.screenWalls.assessment)
          const railingAssessment = v.screenWalls.railing === "yes" && v.screenWalls.railingDetails 
            ? filterAssessment(v.screenWalls.railingDetails.assessment)
            : undefined
          store?.updateScreenWalls({
            screenWallMaterials: v.screenWalls.screenWallMaterials,
            ...(assessment && { assessment }),
            railing: v.screenWalls.railing,
            ...(v.screenWalls.railing === "yes" && v.screenWalls.railingDetails && {
              railingDetails: {
                railingMaterials: v.screenWalls.railingDetails.railingMaterials,
                ...(railingAssessment && { assessment: railingAssessment })
              }
            }),
          })
        }
        if (v.waterFeatures) {
          const assessment = filterAssessment(v.waterFeatures.assessment)
          store?.updateWaterFeatures({
            waterFeatures: v.waterFeatures.waterFeatures,
            pumpLocations: v.waterFeatures.pumpLocations,
            pumpAge: v.waterFeatures.pumpAge,
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

  // Transform data for checklist cards
  const topographySlopesData = useWatch({ control, name: "topographySlope.topographySlopes" })
  const landscapingData = useWatch({ control, name: "landscaping.landscaping" })
  const retainingWallMaterialsData = useWatch({ control, name: "retainingWalls.retainingWallMaterials" })
  const retainingWallRailingMaterialsData = useWatch({ control, name: "retainingWalls.railingDetails.railingMaterials" })
  const screenWallMaterialsData = useWatch({ control, name: "screenWalls.screenWallMaterials" })
  const screenWallRailingMaterialsData = useWatch({ control, name: "screenWalls.railingDetails.railingMaterials" })
  const waterFeaturesData = useWatch({ control, name: "waterFeatures.waterFeatures" })
  const pumpLocationsData = useWatch({ control, name: "waterFeatures.pumpLocations" })

  const topographySlopeItems: ChecklistItem[] = TOPOGRAPHY_SLOPE_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: topographySlopesData?.includes(opt.id) ?? false,
  }))

  const landscapingItems: ChecklistItem[] = LANDSCAPING_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: landscapingData?.includes(opt.id) ?? false,
  }))

  const retainingWallMaterialItems: ChecklistItem[] = RETAINING_WALL_MATERIALS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: retainingWallMaterialsData?.includes(opt.id) ?? false,
  }))

  const retainingWallRailingItems: ChecklistItem[] = RAILING_MATERIALS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: retainingWallRailingMaterialsData?.includes(opt.id) ?? false,
  }))

  const screenWallMaterialItems: ChecklistItem[] = SCREEN_WALL_MATERIALS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: screenWallMaterialsData?.includes(opt.id) ?? false,
  }))

  const screenWallRailingItems: ChecklistItem[] = RAILING_MATERIALS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: screenWallRailingMaterialsData?.includes(opt.id) ?? false,
  }))

  const waterFeatureItems: ChecklistItem[] = WATER_FEATURE_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: waterFeaturesData?.includes(opt.id) ?? false,
  }))

  const pumpLocationItems: ChecklistItem[] = PUMP_LOCATION_OPTIONS.map(opt => ({
    id: opt.id,
    label: opt.label,
    checked: pumpLocationsData?.includes(opt.id) ?? false,
  }))

  // Helper to toggle array values using setValue
  const createArrayToggleHandler = (fieldPath: any, currentArray: string[] | undefined) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter(item => item !== id)
      setValue(fieldPath, newArray, { shouldDirty: true, shouldTouch: true })
    }
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Site & Grounds" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="menu" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Topography" style={themed($titleStyle)} />
          <ProgressBar current={2} total={4} />
        </View>

        <SectionAccordion
          title="Topography Slope"
          expanded={openKey === "topography"}
          onToggle={(n) => setOpenKey(n ? "topography" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Slope Type"
              items={topographySlopeItems}
              onToggle={createArrayToggleHandler("topographySlope.topographySlopes", topographySlopesData)}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.topographySlope.assessment.condition as any}
                onChange={(v) => store?.updateTopographySlope({ assessment: { condition: v } })}
              />
            </View>

          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.topographySlope.assessment.repairStatus as any}
              onChange={(v) => store?.updateTopographySlope({ assessment: { repairStatus: v } })}
            />
          </View>
          <Controller
            control={control}
            name="topographySlope.assessment.amountToRepair"
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
          title="Landscaping"
          expanded={openKey === "landscaping"}
          onToggle={(n) => setOpenKey(n ? "landscaping" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Landscaping Type"
              items={landscapingItems}
              onToggle={createArrayToggleHandler("landscaping.landscaping", landscapingData)}
            />
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.landscaping.assessment.condition as any}
              onChange={(v) => store?.updateLandscaping({ assessment: { condition: v } })}
            />
          </View>
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.landscaping.assessment.repairStatus as any}
              onChange={(v) => store?.updateLandscaping({ assessment: { repairStatus: v } })}
            />
          </View>
          <Controller
            control={control}
            name="landscaping.assessment.amountToRepair"
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
          title="Retaining Walls"
          expanded={!store?.retainingWalls.NotApplicable && openKey === "retainingWalls"}
          onToggle={(n) => {
            if (!store?.retainingWalls.NotApplicable) {
              setOpenKey(n ? "retainingWalls" : null)
            }
          }}
          headerStyle={
            store?.retainingWalls.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.retainingWalls.NotApplicable ?? false))}
              onPress={() => store?.updateRetainingWalls({ NotApplicable: !store?.retainingWalls.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.retainingWalls.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.retainingWalls.NotApplicable && (
            <View style={themed($sectionBody)}>
            <ChecklistField
              label="Retaining Walls Materials"
              items={retainingWallMaterialItems}
              onToggle={createArrayToggleHandler("retainingWalls.retainingWallMaterials", retainingWallMaterialsData)}
            />
          {retainingWallMaterialsData?.includes("other") && (
            <TextField
              label="Specify Other"
              placeholder="Specify type"
              value={store?.retainingWalls.otherType ?? ""}
              onChangeText={(t) => store?.updateRetainingWalls({ otherType: t })}
            />
          )}
          {/** Parent-level assessment for retaining walls */}
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.retainingWalls.assessment.condition as any}
              onChange={(v) => store?.updateRetainingWalls({ assessment: { condition: v } })}
            />
          </View>
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.retainingWalls.assessment.repairStatus as any}
              onChange={(v) => store?.updateRetainingWalls({ assessment: { repairStatus: v } })}
            />
          </View>
          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.retainingWalls.assessment.amountToRepair}
            onChangeText={(t) => store?.updateRetainingWalls({ assessment: { amountToRepair: t } })}
          />
          <View style={themed($radioRow)}>
            <Text preset="formLabel" text="Railings?" />
            <View style={themed($toggleWrap)}>
              <Checkbox
                value={store?.retainingWalls.railing === "yes"}
                onValueChange={(checked) => store?.updateRetainingWalls({ railing: checked ? "yes" : "no" })}
              />
              <View style={$pill(store?.retainingWalls.railing === "yes")}> 
                <Text text={store?.retainingWalls.railing === "yes" ? "Yes" : "No"} />
              </View>
            </View>
          </View>
          {store?.retainingWalls.railing === "yes" && (
            <View style={themed($nestedList)}>
              <Text preset="subheading" text="Railing" />
              <View style={themed($nestedCard)}>
                <ChecklistField
                  label="Railing Materials"
                  items={retainingWallRailingItems}
                  onToggle={createArrayToggleHandler("retainingWalls.railingDetails.railingMaterials", retainingWallRailingMaterialsData)}
                />
                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.retainingWalls.railingDetails?.assessment.condition as any}
                    onChange={(v) =>
                      store?.retainingWalls.railingDetails
                        ? store?.retainingWalls.railingDetails.update({ assessment: { condition: v } })
                        : store?.updateRetainingWalls({ railingDetails: { assessment: { condition: v } } as any })
                    }
                  />
                </View>
                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.retainingWalls.railingDetails?.assessment.repairStatus as any}
                    onChange={(v) =>
                      store?.retainingWalls.railingDetails
                        ? store?.retainingWalls.railingDetails.update({ assessment: { repairStatus: v } })
                        : store?.updateRetainingWalls({ railingDetails: { assessment: { repairStatus: v } } as any })
                    }
                  />
                </View>
                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
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
           )}
        </SectionAccordion>

        <SectionAccordion
          title="Screen Walls"
          expanded={!store?.screenWalls.NotApplicable && openKey === "screenWalls"}
          onToggle={(n) => {
            if (!store?.screenWalls.NotApplicable) {
              setOpenKey(n ? "screenWalls" : null)
            }
          }}
          headerStyle={
            store?.screenWalls.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.screenWalls.NotApplicable ?? false))}
              onPress={() => store?.updateScreenWalls({ NotApplicable: !store?.screenWalls.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.screenWalls.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.screenWalls.NotApplicable && (
            <View style={themed($sectionBody)}>
            <ChecklistField
              label="Screen Walls Materials"
              items={screenWallMaterialItems}
              onToggle={createArrayToggleHandler("screenWalls.screenWallMaterials", screenWallMaterialsData)}
            />
          {screenWallMaterialsData?.includes("other") && (
            <TextField
              label="Specify Other"
              placeholder="Specify type"
              value={store?.screenWalls.otherType ?? ""}
              onChangeText={(t) => store?.updateScreenWalls({ otherType: t })}
            />
          )}
          {/** Parent-level assessment for screen walls */}
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.screenWalls.assessment.condition as any}
              onChange={(v) => store?.updateScreenWalls({ assessment: { condition: v } })}
            />
          </View>
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.screenWalls.assessment.repairStatus as any}
              onChange={(v) => store?.updateScreenWalls({ assessment: { repairStatus: v } })}
            />
          </View>
          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.screenWalls.assessment.amountToRepair}
            onChangeText={(t) => store?.updateScreenWalls({ assessment: { amountToRepair: t } })}
          />
          <View style={themed($radioRow)}>
            <Text preset="formLabel" text="Railings?" />
            <View style={themed($toggleWrap)}>
              <Checkbox
                value={store?.screenWalls.railing === "yes"}
                onValueChange={(checked) => store?.updateScreenWalls({ railing: checked ? "yes" : "no" })}
              />
              <View style={$pill(store?.screenWalls.railing === "yes")}> 
                <Text text={store?.screenWalls.railing === "yes" ? "Yes" : "No"} />
              </View>
            </View>
          </View>
          {store?.screenWalls.railing === "yes" && (
            <View style={themed($nestedList)}>
              <Text preset="subheading" text="Railing" />
              <View style={themed($nestedCard)}>
                <ChecklistField
                  label="Railing Materials"
                  items={screenWallRailingItems}
                  onToggle={createArrayToggleHandler("screenWalls.railingDetails.railingMaterials", screenWallRailingMaterialsData)}
                />
                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Condition" />
                  <ConditionAssessment
                    value={store?.screenWalls.railingDetails?.assessment.condition as any}
                    onChange={(v) =>
                      store?.screenWalls.railingDetails
                        ? store?.screenWalls.railingDetails.update({ assessment: { condition: v } })
                        : store?.updateScreenWalls({ railingDetails: { assessment: { condition: v } } as any })
                    }
                  />
                </View>
                <View style={themed($controlGroup)}>
                  <Text preset="formLabel" text="Repair Status" />
                  <RepairStatus
                    value={store?.screenWalls.railingDetails?.assessment.repairStatus as any}
                    onChange={(v) =>
                      store?.screenWalls.railingDetails
                        ? store?.screenWalls.railingDetails.update({ assessment: { repairStatus: v } })
                        : store?.updateScreenWalls({ railingDetails: { assessment: { repairStatus: v } } as any })
                    }
                  />
                </View>
                <TextField
                  label="Amount to Repair ($)"
                  placeholder="Dollar amount"
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
           )}
        </SectionAccordion>

        <SectionAccordion
          title="Water Features"
          expanded={openKey === "waterFeatures"}
          onToggle={(n) => setOpenKey(n ? "waterFeatures" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Water Features Type"
              items={waterFeatureItems}
              onToggle={createArrayToggleHandler("waterFeatures.waterFeatures", waterFeaturesData)}
            />
            <ChecklistField
              label="Pump Location"
              items={pumpLocationItems}
              onToggle={createArrayToggleHandler("waterFeatures.pumpLocations", pumpLocationsData)}
            />
          <Controller
            control={control}
            name="waterFeatures.pumpAge"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField label="Pump Age" placeholder="Age in years" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Condition" />
            <ConditionAssessment
              value={store?.waterFeatures.assessment.condition as any}
              onChange={(v) => store?.updateWaterFeatures({ assessment: { condition: v } })}
            />
          </View>
          <View style={themed($controlGroup)}>
            <Text preset="formLabel" text="Repair Status" />
            <RepairStatus
              value={store?.waterFeatures.assessment.repairStatus as any}
              onChange={(v) => store?.updateWaterFeatures({ assessment: { repairStatus: v } })}
            />
          </View>
          <TextField
            label="Amount to Repair ($)"
            placeholder="Dollar amount"
            keyboardType="numeric"
            value={store?.waterFeatures.assessment.amountToRepair}
            onChangeText={(t) => store?.updateWaterFeatures({ assessment: { amountToRepair: t } })}
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
                placeholder="Note landscaping conditions, retaining wall issues, or other site features"
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
            // slide back
            // @ts-expect-error route params for animation
            navigation.navigate("SiteGroundsStep1" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // slide forward
            // @ts-expect-error route params for animation
            navigation.navigate("SiteGroundsStep3" as never, { transition: "slide_from_right" } as never)
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

const $content: ViewStyle = {
  // Remove side padding so accordions span full width and touch edges
  paddingTop: 88, // Header height (72) + spacing (16)
  paddingBottom: 96, // Footer height
  gap: 0,
}

const $sectionBody: ViewStyle = { gap: 16, paddingBottom: 16, paddingTop: 8 }

const $row: ViewStyle = {
  flexDirection: "row",
}

const $radioRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $radioChoices: ViewStyle = { flexDirection: "row", gap: 8 }

const $radioChip: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  borderWidth: 1,
}

const $radioChipSelected: ViewStyle = {
  borderColor: "#6366f1",
}

const $nestedList: ViewStyle = { gap: 16, paddingTop: 8 }

const $nestedCard: ViewStyle = { paddingHorizontal: 0, paddingVertical: 0, gap: 16}

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

const $scrollArea: ViewStyle = { flex: 1 }
const $paddedBlock: ViewStyle = { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16, gap: 8 }
const $commentsBlock: ViewStyle = { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 24, gap: 8 }
const $titleStyle: any = ({ colors }: any) => ({ color: colors.palette.primary2 as any, fontSize: 24 })
const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $toggleWrap: ViewStyle = { flexDirection: "row", alignItems: "center", gap: 8 }
const $pill = (on: boolean): ViewStyle => ({ height: 32, minWidth: 64, paddingHorizontal: 12, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: on ? "#dbeafe" : "#e5e7eb" })
const $controlGroup: ViewStyle = { gap: 8 }

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.background1,
})

const $naButton = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  height: 36,
  minWidth: 60,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 16,
  backgroundColor: isActive ? colors.palette.gray6 : "transparent",
  borderWidth: 1,
  borderColor: isActive ? colors.palette.gray6 : colors.palette.gray4,
})

const $naButtonText = (isActive: boolean): ThemedStyle<any> => ({ colors }) => ({
  color: isActive ? "#FFFFFF" : colors.palette.gray5,
  fontSize: 14,
  fontWeight: "600",
})
