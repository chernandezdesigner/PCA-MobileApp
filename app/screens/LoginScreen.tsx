import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const { signIn, signUp, error: authError, isLoading } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const validationError = 
    !authEmail ? "Email can't be blank" :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail) ? "Must be a valid email" :
    !authPassword ? "Password can't be blank" :
    authPassword.length < 6 ? "Password must be at least 6 characters" :
    ""

  const error = isSubmitted ? validationError : ""

  async function handleAuth() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    const result = mode === "signin" 
      ? await signIn(authEmail, authPassword)
      : await signUp(authEmail, authPassword)

    if (result.error) {
      // Error is already set in context
      console.log("Auth error:", result.error)
    } else {
      // Success! Auth context will handle navigation
      setIsSubmitted(false)
      setAuthPassword("")
    }
  }

  function toggleMode() {
    setMode(mode === "signin" ? "signup" : "signin")
    setIsSubmitted(false)
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text 
        testID="login-heading" 
        text={mode === "signin" ? "Sign In" : "Create Account"} 
        preset="heading" 
        style={themed($logIn)} 
      />
      <Text 
        text={mode === "signin" ? "Sign in to continue" : "Create your account"} 
        preset="subheading" 
        style={themed($enterDetails)} 
      />
      {authError && (
        <Text text={authError} size="sm" style={themed($errorText)} />
      )}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        label="Email"
        placeholder="Enter your email"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        label="Password"
        placeholder="Enter your password"
        onSubmitEditing={handleAuth}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        text={mode === "signin" ? "Sign In" : "Sign Up"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={handleAuth}
        disabled={isLoading}
      />

      <Button
        text={mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        style={themed($toggleButton)}
        preset="default"
        onPress={toggleMode}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $toggleButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginBottom: spacing.md,
})
