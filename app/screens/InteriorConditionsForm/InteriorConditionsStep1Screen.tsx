import { FC, useState } from "react"
import { View, ViewStyle, ScrollView, TouchableOpacity, TextStyle } from "react-native"
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

import {
  TENANT_FLOOR_OPTIONS,
  TENANT_WALL_OPTIONS,
  TENANT_CEILING_OPTIONS,
  TENANT_OTHER_OPTIONS,
  RESTROOM_FLOOR_OPTIONS,
  RESTROOM_WALL_OPTIONS,
  RESTROOM_CEILING_OPTIONS,
  RESTROOM_OTHER_OPTIONS,
  KITCHEN_FLOOR_OPTIONS,
  KITCHEN_WALL_OPTIONS,
  KITCHEN_CEILING_OPTIONS,
  KITCHEN_OTHER_OPTIONS,
  WAREHOUSE_FLOOR_OPTIONS,
  WAREHOUSE_UNFINISHED_OPTIONS,
  WAREHOUSE_CEILING_OPTIONS,
  WAREHOUSE_OTHER_OPTIONS,
} from "@/constants/interiorConditionOptions"

// ============================================
// HELPERS
// ============================================

const buildItems = (
  options: readonly { id: string; label: string }[],
  storeData: string[],
): ChecklistItem[] =>
  options.map((opt) => ({ id: opt.id, label: opt.label, checked: storeData.includes(opt.id) }))

const toggleItem = (storeData: string[], id: string, checked: boolean): string[] =>
  checked ? [...storeData, id] : storeData.filter((item: string) => item !== id)

// ============================================
// MAIN SCREEN COMPONENT
// ============================================

