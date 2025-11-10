import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { observer } from "mobx-react-lite"
import { format as formatDateFns } from "date-fns/format"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { useStores } from "@/models/RootStoreProvider"
import { useAuth } from "@/context/AuthContext"
import { AssessmentService } from "@/services/supabase/assessmentService"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

interface SupabaseAssessment {
  id: string
  status: string
  created_at: string
  updated_at: string
  project_summaries?: {
    project_name: string
    project_number: string
    property_address: string
    inspection_date: string
  }
}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const { themed, theme } = useAppTheme()
  const { logout } = useAuth()
  const rootStore = useStores()

  const [submittedAssessments, setSubmittedAssessments] = useState<SupabaseAssessment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get draft assessments from MST
  const draftAssessments = Array.from(rootStore.assessments.values()).filter(
    (assessment) => assessment.status === "draft"
  )

  // Load submitted assessments from Supabase
  const loadSubmittedAssessments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const result = await AssessmentService.fetchUserAssessments()
      
      if (result.success && result.assessments) {
        // Filter for submitted/synced assessments
        const submitted = result.assessments.filter(
          (a) => a.status === "submitted" || a.status === "synced"
        )
        setSubmittedAssessments(submitted)
      } else if (result.error) {
        console.error("Failed to load assessments:", result.error)
      }
    } catch (error) {
      console.error("Error loading assessments:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadSubmittedAssessments()
  }, [])

  const handleStartNewAssessment = () => {
    const id = `assessment_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    rootStore.createAssessment(id)
    navigation.navigate("Assessment")
  }

  const handleContinueDraft = (assessmentId: string) => {
    rootStore.setActiveAssessment(assessmentId)
    navigation.navigate("Assessment")
  }

  const handleDeleteDraft = (assessmentId: string) => {
    Alert.alert(
      "Delete Draft",
      "Are you sure you want to delete this draft? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const assessment = rootStore.assessments.get(assessmentId)
            if (assessment) {
              rootStore.assessments.delete(assessmentId)
              if (rootStore.activeAssessmentId === assessmentId) {
                rootStore.activeAssessmentId = undefined
              }
            }
          },
        },
      ]
    )
  }

  const handleViewSubmitted = (assessment: SupabaseAssessment) => {
    // TODO: Implement view/edit for submitted assessments
    Alert.alert(
      "View Assessment",
      "Viewing submitted assessments will be available in a future update."
    )
  }

  const renderDraftItem = ({ item }: { item: any }) => {
    const projectName = item.projectSummary.projectName || "Untitled Assessment"
    const lastModified = formatDateFns(item.updatedAt, "MMM dd, yyyy h:mm a")
    const created = formatDateFns(item.createdAt, "MMM dd, yyyy")

    return (
      <Card
        style={themed($cardStyle)}
        ContentComponent={
          <View>
            <View style={$cardHeader}>
              <Text preset="subheading" style={themed($projectNameText)}>
                {projectName}
              </Text>
              <View style={themed($statusBadge)}>
                <Text style={themed($statusText)}>DRAFT</Text>
              </View>
            </View>
            
            {item.projectSummary.projectNumber && (
              <Text size="sm" style={themed($detailText)}>
                Project #: {item.projectSummary.projectNumber}
              </Text>
            )}
            
            <Text size="sm" style={themed($detailText)}>
              Created: {created}
            </Text>
            
            <Text size="xs" style={themed($metaText)}>
              Last modified: {lastModified}
            </Text>

            <View style={$buttonRow}>
              <Button
                text="Continue"
                preset="default"
                style={$continueButton}
                onPress={() => handleContinueDraft(item.id)}
              />
              <Button
                text="Delete"
                preset="default"
                style={themed($deleteButton)}
                textStyle={themed($deleteButtonText)}
                onPress={() => handleDeleteDraft(item.id)}
              />
            </View>
          </View>
        }
      />
    )
  }

  const renderSubmittedItem = ({ item }: { item: SupabaseAssessment }) => {
    const projectName = item.project_summaries?.project_name || "Untitled Assessment"
    const projectNumber = item.project_summaries?.project_number
    const address = item.project_summaries?.property_address
    const submittedDate = formatDateFns(new Date(item.updated_at), "MMM dd, yyyy h:mm a")

    return (
      <TouchableOpacity onPress={() => handleViewSubmitted(item)}>
        <Card
          style={themed($cardStyle)}
          ContentComponent={
            <View>
              <View style={$cardHeader}>
                <Text preset="subheading" style={themed($projectNameText)}>
                  {projectName}
                </Text>
                <View style={themed($submittedBadge)}>
                  <Text style={themed($submittedText)}>SUBMITTED</Text>
                </View>
              </View>
              
              {projectNumber && (
                <Text size="sm" style={themed($detailText)}>
                  Project #: {projectNumber}
                </Text>
              )}
              
              {address && (
                <Text size="sm" style={themed($detailText)}>
                  {address}
                </Text>
              )}
              
              <Text size="xs" style={themed($metaText)}>
                Submitted: {submittedDate}
              </Text>
            </View>
          }
        />
      </TouchableOpacity>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($container)}>
      <View style={themed($header)}>
        <Text preset="heading" text="Property Assessments" />
        <Button
          text="Sign Out"
          preset="default"
          style={themed($signOutButton)}
          textStyle={themed($signOutButtonText)}
          onPress={logout}
        />
      </View>

      <Button
        text="+ Start New Assessment"
        preset="reversed"
        style={themed($newAssessmentButton)}
        onPress={handleStartNewAssessment}
      />

      <FlatList
        style={$listContainer}
        contentContainerStyle={themed($listContent)}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadSubmittedAssessments(true)}
            tintColor={theme.colors.tint}
          />
        }
        ListHeaderComponent={
          <View>
            {draftAssessments.length > 0 && (
              <>
                <Text preset="subheading" style={themed($sectionTitle)}>
                  Drafts ({draftAssessments.length})
                </Text>
                <FlatList
                  data={draftAssessments}
                  renderItem={renderDraftItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </>
            )}

            {submittedAssessments.length > 0 && (
              <Text preset="subheading" style={themed($sectionTitle)}>
                Submitted ({submittedAssessments.length})
              </Text>
            )}

            {draftAssessments.length === 0 && submittedAssessments.length === 0 && !isLoading && (
              <View style={themed($emptyState)}>
                <Text style={themed($emptyText)}>No assessments yet</Text>
                <Text size="sm" style={themed($emptySubtext)}>
                  Tap "Start New Assessment" to begin
                </Text>
              </View>
            )}
          </View>
        }
        data={submittedAssessments}
        renderItem={renderSubmittedItem}
        keyExtractor={(item) => item.id}
      />
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
})

const $signOutButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 8,
  minHeight: 0,
})

const $signOutButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral800,
  fontSize: 14,
})

const $newAssessmentButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $listContainer: ViewStyle = {
  flex: 1,
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.md,
  marginBottom: spacing.sm,
  color: colors.text,
})

const $cardStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $cardHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 8,
}

const $projectNameText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  flex: 1,
  marginRight: 8,
})

const $statusBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.warning,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
})

const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 10,
  fontWeight: "600",
})

const $submittedBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.success,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
})

const $submittedText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 10,
  fontWeight: "600",
})

const $detailText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  marginBottom: 4,
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 8,
})

const $buttonRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
  marginTop: 12,
}

const $continueButton: ViewStyle = {
  flex: 1,
  minHeight: 40,
}

const $deleteButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  minHeight: 40,
  backgroundColor: colors.palette.neutral300,
})

const $deleteButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.angry500,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.xxxl,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 18,
  marginBottom: 8,
})

const $emptySubtext: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

