import { useEffect, useState } from "react"
import { Keyboard, StyleProp, Text as RNText, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { radii } from "@/theme/styles"
import { Button } from "@/components/Button"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import type { ExtendedEdge } from "@/utils/useSafeAreaInsetsStyle"

export interface StickyFooterNavProps {
  style?: StyleProp<ViewStyle>
  onBack: () => void
  onNext: () => void
  nextDisabled?: boolean
  nextButtonText?: string
  showCamera?: boolean
  onCamera?: () => void
  photoCount?: number
  safeBottom?: boolean
}

export const StickyFooterNav = (props: StickyFooterNavProps) => {
  const { style, onBack, onNext, nextDisabled, nextButtonText = "Next", showCamera = false, onCamera, photoCount = 0, safeBottom = true } = props
  const { themed, theme } = useAppTheme()
  const edges: ExtendedEdge[] = safeBottom ? ["bottom"] : []
  const safe = useSafeAreaInsetsStyle(edges)

  const [keyboardVisible, setKeyboardVisible] = useState(false)
  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", () => setKeyboardVisible(true))
    const hide = Keyboard.addListener("keyboardWillHide", () => setKeyboardVisible(false))
    return () => { show.remove(); hide.remove() }
  }, [])

  if (keyboardVisible) return null

  return (
    <View style={[themed($container), safe, style]}>
      <Button text="Back" onPress={onBack} style={themed($secondaryBtn)} textStyle={themed($secondaryText)} accessibilityLabel="Go back" />

      {showCamera ? (
        <View>
          <TouchableOpacity
            onPress={onCamera}
            style={themed($cameraBtn)}
            accessibilityRole="button"
            accessibilityLabel={photoCount > 0 ? `Open camera, ${photoCount} photo${photoCount !== 1 ? "s" : ""} taken` : "Take photo"}
          >
            <Ionicons name="camera" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          {photoCount > 0 && (
            <View style={themed($badge)}>
              <RNText style={themed($badgeText)}>{photoCount}</RNText>
            </View>
          )}
        </View>
      ) : (
        <View style={themed($cameraBtn)} />
      )}

      <Button text={nextButtonText} onPress={onNext} disabled={nextDisabled} preset="filled" style={themed($primaryBtn)} accessibilityLabel="Go to next step" />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
  backgroundColor: colors.palette.headerFooterBackground,
  borderTopWidth: 1,
  borderTopColor: colors.palette.gray3,
  minHeight: 72,
  width: "100%",
})

const $secondaryBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  marginRight: spacing.xs,
  backgroundColor: colors.palette.SecondaryButtonBackground,
  borderWidth: 1,
  borderColor: colors.palette.SecondaryButtonBorder,
})

const $secondaryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
})

const $primaryBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  marginLeft: spacing.xs,
  backgroundColor: colors.palette.primary1,
})

const $cameraBtn: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 56,
  height: 56,
  borderRadius: radii.md,
  marginHorizontal: spacing.xs,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: colors.palette.SecondaryButtonBorder,
  backgroundColor: colors.palette.SecondaryButtonBackground,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: -4,
  right: 2,
  backgroundColor: colors.palette.badgeDanger,
  borderRadius: radii.full,
  minWidth: 20,
  height: 20,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 4,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.badgeDangerText,
  fontSize: 11,
  fontWeight: "700",
  textAlign: "center",
})
