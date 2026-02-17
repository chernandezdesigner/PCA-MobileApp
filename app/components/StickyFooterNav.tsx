import { StyleProp, Text as RNText, View, ViewStyle } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

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
  const { themed } = useAppTheme()
  const safe = useSafeAreaInsetsStyle([safeBottom ? "bottom" : (undefined as any)].filter(Boolean) as any)

  return (
    <View style={[themed($container), safe, style]}>
      <Button text="Back" onPress={onBack} style={themed($secondaryBtn)} textStyle={themed($secondaryText)} />

      {showCamera ? (
        <View>
          <PressableIcon icon="view" size={24} onPress={onCamera} containerStyle={themed($cameraBtn)} />
          {photoCount > 0 && (
            <View style={$badge}>
              <RNText style={$badgeText}>{photoCount}</RNText>
            </View>
          )}
        </View>
      ) : (
        <View style={themed($cameraBtn)} />
      )}

      <Button text={nextButtonText} onPress={onNext} disabled={nextDisabled} preset="filled" style={themed($primaryBtn)} />
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

const $secondaryBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  marginRight: 8,
  backgroundColor: colors.palette.SecondaryButtonBackground,
  borderWidth: 1,
  borderColor: colors.palette.SecondaryButtonBorder,
})

const $secondaryText: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.palette.gray6,
}) as any

const $primaryBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  marginLeft: 8,
  backgroundColor: colors.palette.primary1,
})

const $cameraBtn: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 56,
  height: 56,
  borderRadius: 12,
  marginHorizontal: 8,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: colors.palette.SecondaryButtonBorder,
  backgroundColor: colors.palette.SecondaryButtonBackground,
})

const $badge: ViewStyle = {
  position: "absolute",
  top: -4,
  right: 2,
  backgroundColor: "#E53935",
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 4,
}

const $badgeText: any = {
  color: "#FFFFFF",
  fontSize: 11,
  fontWeight: "700",
  textAlign: "center",
}
