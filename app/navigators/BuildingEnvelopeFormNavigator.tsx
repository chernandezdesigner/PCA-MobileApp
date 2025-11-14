import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen } from "@/screens/WelcomeScreen"

export type BuildingEnvelopeFormNavigatorParamList = {
  Demo: undefined
}

const Stack = createNativeStackNavigator<BuildingEnvelopeFormNavigatorParamList>()
export const BuildingEnvelopeFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false, }}>
      <Stack.Screen name="Demo" component={WelcomeScreen} />
    </Stack.Navigator>
  )
}
