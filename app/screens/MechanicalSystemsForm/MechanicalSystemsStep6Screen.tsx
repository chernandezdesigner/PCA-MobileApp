import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TextStyle } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { ConditionAssessment } from "@/components/ConditionAssessment"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { ChecklistField } from "@/components/ChecklistField"
import type { ChecklistItem } from "@/components/ChecklistCard"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import { 
  WATER_HEATER_BOILER_TYPE_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep6ScreenProps 
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep6"> {}

export const MechanicalSystemsStep6Screen: FC<MechanicalSystemsStep6ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step6

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep7" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  // Create checklist helpers
  const createChecklistItems = (options: readonly { id: string; label: string }[], selectedIds: string[]) => {
    return options.map(opt => ({
      id: opt.id,
      label: opt.label,
      checked: selectedIds.includes(opt.id),
    }))
  }

  const createArrayToggleHandler = (currentArray: string[] | undefined, onChange: (newArray: string[]) => void) => {
    return (id: string, checked: boolean) => {
      const arr = currentArray ?? []
      const newArray = checked ? [...arr, id] : arr.filter((item) => item !== id)
      onChange(newArray)
    }
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Mechanical Systems"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Water Heaters" style={themed($titleStyle)} />
          <ProgressBar current={6} total={9} />
        </View>

        {/* ============================================ */}
        {/* COMMON AREA WATER HEATER */}
        {/* ============================================ */}
        <SectionAccordion
          title="Water Heater - Common Area"
          expanded={openKey === "commonAreaWaterHeater"}
          onToggle={(n) => setOpenKey(n ? "commonAreaWaterHeater" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(WATER_HEATER_BOILER_TYPE_OPTIONS, store?.commonAreaWaterHeater.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.commonAreaWaterHeater.type.slice(),
                (newArray) => store?.updateCommonAreaWaterHeater({ type: newArray })
              )}
            />

            <View style={$row}>
              <TextField
                label="Quantity"
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={store?.commonAreaWaterHeater.quantity?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterHeater({ 
                  quantity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Capacity (BTU, Watts)"
                placeholder="Enter capacity"
                keyboardType="numeric"
                value={store?.commonAreaWaterHeater.capacity?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterHeater({ 
                  capacity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <View style={$row}>
              <TextField
                label="Yr Installed (ea.)"
                placeholder="Year"
                keyboardType="numeric"
                value={store?.commonAreaWaterHeater.yearInstalled?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterHeater({ 
                  yearInstalled: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Yr Rebuild (ea.)"
                placeholder="Year"
                keyboardType="numeric"
                value={store?.commonAreaWaterHeater.yearRebuild?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterHeater({ 
                  yearRebuild: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <TextField
              label="Location(s) of Each"
              placeholder="Enter location details"
              value={store?.commonAreaWaterHeater.locationOfEach ?? ""}
              onChangeText={(val) => store?.updateCommonAreaWaterHeater({ locationOfEach: val })}
              multiline
              minRows={2}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.commonAreaWaterHeater.assessment.condition as any}
                onChange={(v) => store?.updateCommonAreaWaterHeater({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.commonAreaWaterHeater.assessment.repairStatus as any}
                onChange={(v) => store?.updateCommonAreaWaterHeater({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.commonAreaWaterHeater.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateCommonAreaWaterHeater({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* HEATED WATER PUMPS - COMMON AREA */}
        {/* ============================================ */}
        <SectionAccordion
          title="Heated Water Pumps - Common Area"
          expanded={openKey === "commonAreaHeatedWaterPumps"}
          onToggle={(n) => setOpenKey(n ? "commonAreaHeatedWaterPumps" : null)}
        >
          <View style={themed($sectionBody)}>
            <TextField
              label="Heated Water Pumps"
              placeholder="Enter heated water pump details"
              value={store?.commonAreaHeatedWaterPumps?.description ?? ""}
              onChangeText={(val) => store?.updateCommonAreaHeatedWaterPumps?.({ description: val })}
              multiline
              minRows={3}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.commonAreaHeatedWaterPumps?.assessment.condition as any}
                onChange={(v) => store?.updateCommonAreaHeatedWaterPumps?.({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.commonAreaHeatedWaterPumps?.assessment.repairStatus as any}
                onChange={(v) => store?.updateCommonAreaHeatedWaterPumps?.({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.commonAreaHeatedWaterPumps?.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateCommonAreaHeatedWaterPumps?.({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* WATER STORAGE TANKS - COMMON AREA */}
        {/* ============================================ */}
        <SectionAccordion
          title="Water Storage Tanks - Common Area"
          expanded={openKey === "commonAreaWaterStorageTanks"}
          onToggle={(n) => setOpenKey(n ? "commonAreaWaterStorageTanks" : null)}
        >
          <View style={themed($sectionBody)}>
            <View style={$row}>
              <TextField
                label="Quantity"
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={store?.commonAreaWaterStorageTanks?.quantity?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterStorageTanks?.({ 
                  quantity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Capacity"
                placeholder="Enter capacity"
                keyboardType="numeric"
                value={store?.commonAreaWaterStorageTanks?.capacity?.toString() ?? ""}
                onChangeText={(val) => store?.updateCommonAreaWaterStorageTanks?.({ 
                  capacity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <TextField
              label="Yr Installed"
              placeholder="Year"
              keyboardType="numeric"
              value={store?.commonAreaWaterStorageTanks?.yearInstalled?.toString() ?? ""}
              onChangeText={(val) => store?.updateCommonAreaWaterStorageTanks?.({ 
                yearInstalled: val ? parseInt(val, 10) : 0 
              })}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.commonAreaWaterStorageTanks?.assessment.condition as any}
                onChange={(v) => store?.updateCommonAreaWaterStorageTanks?.({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.commonAreaWaterStorageTanks?.assessment.repairStatus as any}
                onChange={(v) => store?.updateCommonAreaWaterStorageTanks?.({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.commonAreaWaterStorageTanks?.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateCommonAreaWaterStorageTanks?.({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* TENANT SPACES WATER HEATER */}
        {/* ============================================ */}
        <SectionAccordion
          title="Water Heater - Tenant Spaces"
          expanded={openKey === "tenantSpacesWaterHeater"}
          onToggle={(n) => setOpenKey(n ? "tenantSpacesWaterHeater" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={createChecklistItems(WATER_HEATER_BOILER_TYPE_OPTIONS, store?.tenantSpacesWaterHeater.type.slice() ?? [])}
              onToggle={createArrayToggleHandler(
                store?.tenantSpacesWaterHeater.type.slice(),
                (newArray) => store?.updateTenantSpacesWaterHeater({ type: newArray })
              )}
            />

            <View style={$row}>
              <TextField
                label="Quantity"
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterHeater.quantity?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ 
                  quantity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Capacity (BTU, Watts)"
                placeholder="Enter capacity"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterHeater.capacity?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ 
                  capacity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <View style={$row}>
              <TextField
                label="Yr Installed (ea.)"
                placeholder="Year"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterHeater.yearInstalled?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ 
                  yearInstalled: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Yr Rebuild (ea.)"
                placeholder="Year"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterHeater.yearRebuild?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ 
                  yearRebuild: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <TextField
              label="Location(s) of Each"
              placeholder="Enter location details"
              value={store?.tenantSpacesWaterHeater.locationOfEach ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ locationOfEach: val })}
              multiline
              minRows={2}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.tenantSpacesWaterHeater.assessment.condition as any}
                onChange={(v) => store?.updateTenantSpacesWaterHeater({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tenantSpacesWaterHeater.assessment.repairStatus as any}
                onChange={(v) => store?.updateTenantSpacesWaterHeater({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.tenantSpacesWaterHeater.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesWaterHeater({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* HEATED WATER PUMPS - TENANT SPACES */}
        {/* ============================================ */}
        <SectionAccordion
          title="Heated Water Pumps - Tenant Spaces"
          expanded={openKey === "tenantSpacesHeatedWaterPumps"}
          onToggle={(n) => setOpenKey(n ? "tenantSpacesHeatedWaterPumps" : null)}
        >
          <View style={themed($sectionBody)}>
            <TextField
              label="Heated Water Pumps"
              placeholder="Enter heated water pump details"
              value={store?.tenantSpacesHeatedWaterPumps?.description ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesHeatedWaterPumps?.({ description: val })}
              multiline
              minRows={3}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.tenantSpacesHeatedWaterPumps?.assessment.condition as any}
                onChange={(v) => store?.updateTenantSpacesHeatedWaterPumps?.({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tenantSpacesHeatedWaterPumps?.assessment.repairStatus as any}
                onChange={(v) => store?.updateTenantSpacesHeatedWaterPumps?.({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.tenantSpacesHeatedWaterPumps?.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesHeatedWaterPumps?.({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* WATER STORAGE TANKS - TENANT SPACES */}
        {/* ============================================ */}
        <SectionAccordion
          title="Water Storage Tanks - Tenant Spaces"
          expanded={openKey === "tenantSpacesWaterStorageTanks"}
          onToggle={(n) => setOpenKey(n ? "tenantSpacesWaterStorageTanks" : null)}
        >
          <View style={themed($sectionBody)}>
            <View style={$row}>
              <TextField
                label="Quantity"
                placeholder="Enter quantity"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterStorageTanks?.quantity?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterStorageTanks?.({ 
                  quantity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
              <TextField
                label="Capacity"
                placeholder="Enter capacity"
                keyboardType="numeric"
                value={store?.tenantSpacesWaterStorageTanks?.capacity?.toString() ?? ""}
                onChangeText={(val) => store?.updateTenantSpacesWaterStorageTanks?.({ 
                  capacity: val ? parseInt(val, 10) : 0 
                })}
                containerStyle={$halfWidth}
              />
            </View>

            <TextField
              label="Yr Installed"
              placeholder="Year"
              keyboardType="numeric"
              value={store?.tenantSpacesWaterStorageTanks?.yearInstalled?.toString() ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesWaterStorageTanks?.({ 
                yearInstalled: val ? parseInt(val, 10) : 0 
              })}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.tenantSpacesWaterStorageTanks?.assessment.condition as any}
                onChange={(v) => store?.updateTenantSpacesWaterStorageTanks?.({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tenantSpacesWaterStorageTanks?.assessment.repairStatus as any}
                onChange={(v) => store?.updateTenantSpacesWaterStorageTanks?.({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.tenantSpacesWaterStorageTanks?.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) => store?.updateTenantSpacesWaterStorageTanks?.({ 
                amountToReplaceRepair: val ? parseInt(val, 10) : 0 
              })}
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about water heaters"
            value={store?.comments ?? ""}
            onChangeText={(val) => store?.updateComments(val)}
            multiline
            minRows={2}
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
  paddingTop: 88,
  paddingBottom: 96,
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

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $halfWidth: ViewStyle = {
  flex: 1,
}
