import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep1ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep1"> {}

export const BuildingEnvelopeStep1Screen: FC<BuildingEnvelopeStep1ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep1" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
