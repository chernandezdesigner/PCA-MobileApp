import { FC, useState, useMemo } from "react"
import { View, ViewStyle, ScrollView, TextStyle, TouchableOpacity } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { RepairStatus } from "@/components/RepairStatus"
import { SectionAccordion } from "@/components/SectionAccordion"
import { ChecklistField } from "@/components/ChecklistField"
import { HeaderBar } from "@/components/HeaderBar"
import { ProgressBar } from "@/components/ProgressBar"
import { StickyFooterNav } from "@/components/StickyFooterNav"
import { usePhotoCapture } from "@/hooks/usePhotoCapture"
import { useStores } from "@/models/RootStoreProvider"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { useDrawerControl } from "@/context/DrawerContext"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { MechanicalSystemsFormNavigatorParamList } from "@/navigators/MechanicalSystemsFormNavigator"
import {
  VOLTAGE_OPTIONS,
  Wiring_Method_Options,
  EMERGENCY_GENERATOR_OPTIONS,
  ELECTRICAL_TANK_OPTIONS,
} from "@/constants/mechanicalSystemsOptions"

interface MechanicalSystemsStep7ScreenProps
  extends NativeStackScreenProps<MechanicalSystemsFormNavigatorParamList, "MechanicalSystemsStep7"> {}

