import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { elevation } from "@/theme/styles"
import { Text } from "@/components/Text"
import { PressableIcon } from "@/components/Icon"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import type { ExtendedEdge } from "@/utils/useSafeAreaInsetsStyle"

export interface HeaderBarProps {
  style?: StyleProp<ViewStyle>
  title: string
  leftIcon?: "menu" | "back"
  onLeftPress?: () => void
  rightIcon?: "menu" | "view" | "more" | "settings" | undefined
  onRightPress?: () => void
  elevated?: boolean
  safeTop?: boolean
}

export const HeaderBar = (props: HeaderBarProps) => {
  const { style, title, leftIcon = "back", onLeftPress, rightIcon = "menu", onRightPress, elevated, safeTop = true } = props
  const { themed } = useAppTheme()
  const edges: ExtendedEdge[] = safeTop ? ["top"] : []
  const safe = useSafeAreaInsetsStyle(edges)

  const leftLabel = leftIcon === "back" ? "Go back" : "Open menu"
  const rightLabel = rightIcon === "menu" ? "Open menu" : rightIcon

  return (
    <View style={[themed([$container, elevated && $elevated]), safe, style]}>
      {leftIcon === "back" ? (
        <View style={themed($iconBtn)} />
      ) : (
        <PressableIcon icon={leftIcon} size={24} onPress={onLeftPress} containerStyle={themed($iconBtn)} accessibilityLabel={leftLabel} />
      )}
      <Text preset="subheading" weight="medium" style={themed($title)} text={title} />
      {rightIcon ? (
        <PressableIcon icon={rightIcon} size={24} onPress={onRightPress} containerStyle={themed($iconBtn)} accessibilityLabel={rightLabel} />
      ) : (
        <View style={themed($iconBtn)} />
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.headerFooterBackground,
  paddingHorizontal: spacing.lg,
  minHeight: 72,
  width: "100%",
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.gray3,
})

const $elevated: ThemedStyle<ViewStyle> = () => ({
  ...elevation.md,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  flex: 1,
  color: colors.palette.TopBarHeaderText,
  textAlign: "center",
})

const $iconBtn: ThemedStyle<ViewStyle> = () => ({
  width: 44,
  height: 44,
  alignItems: "center",
  justifyContent: "center",
})
