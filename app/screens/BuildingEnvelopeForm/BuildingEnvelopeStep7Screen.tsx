import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep7ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep7"> {}

export const BuildingEnvelopeStep7Screen: FC<BuildingEnvelopeStep7ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep7" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
