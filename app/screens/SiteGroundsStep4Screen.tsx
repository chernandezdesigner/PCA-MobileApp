import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface SiteGroundsStep4ScreenProps extends AppStackScreenProps<"SiteGroundsStep4"> {}

export const SiteGroundsStep4Screen: FC<SiteGroundsStep4ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="siteGroundsStep4" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