export const MechanicalSystemsStep7Screen: FC<MechanicalSystemsStep7ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const { onCamera, photoCount } = usePhotoCapture("mechanical_systems", 7)
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.mechanicalSystems.step7

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Options for checkboxes
  const voltageItems = useMemo(
    () => VOLTAGE_OPTIONS.map((o) => ({ id: o.id, label: o.label })),
    [],
  )
  const wiringItems = useMemo(
    () => Wiring_Method_Options.map((o) => ({ id: o.id, label: o.label })),
    [],
  )
  const generatorTypeItems = useMemo(
    () => EMERGENCY_GENERATOR_OPTIONS.map((o) => ({ id: o.id, label: o.label })),
    [],
  )
  const tankLocationItems = useMemo(
    () => ELECTRICAL_TANK_OPTIONS.map((o) => ({ id: o.id, label: o.label })),
    [],
  )

  const onNext = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep8" as never, { transition: "slide_from_right" } as never)
  }

  const onBack = () => {
    // @ts-expect-error route params for animation
    navigation.navigate("MechanicalSystemsStep6" as never, { transition: "slide_from_left" } as never)
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
        <View style={$introBlock}>
          <Text preset="subheading" text="Electrical" style={themed($titleStyle)} />
          <ProgressBar current={7} total={9} />
        </View>

        {/* ============================================ */}
        {/* TRANSFORMERS */}
        {/* ============================================ */}
        <SectionAccordion
          title="Transformers"
          expanded={openKey === "transformers"}
          onToggle={(n) => setOpenKey(n ? "transformers" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Pad"
              items={[
                { id: "hasPad", label: "Yes", checked: store?.transformers.hasPad ?? false },
              ]}
              onToggle={(id, checked) => store?.updateTransformers({ hasPad: checked })}
            />
            {store?.transformers.hasPad && (
              <TextField
                label="#"
                placeholder="Enter quantity"
                keyboardType="decimal-pad"
                value={store?.transformers.padQuantity?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateTransformers({ padQuantity: val ? parseInt(val, 10) : 0 })
                }
              />
            )}

            <ChecklistField
              label="Pole-mounted"
              items={[
                { id: "hasPoleMounted", label: "Yes", checked: store?.transformers.hasPoleMounted ?? false },
              ]}
              onToggle={(id, checked) => store?.updateTransformers({ hasPoleMounted: checked })}
            />
            {store?.transformers.hasPoleMounted && (
              <TextField
                label="#"
                placeholder="Enter quantity"
                keyboardType="decimal-pad"
                value={store?.transformers.poleMountedQuantity?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateTransformers({ poleMountedQuantity: val ? parseInt(val, 10) : 0 })
                }
              />
            )}

            <TextField
              label="Amps"
              placeholder="Enter amps"
              keyboardType="decimal-pad"
              value={store?.transformers.amps?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTransformers({ amps: val ? parseFloat(val) : 0 })
              }
            />

            <ChecklistField
              label="Voltage"
              items={voltageItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.transformers.voltage.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.transformers.voltage.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTransformers({ voltage: updated })
              }}
            />

            <ChecklistField
              label="Wiring"
              items={wiringItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.transformers.wiring.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.transformers.wiring.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTransformers({ wiring: updated })
              }}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.transformers.assessment.repairStatus as any}
                onChange={(v) => store?.updateTransformers({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.transformers.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTransformers({
                  amountToReplaceRepair: val ? parseFloat(val) : 0,
                })
              }
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* MAIN */}
        {/* ============================================ */}
        <SectionAccordion
          title="Main"
          expanded={openKey === "main"}
          onToggle={(n) => setOpenKey(n ? "main" : null)}
        >
          <View style={themed($sectionBody)}>
            <TextField
              label="Amps"
              placeholder="Enter amps"
              keyboardType="decimal-pad"
              value={store?.main.amps?.toString() ?? ""}
              onChangeText={(val) => store?.updateMain({ amps: val ? parseFloat(val) : 0 })}
            />

            <ChecklistField
              label="Voltage"
              items={voltageItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.main.voltage.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.main.voltage.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateMain({ voltage: updated })
              }}
            />

            <ChecklistField
              label="Wiring"
              items={wiringItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.main.wiring.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.main.wiring.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateMain({ wiring: updated })
              }}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.main.assessment.repairStatus as any}
                onChange={(v) => store?.updateMain({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.main.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateMain({ amountToReplaceRepair: val ? parseFloat(val) : 0 })
              }
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* TENANT/APT */}
        {/* ============================================ */}
        <SectionAccordion
          title="Tenant/Apt"
          expanded={openKey === "tenantApt"}
          onToggle={(n) => setOpenKey(n ? "tenantApt" : null)}
        >
          <View style={themed($sectionBody)}>
            <TextField
              label="Amps"
              placeholder="Enter amps"
              keyboardType="decimal-pad"
              value={store?.tenantApt.amps?.toString() ?? ""}
              onChangeText={(val) => store?.updateTenantApt({ amps: val ? parseFloat(val) : 0 })}
            />

            <ChecklistField
              label="Voltage"
              items={voltageItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.tenantApt.voltage.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.tenantApt.voltage.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTenantApt({ voltage: updated })
              }}
            />

            <ChecklistField
              label="Wiring"
              items={wiringItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.tenantApt.wiring.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.tenantApt.wiring.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTenantApt({ wiring: updated })
              }}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tenantApt.assessment.repairStatus as any}
                onChange={(v) => store?.updateTenantApt({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.tenantApt.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTenantApt({ amountToReplaceRepair: val ? parseFloat(val) : 0 })
              }
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* EMERGENCY GENERATOR 1 */}
        {/* ============================================ */}
        <SectionAccordion
          title="Emergency Generator 1"
          expanded={openKey === "emergencyGenerator1"}
          onToggle={(n) => setOpenKey(n ? "emergencyGenerator1" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Type"
              items={generatorTypeItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.emergencyGenerator1.type.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.emergencyGenerator1.type.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateEmergencyGenerator1({ type: updated })
              }}
            />

            <View style={$row}>
              <TextField
                label="Eff Age"
                placeholder="Years"
                keyboardType="decimal-pad"
                value={store?.emergencyGenerator1.effAge?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator1({ effAge: val ? parseInt(val, 10) : 0 })
                }
                containerStyle={$halfWidth}
              />
              <View style={$halfWidth} />
            </View>

            <View style={$row}>
              <TextField
                label="kVa"
                placeholder="Enter kVa"
                keyboardType="decimal-pad"
                value={store?.emergencyGenerator1.kVa?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator1({ kVa: val ? parseFloat(val) : 0 })
                }
                containerStyle={$halfWidth}
              />
              <TextField
                label="Kw"
                placeholder="Enter Kw"
                keyboardType="decimal-pad"
                value={store?.emergencyGenerator1.kw?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator1({ kw: val ? parseFloat(val) : 0 })
                }
                containerStyle={$halfWidth}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.emergencyGenerator1.assessment.repairStatus as any}
                onChange={(v) => store?.updateEmergencyGenerator1({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.emergencyGenerator1.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateEmergencyGenerator1({
                  amountToReplaceRepair: val ? parseFloat(val) : 0,
                })
              }
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* TANK 1 */}
        {/* ============================================ */}
        <SectionAccordion
          title="Tank 1"
          expanded={openKey === "tank1"}
          onToggle={(n) => setOpenKey(n ? "tank1" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField
              label="Location"
              items={tankLocationItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.tank1.location.includes(item.id) ?? false,
              }))}
              onToggle={(id, checked) => {
                const current = store?.tank1.location.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTank1({ location: updated })
              }}
            />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tank1.assessment.repairStatus as any}
                onChange={(v) => store?.updateTank1({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
              keyboardType="decimal-pad"
              value={store?.tank1.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTank1({
                  amountToReplaceRepair: val ? parseFloat(val) : 0,
                })
              }
            />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* EMERGENCY GENERATOR 2 */}
        {/* ============================================ */}
        <SectionAccordion
          title="Emergency Generator 2"
          expanded={openKey === "emergencyGenerator2"}
          onToggle={(n) => setOpenKey(n ? "emergencyGenerator2" : null)}
        >
          <View style={themed($sectionBody)}>
                    <ChecklistField
              label="Type"
              items={generatorTypeItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.emergencyGenerator2.type.includes(item.id) ?? false,
                      }))}
                      onToggle={(id, checked) => {
                const current = store?.emergencyGenerator2.type.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateEmergencyGenerator2({ type: updated })
                      }}
                    />

                    <View style={$row}>
                      <TextField
                        label="Eff Age"
                        placeholder="Years"
                        keyboardType="decimal-pad"
                value={store?.emergencyGenerator2.effAge?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator2({ effAge: val ? parseInt(val, 10) : 0 })
                }
                        containerStyle={$halfWidth}
                      />
              <View style={$halfWidth} />
            </View>

            <View style={$row}>
                      <TextField
                        label="kVa"
                        placeholder="Enter kVa"
                        keyboardType="decimal-pad"
                value={store?.emergencyGenerator2.kVa?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator2({ kVa: val ? parseFloat(val) : 0 })
                }
                containerStyle={$halfWidth}
              />
              <TextField
                label="Kw"
                placeholder="Enter Kw"
                keyboardType="decimal-pad"
                value={store?.emergencyGenerator2.kw?.toString() ?? ""}
                onChangeText={(val) =>
                  store?.updateEmergencyGenerator2({ kw: val ? parseFloat(val) : 0 })
                }
                        containerStyle={$halfWidth}
                      />
                    </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.emergencyGenerator2.assessment.repairStatus as any}
                onChange={(v) => store?.updateEmergencyGenerator2({ assessment: { repairStatus: v } })}
              />
            </View>

                    <TextField
              label="Amount to Replace/Repair ($)"
              placeholder="Dollar amount"
                      keyboardType="decimal-pad"
              value={store?.emergencyGenerator2.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateEmergencyGenerator2({
                  amountToReplaceRepair: val ? parseFloat(val) : 0,
                })
              }
                    />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* TANK 2 */}
        {/* ============================================ */}
        <SectionAccordion
          title="Tank 2"
          expanded={openKey === "tank2"}
          onToggle={(n) => setOpenKey(n ? "tank2" : null)}
        >
          <View style={themed($sectionBody)}>
                    <ChecklistField
              label="Location"
              items={tankLocationItems.map((item) => ({
                id: item.id,
                label: item.label,
                checked: store?.tank2.location.includes(item.id) ?? false,
                      }))}
                      onToggle={(id, checked) => {
                const current = store?.tank2.location.slice() || []
                const updated = checked
                  ? [...current, id]
                  : current.filter((v) => v !== id)
                store?.updateTank2({ location: updated })
                      }}
                    />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.tank2.assessment.repairStatus as any}
                onChange={(v) => store?.updateTank2({ assessment: { repairStatus: v } })}
              />
            </View>

                    <TextField
              label="Amount to Replace/Repair ($)"
                      placeholder="Dollar amount"
                      keyboardType="decimal-pad"
              value={store?.tank2.amountToReplaceRepair?.toString() ?? ""}
              onChangeText={(val) =>
                store?.updateTank2({
                  amountToReplaceRepair: val ? parseFloat(val) : 0,
                })
              }
              />
          </View>
        </SectionAccordion>

        {/* ============================================ */}
        {/* COMMENTS */}
        {/* ============================================ */}
        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Additional notes about electrical systems"
            value={store?.comments ?? ""}
            onChangeText={(val) => store?.updateComments(val)}
            multiline
            minRows={2}
          />
        </View>
      </ScrollView>

      <View style={$stickyFooter}>
        <StickyFooterNav onBack={onBack} onNext={onNext} showCamera={true} onCamera={onCamera} photoCount={photoCount} />
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

const $stickyHeader: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 2,
}

const $scrollArea: ViewStyle = {
  flex: 1,
}

const $content: ThemedStyle<ViewStyle> = (theme) => ({
  paddingTop: 88,
  paddingBottom: 112, // 96 (footer height) + 16 (spacing)
  gap: 0,
})

const $introBlock: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 32,
  gap: 8,
}

const $paddedBlock: ThemedStyle<ViewStyle> = (theme) => ({
  paddingHorizontal: theme.spacing.md,
  paddingTop: theme.spacing.md,
  paddingBottom: theme.spacing.sm,
})

const $titleStyle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.primary2,
  fontSize: 24,
  marginBottom: theme.spacing.xs,
})

const $sectionBody: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.md,
})

const $controlGroup: ThemedStyle<ViewStyle> = (theme) => ({
  gap: theme.spacing.xs,
})

const $commentsBlock: ThemedStyle<ViewStyle> = (theme) => ({
  paddingHorizontal: theme.spacing.md,
  paddingTop: theme.spacing.md,
})

const $stickyFooter: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 12,
}

const $halfWidth: ViewStyle = {
  flex: 1,
}
