import { FC, useEffect, useMemo, useRef, useState } from "react"
import { Animated, FlatList, Modal, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProjectSummaryFormNavigatorParamList } from "@/navigators/ProjectSummaryFormNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useNavigation } from "@react-navigation/native"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { TextField } from "@/components/TextField"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { useStores } from "@/models/RootStoreProvider"

interface ProjectSummaryStep3ScreenProps extends NativeStackScreenProps<ProjectSummaryFormNavigatorParamList, "ProjectSummaryStep3"> {}

export const ProjectSummaryStep3Screen: FC<ProjectSummaryStep3ScreenProps> = observer(() => {
  const navigation = useNavigation()
  const rootStore = useStores()
  const activeAssessment = rootStore.activeAssessmentId
    ? rootStore.assessments.get(rootStore.activeAssessmentId)
    : undefined
  const projectSummaryStore = activeAssessment?.projectSummary

  const [docModalVisible, setDocModalVisible] = useState(false)

  const documents = projectSummaryStore?.documents ?? []
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

  const docsProvidedCount = useMemo(
    () => documents.reduce((acc, d) => acc + (d.provided ? 1 : 0), 0),
    [projectSummaryStore?.lastModified],
  )

  function onNext() {
    navigation.navigate("ProjectSummaryStep4" as never)
  }

  return (
    <Screen style={$root} preset="scroll" contentContainerStyle={$content}>
      <Text preset="heading" text="Documentation & Personnel" />
      <Text preset="subheading" text="Document review and personnel interviews" />

      {/* Documentation Section */}
      <Card
        HeadingComponent={<Text preset="subheading" text="Documentation" />}
        ContentComponent={
          <View style={$sectionContent}>
            <View style={$rowBetween}>
              <Text text={`${docsProvidedCount} of ${documents.length} selected`} />
              <Button text="Open Checklist" onPress={() => setDocModalVisible(true)} />
            </View>
            {/* Inline scrollable checklist preview */}
            <View style={$docPreviewContainer}>
              <ListWithFadingDot
                data={documents.slice()}
                keyExtractor={(d: { type: string }) => d.type}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />}
                contentContainerStyle={$docPreviewContentPadding}
                renderItem={({ item }: { item: { label: string; provided: boolean; type: string } }) => (
                  <View style={$docRow}>
                    <Text text={item.label} />
                    <View style={$row}>
                      <Checkbox
                        value={item.provided}
                        onValueChange={(v) => projectSummaryStore?.updateDocumentChecklist(item.type, v)}
                      />
                      <View style={$pill(item.provided)}>
                        <Text text={item.provided ? "Yes" : "No"} />
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        }
      />

      {/* Personnel Interviewed Section */}
      <View style={$sectionHeaderRow}>
        <Text preset="subheading" text="Personnel Interviewed" />
        <Button text="Add Person" onPress={() => projectSummaryStore?.addPersonnel("", "", 0, "")} />
      </View>
      <FlatList
        data={personnel.slice()}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <Card
            HeadingComponent={<Text weight="bold" text={`Person ${index + 1}`} />}
            ContentComponent={
              <View style={$cardFields}>
                <TextField
                  label="Name"
                  value={item.name}
                  onChangeText={(val) => projectSummaryStore?.updatePersonnel(item.id, { name: val })}
                />
                <TextField
                  label="Title"
                  value={item.title}
                  onChangeText={(val) => projectSummaryStore?.updatePersonnel(item.id, { title: val })}
                />
                <View style={$row}>
                  <TextField
                    label="Years at Property"
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
        )}
      />

      {/* Commercial Tenants Section */}
      <View style={$sectionHeaderRow}>
        <Text preset="subheading" text="Commercial Tenants" />
        <Button text="Add Tenant" onPress={() => projectSummaryStore?.addCommercialTenant("", "", false)} />
      </View>
      <FlatList
        data={tenants.slice()}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item, index }) => (
          <Card
            HeadingComponent={<Text weight="bold" text={`Tenant ${index + 1}`} />}
            ContentComponent={
              <View style={$cardFields}>
                <TextField
                  label="Tenant Name"
                  value={item.name}
                  onChangeText={(val) => projectSummaryStore?.updateCommercialTenant(item.id, { name: val })}
                />
                <TextField
                  label="Address/Unit Number"
                  value={item.addressOrUnit}
                  onChangeText={(val) => projectSummaryStore?.updateCommercialTenant(item.id, { addressOrUnit: val })}
                />
                <View style={$rowBetween}>
                  <Checkbox
                    label="Unit Accessed"
                    value={item.accessed}
                    onValueChange={(v) => projectSummaryStore?.updateCommercialTenant(item.id, { accessed: v })}
                  />
                  <View style={$pill(item.accessed)}>
                    <Text text={item.accessed ? "Yes" : "No"} />
                  </View>
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
        )}
      />

      <Button preset="filled" text="Next" onPress={onNext} />

      {/* Documentation Modal */}
      <Modal visible={docModalVisible} animationType="slide" onRequestClose={() => setDocModalVisible(false)}>
        <Screen preset="fixed" style={{ flex: 1 }} contentContainerStyle={$modalContainer}>
          <View style={$sectionHeaderRow}>
            <Text preset="subheading" text="Documentation" />
            <Button text="Done" onPress={() => setDocModalVisible(false)} />
          </View>
          <View style={$rowBetween}>
            <Text text={`${docsProvidedCount} of ${documents.length} selected`} />
            <View style={$row}>
              <Button
                text="Select All"
                onPress={() => documents.forEach((d) => projectSummaryStore?.updateDocumentChecklist(d.type, true))}
              />
              <Button
                preset="reversed"
                text="Clear All"
                onPress={() => documents.forEach((d) => projectSummaryStore?.updateDocumentChecklist(d.type, false))}
              />
            </View>
          </View>
          <View style={$flex1}>
            <ListWithFadingDot
              data={documents.slice()}
              keyExtractor={(d: { type: string }) => d.type}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e5e7eb" }} />}
              renderItem={({ item }: { item: { label: string; provided: boolean; type: string } }) => (
                <TouchableOpacity
                  onPress={() => projectSummaryStore?.updateDocumentChecklist(item.type, !item.provided)}
                  style={$docRow}
                >
                  <Text text={item.label} />
                  <View style={$row}>
                    <Checkbox
                      value={item.provided}
                      onValueChange={(v) => projectSummaryStore?.updateDocumentChecklist(item.type, v)}
                    />
                    <View style={$pill(item.provided)}>
                      <Text text={item.provided ? "Yes" : "No"} />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Screen>
      </Modal>
    </Screen>
  )
})

