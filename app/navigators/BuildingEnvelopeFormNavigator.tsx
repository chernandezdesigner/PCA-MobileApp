import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BuildingEnvelopeStep1Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep1Screen"
import { BuildingEnvelopeStep2Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep2Screen"
import { BuildingEnvelopeStep3Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep3Screen"
import { BuildingEnvelopeStep4Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep4Screen"
import { BuildingEnvelopeStep5Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep5Screen"
import { BuildingEnvelopeStep6Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep6Screen"
import { BuildingEnvelopeStep7Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep7Screen"
import { BuildingEnvelopeStep8Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep8Screen"
import { BuildingEnvelopeStep9Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep9Screen"
import { BuildingEnvelopeStep10Screen } from "@/screens/BuildingEnvelopeForm/BuildingEnvelopeStep10Screen"

export type BuildingEnvelopeFormNavigatorParamList = {
  BuildingEnvelopeStep1: undefined
  BuildingEnvelopeStep2: undefined
  BuildingEnvelopeStep3: undefined
  BuildingEnvelopeStep4: undefined
  BuildingEnvelopeStep5: undefined
  BuildingEnvelopeStep6: undefined
  BuildingEnvelopeStep7: undefined
  BuildingEnvelopeStep8: undefined
  BuildingEnvelopeStep9: undefined
  BuildingEnvelopeStep10: undefined
}

const Stack = createNativeStackNavigator<BuildingEnvelopeFormNavigatorParamList>()
export const BuildingEnvelopeFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BuildingEnvelopeStep1" component={BuildingEnvelopeStep1Screen} />
      <Stack.Screen name="BuildingEnvelopeStep2" component={BuildingEnvelopeStep2Screen} />
      <Stack.Screen name="BuildingEnvelopeStep3" component={BuildingEnvelopeStep3Screen} />
      <Stack.Screen name="BuildingEnvelopeStep4" component={BuildingEnvelopeStep4Screen} />
      <Stack.Screen name="BuildingEnvelopeStep5" component={BuildingEnvelopeStep5Screen} />
      <Stack.Screen name="BuildingEnvelopeStep6" component={BuildingEnvelopeStep6Screen} />
      <Stack.Screen name="BuildingEnvelopeStep7" component={BuildingEnvelopeStep7Screen} />
      <Stack.Screen name="BuildingEnvelopeStep8" component={BuildingEnvelopeStep8Screen} />
      <Stack.Screen name="BuildingEnvelopeStep9" component={BuildingEnvelopeStep9Screen} />
      <Stack.Screen name="BuildingEnvelopeStep10" component={BuildingEnvelopeStep10Screen} />
    </Stack.Navigator>
  )
}
