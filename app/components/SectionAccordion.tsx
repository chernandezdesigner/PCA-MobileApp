import { ReactNode, useMemo, useState } from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"

export interface SectionAccordionProps {
  /**
   * Section title text.
   */
  title?: string
  /** Title via i18n key. */
  titleTx?: Parameters<typeof Text>[0]["tx"]
  /**
   * Optional element rendered on the right side of the header (e.g., badge, action).
   */
  RightComponent?: ReactNode
  /**
   * Controlled expanded state. If undefined, component manages its own state.
   */
  expanded?: boolean
  /**
   * Initial expanded state for uncontrolled usage.
   */
  defaultExpanded?: boolean
  /**
   * Called when expansion toggles.
   */
  onToggle?: (nextExpanded: boolean) => void
  /**
   * Header container style override.
   */
  headerStyle?: StyleProp<ViewStyle>
  /**
   * Body container style override.
   */
  contentStyle?: StyleProp<ViewStyle>
  /**
   * Wrapper style override.
   */
  style?: StyleProp<ViewStyle>
  /**
   * Accordion children rendered inside the body.
   */
  children?: ReactNode
}

/**
 * Describe your component here
 */
export const SectionAccordion = (props: SectionAccordionProps) => {
  const {
    style,
    headerStyle,
    contentStyle,
    title,
    titleTx,
    RightComponent,
    expanded,
    defaultExpanded = true,
    onToggle,
    children,
  } = props

  const { themed, theme } = useAppTheme()
  const [internalExpanded, setInternalExpanded] = useState<boolean>(defaultExpanded)
  const isControlled = useMemo(() => expanded !== undefined, [expanded])
  const isExpanded = isControlled ? !!expanded : internalExpanded

  function handleToggle() {
    const next = !isExpanded
    if (!isControlled) setInternalExpanded(next)
    onToggle?.(next)
  }

  const containerStyles = themed([$container])

  const headerStyles = themed([$header])

  return (
    <View style={[containerStyles, style] as StyleProp<ViewStyle>}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={handleToggle}
        style={[
          headerStyles,
          // Background responds to expansion state per figma
          { backgroundColor: isExpanded ? (theme.colors.palette as any).accordionBackground : theme.colors.palette.gray1 },
          headerStyle,
        ] as StyleProp<ViewStyle>}
        activeOpacity={0.8}
      >
        <Text
          preset="subheading"
          text={title}
          tx={titleTx as any}
          style={{
            color: isExpanded
              ? (theme.colors.palette as any).accordionHeaderActiveText
              : (theme.colors.palette as any).accordionHeaderInactiveText,
          }}
        />

        <View style={themed($headerRight)}>
          {RightComponent}
          <View style={{ transform: [{ rotate: isExpanded ? "-90deg" : "90deg" }] }}>
            <Icon icon="caretRight" size={18} color={theme.colors.textDim} />
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[
            themed($content),
            // Expanded body uses the darker accordion background and preserves the container bottom border
            { backgroundColor: (theme.colors.palette as any).accordionBackground },
            contentStyle,
          ] as StyleProp<ViewStyle>}
        >
          {children}
        </View>
      )}
    </View>
  )
}

const $container: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    // Faint top and bottom borders; sections stack with no gaps
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.palette.gray3,
  }),
]

const $header: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  }),
]

const $headerRight: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $content: ThemedStyleArray<ViewStyle> = [
  (theme) => ({
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  }),
]