// Lightweight wrapper that hides the scrollbar and shows a floating dot that fades away
function ListWithFadingDot(props: any) {
  const { data, renderItem, keyExtractor, ItemSeparatorComponent, style, contentContainerStyle } = props
  const [listHeight, setListHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const scrollY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

  function handleScroll(e: any) {
    const y = e.nativeEvent.contentOffset.y || 0
    scrollY.setValue(y)
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }).start()
    fadeTimeout.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start()
    }, 650)
  }

  const maxScroll = Math.max(1, contentHeight - listHeight)
  const travel = Math.max(0, listHeight - 20) // 20 = dot size
  const translateY = scrollY.interpolate({ inputRange: [0, maxScroll], outputRange: [0, travel], extrapolate: "clamp" })

  return (
    <View style={[$flex1, { position: "relative" }, style]} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        decelerationRate="fast"
        style={$flex1}
      />
      {contentHeight > listHeight && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 4,
            width: 6,
            height: 24,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.35)",
            opacity,
            transform: [{ translateY }],
          }}
        />
      )}
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  padding: 16,
  gap: 16,
}

const $sectionContent: ViewStyle = {
  gap: 12,
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
  gap: 12,
}

const $alignEnd: ViewStyle = {
  alignSelf: "flex-end",
}

const $modalContainer: ViewStyle = {
  padding: 16,
  gap: 16,
  flex: 1,
}

const $docRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
}

const $pill = (on: boolean): ViewStyle => ({
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  backgroundColor: on ? "#dbeafe" : "#e5e7eb",
})

const $docPreviewContainer: ViewStyle = {
  maxHeight: 240,
  backgroundColor: "#f3f4f6",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#e5e7eb",
}

const $docPreviewContentPadding: ViewStyle = { padding: 8, paddingHorizontal: 16 }

const $flex1: ViewStyle = { flex: 1 }
