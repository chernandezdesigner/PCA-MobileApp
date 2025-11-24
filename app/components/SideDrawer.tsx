import { useState, useMemo, useEffect } from "react"
import { 
  StyleProp, 
  TextStyle, 
  View, 
  ViewStyle, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigationState } from "@react-navigation/native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { TextField } from "@/components/TextField"
import { Button } from "@/components/Button"
import { navigate, resetRoot, navigationRef } from "@/navigators/navigationUtilities"
import { useAuth } from "@/context/AuthContext"
import { useStores } from "@/models/RootStoreProvider"
import { AssessmentService } from "@/services/supabase"

export interface SideDrawerProps {
  /**
   * Called when user navigates to a screen
   */
  onNavigate?: () => void
  /**
   * Called when drawer should close
   */
  onClose?: () => void
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

interface NavigationItem {
  id: string
  label: string
  route?: keyof import("@/navigators/AssessmentFormStackNavigator").AssessmentFormStackParamList
  children?: NavigationItem[]
}

const NAVIGATION_STRUCTURE: NavigationItem[] = [
  {
    id: "project-summary",
    label: "Project Summary",
    children: [
      { id: "ps-step1", label: "General Info", route: "ProjectSummaryStep1" },
      { id: "ps-step2", label: "Unit Info", route: "ProjectSummaryStep2" },
      { id: "ps-step3", label: "Documentation & Personnel", route: "ProjectSummaryStep3" },
      { id: "ps-step4", label: "Red Flags & Utilities", route: "ProjectSummaryStep4" },
    ],
  },
  {
    id: "site-grounds",
    label: "Site Grounds",
    children: [
      { id: "sg-step1", label: "Drainage & Erosion", route: "SiteGroundsStep1" },
      { id: "sg-step2", label: "Topography", route: "SiteGroundsStep2" },
      { id: "sg-step3", label: "Site Elements", route: "SiteGroundsStep3" },
      { id: "sg-step4", label: "Other Structures", route: "SiteGroundsStep4" },
    ],
  },
  {
    id: "building-envelope",
    label: "Building Envelope",
    children: [
      { id: "be-step1", label: "Foundation & Substructure", route: "BuildingEnvelopeStep1" },
      { id: "be-step2", label: "Superstructure", route: "BuildingEnvelopeStep2" },
      { id: "be-step3", label: "Primary & Secondary Roofing", route: "BuildingEnvelopeStep3" },
      { id: "be-step4", label: "Exterior Walls", route: "BuildingEnvelopeStep4" },
      { id: "be-step5", label: "Parking, Paving, Sidewalks", route: "BuildingEnvelopeStep5" },
      { id: "be-step6", label: "Balconies, Patios", route: "BuildingEnvelopeStep6" },
      { id: "be-step7", label: "Stairs, Balconies, Patios", route: "BuildingEnvelopeStep7" },
      { id: "be-step8", label: "Windows", route: "BuildingEnvelopeStep8" },
      { id: "be-step9", label: "Doors", route: "BuildingEnvelopeStep9" },
      { id: "be-step10", label: "Pool, Spa", route: "BuildingEnvelopeStep10" },
    ],
  },
  {
    id: "mechanical-systems",
    label: "Mechanical Systems",
    children: [],
  },
  {
    id: "interior-conditions",
    label: "Interior Conditions",
    children: [],
  },
]

/**
 * Side drawer navigation with search and accordion sections
 */
export const SideDrawer = (props: SideDrawerProps) => {
  const { style, onNavigate, onClose } = props
  const { themed, theme } = useAppTheme()
  const { user, signOut } = useAuth()
  const rootStore = useStores()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Determine the deepest active route inside the Assessment navigator
  const activeChildRoute = useNavigationState((state) => {
    const assessmentRoute = state?.routes?.find((r) => r.name === "Assessment") as any
    function getDeepestRouteName(s: any): string | undefined {
      if (!s) return undefined
      const current = s.routes?.[s.index ?? 0]
      return current?.state ? getDeepestRouteName(current.state) : current?.name
    }
    return getDeepestRouteName(assessmentRoute?.state)
  })
  
  const [searchQuery, setSearchQuery] = useState("")

  // Find which section contains the current route
  const activeSectionId = useMemo(() => {
    if (!activeChildRoute) return null
    for (const section of NAVIGATION_STRUCTURE) {
      if (section.children?.some(child => child.route === activeChildRoute)) {
        return section.id
      }
    }
    return null
  }, [activeChildRoute])

  // Initialize expanded sections with only the active section
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(activeSectionId ? [activeSectionId] : ["project-summary"])
  )

  // Update expanded sections when route changes (only if not searching)
  useEffect(() => {
    if (!searchQuery.trim() && activeSectionId) {
      setExpandedSections(new Set([activeSectionId]))
    }
  }, [activeSectionId, searchQuery])

  // Filter navigation based on search
  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return NAVIGATION_STRUCTURE

