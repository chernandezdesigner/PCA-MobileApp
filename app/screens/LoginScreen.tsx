import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { radii } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const { signIn, error: authError, isLoading } = useAuth()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const { contentMaxWidth } = useResponsiveLayout()

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

    const result = await signIn(authEmail, authPassword)

    if (result.error) {
      // Error is already set in context
    } else {
      setIsSubmitted(false)
      setAuthPassword("")
    }
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
      preset="scroll"
      contentContainerStyle={[
        themed($screenContentContainer),
        contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: "center" as const, width: "100%" as const } : undefined,
      ]}
      safeAreaEdges={["top", "bottom"]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Branded header block */}
      <View style={themed($brandedHeader)}>
        <Text
          text="PCA Mobile"
          preset="heading"
          style={$brandedHeaderText}
        />
      </View>

      <View style={themed($formBody)}>
        <Text
          testID="login-heading"
          text="Sign In"
          preset="heading"
          style={themed($logIn)}
        />
        <Text
          text="Sign in to continue"
          preset="subheading"
          style={themed($enterDetails)}
        />
        {authError && (
          <View style={themed($errorContainer)}>
            <Text text={authError} size="sm" style={themed($errorText)} />
          </View>
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
          returnKeyType="next"
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
          returnKeyType="done"
          RightAccessory={PasswordRightAccessory}
        />

        <Button
          testID="login-button"
          text="Sign In"
          style={themed($tapButton)}
          preset="filled"
          onPress={handleAuth}
          loading={isLoading}
        />
      </View>
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = () => ({})

const $brandedHeader: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary1,
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
  borderBottomLeftRadius: radii.md,
  borderBottomRightRadius: radii.md,
})

const $brandedHeaderText: TextStyle = {
  color: "#FFFFFF",
}

const $formBody: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderLeftWidth: 3,
  borderLeftColor: colors.error,
  paddingLeft: spacing.sm,
  backgroundColor: colors.palette.conditionPoorBackground,
  borderRadius: radii.sm,
  paddingVertical: spacing.sm,
  paddingRight: spacing.sm,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
  borderRadius: radii.sm,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
})
