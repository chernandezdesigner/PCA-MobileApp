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
import { Controller, useForm } from "react-hook-form"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Dropdown } from "@/components/Dropdown"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useNavigation } from "@react-navigation/native"

// Static dropdown options for step 3 inputs
const SIGNAGE_TYPE_OPTIONS = [
  { label: "Monument", value: "Monument" },
  { label: "Wood Post", value: "Wood Post" },
  { label: "Pylon", value: "Pylon" },
  { label: "Bldg. Mounted", value: "Bldg. Mounted" },
]

const LOT_LIGHTING_TYPE_OPTIONS = [
  { label: "Metal Pole", value: "Metal Pole" },
  { label: "Wood Pole", value: "Wood Pole" },
]

const BLDG_LIGHTING_TYPE_OPTIONS = [
  { label: "Surface", value: "Surface" },
  { label: "Recessed in Soffits", value: "Recessed in Soffits" },
]

const SITE_FENCING_TYPE_OPTIONS = [
  { label: "Chain Link", value: "Chain Link" },
  { label: "Wood", value: "Wood" },
  { label: "CMU", value: "CMU" },
  { label: "Brick", value: "Brick" },
  { label: "Vinyl", value: "Vinyl" },
  { label: "Other", value: "Other" },
]

const ENCLOSURE_TYPE_OPTIONS = [
  { label: "Chain Link", value: "Chain Link" },
  { label: "Wood", value: "Wood" },
  { label: "CMU", value: "CMU" },
  { label: "Brick", value: "Brick" },
  { label: "Vinyl", value: "Vinyl" },
  { label: "Other", value: "Other" },
]

const GATE_TYPE_OPTIONS = [
  { label: "Chain Link", value: "Chain Link" },
  { label: "Wood", value: "Wood" },
  { label: "Metal (Solid)", value: "Metal (Solid)" },
  { label: "Metal (Tubular)", value: "Metal (Tubular)" },
]

const RECREATIONAL_FACILITIES_TYPE_OPTIONS = [
  { label: "BBQ Area", value: "BBQ Area" },
  { label: "Playground", value: "Playground" },
  { label: "Basketball Court", value: "Basketball Court" },
  { label: "Tennis Court", value: "Tennis Court" },
  { label: "Volleyball Court", value: "Volleyball Court" },
  { label: "Golf Course", value: "Golf Course" },
  { label: "Leisure Area", value: "Leisure Area" },
  { label: "Other", value: "Other" },
]

const BRIDGES_TYPE_OPTIONS = [
  { label: "Concrete", value: "Concrete" },
  { label: "Wood", value: "Wood" },
  { label: "Granite", value: "Granite" },
  { label: "Steel", value: "Steel" },
]

const RAILING_TYPE_OPTIONS = [
  { label: "Metal", value: "Metal" },
  { label: "Wood", value: "Wood" },
  { label: "Vinyl", value: "Vinyl" },
]

interface SiteGroundsStep3ScreenProps
  extends NativeStackScreenProps<SiteGroundsFormNavigatorParamList, "SiteGroundsStep3"> {}

