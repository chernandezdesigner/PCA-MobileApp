import { FC, useState } from "react"
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
import type { BuildingEnvelopeFormNavigatorParamList } from "@/navigators/BuildingEnvelopeFormNavigator"
import {
  WINDOW_TYPE_OPTIONS,
  WINDOW_GLAZING_TYPE_OPTIONS,
  WINDOW_PANE_OPTIONS,
  WINDOW_FRAME_OPTIONS,
} from "@/constants/buildingEnvelopeOptions"

interface BuildingEnvelopeStep8ScreenProps
  extends NativeStackScreenProps<BuildingEnvelopeFormNavigatorParamList, "BuildingEnvelopeStep8"> {}

export const BuildingEnvelopeStep8Screen: FC<BuildingEnvelopeStep8ScreenProps> = observer(() => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const { openDrawer } = useDrawerControl()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const store = activeAssessment?.buildingEnvelope.step8

  // Local accordion control: only one open at a time
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Transform data for checklist fields
  const windowTypeData = store?.windowsType.windowTypes ?? []
  const windowTypeItems: ChecklistItem[] = WINDOW_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: windowTypeData.includes(opt.id),
  }))

  const glazingData = store?.glazingAndPanes.glazing ?? []
  const glazingItems: ChecklistItem[] = WINDOW_GLAZING_TYPE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: glazingData.includes(opt.id),
  }))

  const panesData = store?.glazingAndPanes.panes ?? []
  const panesItems: ChecklistItem[] = WINDOW_PANE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: panesData.includes(opt.id),
  }))

  const frameTypeData = store?.frameType.frameTypes ?? []
  const frameTypeItems: ChecklistItem[] = WINDOW_FRAME_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    checked: frameTypeData.includes(opt.id),
  }))

  // Toggle handlers
  const toggleWindowType = (id: string, checked: boolean) => {
    const current = windowTypeData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateWindowsType({ windowTypes: newArray })
  }

  const toggleGlazing = (id: string, checked: boolean) => {
    const current = glazingData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateGlazingAndPanes({ glazing: newArray })
  }

  const togglePanes = (id: string, checked: boolean) => {
    const current = panesData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateGlazingAndPanes({ panes: newArray })
  }

  const toggleFrameType = (id: string, checked: boolean) => {
    const current = frameTypeData
    const newArray = checked ? [...current, id] : current.filter((item: string) => item !== id)
    store?.updateFrameType({ frameTypes: newArray })
  }

  return (
    <Screen style={$root} preset="fixed" contentContainerStyle={$screenInner}>
      <View style={$stickyHeader}>
        <HeaderBar
          title="Building Envelope"
          leftIcon="back"
          onLeftPress={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep7" as never, { transition: "slide_from_left" } as never)
          }}
          rightIcon="menu"
          onRightPress={openDrawer}
        />
      </View>
      <ScrollView contentContainerStyle={themed($content)} style={$scrollArea}>
        <View style={themed($paddedBlock)}>
          <Text preset="subheading" text="Windows" style={themed($titleStyle)} />
          <ProgressBar current={8} total={10} />
        </View>

        <SectionAccordion
          title="Windows Type"
          expanded={openKey === "windowsType"}
          onToggle={(n) => setOpenKey(n ? "windowsType" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Window Types" items={windowTypeItems} onToggle={toggleWindowType} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.windowsType.assessment.condition as any}
                onChange={(v) => store?.updateWindowsType({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.windowsType.assessment.repairStatus as any}
                onChange={(v) => store?.updateWindowsType({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.windowsType.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateWindowsType({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Glazing and Panes"
          expanded={openKey === "glazingAndPanes"}
          onToggle={(n) => setOpenKey(n ? "glazingAndPanes" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Glazing Type" items={glazingItems} onToggle={toggleGlazing} />

            <ChecklistField label="Pane Type" items={panesItems} onToggle={togglePanes} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.glazingAndPanes.assessment.condition as any}
                onChange={(v) => store?.updateGlazingAndPanes({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.glazingAndPanes.assessment.repairStatus as any}
                onChange={(v) => store?.updateGlazingAndPanes({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.glazingAndPanes.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateGlazingAndPanes({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <SectionAccordion
          title="Frame Type"
          expanded={openKey === "frameType"}
          onToggle={(n) => setOpenKey(n ? "frameType" : null)}
        >
          <View style={themed($sectionBody)}>
            <ChecklistField label="Frame Types" items={frameTypeItems} onToggle={toggleFrameType} />

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Condition" />
              <ConditionAssessment
                value={store?.frameType.assessment.condition as any}
                onChange={(v) => store?.updateFrameType({ assessment: { condition: v } })}
              />
            </View>

            <View style={themed($controlGroup)}>
              <Text preset="formLabel" text="Repair Status" />
              <RepairStatus
                value={store?.frameType.assessment.repairStatus as any}
                onChange={(v) => store?.updateFrameType({ assessment: { repairStatus: v } })}
              />
            </View>

            <TextField
              label="Amount to Repair ($)"
              placeholder="Dollar amount"
              keyboardType="numeric"
              value={store?.frameType.assessment.amountToRepair ?? ""}
              onChangeText={(txt) => store?.updateFrameType({ assessment: { amountToRepair: txt } })}
            />
          </View>
        </SectionAccordion>

        <View style={themed($commentsBlock)}>
          <TextField
            label="Comments"
            placeholder="Note any window conditions, damage, or concerns"
            value={store?.comments ?? ""}
            onChangeText={(txt) => store?.updateComments(txt)}
            multiline
            minRows={2}
          />
        </View>
      </ScrollView>
      <View style={$stickyFooter}>
        <StickyFooterNav
          onBack={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep7" as never, { transition: "slide_from_left" } as never)
          }}
          onNext={() => {
            // @ts-expect-error route params for animation
            navigation.navigate("BuildingEnvelopeStep9" as never, { transition: "slide_from_right" } as never)
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
