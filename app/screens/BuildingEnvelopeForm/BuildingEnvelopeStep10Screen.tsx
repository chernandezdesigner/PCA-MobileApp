import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BuildingEnvelopeStep10ScreenProps extends AppStackScreenProps<"BuildingEnvelopeStep10"> {}

export const BuildingEnvelopeStep10Screen: FC<BuildingEnvelopeStep10ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="buildingEnvelopeStep10" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
