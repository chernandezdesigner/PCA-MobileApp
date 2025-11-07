import { FC, useEffect, useMemo, useRef, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SectionAccordion } from "@/components/SectionAccordion"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { Button } from "@/components/Button"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useAppTheme } from "@/theme/context"
import type { SiteGroundsFormNavigatorParamList } from "@/navigators/SiteGroundsFormNavigator"
import type { ThemedStyle } from "@/theme/types"
import { Controller, useForm } from "react-hook-form"
import { Dropdown } from "@/components/Dropdown"
import { HeaderBar } from "@/components/HeaderBar"
import { useDrawerControl } from "@/context/DrawerContext"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useNavigation } from "@react-navigation/native"

// Static dropdown options for step 4 inputs
const GENERAL_CONSTRUCTION_OPTIONS = [
  { label: "CMU", value: "CMU" },
  { label: "Tilt-up", value: "Tilt-up" },
  { label: "Light-Gauge Steel", value: "Light-Gauge Steel" },
  { label: "Wood", value: "Wood" },
]

interface SiteGroundsStep4ScreenProps
  extends NativeStackScreenProps<SiteGroundsFormNavigatorParamList, "SiteGroundsStep4"> {}

export const SiteGroundsStep4Screen: FC<SiteGroundsStep4ScreenProps> = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.siteGrounds.step4

  // local accordion control: only one open at a time, default all closed
  const [openKey, setOpenKey] = useState<string | null>(null)

  // react-hook-form setup
  type ConditionT = "good" | "fair" | "poor"
  type RepairT = "IR" | "ST" | "RR" | "RM" | "INV" | "NA"

  type AssessmentVals = {
    condition: ConditionT
    repairStatus: RepairT
    amountToRepair: string
  }

  type StructureVals = {
    GeneralConstruction: string
    RoofType: string
    assessment: AssessmentVals
  }

  type Step4FormValues = {
    carports: StructureVals
    maintenanceBldg: StructureVals
    firePumpBldg: StructureVals
    residentialGarages: StructureVals
    gazeboPavilion: StructureVals
    greenhouses: StructureVals
    laundryBldg: StructureVals
    wellPumpHouse: StructureVals
    sewerPumpHouse: StructureVals
    comments: string
  }

  const defaultValues = useMemo<Step4FormValues>(
    () => ({
      carports: {
        GeneralConstruction: store?.carports.GeneralConstruction ?? "",
        RoofType: store?.carports.RoofType ?? "",
        assessment: {
          condition: (store?.carports.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.carports.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.carports.assessment.amountToRepair ?? "",
        },
      },
      maintenanceBldg: {
        GeneralConstruction: store?.maintenanceBldg.GeneralConstruction ?? "",
        RoofType: store?.maintenanceBldg.RoofType ?? "",
        assessment: {
          condition: (store?.maintenanceBldg.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.maintenanceBldg.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.maintenanceBldg.assessment.amountToRepair ?? "",
        },
      },
      firePumpBldg: {
        GeneralConstruction: store?.firePumpBldg.GeneralConstruction ?? "",
        RoofType: store?.firePumpBldg.RoofType ?? "",
        assessment: {
          condition: (store?.firePumpBldg.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.firePumpBldg.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.firePumpBldg.assessment.amountToRepair ?? "",
        },
      },
      residentialGarages: {
        GeneralConstruction: store?.residentialGarages.GeneralConstruction ?? "",
        RoofType: store?.residentialGarages.RoofType ?? "",
        assessment: {
          condition: (store?.residentialGarages.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.residentialGarages.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.residentialGarages.assessment.amountToRepair ?? "",
        },
      },
      gazeboPavilion: {
        GeneralConstruction: store?.gazeboPavilion.GeneralConstruction ?? "",
        RoofType: store?.gazeboPavilion.RoofType ?? "",
        assessment: {
          condition: (store?.gazeboPavilion.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.gazeboPavilion.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.gazeboPavilion.assessment.amountToRepair ?? "",
        },
      },
      greenhouses: {
        GeneralConstruction: store?.greenhouses.GeneralConstruction ?? "",
        RoofType: store?.greenhouses.RoofType ?? "",
        assessment: {
          condition: (store?.greenhouses.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.greenhouses.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.greenhouses.assessment.amountToRepair ?? "",
        },
      },
      laundryBldg: {
        GeneralConstruction: store?.laundryBldg.GeneralConstruction ?? "",
        RoofType: store?.laundryBldg.RoofType ?? "",
        assessment: {
          condition: (store?.laundryBldg.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.laundryBldg.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.laundryBldg.assessment.amountToRepair ?? "",
        },
      },
      wellPumpHouse: {
        GeneralConstruction: store?.wellPumpHouse.GeneralConstruction ?? "",
        RoofType: store?.wellPumpHouse.RoofType ?? "",
        assessment: {
          condition: (store?.wellPumpHouse.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.wellPumpHouse.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.wellPumpHouse.assessment.amountToRepair ?? "",
        },
      },
      sewerPumpHouse: {
        GeneralConstruction: store?.sewerPumpHouse.GeneralConstruction ?? "",
        RoofType: store?.sewerPumpHouse.RoofType ?? "",
        assessment: {
          condition: (store?.sewerPumpHouse.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.sewerPumpHouse.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.sewerPumpHouse.assessment.amountToRepair ?? "",
        },
      },
      comments: store?.comments ?? "",
    }),
    [store?.lastModified],
  )

  const { control, reset, watch } = useForm<Step4FormValues>({ defaultValues, mode: "onChange" })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const v = values as Required<Step4FormValues>
        store?.updateCarports({ GeneralConstruction: v.carports.GeneralConstruction, RoofType: v.carports.RoofType, assessment: v.carports.assessment as any })
        store?.updateMaintenanceBldg({ GeneralConstruction: v.maintenanceBldg.GeneralConstruction, RoofType: v.maintenanceBldg.RoofType, assessment: v.maintenanceBldg.assessment as any })
        store?.updateFirePumpBldg({ GeneralConstruction: v.firePumpBldg.GeneralConstruction, RoofType: v.firePumpBldg.RoofType, assessment: v.firePumpBldg.assessment as any })
        store?.updateResidentialGarages({ GeneralConstruction: v.residentialGarages.GeneralConstruction, RoofType: v.residentialGarages.RoofType, assessment: v.residentialGarages.assessment as any })
        store?.updateGazeboPavilion({ GeneralConstruction: v.gazeboPavilion.GeneralConstruction, RoofType: v.gazeboPavilion.RoofType, assessment: v.gazeboPavilion.assessment as any })
        store?.updateGreenhouses({ GeneralConstruction: v.greenhouses.GeneralConstruction, RoofType: v.greenhouses.RoofType, assessment: v.greenhouses.assessment as any })
        store?.updateLaundryBldg({ GeneralConstruction: v.laundryBldg.GeneralConstruction, RoofType: v.laundryBldg.RoofType, assessment: v.laundryBldg.assessment as any })
        store?.updateWellPumpHouse({ GeneralConstruction: v.wellPumpHouse.GeneralConstruction, RoofType: v.wellPumpHouse.RoofType, assessment: v.wellPumpHouse.assessment as any })
        store?.updateSewerPumpHouse({ GeneralConstruction: v.sewerPumpHouse.GeneralConstruction, RoofType: v.sewerPumpHouse.RoofType, assessment: v.sewerPumpHouse.assessment as any })
        store?.updateComments(v.comments)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  // Check if all sections are marked as N/A
  const allMarkedAsNA = useMemo(() => {
    return (
      store?.carports.NotApplicable &&
      store?.maintenanceBldg.NotApplicable &&
      store?.firePumpBldg.NotApplicable &&
      store?.residentialGarages.NotApplicable &&
      store?.gazeboPavilion.NotApplicable &&
      store?.greenhouses.NotApplicable &&
      store?.laundryBldg.NotApplicable &&
      store?.wellPumpHouse.NotApplicable &&
      store?.sewerPumpHouse.NotApplicable
    )
  }, [
    store?.carports.NotApplicable,
    store?.maintenanceBldg.NotApplicable,
    store?.firePumpBldg.NotApplicable,
    store?.residentialGarages.NotApplicable,
    store?.gazeboPavilion.NotApplicable,
    store?.greenhouses.NotApplicable,
    store?.laundryBldg.NotApplicable,
    store?.wellPumpHouse.NotApplicable,
    store?.sewerPumpHouse.NotApplicable,
  ])

  const handleToggleAllNA = () => {
    const newValue = !allMarkedAsNA
    store?.updateStepNotApplicable(newValue)
    store?.updateCarports({ NotApplicable: newValue })
    store?.updateMaintenanceBldg({ NotApplicable: newValue })
    store?.updateFirePumpBldg({ NotApplicable: newValue })
    store?.updateResidentialGarages({ NotApplicable: newValue })
    store?.updateGazeboPavilion({ NotApplicable: newValue })
    store?.updateGreenhouses({ NotApplicable: newValue })
    store?.updateLaundryBldg({ NotApplicable: newValue })
    store?.updateWellPumpHouse({ NotApplicable: newValue })
    store?.updateSewerPumpHouse({ NotApplicable: newValue })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Site & Grounds" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="menu" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Miscellaneous Structures" style={themed($titleStyle)} />
          <ProgressBar current={4} total={4} />
        </View>

        {/* Carports */}
        <SectionAccordion
          title="Carports"
          expanded={!store?.carports.NotApplicable && openKey === "carports"}
          onToggle={(n) => {
            if (!store?.carports.NotApplicable) {
              setOpenKey(n ? "carports" : null)
            }
          }}
          headerStyle={store?.carports.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.carports.NotApplicable ?? false))}
              onPress={() => store?.updateCarports({ NotApplicable: !store?.carports.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.carports.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.carports.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="carports.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="carports.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.carports.assessment.condition as any}
                  onChange={(v) => store?.updateCarports({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.carports.assessment.repairStatus as any}
                  onChange={(v) => store?.updateCarports({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="carports.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Maintenance Building */}
        <SectionAccordion
          title="Maintenance Building"
          expanded={!store?.maintenanceBldg.NotApplicable && openKey === "maintenanceBldg"}
          onToggle={(n) => {
            if (!store?.maintenanceBldg.NotApplicable) {
              setOpenKey(n ? "maintenanceBldg" : null)
            }
          }}
          headerStyle={store?.maintenanceBldg.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.maintenanceBldg.NotApplicable ?? false))}
              onPress={() => store?.updateMaintenanceBldg({ NotApplicable: !store?.maintenanceBldg.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.maintenanceBldg.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.maintenanceBldg.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="maintenanceBldg.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="maintenanceBldg.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.maintenanceBldg.assessment.condition as any}
                  onChange={(v) => store?.updateMaintenanceBldg({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.maintenanceBldg.assessment.repairStatus as any}
                  onChange={(v) => store?.updateMaintenanceBldg({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="maintenanceBldg.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Fire Pump Building */}
        <SectionAccordion
          title="Fire Pump Building"
          expanded={!store?.firePumpBldg.NotApplicable && openKey === "firePumpBldg"}
          onToggle={(n) => {
            if (!store?.firePumpBldg.NotApplicable) {
              setOpenKey(n ? "firePumpBldg" : null)
            }
          }}
          headerStyle={store?.firePumpBldg.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.firePumpBldg.NotApplicable ?? false))}
              onPress={() => store?.updateFirePumpBldg({ NotApplicable: !store?.firePumpBldg.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.firePumpBldg.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.firePumpBldg.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="firePumpBldg.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="firePumpBldg.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.firePumpBldg.assessment.condition as any}
                  onChange={(v) => store?.updateFirePumpBldg({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.firePumpBldg.assessment.repairStatus as any}
                  onChange={(v) => store?.updateFirePumpBldg({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="firePumpBldg.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Residential Garages */}
        <SectionAccordion
          title="Residential Garages"
          expanded={!store?.residentialGarages.NotApplicable && openKey === "residentialGarages"}
          onToggle={(n) => {
            if (!store?.residentialGarages.NotApplicable) {
              setOpenKey(n ? "residentialGarages" : null)
            }
          }}
          headerStyle={store?.residentialGarages.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.residentialGarages.NotApplicable ?? false))}
              onPress={() => store?.updateResidentialGarages({ NotApplicable: !store?.residentialGarages.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.residentialGarages.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.residentialGarages.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="residentialGarages.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="residentialGarages.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.residentialGarages.assessment.condition as any}
                  onChange={(v) => store?.updateResidentialGarages({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.residentialGarages.assessment.repairStatus as any}
                  onChange={(v) => store?.updateResidentialGarages({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="residentialGarages.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Gazebo/Pavilion */}
        <SectionAccordion
          title="Gazebo/Pavilion"
          expanded={!store?.gazeboPavilion.NotApplicable && openKey === "gazeboPavilion"}
          onToggle={(n) => {
            if (!store?.gazeboPavilion.NotApplicable) {
              setOpenKey(n ? "gazeboPavilion" : null)
            }
          }}
          headerStyle={store?.gazeboPavilion.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.gazeboPavilion.NotApplicable ?? false))}
              onPress={() => store?.updateGazeboPavilion({ NotApplicable: !store?.gazeboPavilion.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.gazeboPavilion.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.gazeboPavilion.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="gazeboPavilion.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="gazeboPavilion.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.gazeboPavilion.assessment.condition as any}
                  onChange={(v) => store?.updateGazeboPavilion({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.gazeboPavilion.assessment.repairStatus as any}
                  onChange={(v) => store?.updateGazeboPavilion({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="gazeboPavilion.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Greenhouses */}
        <SectionAccordion
          title="Greenhouses"
          expanded={!store?.greenhouses.NotApplicable && openKey === "greenhouses"}
          onToggle={(n) => {
            if (!store?.greenhouses.NotApplicable) {
              setOpenKey(n ? "greenhouses" : null)
            }
          }}
          headerStyle={store?.greenhouses.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.greenhouses.NotApplicable ?? false))}
              onPress={() => store?.updateGreenhouses({ NotApplicable: !store?.greenhouses.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.greenhouses.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.greenhouses.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="greenhouses.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="greenhouses.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.greenhouses.assessment.condition as any}
                  onChange={(v) => store?.updateGreenhouses({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.greenhouses.assessment.repairStatus as any}
                  onChange={(v) => store?.updateGreenhouses({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="greenhouses.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Laundry Building */}
        <SectionAccordion
          title="Laundry Building"
          expanded={!store?.laundryBldg.NotApplicable && openKey === "laundryBldg"}
          onToggle={(n) => {
            if (!store?.laundryBldg.NotApplicable) {
              setOpenKey(n ? "laundryBldg" : null)
            }
          }}
          headerStyle={store?.laundryBldg.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.laundryBldg.NotApplicable ?? false))}
              onPress={() => store?.updateLaundryBldg({ NotApplicable: !store?.laundryBldg.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.laundryBldg.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.laundryBldg.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="laundryBldg.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="laundryBldg.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.laundryBldg.assessment.condition as any}
                  onChange={(v) => store?.updateLaundryBldg({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.laundryBldg.assessment.repairStatus as any}
                  onChange={(v) => store?.updateLaundryBldg({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="laundryBldg.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Well Pump House */}
        <SectionAccordion
          title="Well Pump House"
          expanded={!store?.wellPumpHouse.NotApplicable && openKey === "wellPumpHouse"}
          onToggle={(n) => {
            if (!store?.wellPumpHouse.NotApplicable) {
              setOpenKey(n ? "wellPumpHouse" : null)
            }
          }}
          headerStyle={store?.wellPumpHouse.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.wellPumpHouse.NotApplicable ?? false))}
              onPress={() => store?.updateWellPumpHouse({ NotApplicable: !store?.wellPumpHouse.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.wellPumpHouse.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.wellPumpHouse.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="wellPumpHouse.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="wellPumpHouse.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.wellPumpHouse.assessment.condition as any}
                  onChange={(v) => store?.updateWellPumpHouse({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.wellPumpHouse.assessment.repairStatus as any}
                  onChange={(v) => store?.updateWellPumpHouse({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="wellPumpHouse.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        {/* Sewer Pump House */}
        <SectionAccordion
          title="Sewer Pump House"
          expanded={!store?.sewerPumpHouse.NotApplicable && openKey === "sewerPumpHouse"}
          onToggle={(n) => {
            if (!store?.sewerPumpHouse.NotApplicable) {
              setOpenKey(n ? "sewerPumpHouse" : null)
            }
          }}
          headerStyle={store?.sewerPumpHouse.NotApplicable ? themed($naHeaderStyle) : undefined}
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.sewerPumpHouse.NotApplicable ?? false))}
              onPress={() => store?.updateSewerPumpHouse({ NotApplicable: !store?.sewerPumpHouse.NotApplicable })}
            >
              <Text text="N/A" style={themed($naButtonText(store?.sewerPumpHouse.NotApplicable ?? false))} />
            </TouchableOpacity>
          }
        >
          {!store?.sewerPumpHouse.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="sewerPumpHouse.GeneralConstruction"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="General Construction"
                    value={value}
                    onValueChange={onChange}
                    options={GENERAL_CONSTRUCTION_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="sewerPumpHouse.RoofType"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Roof Type"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.sewerPumpHouse.assessment.condition as any}
                  onChange={(v) => store?.updateSewerPumpHouse({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.sewerPumpHouse.assessment.repairStatus as any}
                  onChange={(v) => store?.updateSewerPumpHouse({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="sewerPumpHouse.assessment.amountToRepair"
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
          )}
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <Controller
            control={control}
            name="comments"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Comments"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                minRows={2}
              />
            )}
          />
          
          <Button
            preset="default"
            text={allMarkedAsNA ? "Unmark Whole Step as N/A" : "Mark Whole Step as N/A"}
            onPress={handleToggleAllNA}
            style={themed($naStepButton)}
          />
        </View>
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => {
            // slide back
            // @ts-expect-error route params for animation
            navigation.navigate("SiteGroundsStep3" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // Navigate to next section or finish
            navigation.goBack()
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
  gap: 0,
}

const $sectionBody: ViewStyle = { gap: 16, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }

const $scrollArea: ViewStyle = { flex: 1, paddingTop: 72, paddingBottom: 96 }
const $paddedBlock: ViewStyle = { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 16, gap: 8 }
const $commentsBlock: ViewStyle = { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 24, gap: 16 }
const $titleStyle: any = ({ colors }: any) => ({ color: colors.palette.primary2 as any, fontSize: 24 })
const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
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

const $naStepButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  marginTop: 8,
  backgroundColor: colors.palette.neutral400,
})
