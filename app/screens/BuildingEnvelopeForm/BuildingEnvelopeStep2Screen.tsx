import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep2ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep2"> {}

export const BuildingEnvelopeStep2Screen: FC<BuildingEnvelopeStep2ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep2" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
