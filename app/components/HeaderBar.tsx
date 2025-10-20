import { StyleProp, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { PressableIcon } from "@/components/Icon"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

export interface HeaderBarProps {
  style?: StyleProp<ViewStyle>
  title: string
  leftIcon?: "menu" | "back"
  onLeftPress?: () => void
  rightIcon?: "view" | "more" | "settings" | undefined
  onRightPress?: () => void
  elevated?: boolean
  safeTop?: boolean
}

export const HeaderBar = (props: HeaderBarProps) => {
  const { style, title, leftIcon = "back", onLeftPress, rightIcon, onRightPress, elevated, safeTop = true } = props
  const { themed } = useAppTheme()
  const safe = useSafeAreaInsetsStyle([safeTop ? "top" : (undefined as any)].filter(Boolean) as any)

  return (
    <View style={[themed([$container, elevated && $elevated]), safe, style]}>
      <PressableIcon icon={leftIcon} size={24} onPress={onLeftPress} containerStyle={themed($iconBtn)} />
      <Text preset="subheading" weight="medium" style={themed($title)} text={title} />
      {rightIcon ? (
        <PressableIcon icon={rightIcon} size={24} onPress={onRightPress} containerStyle={themed($iconBtn)} />
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
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
})

const $title: ThemedStyle<any> = ({ colors }) => ({
  flex: 1,
  color: colors.palette.TopBarHeaderText,
  textAlign: "center",
})

const $iconBtn: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 44,
  height: 44,
  alignItems: "center",
  justifyContent: "center",
})