    const query = searchQuery.toLowerCase()
    return NAVIGATION_STRUCTURE.map((section) => {
      const matchesSection = section.label.toLowerCase().includes(query)
      const filteredChildren = section.children?.filter(
        (child) =>
          child.label.toLowerCase().includes(query) ||
          (child.route && child.route.toLowerCase().includes(query))
      )

      if (matchesSection || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...section,
          children: matchesSection ? section.children : filteredChildren,
        }
      }
      return null
    }).filter(Boolean) as NavigationItem[]
  }, [searchQuery])

  // Auto-expand sections with search results when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const sectionsWithResults = new Set<string>()
      filteredNavigation.forEach((section) => {
        if (section.children && section.children.length > 0) {
          sectionsWithResults.add(section.id)
        }
      })
      setExpandedSections(sectionsWithResults)
    }
  }, [searchQuery, filteredNavigation])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const handleNavigate = (routeName: string) => {
    // Fade transition when navigating via drawer
    navigate("Assessment", { screen: routeName, params: { transition: "fade" } })
    onNavigate?.()
  }

  const isActiveRoute = (routeName?: string) => {
    return routeName === activeChildRoute
  }

  const handleSubmit = async () => {
    console.log('🔘 Submit button pressed!')
    console.log('📋 Active Assessment ID:', rootStore.activeAssessmentId)
    
    if (!rootStore.activeAssessmentId) {
      console.log('❌ No active assessment ID')
      Alert.alert('No Assessment', 'No active assessment to submit')
      return
    }

    const assessment = rootStore.assessments.get(rootStore.activeAssessmentId)
    console.log('📦 Assessment found:', !!assessment)
    
    if (!assessment) {
      console.log('❌ Assessment not found in store')
      Alert.alert('Error', 'Could not find assessment')
      return
    }

    console.log('✅ Showing confirmation dialog')
    
    // On web, Alert.alert with multiple buttons doesn't work properly
    // Use window.confirm as a fallback
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to submit this assessment to Supabase?')
      if (!confirmed) {
        console.log('🚫 User cancelled submission')
        return
      }
      
      console.log('🚀 Starting submission...')
      setIsSubmitting(true)
      const result = await AssessmentService.submitAssessment(assessment)
      setIsSubmitting(false)

      if (result.success) {
        console.log('✅ Submission successful!')
        window.alert('Success! Assessment submitted successfully')
      } else {
        console.log('❌ Submission failed:', result.error)
        window.alert(`Error: ${result.error || 'Failed to submit assessment'}`)
      }
    } else {
      // Native platform - use Alert.alert
      Alert.alert(
        'Submit Assessment',
        'Are you sure you want to submit this assessment to Supabase?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: async () => {
              console.log('🚀 Starting submission...')
              setIsSubmitting(true)
              const result = await AssessmentService.submitAssessment(assessment)
              setIsSubmitting(false)

              if (result.success) {
                console.log('✅ Submission successful!')
                Alert.alert('Success!', 'Assessment submitted successfully')
              } else {
                console.log('❌ Submission failed:', result.error)
                Alert.alert('Error', result.error || 'Failed to submit assessment')
              }
            },
          },
        ]
      )
    }
  }

  const handleExitToHome = () => {
    console.log('🏠 Exit to Home clicked')
    console.log('🔍 Navigation ref ready?', navigationRef.isReady())
    
    const performNavigation = () => {
      console.log('🚀 Attempting navigation to Home')
      try {
        if (!navigationRef.isReady()) {
          console.error('❌ Navigation ref not ready')
          return
        }
        resetRoot({ index: 0, routes: [{ name: "Home" }] })
        console.log('✅ Navigation command sent')
      } catch (error) {
        console.error('❌ Navigation error:', error)
      }
    }
    
    // Web platform needs different handling
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Return to the home screen? Your progress is automatically saved.')
      if (!confirmed) {
        console.log('🚫 User cancelled')
        return
      }
      
      console.log('👍 User confirmed, closing drawer')
      onClose?.()
      // Small delay to let drawer close animation complete
      setTimeout(performNavigation, 100)
    } else {
      // Native platforms
      Alert.alert(
        'Exit to Home',
        'Return to the home screen? Your progress is automatically saved.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => console.log('🚫 User cancelled') },
          {
            text: 'Exit to Home',
            onPress: () => {
              console.log('👍 User confirmed, closing drawer')
              onClose?.()
              // Small delay to let drawer close animation complete
              setTimeout(performNavigation, 300)
            },
          },
        ]
      )
    }
  }

  return (
    <SafeAreaView style={[themed($container), style]} edges={["top", "bottom", "left", "right"]}>
      {/* Header */}
      <View style={themed($header)}>
        <TouchableOpacity
          onPress={onClose}
          style={themed($closeButton)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon icon="x" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text preset="heading" text="Assessment" style={themed($headerTitle)} />
      </View>

      {/* Search Bar */}
      <View style={themed($searchContainer)}>
        <TextField
          placeholder="Search Sections"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={themed($searchFieldContainer)}
          inputWrapperStyle={themed($searchInputWrapper)}
          LeftAccessory={() => (
            <Icon 
              icon="menu" 
              size={20} 
              color={theme.colors.textDim} 
            />
          )}
          RightAccessory={searchQuery.length > 0 ? () => (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon icon="x" size={18} color={theme.colors.textDim} />
            </TouchableOpacity>
          ) : undefined}
        />
      </View>

      {/* Table of Contents Label */}
      <View style={themed($tocHeader)}>
        <Text text="table of contents" style={themed($tocText)} />
      </View>

      {/* Navigation List */}
      <ScrollView 
        style={themed($scrollView)}
        contentContainerStyle={themed($scrollContent)}
        showsVerticalScrollIndicator={false}
      >
        {filteredNavigation.map((section) => {
          const isExpanded = expandedSections.has(section.id)
          const hasChildren = section.children && section.children.length > 0

          return (
            <View key={section.id} style={themed($sectionContainer)}>
              {/* Section Header */}
              <TouchableOpacity
                onPress={() => hasChildren && toggleSection(section.id)}
                style={[themed($sectionHeader), isExpanded && $sectionHeaderExpanded]}
                disabled={!hasChildren}
              >
                <Text 
                  text={section.label} 
                  style={themed($sectionLabel)} 
                  weight="medium"
                />
                {hasChildren && (
                  <View style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}>
                    <Icon 
                      icon="caretRight" 
                      size={16} 
                      color={theme.colors.text}
                      style={{ transform: [{ rotate: "90deg" }] }}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Children/Steps */}
              {isExpanded && hasChildren && (
                <View style={themed($childrenContainer)}>
                  {section.children?.map((child) => {
                    const isActive = isActiveRoute(child.route)
                    return (
                      <TouchableOpacity
                        key={child.id}
                        onPress={() => child.route && handleNavigate(child.route)}
                        style={[themed($childItem), isActive && $childItemActive]}
                      >
                        <Text 
                          text={child.label} 
                          style={[themed($childLabel), isActive ? themed($childLabelActive) : undefined]}
                        />
                        {isActive && (
                          <View style={themed($activeDot)} />
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>

      {/* Action Buttons */}
      <View style={themed($actionsContainer)}>
        {user && (
          <View style={themed($userInfo)}>
            <Icon icon="settings" size={16} color={theme.colors.textDim} />
            <Text text={user.email || 'User'} style={themed($userEmail)} size="xs" />
          </View>
        )}
        
        <Button
          text={isSubmitting ? "Submitting..." : "Submit Assessment"}
          onPress={handleSubmit}
          disabled={isSubmitting}
          preset="filled"
          style={themed($submitButton)}
        />

        <Button
          text="Exit to Home"
          onPress={handleExitToHome}
          preset="default"
          style={themed($logoutButton)}
        />
      </View>
    </SafeAreaView>
  )
}

const $container: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
]

const $header: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }),
]

const $closeButton: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    marginRight: theme.spacing.sm,
  }),
]

const $headerTitle: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    fontSize: 20,
    color: theme.colors.text,
  }),
]

const $searchContainer: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  }),
]

