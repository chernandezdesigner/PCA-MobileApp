/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useEffect, useRef } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LoginScreen } from "@/screens/LoginScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { useAppTheme } from "@/theme/context"
import { Text } from "@/components/Text"
import { useStorageWarning } from "@/models/RootStoreProvider"
import type { ThemedStyle } from "@/theme/types"

import { AssessmentNavigator } from "./AssessmentNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

// ─── Storage warning banner ────────────────────────────────────────────────
// Shown as a persistent overlay when MMKV writes fail repeatedly. This is the
// only user-visible signal that their data is not being saved to local storage.

const StorageWarningBanner = () => {
  const { hasStorageWarning } = useStorageWarning()
  const { themed } = useAppTheme()

  if (!hasStorageWarning) return null

  return (
    <View style={themed($warningBanner)} accessibilityLiveRegion="assertive" accessibilityRole="alert">
      <Text style={themed($warningText)}>
        Storage full — data is not saving. Free up space on your device immediately.
      </Text>
    </View>
  )
}

const $warningBanner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  backgroundColor: colors.palette.angry500,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $warningText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  fontSize: 13,
  fontWeight: "600",
  textAlign: "center",
})

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()
  const didMountRef = useRef(false)

  const {
    theme: { colors },
  } = useAppTheme()

  // After the initial mount, drive navigation imperatively when auth state
  // changes (sign in → Home, sign out → Login). Using navigationRef.reset()
  // clears the back stack so the user can't swipe back to Login after sign in.
  // We skip the first render because initialRouteName already handles it.
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (!navigationRef.isReady()) return
    navigationRef.reset({
      index: 0,
      routes: [{ name: isAuthenticated ? "Home" : "Login" }],
    })
  }, [isAuthenticated])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      // All screens always registered — prevents Login from unmounting during
      // Supabase stale-session refresh cycles on iOS Keychain.
      initialRouteName={isAuthenticated ? "Home" : "Login"}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Assessment" component={AssessmentNavigator} />

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export const AppNavigator = ({ initialState, ...rest }: NavigationProps) => {
  const { isAuthenticated } = useAuth()
  const { navigationTheme } = useAppTheme()

  // Never restore a persisted navigation state for an unauthenticated user.
  // iOS Keychain retains the Supabase session across app reinstalls, so a
  // stale/expired session can leave navigation state pointing at protected
  // screens (Assessment, Home). Passing that state while logged-out would
  // crash any screen that accesses the MST store or auth context.
  const safeInitialState = isAuthenticated ? initialState : undefined

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  const $navigatorRoot: ViewStyle = { flex: 1 }

  return (
    <View style={$navigatorRoot}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} initialState={safeInitialState} {...rest}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <AppStack />
        </ErrorBoundary>
      </NavigationContainer>
      {/* Rendered outside NavigationContainer so it overlays every screen */}
      <StorageWarningBanner />
    </View>
  )
}
