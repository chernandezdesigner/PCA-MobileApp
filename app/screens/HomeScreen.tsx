import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, Alert, RefreshControl } from "react-native"
import { observer } from "mobx-react-lite"
import { format as formatDateFns } from "date-fns/format"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { AnimatedPressable } from "@/components/AnimatedPressable"
import { useStores } from "@/models/RootStoreProvider"
import { useAuth } from "@/context/AuthContext"
import { AssessmentService } from "@/services/supabase/assessmentService"
import { PhotoService } from "@/services/supabase/photoService"
import { generateUUID } from "@/utils/generateUUID"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { elevation, radii, opacity } from "@/theme/styles"
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
  const { contentMaxWidth } = useResponsiveLayout()

  const [submittedAssessments, setSubmittedAssessments] = useState<SupabaseAssessment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  // Tracks which pending-sync assessment is currently being submitted so we
  // can show a per-card loading state without blocking the whole screen.
  const [syncingId, setSyncingId] = useState<string | null>(null)

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
        const submitted = result.assessments.filter(
          (a) => a.status === "submitted" || a.status === "synced"
        )
        setSubmittedAssessments(submitted)
        setLoadError(null)
      }
    } catch (_error) {
      setLoadError("Unable to load submitted assessments. Check your connection.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadSubmittedAssessments()
  }, [])

  // Prune submitted assessments from local MMKV storage on every home screen
  // mount. Once an assessment reaches "submitted" status its canonical copy is
  // in Supabase — keeping it in MMKV only bloats the snapshot that is
  // serialized and written on every form change. Photo files are deleted first
  // so we don't leave orphaned images in DocumentDir.
  useEffect(() => {
    const pruneSubmitted = async () => {
      const submitted = Array.from(rootStore.assessments.values()).filter(
        (a) => a.status === "submitted"
      )
      for (const assessment of submitted) {
        await PhotoService.cleanupLocalPhotos(assessment.id)
        rootStore.deleteAssessment(assessment.id)
      }
    }
    pruneSubmitted()
  }, [])

  const handleStartNewAssessment = () => {
    const id = generateUUID()
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
          onPress: async () => {
            const assessment = rootStore.assessments.get(assessmentId)
            if (assessment?.supabaseId) {
              await AssessmentService.deleteAssessment(assessment.supabaseId)
            }
            rootStore.deleteAssessment(assessmentId)
          },
        },
      ]
    )
  }


  const handleSyncNow = async (assessmentId: string) => {
    const assessment = rootStore.assessments.get(assessmentId)
    if (!assessment || syncingId) return

    setSyncingId(assessmentId)
    const result = await AssessmentService.submitAssessment(assessment)
    setSyncingId(null)

    if (result.success) {
      if (result.assessmentId) assessment.setSupabaseId(result.assessmentId)
      const failedCount = result.failedPhotoCount ?? 0
      if (failedCount > 0) {
        // Keep as draft so the inspector can tap Continue → open the drawer →
        // tap Submit to retry just the failed photos. markAsSubmitted() is
        // intentionally skipped — it would remove the assessment from the
        // drafts list, cutting off the only retry path.
        assessment.clearPendingSync()
        Alert.alert(
          'Form Data Saved',
          `${failedCount} photo(s) failed to upload. Tap Continue on this assessment, then use the menu to Submit and retry.`
        )
      } else {
        assessment.markAsSubmitted() // clears pendingSync internally
        Alert.alert('Submitted', 'Assessment submitted successfully.')
        loadSubmittedAssessments()
      }
    } else if (result.error === 'OFFLINE') {
      Alert.alert('Still Offline', 'You appear to be offline. Try again when you have a connection.')
    } else if (result.error === 'AUTH_EXPIRED') {
      Alert.alert(
        'Session Expired',
        'Your login session has expired. Sign out and back in — your draft is saved locally.'
      )
    } else {
      Alert.alert('Submit Failed', result.error || 'Something went wrong. Please try again.')
    }
  }

  const draftCount = draftAssessments.length
  const submittedCount = submittedAssessments.length

  const renderDraftItem = ({ item }: { item: any }) => {
    const projectName = item.projectSummary.projectName || "Untitled Assessment"
    const lastModified = formatDateFns(item.updatedAt, "MMM dd, yyyy h:mm a")
    const created = formatDateFns(item.createdAt, "MMM dd, yyyy")
    const isPendingSync = !!item.pendingSync
    const isSyncing = syncingId === item.id

    return (
      <AnimatedPressable
        onPress={() => handleContinueDraft(item.id)}
        accessibilityLabel={isPendingSync ? `Sync ${projectName}` : `Continue ${projectName}`}
        accessibilityHint={isPendingSync ? "Assessment queued for sync" : "Opens this draft assessment"}
        style={[themed($card), isPendingSync && themed($pendingSyncCard)]}
      >
        <View style={themed($cardInner)}>
          {/* Top row: name + badge */}
          <View style={themed($cardTopRow)}>
            <Text preset="subheading" style={themed($projectNameText)} numberOfLines={2}>
              {projectName}
            </Text>
            {isPendingSync
              ? <Text preset="badge" style={themed($pendingSyncBadge)}>PENDING SYNC</Text>
              : <Text preset="badge" style={themed($draftBadge)}>DRAFT</Text>
            }
          </View>

          {/* Pending sync notice */}
          {isPendingSync && (
            <Text size="xs" style={themed($pendingSyncNote)}>
              Saved offline — connect to internet and tap Sync Now
            </Text>
          )}

          {/* Metadata */}
          {item.projectSummary.projectNumber ? (
            <Text size="sm" style={themed($detailText)}>
              Project #: {item.projectSummary.projectNumber}
            </Text>
          ) : null}
          <Text size="sm" style={themed($detailText)}>Created: {created}</Text>
          <Text size="xs" style={themed($metaText)}>Last modified: {lastModified}</Text>

          {/* Footer */}
          <View style={themed($cardFooter)}>
            {isPendingSync ? (
              // Pending sync: Sync Now is the primary action, Continue is secondary
              <AnimatedPressable
                onPress={(e) => {
                  e?.stopPropagation?.()
                  handleSyncNow(item.id)
                }}
                hitSlop={8}
                style={themed($syncNowBtn)}
                disabled={isSyncing}
                accessibilityLabel={`Sync ${projectName}`}
                accessibilityRole="button"
                scaleDown={0.95}
              >
                <Text size="sm" style={themed($syncNowText)}>
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Text>
              </AnimatedPressable>
            ) : (
              <View style={themed($continueHint)}>
                <Text size="sm" style={themed($continueText)}>Continue</Text>
                <Icon icon="caretRight" size={14} color={theme.colors.tint} />
              </View>
            )}

            <AnimatedPressable
              onPress={(e) => {
                e?.stopPropagation?.()
                handleDeleteDraft(item.id)
              }}
              hitSlop={12}
              style={themed($deleteBtn)}
              accessibilityLabel={`Delete ${projectName}`}
              accessibilityRole="button"
              scaleDown={0.9}
            >
              <Icon icon="x" size={14} color={theme.colors.palette.angry500} />
              <Text size="sm" style={themed($deleteBtnText)}>Delete</Text>
            </AnimatedPressable>
          </View>
        </View>
      </AnimatedPressable>
    )
  }

  const renderSubmittedItem = ({ item }: { item: SupabaseAssessment }) => {
    const projectName = item.project_summaries?.project_name || "Untitled Assessment"
    const projectNumber = item.project_summaries?.project_number
    const address = item.project_summaries?.property_address
    const submittedDate = formatDateFns(new Date(item.updated_at), "MMM dd, yyyy")

    return (
      <View style={themed($card)}>
        <View style={themed($cardInner)}>
          <View style={themed($cardTopRow)}>
            <Text preset="subheading" style={themed($projectNameText)} numberOfLines={2}>
              {projectName}
            </Text>
            <Text preset="badge" style={themed($submittedBadge)}>SUBMITTED</Text>
          </View>

          {projectNumber ? (
            <Text size="sm" style={themed($detailText)}>Project #: {projectNumber}</Text>
          ) : null}
          {address ? (
            <Text size="sm" style={themed($detailText)}>{address}</Text>
          ) : null}

          <Text size="xs" style={themed($metaText)}>{submittedDate}</Text>
        </View>
      </View>
    )
  }

  const isEmpty = draftCount === 0 && submittedCount === 0 && !isLoading

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>
      <View style={[themed($contentWrapper), contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: "center" as const, width: "100%" as const } : undefined]}>
        {/* Header */}
        <View style={themed($header)}>
          <Text preset="heading" text="Property Assessments" style={$headerTitle} />
          <Text
            size="sm"
            style={themed($signOutLink)}
            onPress={logout}
          >
            Sign Out
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={themed($statsRow)}>
          <View style={[themed($statCard), draftCount === 0 && { opacity: opacity.dimmed }]}>
            <Text style={themed($statCountDraft)}>{draftCount}</Text>
            <Text size="xs" style={themed($statLabel)}>Drafts</Text>
          </View>
          <View style={[themed($statCard), submittedCount === 0 && { opacity: opacity.dimmed }]}>
            <Text style={themed($statCountSubmitted)}>{submittedCount}</Text>
            <Text size="xs" style={themed($statLabel)}>Submitted</Text>
          </View>
        </View>

        {/* Primary CTA */}
        <Button
          text="+ Start New Assessment"
          preset="filled"
          size="md"
          style={themed($newAssessmentButton)}
          onPress={handleStartNewAssessment}
        />

        {/* Assessment List */}
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
              {draftCount > 0 && (
                <>
                  <Text preset="subheading" style={themed($sectionTitle)}>
                    Drafts ({draftCount})
                  </Text>
                  {draftAssessments.map((item) => (
                    <View key={item.id}>{renderDraftItem({ item })}</View>
                  ))}
                </>
              )}

              {loadError && (
                <View style={themed($offlineNotice)}>
                  <Text style={themed($offlineNoticeText)} text={loadError} />
                </View>
              )}

              {submittedCount > 0 && (
                <Text preset="subheading" style={themed($sectionTitle)}>
                  Submitted ({submittedCount})
                </Text>
              )}

              {isEmpty && (
                <View style={themed($emptyState)}>
                  <Text style={themed($emptyText)}>No assessments yet</Text>
                  <Text size="sm" style={themed($emptySubtext)}>
                    Start your first property assessment to get going
                  </Text>
                  <Button
                    text="Start Assessment"
                    preset="filled"
                    style={themed($emptyCtaButton)}
                    onPress={handleStartNewAssessment}
                  />
                </View>
              )}
            </View>
          }
          data={submittedAssessments}
          renderItem={renderSubmittedItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </Screen>
  )
})

