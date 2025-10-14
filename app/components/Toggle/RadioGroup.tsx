import React from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { Radio } from "./Radio"
import { useAppTheme } from "@/theme/context"

export interface RadioOption {
  label: string
  value: string
}

interface RadioGroupProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: RadioOption[]
}

export function RadioGroup({ label, value, onValueChange, options }: RadioGroupProps) {
  const {
    theme: { spacing },
  } = useAppTheme()

  return (
    <View style={$container}>
      {label && <Text preset="formLabel" text={label} />}
      <View style={[$optionsContainer, { gap: spacing.sm }]}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={value === option.value}
            onValueChange={() => onValueChange(option.value)}
            label={option.label}
          />
        ))}
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  gap: 4,
}

const $optionsContainer: ViewStyle = {
  gap: 8,
}
