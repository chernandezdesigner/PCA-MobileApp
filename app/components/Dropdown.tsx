import React, { ComponentType, useState, useRef } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native"
import { Text, TextProps } from "./Text"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { Icon } from "./Icon"

export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownAccessoryProps {
  style: StyleProp<ViewStyle>
  status?: "error" | "disabled"
}

export interface DropdownProps {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * The currently selected value
   */
  value?: string
  /**
   * Called when the selected value changes
   */
  onValueChange?: (value: string) => void
  /**
   * Array of options to display in the dropdown
   */
  options: DropdownOption[]
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
   */
  RightAccessory?: ComponentType<DropdownAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   */
  LeftAccessory?: ComponentType<DropdownAccessoryProps>
}

export function Dropdown(props: DropdownProps) {
  const {
    label,
    value,
    onValueChange,
    options,
    status,
    RightAccessory,
    LeftAccessory,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [inputHeight, setInputHeight] = useState<number>(44)
  const [shouldRenderAbove, setShouldRenderAbove] = useState(false)
  const inputRef = useRef<View>(null)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const selectedOption = options.find((option) => option.value === value)
  const disabled = status === "disabled"

  const $containerStyles = [
    $containerStyle,
    isOpen && $containerOpenStyle,
    $containerStyleOverride,
  ]

  const $labelStyles = [$labelStyle]

  const $inputWrapperStyles = [
    $styles.row,
    $inputWrapperStyle,
    status === "error" && { borderColor: colors.error },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 0 },
    isFocused && {
      borderColor: colors.tint,
      shadowColor: colors.tint,
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    isOpen && $inputActiveBorder,
    $inputWrapperStyleOverride,
  ]

  const $valueStyles: ThemedStyleArray<TextStyle> = [
    $valueStyle,
    disabled && { color: colors.textDim },
  ]

  const $optionStyles = [
    $optionStyle,
    {
      backgroundColor: colors.palette.neutral100,
      borderColor: colors.palette.neutral300,
    },
  ]

  const $optionTextStyles = [$optionTextStyle]

  const $menuStyles = [
    $menuStyle,
    {
      backgroundColor: colors.palette.neutral100,
      borderColor: colors.palette.neutral300,
    },
  ]

  function toggleDropdown() {
    if (disabled) return
    
    // If closing, just close
    if (isOpen) {
      setIsOpen(false)
      setIsFocused(false)
      return
    }
    
    // If opening, calculate position first, then open
    if (inputRef.current) {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Get viewport height
        const windowHeight = Platform.OS === 'web' 
          ? window.innerHeight 
          : Dimensions.get('window').height
        
        // pageY is the absolute Y position on screen
        // Calculate space below the input
        const spaceBelow = windowHeight - (pageY + height)
        
        // Menu max height is 300, plus generous padding for safe spacing
        const menuHeight = Math.min(options.length * 48, 300) + 32
        
        // If not enough space below (with 50px buffer), render above
        const renderAbove = spaceBelow < (menuHeight + 50)
        setShouldRenderAbove(renderAbove)
        setInputHeight(height)
        
        // NOW open the dropdown after positioning is calculated
        setIsOpen(true)
        setIsFocused(true)
      })
    } else {
      // Fallback if ref is not ready
      setIsOpen(true)
      setIsFocused(true)
    }
  }

  function selectOption(option: DropdownOption) {
    onValueChange?.(option.value)
    setIsOpen(false)
    setIsFocused(false)
  }

  return (
    <View style={$containerStyles}>
      {!!label && (
        <Text preset="formLabel" text={label} style={themed($labelStyles)} />
      )}

      <TouchableOpacity
        ref={inputRef}
        activeOpacity={0.8}
        style={themed([$inputWrapperStyles])}
        onPress={toggleDropdown}
        disabled={disabled}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          setInputHeight(Math.round(height) || 44)
        }}
      >
        {!!LeftAccessory && (
          <LeftAccessory
            style={themed($leftAccessoryStyle)}
            status={status}
          />
        )}

        <Text
          text={selectedOption?.label ?? "Select an option"}
          style={themed($valueStyles)}
        />

        <Icon
          icon="caretRight"
          size={20}
          color={colors.textDim}
          containerStyle={themed($caretStyle)}
          style={[
            // caretRight rotated 90deg = down; 270deg = up when open
            { transform: [{ rotate: isOpen ? "270deg" : "90deg" }] },
          ]}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={themed($rightAccessoryStyle)}
            status={status}
          />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View
          style={themed([
            $menuStyles,
            shouldRenderAbove 
              ? { 
                  bottom: inputHeight + 4,
                  top: undefined,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }
              : { 
                  top: inputHeight + 4,
                  bottom: undefined,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
            isFocused && { borderColor: colors.tint },
          ])}
        >
          <ScrollView 
            style={{ maxHeight: 300 }} 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {options.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={themed($optionStyles)}
                onPress={() => selectOption(item)}
              >
                <Text text={item.label} style={themed($optionTextStyles)} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const $containerStyle: ViewStyle = {
  gap: 4,
  position: "relative",
}

const $containerOpenStyle: ViewStyle = {
  // High z-index to appear above all content including cards, headers, footers
  zIndex: 9999,
}

const $labelStyle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xs,
  color: colors.palette.neutral800,
})

const $inputWrapperStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignItems: "center",
  borderWidth: 1,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  overflow: "visible",
})

const $inputActiveBorder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.tint,
})

const $valueStyle: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  flex: 1,
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,
  height: 24,
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
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

const $caretStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.sm,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
})

const $menuStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  width: "100%",
  maxHeight: 300,
  borderRadius: 12,
  borderWidth: 1,
  overflow: "hidden",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  // High elevation for Android to appear above all content
  elevation: 10,
  zIndex: 10000,
})

const $optionStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.sm,
  borderBottomWidth: 1,
})

const $optionTextStyle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,
})