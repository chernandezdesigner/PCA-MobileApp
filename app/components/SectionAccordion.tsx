import { ReactNode, useEffect, useMemo, useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { AnimatedPressable } from "@/components/AnimatedPressable"

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

  const caretRotation = useSharedValue(isExpanded ? -90 : 90)

  useEffect(() => {
    caretRotation.value = withTiming(isExpanded ? -90 : 90, { duration: 200 })
  }, [isExpanded])

  const caretAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${caretRotation.value}deg` }],
  }))

  function handleToggle() {
    const next = !isExpanded
    if (!isControlled) setInternalExpanded(next)
    onToggle?.(next)
    caretRotation.value = withTiming(next ? -90 : 90, { duration: 200 })
  }

  const containerStyles = themed([$container])

  const headerStyles = themed([$header])

  return (
    <View style={[containerStyles, style] as StyleProp<ViewStyle>}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={title ? `${title}, ${isExpanded ? "expanded" : "collapsed"}` : undefined}
        accessibilityState={{ expanded: isExpanded }}
        onPress={handleToggle}
        style={[
          headerStyles,
          { backgroundColor: isExpanded ? theme.colors.palette.accordionBackground : theme.colors.palette.gray1 },
          headerStyle,
        ] as StyleProp<ViewStyle>}
      >
        <Text
          preset="subheading"
          text={title}
          tx={titleTx}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            marginRight: 8,
            color: isExpanded
              ? theme.colors.palette.accordionHeaderActiveText
              : theme.colors.palette.accordionHeaderInactiveText,
          }}
        />

        <View style={themed($headerRight)}>
          {RightComponent}
          <Animated.View style={caretAnimatedStyle}>
            <Icon icon="caretRight" size={18} color={theme.colors.textDim} />
          </Animated.View>
        </View>
      </AnimatedPressable>

      {isExpanded && (
        <View
          style={[
            themed($content),
            // Expanded body uses the darker accordion background and preserves the container bottom border
            { backgroundColor: theme.colors.palette.accordionBackground },
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

