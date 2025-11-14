import { FC, useEffect, useMemo, useRef } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import { observer } from "mobx-react-lite"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useNavigation } from "@react-navigation/native"
import { Card } from "@/components/Card"
import { ChecklistCard } from "@/components/ChecklistCard"
import { Button } from "@/components/Button"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Pill } from "@/components/Pill"
import { useStores } from "@/models/RootStoreProvider"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useDrawerControl } from "@/context/DrawerContext"

interface ProjectSummaryStep3ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep3"> {}

// Local, static catalog of documents (labels kept out of MST)
const DOCUMENTS = [
  { id: "ADASurvey", label: "ADA Survey" },
  { id: "ALTASurvey", label: "ALTA Survey" },
  { id: "CapExPlan", label: "CapEx Plan" },
  { id: "CapExHistory", label: "CapEx History" },
  { id: "SitePlansSurveys", label: "Site Plans / Surveys" },
  { id: "BuildingPlans", label: "Building Plans" },
  { id: "FloorPlans", label: "Floor Plans" },
  { id: "RoofWarranty", label: "Roof Warranty" },
  { id: "Warranties", label: "Warranties" },
  { id: "CertificateOfOccupancy", label: "Certificate of Occupancy" },
  { id: "MarketingBrochure", label: "Marketing Brochure" },
  { id: "EquipmentInventory", label: "Equipment Inventory" },
  { id: "FireDepartmentInspection", label: "Fire Department Inspection" },
  { id: "FireAlarmInspection", label: "Fire Alarm Inspection" },
  { id: "FireSprinklerInspection", label: "Fire Sprinkler Inspection" },
  { id: "ElevatorCertificates", label: "Elevator Certificates" },
  { id: "BoilerPermits", label: "Boiler Permits" },
  { id: "OccupancySummary", label: "Occupancy Summary" },
  { id: "PendingRepairProposals", label: "Pending Repair Proposals" },
  { id: "PreviousPCAReports", label: "Previous PCA Reports" },
  { id: "RentRollTenantList", label: "Rent Roll / Tenant List" },
  { id: "UnitTypeAndQuantityList", label: "Unit Type and Quantity List" },
  { id: "VendorList", label: "Vendor List" },
  { id: "HealthcareInspection", label: "Healthcare Inspection" },
  { id: "Other", label: "Other" },
] as const

