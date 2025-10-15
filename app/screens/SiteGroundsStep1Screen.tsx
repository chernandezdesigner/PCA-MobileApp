import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface SiteGroundsStep1ScreenProps extends AppStackScreenProps<"SiteGroundsStep1"> {}

export const SiteGroundsStep1Screen: FC<SiteGroundsStep1ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="siteGroundsStep1" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
