import { ComponentType, forwardRef, Ref, useImperativeHandle, useRef, useState } from "react"
import {
  ImageStyle,
  StyleProp,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
  Pressable,
  Animated,
} from "react-native"

import { isRTL } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

import { Text, TextProps } from "./Text"

export interface TextFieldAccessoryProps {
  style: StyleProp<ViewStyle | TextStyle | ImageStyle>
  status: TextFieldProps["status"]
  multiline: boolean
  editable: boolean
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<TextFieldAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>
  /**
   * Minimum number of rows when `multiline` is true. Defaults to 3 when set.
   * Works on native and web by mapping to a minimum height.
   */
  minRows?: number
}

/**
 * A component that allows for the entering and editing of text.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/TextField/}
 * @param {TextFieldProps} props - The props for the `TextField` component.
 * @returns {JSX.Element} The rendered `TextField` component.
 */
export const TextField = forwardRef(function TextField(props: TextFieldProps, ref: Ref<TextInput>) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    minRows,
    ...TextInputProps
  } = props
  const input = useRef<TextInput>(null)
  // Use Animated value for focus state on Android to avoid re-renders
  // On iOS, use state as normal (better for accessibility and doesn't cause issues)
  const [isFocused, setIsFocused] = useState(false)
  const focusAnimValue = useRef(new Animated.Value(0)).current

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const disabled = TextInputProps.editable === false || status === "disabled"

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  const $containerStyles = [$containerStyleOverride]

  const $labelStyles = [$labelStyle, LabelTextProps?.style]

  // Compute a corresponding wrapper minHeight so the container doesn't cap the input
  const computedWrapperMinHeight = (() => {
    if (!TextInputProps.multiline) return undefined
    const rows = minRows ?? 3
    const line = 24
    // Add some padding and label spacing headroom
    return Math.max(rows * line + 32, 96)
  })()

  // Animated border color for Android (no re-renders)
  const animatedBorderColor = focusAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.palette.neutral300, colors.tint],
  })

  // Base styles (non-animated)
  const $inputWrapperStylesBase = [
    $styles.row,
    $inputWrapperStyle,
    status === "error" && { borderColor: colors.error },
    TextInputProps.multiline && { minHeight: computedWrapperMinHeight },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    $inputWrapperStyleOverride,
  ]

  // On iOS: use state-based focus styling (works fine)
  // On Android: will use Animated.View with interpolated styles
  const $inputWrapperStyles = [
    ...$inputWrapperStylesBase,
    Platform.OS === "ios" && isFocused && {
      borderColor: colors.tint,
      shadowColor: colors.tint,
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
  ]

  // Animated styles for Android focus state
  const $inputWrapperAnimatedStyles = Platform.OS === "android" ? {
    borderColor: animatedBorderColor,
    elevation: focusAnimValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4],
    }),
  } : {}

  // Compute a min height when multiline is enabled
  const computedMinHeight = (() => {
    if (!TextInputProps.multiline) return undefined
    const rows = minRows ?? 3
    // 24 is the base line-height proxy from $inputStyle height; add vertical paddings/margins
    const line = 24
    return Math.max(rows * line + 16, 72)
  })()

  const $inputStyles: ThemedStyleArray<TextStyle> = [
    $inputStyle,
    disabled && { color: colors.textDim },
    isRTL && { textAlign: "right" as TextStyle["textAlign"] },
    TextInputProps.multiline && { height: "auto", minHeight: computedMinHeight },
    $inputStyleOverride,
  ]

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  /**
   *
   */
  function focusInput() {
    if (disabled) return

    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current as TextInput)

  // Render function for the content (used by both wrapped and unwrapped versions)
  // Use Animated.View on Android for focus animation, regular View on iOS
  const InputWrapperComponent = Platform.OS === "android" ? Animated.View : View

  const renderContent = () => (
    <>
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={themed($labelStyles)}
        />
      )}

      <InputWrapperComponent 
        style={[
          themed($inputWrapperStyles),
          Platform.OS === "android" && $inputWrapperAnimatedStyles,
        ]}
      >
        {!!LeftAccessory && (
          <LeftAccessory
            style={themed($leftAccessoryStyle)}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <TextInput
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={placeholderContent}
          placeholderTextColor={colors.palette.FormInputPlaceholderText}
          {...TextInputProps}
          editable={!disabled}
          multiline={TextInputProps.multiline}
          onFocus={(e) => {
            if (Platform.OS === "ios") {
              // iOS: Use state-based focus (works fine, no re-render issues)
              setIsFocused(true)
            } else {
              // Android: Animate focus without state change (no re-renders)
              Animated.timing(focusAnimValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false, // Can't use native driver for borderColor/elevation
              }).start()
            }
            TextInputProps.onFocus?.(e)
          }}
          onBlur={(e) => {
            if (Platform.OS === "ios") {
              // iOS: Use state-based unfocus
              setIsFocused(false)
            } else {
              // Android: Animate unfocus without state change
              Animated.timing(focusAnimValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
              }).start()
            }
            TextInputProps.onBlur?.(e)
          }}
          style={themed([
            $inputStyles,
            Platform.OS === "web" && ({ outlineWidth: 0, outlineColor: "transparent", outlineStyle: "none" } as any),
          ])}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={themed($rightAccessoryStyle)}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </InputWrapperComponent>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={themed($helperStyles)}
        />
      )}
    </>
  )

  // On iOS, wrap in Pressable for enhanced touch target; on Android, use plain View to avoid touch conflicts
  if (Platform.OS === "ios") {
    return (
      <Pressable
        onPress={focusInput}
        accessible={true}
        accessibilityState={{ disabled }}
        style={$containerStyles}
      >
        {renderContent()}
      </Pressable>
    )
  }

  // Android: Plain View with no touch handling
  return (
    <View style={$containerStyles}>
      {renderContent()}
    </View>
  )
})

const $labelStyle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xs,
  color: colors.palette.neutral800,
})

const $inputWrapperStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignItems: "flex-start",
  borderWidth: 1,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  overflow: "visible",
})

const $inputStyle: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  flex: 1,
  alignSelf: "stretch",
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,
  height: 24,
  // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
})

const $helperStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $rightAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.xs,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
})

const $leftAccessoryStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginStart: spacing.xs,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
})