/* ── Styles ─────────────────────────────────────────────── */

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
})

const $contentWrapper: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

// ── Header ──

const $header: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: spacing.sm,
  marginBottom: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $headerTitle: TextStyle = {
  flex: 1,
  flexShrink: 1,
}

const $signOutLink: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textDecorationLine: "underline",
  flexShrink: 0,
  marginLeft: 8,
})

// ── Stats Row ──

const $statsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.md,
  marginBottom: spacing.md,
})

const $statCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderRadius: radii.md,
  borderWidth: 1,
  borderColor: colors.palette.gray3,
  padding: spacing.sm,
  ...elevation.xs,
})

const $statCountDraft: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 22,
  fontWeight: "700",
  color: colors.palette.conditionFairBorder,
})

const $statCountSubmitted: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 22,
  fontWeight: "700",
  color: colors.palette.conditionGoodBorder,
})

const $statLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  marginTop: 2,
})

// ── CTA ──

const $newAssessmentButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

// ── List ──

const $listContainer: ViewStyle = {
  flex: 1,
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  paddingBottom: spacing.xl,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.sm,
  marginBottom: spacing.sm,
  color: colors.text,
})

// ── Card (shared) ──

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: radii.md,
  borderWidth: 1,
  borderColor: colors.palette.gray3,
  marginBottom: spacing.sm,
  ...elevation.sm,
})

