import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen } from "@/screens/WelcomeScreen"

export type ProjectSummaryFormNavigatorParamList = {
  Demo: undefined
}

const Stack = createNativeStackNavigator<ProjectSummaryFormNavigatorParamList>()
export const ProjectSummaryFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false, }}>
      <Stack.Screen name="Demo" component={WelcomeScreen} />
    </Stack.Navigator>
  )
}
