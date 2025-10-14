import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface ProjectSummaryStep1ScreenProps extends AppStackScreenProps<"ProjectSummaryStep1"> {}

export const ProjectSummaryStep1Screen: FC<ProjectSummaryStep1ScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="projectSummaryStep1" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
