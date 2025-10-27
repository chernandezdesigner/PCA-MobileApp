import { useState, useMemo } from "react"
import { 
  StyleProp, 
  TextStyle, 
  View, 
  ViewStyle, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"

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
      { id: "sg-step2", label: "Landscaping & Features", route: "SiteGroundsStep2" },
      { id: "sg-step3", label: "Paving & Parking", route: "SiteGroundsStep3" },
      { id: "sg-step4", label: "Site Amenities", route: "SiteGroundsStep4" },
    ],
  },
  {
    id: "building-envelope",
    label: "Building Envelope",
    children: [],
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
  const navigation = useNavigation()
  const route = useRoute()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["project-summary", "site-grounds"])
  )

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

  // Auto-expand sections with search results
  useMemo(() => {
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
    navigation.navigate(routeName as never)
    onNavigate?.()
  }

  const isActiveRoute = (routeName?: string) => {
    return routeName === route.name
  }

  return (
    <SafeAreaView style={themed([$container, style])}>
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
        <Icon 
          icon="menu" 
          size={20} 
          color={theme.colors.textDim} 
          containerStyle={themed($searchIcon)} 
        />
        <TextInput
          style={themed($searchInput)}
          placeholder="Search Sections"
          placeholderTextColor={theme.colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={themed($clearButton)}>
            <Icon icon="x" size={16} color={theme.colors.textDim} />
          </TouchableOpacity>
        )}
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
                style={themed([$sectionHeader, isExpanded && $sectionHeaderExpanded])}
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
                        style={themed([$childItem, isActive && $childItemActive])}
                      >
                        <Text 
                          text={child.label} 
                          style={themed([$childLabel, isActive && $childLabelActive])}
                        />
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.palette.gray1,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
]

const $searchIcon: ThemedStyleArray<ViewStyle> = [
  () => ({
    marginRight: 8,
  }),
]

const $searchInput: ThemedStyleArray<TextStyle> = [
  (theme) => ({
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 12,
    fontFamily: theme.typography.primary.normal,
  }),
]

const $clearButton: ThemedStyleArray<ViewStyle> = [
  () => ({
    padding: 4,
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