export const InteriorConditionsStep1Screen: FC = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.interiorConditions?.step1

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("InteriorConditionsStep2" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => navigation.goBack()

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Interior Conditions"
          leftIcon="back"
          onLeftPress={onBack}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>

      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Commercial Tenant Unit Finishes" style={themed($titleStyle)} />
          <ProgressBar current={1} total={4} />
        </View>

        {/* ============================================ */}
        {/* LAST RENOVATED (top-level field) */}
        {/* ============================================ */}
        <View style={themed($paddedBlock)}>
          <TextField
            label="Last Renovated"
            placeholder="e.g., 2019"
            value={store?.lastRenovated ?? ""}
            onChangeText={(val) => store?.updateTopLevel({ lastRenovated: val })}
          />
        </View>

        {/* ============================================ */}
        {/* TENANT FLOORS, WALLS & CEILINGS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Tenant Floors, Walls & Ceilings"
          expanded={!store?.tenantFinishes.NotApplicable && openKey === "tenantFinishes"}
          onToggle={(n) => {
            if (!store?.tenantFinishes.NotApplicable) {
              setOpenKey(n ? "tenantFinishes" : null)
            }
          }}
          headerStyle={
            store?.tenantFinishes.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.tenantFinishes.NotApplicable ?? false))}
              onPress={() => store?.updateTenantFinishes({ NotApplicable: !store?.tenantFinishes.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.tenantFinishes.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.tenantFinishes.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Floors"
                items={buildItems(TENANT_FLOOR_OPTIONS, store?.tenantFinishes.floors?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateTenantFinishes({
                  floors: toggleItem(store?.tenantFinishes.floors?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Walls"
                items={buildItems(TENANT_WALL_OPTIONS, store?.tenantFinishes.walls?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateTenantFinishes({
                  walls: toggleItem(store?.tenantFinishes.walls?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Ceilings"
                items={buildItems(TENANT_CEILING_OPTIONS, store?.tenantFinishes.ceilings?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateTenantFinishes({
                  ceilings: toggleItem(store?.tenantFinishes.ceilings?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Other"
                items={buildItems(TENANT_OTHER_OPTIONS, store?.tenantFinishes.other?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateTenantFinishes({
                  other: toggleItem(store?.tenantFinishes.other?.slice() ?? [], id, checked),
                })}
              />

              {store?.tenantFinishes.other?.includes("other") && (
                <TextField
                  label="Specify Other"
                  placeholder="Describe other finishes"
                  value={store?.tenantFinishes.otherSpecification ?? ""}
                  onChangeText={(val) => store?.updateTenantFinishes({ otherSpecification: val })}
                />
              )}

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.tenantFinishes.assessment.condition as any}
                  onChange={(v) => store?.updateTenantFinishes({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.tenantFinishes.assessment.repairStatus as any}
                  onChange={(v) => store?.updateTenantFinishes({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.tenantFinishes.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateTenantFinishes({ assessment: { amountToRepair: val } })}
              />

              <TextField
                label="Effective Age (Years)"
                placeholder="Enter effective age"
                keyboardType="numeric"
                value={store?.tenantFinishes.effectiveAge ? store.tenantFinishes.effectiveAge.toString() : ""}
                onChangeText={(val) => store?.updateTenantFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* RESTROOM FLOORS, WALLS & CEILINGS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Restroom Floors, Walls & Ceilings"
          expanded={!store?.restroomFinishes.NotApplicable && openKey === "restroomFinishes"}
          onToggle={(n) => {
            if (!store?.restroomFinishes.NotApplicable) {
              setOpenKey(n ? "restroomFinishes" : null)
            }
          }}
          headerStyle={
            store?.restroomFinishes.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.restroomFinishes.NotApplicable ?? false))}
              onPress={() => store?.updateRestroomFinishes({ NotApplicable: !store?.restroomFinishes.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.restroomFinishes.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.restroomFinishes.NotApplicable && (
            <View style={themed($sectionBody)}>
              <TextField
                label="Quantity"
                placeholder="Number of restrooms"
                keyboardType="numeric"
                value={store?.restroomFinishes.quantity ? store.restroomFinishes.quantity.toString() : ""}
                onChangeText={(val) => store?.updateRestroomFinishes({ quantity: val ? parseInt(val, 10) : 0 })}
              />

              <ChecklistField
                label="Floors"
                items={buildItems(RESTROOM_FLOOR_OPTIONS, store?.restroomFinishes.floors?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateRestroomFinishes({
                  floors: toggleItem(store?.restroomFinishes.floors?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Walls"
                items={buildItems(RESTROOM_WALL_OPTIONS, store?.restroomFinishes.walls?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateRestroomFinishes({
                  walls: toggleItem(store?.restroomFinishes.walls?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Ceilings"
                items={buildItems(RESTROOM_CEILING_OPTIONS, store?.restroomFinishes.ceilings?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateRestroomFinishes({
                  ceilings: toggleItem(store?.restroomFinishes.ceilings?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Other"
                items={buildItems(RESTROOM_OTHER_OPTIONS, store?.restroomFinishes.other?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateRestroomFinishes({
                  other: toggleItem(store?.restroomFinishes.other?.slice() ?? [], id, checked),
                })}
              />

              {store?.restroomFinishes.other?.includes("other") && (
                <TextField
                  label="Specify Other"
                  placeholder="Describe other finishes"
                  value={store?.restroomFinishes.otherSpecification ?? ""}
                  onChangeText={(val) => store?.updateRestroomFinishes({ otherSpecification: val })}
                />
              )}

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.restroomFinishes.assessment.condition as any}
                  onChange={(v) => store?.updateRestroomFinishes({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.restroomFinishes.assessment.repairStatus as any}
                  onChange={(v) => store?.updateRestroomFinishes({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.restroomFinishes.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateRestroomFinishes({ assessment: { amountToRepair: val } })}
              />

              <TextField
                label="Effective Age (Years)"
                placeholder="Enter effective age"
                keyboardType="numeric"
                value={store?.restroomFinishes.effectiveAge ? store.restroomFinishes.effectiveAge.toString() : ""}
                onChangeText={(val) => store?.updateRestroomFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* KITCHEN FLOORS, WALLS & CEILINGS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Kitchen Floors, Walls & Ceilings"
          expanded={!store?.kitchenFinishes.NotApplicable && openKey === "kitchenFinishes"}
          onToggle={(n) => {
            if (!store?.kitchenFinishes.NotApplicable) {
              setOpenKey(n ? "kitchenFinishes" : null)
            }
          }}
          headerStyle={
            store?.kitchenFinishes.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.kitchenFinishes.NotApplicable ?? false))}
              onPress={() => store?.updateKitchenFinishes({ NotApplicable: !store?.kitchenFinishes.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.kitchenFinishes.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.kitchenFinishes.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Floors"
                items={buildItems(KITCHEN_FLOOR_OPTIONS, store?.kitchenFinishes.floors?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateKitchenFinishes({
                  floors: toggleItem(store?.kitchenFinishes.floors?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Walls"
                items={buildItems(KITCHEN_WALL_OPTIONS, store?.kitchenFinishes.walls?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateKitchenFinishes({
                  walls: toggleItem(store?.kitchenFinishes.walls?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Ceilings"
                items={buildItems(KITCHEN_CEILING_OPTIONS, store?.kitchenFinishes.ceilings?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateKitchenFinishes({
                  ceilings: toggleItem(store?.kitchenFinishes.ceilings?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Other"
                items={buildItems(KITCHEN_OTHER_OPTIONS, store?.kitchenFinishes.other?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateKitchenFinishes({
                  other: toggleItem(store?.kitchenFinishes.other?.slice() ?? [], id, checked),
                })}
              />

              {store?.kitchenFinishes.other?.includes("other") && (
                <TextField
                  label="Specify Other"
                  placeholder="Describe other finishes"
                  value={store?.kitchenFinishes.otherSpecification ?? ""}
                  onChangeText={(val) => store?.updateKitchenFinishes({ otherSpecification: val })}
                />
              )}

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.kitchenFinishes.assessment.condition as any}
                  onChange={(v) => store?.updateKitchenFinishes({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.kitchenFinishes.assessment.repairStatus as any}
                  onChange={(v) => store?.updateKitchenFinishes({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.kitchenFinishes.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateKitchenFinishes({ assessment: { amountToRepair: val } })}
              />

              <TextField
                label="Effective Age (Years)"
                placeholder="Enter effective age"
                keyboardType="numeric"
                value={store?.kitchenFinishes.effectiveAge ? store.kitchenFinishes.effectiveAge.toString() : ""}
                onChangeText={(val) => store?.updateKitchenFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* WAREHOUSE FLOORS, WALLS & CEILINGS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Warehouse Floors, Walls & Ceilings"
          expanded={!store?.warehouseFinishes.NotApplicable && openKey === "warehouseFinishes"}
          onToggle={(n) => {
            if (!store?.warehouseFinishes.NotApplicable) {
              setOpenKey(n ? "warehouseFinishes" : null)
            }
          }}
          headerStyle={
            store?.warehouseFinishes.NotApplicable
              ? themed($naHeaderStyle)
              : undefined
          }
          RightComponent={
            <TouchableOpacity
              style={themed($naButton(store?.warehouseFinishes.NotApplicable ?? false))}
              onPress={() => store?.updateWarehouseFinishes({ NotApplicable: !store?.warehouseFinishes.NotApplicable })}
            >
              <Text
                text="N/A"
                style={themed($naButtonText(store?.warehouseFinishes.NotApplicable ?? false))}
              />
            </TouchableOpacity>
          }
        >
          {!store?.warehouseFinishes.NotApplicable && (
            <View style={themed($sectionBody)}>
              <ChecklistField
                label="Floors"
                items={buildItems(WAREHOUSE_FLOOR_OPTIONS, store?.warehouseFinishes.floors?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateWarehouseFinishes({
                  floors: toggleItem(store?.warehouseFinishes.floors?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Unfinished"
                items={buildItems(WAREHOUSE_UNFINISHED_OPTIONS, store?.warehouseFinishes.unfinished?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateWarehouseFinishes({
                  unfinished: toggleItem(store?.warehouseFinishes.unfinished?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Ceilings"
                items={buildItems(WAREHOUSE_CEILING_OPTIONS, store?.warehouseFinishes.ceilings?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateWarehouseFinishes({
                  ceilings: toggleItem(store?.warehouseFinishes.ceilings?.slice() ?? [], id, checked),
                })}
              />

              <ChecklistField
                label="Other"
                items={buildItems(WAREHOUSE_OTHER_OPTIONS, store?.warehouseFinishes.other?.slice() ?? [])}
                onToggle={(id, checked) => store?.updateWarehouseFinishes({
                  other: toggleItem(store?.warehouseFinishes.other?.slice() ?? [], id, checked),
                })}
              />

              {store?.warehouseFinishes.other?.includes("other") && (
                <TextField
                  label="Specify Other"
                  placeholder="Describe other finishes"
                  value={store?.warehouseFinishes.otherSpecification ?? ""}
                  onChangeText={(val) => store?.updateWarehouseFinishes({ otherSpecification: val })}
                />
              )}

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Condition" />
                <ConditionAssessment
                  value={store?.warehouseFinishes.assessment.condition as any}
                  onChange={(v) => store?.updateWarehouseFinishes({ assessment: { condition: v } })}
                />
              </View>

              <View style={themed($controlGroup)}>
                <Text preset="formLabel" text="Repair Status" />
                <RepairStatus
                  value={store?.warehouseFinishes.assessment.repairStatus as any}
                  onChange={(v) => store?.updateWarehouseFinishes({ assessment: { repairStatus: v } })}
                />
              </View>

              <TextField
                label="Amount to Repair ($)"
                placeholder="Dollar amount"
                keyboardType="numeric"
                value={store?.warehouseFinishes.assessment.amountToRepair ?? ""}
                onChangeText={(val) => store?.updateWarehouseFinishes({ assessment: { amountToRepair: val } })}
              />

              <TextField
                label="Effective Age (Years)"
                placeholder="Enter effective age"
                keyboardType="numeric"
                value={store?.warehouseFinishes.effectiveAge ? store.warehouseFinishes.effectiveAge.toString() : ""}
                onChangeText={(val) => store?.updateWarehouseFinishes({ effectiveAge: val ? parseInt(val, 10) : 0 })}
              />
            </View>
          )}
        </SectionAccordion>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about commercial tenant unit finishes"
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

// ============================================
// STYLES
// ============================================

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

const $naHeaderStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  opacity: 0.6,
})

const $naButton = (isActive: boolean): ThemedStyle<ViewStyle> => ({ colors }) => ({
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 4,
  backgroundColor: isActive ? colors.palette.primary2 : colors.palette.neutral300,
})

const $naButtonText = (isActive: boolean): ThemedStyle<TextStyle> => ({ colors }) => ({
  color: isActive ? colors.palette.neutral100 : colors.text,
  fontSize: 12,
  fontWeight: "600",
})