export const ProjectSummaryStep3Screen: FC<ProjectSummaryStep3ScreenProps> = observer(() => {
  const navigation = useNavigation()
  const { themed } = useAppTheme()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  // Derive renderable documents by combining constants with store map state
  // Remove useMemo to allow observer to handle reactivity
  const documents = DOCUMENTS.map((d) => ({
    type: d.id,
    label: d.label,
    provided: projectSummaryStore?.documents.get(d.id) ?? false,
  }))
  const personnel = projectSummaryStore?.personnelInterviewed ?? []
  const tenants = projectSummaryStore?.commercialTenants ?? []

  // Seed one default card for each list on first mount if empty
  const seededRef = useRef(false)
  useEffect(() => {
    if (seededRef.current) return
    if (!projectSummaryStore) return
    if (projectSummaryStore.personnelInterviewed.length === 0) {
      projectSummaryStore.addPersonnel("", "", 0, "")
    }
    if (projectSummaryStore.commercialTenants.length === 0) {
      projectSummaryStore.addCommercialTenant("", "", false)
    }
    seededRef.current = true
  }, [projectSummaryStore])

  // Convert documents to ChecklistCard format
  const checklistDocuments = documents.map((d) => ({
    id: d.type,
    label: d.label,
    checked: d.provided,
    comments: "", // Documentation doesn't use comments
  }))

  function handleDocToggle(id: string, checked: boolean) {
    projectSummaryStore?.updateDocumentChecklist(id, checked)
  }

  function handleDocSelectAll() {
    DOCUMENTS.forEach((d) => projectSummaryStore?.updateDocumentChecklist(d.id, true))
  }

  function handleDocClearAll() {
    DOCUMENTS.forEach((d) => projectSummaryStore?.updateDocumentChecklist(d.id, false))
  }

  function onNext() {
    // slide forward
    // @ts-expect-error route params for animation
    navigation.navigate("ProjectSummaryStep4" as never, { transition: "slide_from_right" } as never)
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar title="Project Summary" leftIcon="back" onLeftPress={() => navigation.goBack()} rightIcon="menu" onRightPress={openDrawer} />
      </View>
      <ScrollView contentContainerStyle={$content} style={$scrollArea}>
        <View style={$introBlock}>
          <Text preset="subheading" text="Documentation & Personnel" style={themed($titleStyle)} />
          <ProgressBar current={3} total={4} />
        </View>

      {/* Documentation Section */}
      <ChecklistCard
        title="Documentation"
        items={checklistDocuments}
        showComments={false}
        onToggle={handleDocToggle}
        onSelectAll={handleDocSelectAll}
        onClearAll={handleDocClearAll}
      />

      {/* Personnel Interviewed Section */}
      <View style={$sectionHeaderRow}>
        <Text preset="subheading" text="Personnel Interviewed" />
        <Button text="Add Person" onPress={() => projectSummaryStore?.addPersonnel("", "", 0, "")} />
      </View>
      <View style={$listContainer}>
        {personnel.slice().map((item, index) => (
          <Card
            key={item.id}
            HeadingComponent={<Text weight="bold" text={`Person ${index + 1}`} />}
            ContentComponent={
              <View style={$cardFields}>
                <TextField
                  label="Name"
                  placeholder="Full name"
                  value={item.name}
                  onChangeText={(val) => projectSummaryStore?.updatePersonnel(item.id, { name: val })}
                />
                <TextField
                  label="Title"
                  placeholder="Job title"
                  value={item.title}
                  onChangeText={(val) => projectSummaryStore?.updatePersonnel(item.id, { title: val })}
                />
                <View style={$row}>
                  <TextField
                    label="Years at Property"
                    placeholder="0"
                    value={String(item.yearsAtProperty ?? 0)}
                    onChangeText={(txt) =>
                      projectSummaryStore?.updatePersonnel(item.id, {
                        yearsAtProperty: Number(txt.replace(/[^0-9.-]/g, "")) || 0,
                      })
                    }
                    keyboardType="numeric"
                    containerStyle={{ flex: 1 }}
                  />
                  <TextField
                    label="Phone Number"
                    placeholder="Phone number"
                    value={item.phoneNumber}
                    onChangeText={(val) => projectSummaryStore?.updatePersonnel(item.id, { phoneNumber: val })}
                    keyboardType="phone-pad"
                    containerStyle={{ flex: 1 }}
                  />
                </View>
                <View style={$alignEnd}>
                  <Button
                    preset="reversed"
                    text="Remove"
                    onPress={() => projectSummaryStore?.removePersonnel(item.id)}
                  />
                </View>
              </View>
            }
          />
        ))}
      </View>

      {/* Commercial Tenants Section */}
      <View style={$sectionHeaderRow}>
        <Text preset="subheading" text="Commercial Tenants" />
        <Button text="Add Tenant" onPress={() => projectSummaryStore?.addCommercialTenant("", "", false)} />
      </View>
      <View style={$listContainer}>
        {tenants.slice().map((item, index) => (
          <Card
            key={item.id}
            HeadingComponent={<Text weight="bold" text={`Tenant ${index + 1}`} />}
            ContentComponent={
              <View style={$cardFields}>
                <TextField
                  label="Tenant Name"
                  placeholder="Tenant name"
                  value={item.name}
                  onChangeText={(val) => projectSummaryStore?.updateCommercialTenant(item.id, { name: val })}
                />
                <TextField
                  label="Address/Unit Number"
                  placeholder="Unit number"
                  value={item.addressOrUnit}
                  onChangeText={(val) => projectSummaryStore?.updateCommercialTenant(item.id, { addressOrUnit: val })}
                />
                <View style={$checkboxRow}>
                  <Checkbox
                    label="Unit Accessed"
                    value={item.accessed}
                    onValueChange={(v) => projectSummaryStore?.updateCommercialTenant(item.id, { accessed: v })}
                    containerStyle={$checkboxContainer}
                  />
                  <Pill 
                    label={item.accessed ? "Yes" : "No"} 
                    variant={item.accessed ? "active" : "default"}
                  />
                </View>
                <View style={$alignEnd}>
                  <Button
                    preset="reversed"
                    text="Remove"
                    onPress={() => projectSummaryStore?.removeCommercialTenant(item.id)}
                  />
                </View>
              </View>
            }
          />
        ))}
      </View>

    </ScrollView>
    <View style={$stickyFooter}>
      <StickyFooterNav onBack={() => navigation.goBack()} onNext={onNext} showCamera={true} />
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

const $sectionHeaderRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $rowBetween: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $cardFields: ViewStyle = {
  gap: 8, // Reduced from 12 for tighter spacing
}

const $checkboxRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $checkboxContainer: ViewStyle = {
  flex: 1,
  marginRight: 8,
}

const $alignEnd: ViewStyle = {
  alignSelf: "flex-end",
}

const $listContainer: ViewStyle = {
  gap: 12,
}

const $screenInner: ViewStyle = { flex: 1 }
const $stickyHeader: ViewStyle = { position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }
const $stickyFooter: ViewStyle = { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }
const $scrollArea: ViewStyle = { flex: 1 }
const $titleStyle: ThemedStyle<any> = ({ colors }) => ({ color: colors.palette.primary2 as any, fontSize: 24 })
const $introBlock: ViewStyle = { paddingTop: 16, paddingBottom: 32 }
