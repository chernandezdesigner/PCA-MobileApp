import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { MechanicalSystemsStep1Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep1Screen"
import { MechanicalSystemsStep2Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep2Screen"
import { MechanicalSystemsStep3Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep3Screen"
import { MechanicalSystemsStep4Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep4Screen"
import { MechanicalSystemsStep5Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep5Screen"
import { MechanicalSystemsStep6Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep6Screen"
import { MechanicalSystemsStep7Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep7Screen"
import { MechanicalSystemsStep8Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep8Screen"
import { MechanicalSystemsStep9Screen } from "@/screens/MechanicalSystemsForm/MechanicalSystemsStep9Screen"

export type MechanicalSystemsFormNavigatorParamList = {
  MechanicalSystemsStep1: undefined
  MechanicalSystemsStep2: undefined
  MechanicalSystemsStep3: undefined
  MechanicalSystemsStep4: undefined
  MechanicalSystemsStep5: undefined
  MechanicalSystemsStep6: undefined
  MechanicalSystemsStep7: undefined
  MechanicalSystemsStep8: undefined
  MechanicalSystemsStep9: undefined
}

const Stack = createNativeStackNavigator<MechanicalSystemsFormNavigatorParamList>()

export const MechanicalSystemsFormNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MechanicalSystemsStep1" component={MechanicalSystemsStep1Screen} />
      <Stack.Screen name="MechanicalSystemsStep2" component={MechanicalSystemsStep2Screen} />
      <Stack.Screen name="MechanicalSystemsStep3" component={MechanicalSystemsStep3Screen} />
      <Stack.Screen name="MechanicalSystemsStep4" component={MechanicalSystemsStep4Screen} />
      <Stack.Screen name="MechanicalSystemsStep5" component={MechanicalSystemsStep5Screen} />
      <Stack.Screen name="MechanicalSystemsStep6" component={MechanicalSystemsStep6Screen} />
      <Stack.Screen name="MechanicalSystemsStep7" component={MechanicalSystemsStep7Screen} />
      <Stack.Screen name="MechanicalSystemsStep8" component={MechanicalSystemsStep8Screen} />
      <Stack.Screen name="MechanicalSystemsStep9" component={MechanicalSystemsStep9Screen} />
    </Stack.Navigator>
  )
}

