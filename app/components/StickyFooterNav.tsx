import { StyleProp, View, ViewStyle } from "react-native"
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
  showCamera?: boolean
  onCamera?: () => void
  safeBottom?: boolean
}

export const StickyFooterNav = (props: StickyFooterNavProps) => {
  const { style, onBack, onNext, nextDisabled, showCamera = false, onCamera, safeBottom = true } = props
  const { themed } = useAppTheme()
  const safe = useSafeAreaInsetsStyle([safeBottom ? "bottom" : (undefined as any)].filter(Boolean) as any)

  return (
    <View style={[themed($container), safe, style]}>
      <Button text="Back" onPress={onBack} style={themed($secondaryBtn)} textStyle={themed($secondaryText)} />

      {showCamera ? (
        <PressableIcon icon="view" size={24} onPress={onCamera} containerStyle={themed($cameraBtn)} />
      ) : (
        <View style={themed($cameraBtn)} />
      )}

      <Button text="Next" onPress={onNext} disabled={nextDisabled} preset="filled" style={themed($primaryBtn)} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
  paddingTop: 0,
  paddingBottom: 0,
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