const $cardInner: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $cardTopRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: spacing.xs,
})

const $projectNameText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  flex: 1,
  marginRight: spacing.sm,
})

const $detailText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xxs,
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

// Card footer: action hint left, secondary action right
const $cardFooter: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.md,
  paddingTop: spacing.sm,
  borderTopWidth: 1,
  borderTopColor: colors.palette.gray2,
})

const $continueHint: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  minHeight: 36,
  backgroundColor: colors.tint + "12",
  borderWidth: 1,
  borderColor: colors.tint + "30",
  borderRadius: radii.sm,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
})

const $continueText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  fontWeight: "600",
})

// ── Draft badge ──

const $draftBadge: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral100,
  backgroundColor: colors.palette.accent400,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
  borderRadius: radii.xs,
  overflow: "hidden",
})

// ── Delete button (inside draft card) ──

const $deleteBtn: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
  minHeight: 44,
  minWidth: 44,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
  borderRadius: radii.sm,
  borderWidth: 1,
  borderColor: colors.palette.angry500 + "30",
  backgroundColor: colors.palette.angry500 + "08",
})

const $deleteBtnText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.angry500,
  fontWeight: "600",
})

// ── Submitted badge ──

const $submittedBadge: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral100,
  backgroundColor: colors.palette.conditionGoodBorder,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
  borderRadius: radii.xs,
  overflow: "hidden",
})

// ── Empty State ──

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.xxxl,
  paddingHorizontal: spacing.lg,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  fontSize: 22,
  fontWeight: "600",
  marginBottom: spacing.xs,
})

const $emptySubtext: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.lg,
})

const $emptyCtaButton: ThemedStyle<ViewStyle> = () => ({
  minWidth: 200,
})

// ── Pending Sync card ──

const $pendingSyncCard: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.conditionFairBorder,
  borderWidth: 1.5,
})

const $pendingSyncBadge: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral100,
  backgroundColor: colors.palette.conditionFairBorder,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
  borderRadius: radii.xs,
  overflow: "hidden",
})

const $pendingSyncNote: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.conditionFairBorder,
  marginBottom: spacing.xs,
  fontStyle: "italic",
})

const $syncNowBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  minHeight: 36,
  paddingVertical: spacing.xxs,
  paddingHorizontal: spacing.sm,
  borderRadius: radii.sm,
  borderWidth: 1,
  borderColor: colors.palette.conditionFairBorder,
  backgroundColor: colors.palette.conditionFairBorder + "15",
})

const $syncNowText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.conditionFairBorder,
  fontWeight: "600",
})

// ── Offline Notice ──

const $offlineNotice: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.noticeBg,
  borderRadius: radii.sm,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  marginBottom: spacing.xs,
})

const $offlineNoticeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 13,
  color: colors.palette.noticeText,
})
