import React, { ComponentType, useState } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Modal,
  FlatList,
  Platform,
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

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const selectedOption = options.find((option) => option.value === value)
  const disabled = status === "disabled"

  const $containerStyles = [$containerStyle, $containerStyleOverride]

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

  const $modalStyles = [
    $modalStyle,
    {
      backgroundColor: colors.palette.neutral100,
      borderColor: colors.palette.neutral300,
    },
  ]

  function toggleDropdown() {
    if (disabled) return
    setIsOpen(!isOpen)
    setIsFocused(!isFocused)
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
        activeOpacity={0.8}
        style={themed($inputWrapperStyles)}
        onPress={toggleDropdown}
        disabled={disabled}
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
          style={[
            themed($caretStyle),
            { transform: [{ rotate: isOpen ? "90deg" : "0deg" }] },
          ]}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={themed($rightAccessoryStyle)}
            status={status}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={$overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={themed($modalStyles)}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={themed($optionStyles)}
                  onPress={() => selectOption(item)}
                >
                  <Text
                    text={item.label}
                    style={themed($optionTextStyles)}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const $containerStyle: ViewStyle = {
  gap: 4,
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
  overflow: "hidden",
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

const $overlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
}

const $modalStyle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  maxHeight: 300,
  borderRadius: 12,
  borderWidth: 1,
  overflow: "hidden",
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