const $searchFieldContainer: ThemedStyleArray<ViewStyle> = [
  () => ({
    marginBottom: 0,
  }),
]

const $searchInputWrapper: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    minHeight: 48,
    backgroundColor: theme.colors.palette.gray1,
    borderColor: theme.colors.border,
  }),
]

const $tocHeader: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.palette.gray1,
  }),
]

const $tocText: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    fontSize: 12,
    color: theme.colors.textDim,
    textTransform: "lowercase",
  }),
]

const $scrollView: ThemedStyleArray<ViewStyle> = [
  () => ({
    flex: 1,
  }),
]

const $scrollContent: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    paddingBottom: theme.spacing.lg,
  }),
]

const $sectionContainer: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  }),
]

const $sectionHeader: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.palette.gray1,
  }),
]

const $sectionHeaderExpanded: ViewStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.02)",
}

const $sectionLabel: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    fontSize: 16,
    color: theme.colors.text,
  }),
]

const $childrenContainer: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    backgroundColor: theme.colors.background,
  }),
]

const $childItem: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  }),
]

const $childItemActive: ViewStyle = {
  backgroundColor: "rgba(79, 70, 229, 0.08)",
}

const $childLabel: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  }),
]

const $childLabelActive: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    color: theme.colors.palette.primary500,
    fontFamily: theme.typography.primary.medium,
  }),
]

const $activeDot: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.palette.primary500,
    marginLeft: theme.spacing.sm,
  }),
]

const $actionsContainer: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  }),
]

const $userInfo: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  }),
]

const $userEmail: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    color: theme.colors.textDim,
    flex: 1,
  }),
]

const $submitButton: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.palette.primary1,
  }),
]

const $logoutButton: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    backgroundColor: theme.colors.palette.gray2,
  }),
]
