import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep5ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep5"> {}

export const BuildingEnvelopeStep5Screen: FC<BuildingEnvelopeStep5ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep5" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