export const SiteGroundsStep3Screen: FC<SiteGroundsStep3ScreenProps> = observer(() => {
  const { themed, theme } = useAppTheme()
  const navigation = useNavigation()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.siteGrounds.step3

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

  type Step3FormValues = {
    signage: { signageType: string; assessment: AssessmentVals }
    lotLighting: { lotLightingType: string; assessment: AssessmentVals }
    bldgLighting: { bldgLightingType: string; assessment: AssessmentVals }
    siteFencing: { siteFencingType: string; assessment: AssessmentVals }
    dumpster: {
      enclosureType: string
      gateType: string
      otherType: string
      location: string
      assessment: AssessmentVals
    }
    recreationalFacilities: {
      recreationalFacilitiesType: string
      otherType: string
      assessment: AssessmentVals
    }
    compactors: {
      tenantOwned: YesNo
      location: string
      assessment: AssessmentVals
    }
    bridges: {
      bridgesType: string
      assessment: AssessmentVals
      railing: YesNo
      railingDetails: RailingDetailsVals
    }
    comments: string
  }

  const defaultValues = useMemo<Step3FormValues>(
    () => ({
      signage: {
        signageType: store?.signage.signageType ?? "",
        assessment: {
          condition: (store?.signage.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.signage.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.signage.assessment.amountToRepair ?? "",
        },
      },
      lotLighting: {
        lotLightingType: store?.lotLighting.lotLightingType ?? "",
        assessment: {
          condition: (store?.lotLighting.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.lotLighting.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.lotLighting.assessment.amountToRepair ?? "",
        },
      },
      bldgLighting: {
        bldgLightingType: store?.bldgLighting.bldgLightingType ?? "",
        assessment: {
          condition: (store?.bldgLighting.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.bldgLighting.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.bldgLighting.assessment.amountToRepair ?? "",
        },
      },
      siteFencing: {
        siteFencingType: store?.siteFencing.siteFencingType ?? "",
        assessment: {
          condition: (store?.siteFencing.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.siteFencing.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.siteFencing.assessment.amountToRepair ?? "",
        },
      },
      dumpster: {
        enclosureType: store?.dumpster.enclosureType ?? "",
        gateType: store?.dumpster.gateType ?? "",
        otherType: store?.dumpster.otherType ?? "",
        location: store?.dumpster.location ?? "",
        assessment: {
          condition: (store?.dumpster.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.dumpster.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.dumpster.assessment.amountToRepair ?? "",
        },
      },
      recreationalFacilities: {
        recreationalFacilitiesType: store?.recreationalFacilities.recreationalFacilitiesType ?? "",
        otherType: store?.recreationalFacilities.otherType ?? "",
        assessment: {
          condition: (store?.recreationalFacilities.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.recreationalFacilities.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.recreationalFacilities.assessment.amountToRepair ?? "",
        },
      },
      compactors: {
        tenantOwned: (store?.compactors.tenantOwned as YesNo) ?? "no",
        location: store?.compactors.location ?? "",
        assessment: {
          condition: (store?.compactors.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.compactors.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.compactors.assessment.amountToRepair ?? "",
        },
      },
      bridges: {
        bridgesType: store?.bridges.bridgesType ?? "",
        assessment: {
          condition: (store?.bridges.assessment.condition as ConditionT) ?? "good",
          repairStatus: (store?.bridges.assessment.repairStatus as RepairT) ?? "IR",
          amountToRepair: store?.bridges.assessment.amountToRepair ?? "",
        },
        railing: (store?.bridges.railing as YesNo) ?? "no",
        railingDetails: {
          railingType: store?.bridges.railingDetails?.railingType ?? "",
          assessment: {
            condition: (store?.bridges.railingDetails?.assessment.condition as ConditionT) ?? "good",
            repairStatus: (store?.bridges.railingDetails?.assessment.repairStatus as RepairT) ?? "IR",
            amountToRepair: store?.bridges.railingDetails?.assessment.amountToRepair ?? "",
          },
        },
      },
      comments: store?.comments ?? "",
    }),
    [store?.lastModified],
  )

  const { control, reset, watch } = useForm<Step3FormValues>({ defaultValues, mode: "onChange" })
  useEffect(() => { reset(defaultValues) }, [defaultValues, reset])

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const v = values as Required<Step3FormValues>
        store?.updateSignage({ signageType: v.signage.signageType, assessment: v.signage.assessment as any })
        store?.updateLotLighting({ lotLightingType: v.lotLighting.lotLightingType, assessment: v.lotLighting.assessment as any })
        store?.updateBldgLighting({ bldgLightingType: v.bldgLighting.bldgLightingType, assessment: v.bldgLighting.assessment as any })
        store?.updateSiteFencing({ siteFencingType: v.siteFencing.siteFencingType, assessment: v.siteFencing.assessment as any })
        store?.updateDumpster({
          enclosureType: v.dumpster.enclosureType,
          gateType: v.dumpster.gateType,
          otherType: v.dumpster.otherType,
          location: v.dumpster.location,
          assessment: v.dumpster.assessment as any,
        })
        store?.updateRecreationalFacilities({
          recreationalFacilitiesType: v.recreationalFacilities.recreationalFacilitiesType,
          otherType: v.recreationalFacilities.otherType,
          assessment: v.recreationalFacilities.assessment as any,
        })
        store?.updateCompactors({
          tenantOwned: v.compactors.tenantOwned,
          location: v.compactors.location,
          assessment: v.compactors.assessment as any,
        })
        store?.updateBridges({
          bridgesType: v.bridges.bridgesType,
          assessment: v.bridges.assessment as any,
          railing: v.bridges.railing,
          railingDetails: v.bridges.railing === "yes" ? (v.bridges.railingDetails as any) : undefined,
        })
        store?.updateComments(v.comments)
      }, 300)
    })
    return () => subscription.unsubscribe()
  }, [watch, store])

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Site & Grounds" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="view" />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Site Elements" style={themed($titleStyle)} />
          <ProgressBar current={3} total={4} />
        </View>

        <SectionAccordion
          title="Signage"
          expanded={!store?.signage.NotApplicable && openKey === "signage"}
          onToggle={(n) => {
            if (!store?.signage.NotApplicable) {
              setOpenKey(n ? "signage" : null)
            }
          }}
          headerStyle={
            store?.signage.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.signage.NotApplicable ?? false))}
              onPress={() => store?.updateSignage({ NotApplicable: !store?.signage.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.signage.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.signage.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="signage.signageType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Signage Type"
                    value={value}
                    onValueChange={onChange}
                    options={SIGNAGE_TYPE_OPTIONS}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.signage.assessment.condition as any}
                  onChange={(v) => store?.updateSignage({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.signage.assessment.repairStatus as any}
                  onChange={(v) => store?.updateSignage({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="signage.assessment.amountToRepair"
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

        <SectionAccordion
          title="Lot Lighting"
          expanded={!store?.lotLighting.NotApplicable && openKey === "lotLighting"}
          onToggle={(n) => {
            if (!store?.lotLighting.NotApplicable) {
              setOpenKey(n ? "lotLighting" : null)
            }
          }}
          headerStyle={
            store?.lotLighting.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.lotLighting.NotApplicable ?? false))}
              onPress={() => store?.updateLotLighting({ NotApplicable: !store?.lotLighting.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.lotLighting.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.lotLighting.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="lotLighting.lotLightingType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Lot Lighting Type"
                    value={value}
                    onValueChange={onChange}
                    options={LOT_LIGHTING_TYPE_OPTIONS}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.lotLighting.assessment.condition as any}
                  onChange={(v) => store?.updateLotLighting({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.lotLighting.assessment.repairStatus as any}
                  onChange={(v) => store?.updateLotLighting({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="lotLighting.assessment.amountToRepair"
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

        <SectionAccordion
          title="Building Lighting"
          expanded={!store?.bldgLighting.NotApplicable && openKey === "bldgLighting"}
          onToggle={(n) => {
            if (!store?.bldgLighting.NotApplicable) {
              setOpenKey(n ? "bldgLighting" : null)
            }
          }}
          headerStyle={
            store?.bldgLighting.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.bldgLighting.NotApplicable ?? false))}
              onPress={() => store?.updateBldgLighting({ NotApplicable: !store?.bldgLighting.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.bldgLighting.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.bldgLighting.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="bldgLighting.bldgLightingType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Building Lighting Type"
                    value={value}
                    onValueChange={onChange}
                    options={BLDG_LIGHTING_TYPE_OPTIONS}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.bldgLighting.assessment.condition as any}
                  onChange={(v) => store?.updateBldgLighting({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.bldgLighting.assessment.repairStatus as any}
                  onChange={(v) => store?.updateBldgLighting({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="bldgLighting.assessment.amountToRepair"
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

        <SectionAccordion
          title="Site Fencing"
          expanded={!store?.siteFencing.NotApplicable && openKey === "siteFencing"}
          onToggle={(n) => {
            if (!store?.siteFencing.NotApplicable) {
              setOpenKey(n ? "siteFencing" : null)
            }
          }}
          headerStyle={
            store?.siteFencing.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.siteFencing.NotApplicable ?? false))}
              onPress={() => store?.updateSiteFencing({ NotApplicable: !store?.siteFencing.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.siteFencing.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.siteFencing.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="siteFencing.siteFencingType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Site Fencing Type"
                    value={value}
                    onValueChange={onChange}
                    options={SITE_FENCING_TYPE_OPTIONS}
                  />
                )}
              />
              {store?.siteFencing.siteFencingType === "Other" && (
                <TextField
                  label="Specify Other"
                  value={store?.siteFencing.otherType ?? ""}
                  onChangeText={(t) => store?.updateSiteFencing({ otherType: t })}
                  placeholder="Enter custom type"
                />
              )}
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.siteFencing.assessment.condition as any}
                  onChange={(v) => store?.updateSiteFencing({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.siteFencing.assessment.repairStatus as any}
                  onChange={(v) => store?.updateSiteFencing({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="siteFencing.assessment.amountToRepair"
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

        <SectionAccordion
          title="Dumpster Enclosure"
          expanded={!store?.dumpster.NotApplicable && openKey === "dumpster"}
          onToggle={(n) => {
            if (!store?.dumpster.NotApplicable) {
              setOpenKey(n ? "dumpster" : null)
            }
          }}
          headerStyle={
            store?.dumpster.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.dumpster.NotApplicable ?? false))}
              onPress={() => store?.updateDumpster({ NotApplicable: !store?.dumpster.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.dumpster.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.dumpster.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="dumpster.enclosureType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Enclosure Type"
                    value={value}
                    onValueChange={onChange}
                    options={ENCLOSURE_TYPE_OPTIONS}
                  />
                )}
              />
              {store?.dumpster.enclosureType === "Other" && (
                <Controller
                  control={control}
                  name="dumpster.otherType"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label="Specify Other"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter custom type"
                    />
                  )}
                />
              )}
              <Controller
                control={control}
                name="dumpster.gateType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Gate Type"
                    value={value}
                    onValueChange={onChange}
                    options={GATE_TYPE_OPTIONS}
                  />
                )}
              />
              <Controller
                control={control}
                name="dumpster.location"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Location"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.dumpster.assessment.condition as any}
                  onChange={(v) => store?.updateDumpster({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.dumpster.assessment.repairStatus as any}
                  onChange={(v) => store?.updateDumpster({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="dumpster.assessment.amountToRepair"
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

        <SectionAccordion
          title="Recreational Facilities"
          expanded={!store?.recreationalFacilities.NotApplicable && openKey === "recreationalFacilities"}
          onToggle={(n) => {
            if (!store?.recreationalFacilities.NotApplicable) {
              setOpenKey(n ? "recreationalFacilities" : null)
            }
          }}
          headerStyle={
            store?.recreationalFacilities.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.recreationalFacilities.NotApplicable ?? false))}
              onPress={() => store?.updateRecreationalFacilities({ NotApplicable: !store?.recreationalFacilities.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.recreationalFacilities.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.recreationalFacilities.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="recreationalFacilities.recreationalFacilitiesType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Facility Type"
                    value={value}
                    onValueChange={onChange}
                    options={RECREATIONAL_FACILITIES_TYPE_OPTIONS}
                  />
                )}
              />
              {store?.recreationalFacilities.recreationalFacilitiesType === "Other" && (
                <Controller
                  control={control}
                  name="recreationalFacilities.otherType"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      label="Specify Other"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter custom type"
                    />
                  )}
                />
              )}
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.recreationalFacilities.assessment.condition as any}
                  onChange={(v) => store?.updateRecreationalFacilities({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.recreationalFacilities.assessment.repairStatus as any}
                  onChange={(v) => store?.updateRecreationalFacilities({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="recreationalFacilities.assessment.amountToRepair"
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

        <SectionAccordion
          title="Compactors"
          expanded={!store?.compactors.NotApplicable && openKey === "compactors"}
          onToggle={(n) => {
            if (!store?.compactors.NotApplicable) {
              setOpenKey(n ? "compactors" : null)
            }
          }}
          headerStyle={
            store?.compactors.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.compactors.NotApplicable ?? false))}
              onPress={() => store?.updateCompactors({ NotApplicable: !store?.compactors.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.compactors.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.compactors.NotApplicable && (
            <View style={themed($sectionBody)}>
              <View style={themed($radioRow)}>
                <Text preset="formLabel" text="Tenant Owned?" />
                <View style={themed($toggleWrap)}>
                  <Checkbox
                    value={store?.compactors.tenantOwned === "yes"}
                    onValueChange={(checked) => store?.updateCompactors({ tenantOwned: checked ? "yes" : "no" })}
                  />
                  <View style={$pill(store?.compactors.tenantOwned === "yes")}> 
                    <Text text={store?.compactors.tenantOwned === "yes" ? "Yes" : "No"} />
                  </View>
                </View>
              </View>
              <Controller
                control={control}
                name="compactors.location"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    label="Location"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.compactors.assessment.condition as any}
                  onChange={(v) => store?.updateCompactors({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.compactors.assessment.repairStatus as any}
                  onChange={(v) => store?.updateCompactors({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="compactors.assessment.amountToRepair"
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

        <SectionAccordion
          title="Bridges"
          expanded={!store?.bridges.NotApplicable && openKey === "bridges"}
          onToggle={(n) => {
            if (!store?.bridges.NotApplicable) {
              setOpenKey(n ? "bridges" : null)
            }
          }}
          headerStyle={
            store?.bridges.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.bridges.NotApplicable ?? false))}
              onPress={() => store?.updateBridges({ NotApplicable: !store?.bridges.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.bridges.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.bridges.NotApplicable && (
            <View style={themed($sectionBody)}>
              <Controller
                control={control}
                name="bridges.bridgesType"
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    label="Bridge Type"
                    value={value}
                    onValueChange={onChange}
                    options={BRIDGES_TYPE_OPTIONS}
                  />
                )}
              />
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.bridges.assessment.condition as any}
                  onChange={(v) => store?.updateBridges({ assessment: { condition: v } })}
                />
              </View>
              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.bridges.assessment.repairStatus as any}
                  onChange={(v) => store?.updateBridges({ assessment: { repairStatus: v } })}
                />
              </View>
              <Controller
                control={control}
                name="bridges.assessment.amountToRepair"
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
              <View style={themed($radioRow)}>
                <Text preset="formLabel" text="Railings?" />
                <View style={themed($toggleWrap)}>
                  <Checkbox
                    value={store?.bridges.railing === "yes"}
                    onValueChange={(checked) => store?.updateBridges({ railing: checked ? "yes" : "no" })}
                  />
                  <View style={$pill(store?.bridges.railing === "yes")}> 
                    <Text text={store?.bridges.railing === "yes" ? "Yes" : "No"} />
                  </View>
                </View>
              </View>
              {store?.bridges.railing === "yes" && (
                <View style={themed($nestedList)}>
                  <Text preset="subheading" text="Railing" />
                  <View style={themed($nestedCard)}>
                    <Dropdown
                      label="Railing Type"
                      value={store?.bridges.railingDetails?.railingType ?? ""}
                      onValueChange={(t) => {
                        if (store?.bridges.railingDetails) {
                          store?.bridges.railingDetails.update({ railingType: t })
                        } else {
                          store?.updateBridges({ railingDetails: { railingType: t } as any })
                        }
                      }}
                      options={RAILING_TYPE_OPTIONS}
                    />
                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Condition" />
                      <ConditionAssessment
                        value={store?.bridges.railingDetails?.assessment.condition as any}
                        onChange={(v) =>
                          store?.bridges.railingDetails
                            ? store?.bridges.railingDetails.update({ assessment: { condition: v } })
                            : store?.updateBridges({ railingDetails: { assessment: { condition: v } } as any })
                        }
                      />
                    </View>
                    <View style={themed($controlGroup)}>
                      <Text preset="formLabel" text="Repair Status" />
                      <RepairStatus
                        value={store?.bridges.railingDetails?.assessment.repairStatus as any}
                        onChange={(v) =>
                          store?.bridges.railingDetails
                            ? store?.bridges.railingDetails.update({ assessment: { repairStatus: v } })
                            : store?.updateBridges({ railingDetails: { assessment: { repairStatus: v } } as any })
                        }
                      />
                    </View>
                    <TextField
                      label="Amount to Repair ($)"
                      keyboardType="numeric"
                      value={store?.bridges.railingDetails?.assessment.amountToRepair ?? ""}
                      onChangeText={(t) =>
                        store?.bridges.railingDetails
                          ? store?.bridges.railingDetails.update({ assessment: { amountToRepair: t } })
                          : store?.updateBridges({ railingDetails: { assessment: { amountToRepair: t } } as any })
                      }
                    />
                  </View>
                </View>
              )}
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
        </View>
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => navigation.navigate("SiteGroundsStep2" as never)}
          onNext={() => navigation.navigate("SiteGroundsStep4" as never)}
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
  gap: 0,
}

const $sectionBody: ViewStyle = { gap: 16, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }

const $radioRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $nestedList: ViewStyle = { gap: 16, paddingTop: 8 }

const $nestedCard: ViewStyle = { paddingHorizontal: 0, paddingVertical: 0, gap: 16}

const $scrollArea: ViewStyle = { flex: 1, paddingTop: 72, paddingBottom: 96 }
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
