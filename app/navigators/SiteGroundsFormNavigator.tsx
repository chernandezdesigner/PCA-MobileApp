import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { SiteGroundsStep1Screen } from "@/screens/SiteGroundsStep1Screen"
import { SiteGroundsStep2Screen } from "@/screens/SiteGroundsStep2Screen"
import { SiteGroundsStep3Screen } from "@/screens/SiteGroundsStep3Screen"
import { SiteGroundsStep4Screen } from "@/screens/SiteGroundsStep4Screen"


export type SiteGroundsFormNavigatorParamList = {
  SiteGroundsStep1: undefined
  SiteGroundsStep2: undefined
  SiteGroundsStep3: undefined
  SiteGroundsStep4: undefined
}

const Stack = createNativeStackNavigator<SiteGroundsFormNavigatorParamList>()
export const SiteGroundsFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SiteGroundsStep1" component={SiteGroundsStep1Screen} />
      <Stack.Screen name="SiteGroundsStep2" component={SiteGroundsStep2Screen} />
      <Stack.Screen name="SiteGroundsStep3" component={SiteGroundsStep3Screen} />
      <Stack.Screen name="SiteGroundsStep4" component={SiteGroundsStep4Screen} />
    </Stack.Navigator>
  )
}
