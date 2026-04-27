import { ComponentType } from "react"
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { $styles, elevation, radii } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

import { Text, TextProps } from "./Text"

type Presets = "default" | "filled" | "reversed"

type ButtonSize = "sm" | "md" | "lg"

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "disabled" state.
   */
  disabledTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * The size of the button. Controls minHeight, fontSize, and padding.
   * @default "md"
   */
  size?: ButtonSize
  /**
   * When true, shows an ActivityIndicator instead of text and disables interaction.
   */
  loading?: boolean
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Button/}
 * @param {ButtonProps} props - The props for the `Button` component.
 * @returns {JSX.Element} The rendered `Button` component.
 * @example
 * <Button
 *   tx="common:ok"
 *   style={styles.button}
 *   textStyle={styles.buttonText}
 *   onPress={handleButtonPress}
 * />
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    loading,
    size = "md",
    ...rest
  } = props

  const { themed } = useAppTheme()

  const preset: Presets = props.preset ?? "default"
  const isDisabled = disabled || loading
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      themed($viewPresets[preset]),
      $sizeViewStyles[size],
      $viewStyleOverride,
      !!pressed && themed([$pressedViewPresets[preset], $pressedViewStyleOverride]),
      !!isDisabled && $disabledViewStyleOverride,
    ]
  }
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<TextStyle>} The text style based on the pressed state.
   */
  function $textStyle({ pressed }: PressableStateCallbackType): StyleProp<TextStyle> {
    return [
      themed($textPresets[preset]),
      $sizeTextStyles[size],
      $textStyleOverride,
      !!pressed && themed([$pressedTextPresets[preset], $pressedTextStyleOverride]),
      !!isDisabled && $disabledTextStyleOverride,
    ]
  }

  /**
   * Resolves the text color for the current preset to use on the loading indicator.
   */
  function getLoadingColor(): string | undefined {
    const resolvedStyles = themed($textPresets[preset]) as TextStyle | TextStyle[]
    if (Array.isArray(resolvedStyles)) {
      for (let i = resolvedStyles.length - 1; i >= 0; i--) {
        const s = resolvedStyles[i] as TextStyle | undefined
        if (s?.color) return s.color as string
      }
    } else if (resolvedStyles && (resolvedStyles as TextStyle).color) {
      return (resolvedStyles as TextStyle).color as string
    }
    return undefined
  }

  return (
    <Pressable
      style={$viewStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      {...rest}
      disabled={isDisabled}
    >
      {(state) => (
        <>
          {!!LeftAccessory && !loading && (
            <LeftAccessory style={$leftAccessoryStyle} pressableState={state} disabled={isDisabled} />
          )}

          {loading ? (
            <ActivityIndicator color={getLoadingColor()} />
          ) : (
            <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
              {children}
            </Text>
          )}

          {!!RightAccessory && !loading && (
            <RightAccessory
              style={$rightAccessoryStyle}
              pressableState={state}
              disabled={isDisabled}
            />
          )}
        </>
      )}
    </Pressable>
  )
}

const $baseViewStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minHeight: 48,
  borderRadius: radii.md,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  overflow: "hidden",
})

const $sizeViewStyles: Record<ButtonSize, ViewStyle> = {
  sm: { minHeight: 44, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  md: { minHeight: 48, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  lg: { minHeight: 56, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
}

const $sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14, lineHeight: 14 },
  md: { fontSize: 16, lineHeight: 16 },
  lg: { fontSize: 20, lineHeight: 20 },
}

const $baseTextStyle: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontSize: 16,
  lineHeight: 16,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
})

const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginStart: spacing.xs,
  zIndex: 1,
})
const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.xs,
  zIndex: 1,
})

const $viewPresets: Record<Presets, ThemedStyleArray<ViewStyle>> = {
  default: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({
      borderWidth: 1,
      borderColor: colors.palette.gray4,
      backgroundColor: colors.palette.SecondaryButtonBackground,
    }),
  ],
  filled: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({ backgroundColor: colors.tint, ...elevation.sm }),
  ],
  reversed: [
    $styles.row,
    $baseViewStyle,
    ({ colors }) => ({ backgroundColor: colors.transparent }),
  ],
}

const $textPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [$baseTextStyle],
  filled: [$baseTextStyle, ({ colors }) => ({ color: colors.palette.neutral100 })],
  reversed: [$baseTextStyle, ({ colors }) => ({ color: colors.tint })],
}

const $pressedViewPresets: Record<Presets, ThemedStyle<ViewStyle>> = {
  default: ({ colors }) => ({ backgroundColor: colors.palette.neutral100 }),
  filled: ({ colors }) => ({ backgroundColor: colors.palette.primary600 }),
  reversed: ({ colors }) => ({ backgroundColor: colors.palette.neutral100 }),
}

const $pressedTextPresets: Record<Presets, ThemedStyle<TextStyle>> = {
  default: () => ({ opacity: 0.9 }),
  filled: () => ({ opacity: 0.9 }),
  reversed: () => ({ opacity: 0.9 }),
}
