import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"
import { supabase } from "@/services/supabase"
import type { User, Session } from "@supabase/supabase-js"

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // onAuthStateChange fires synchronously on subscribe with the current
    // session (INITIAL_SESSION event), so we don't need a separate getSession()
    // call. Using only onAuthStateChange avoids the race where both resolve
    // near-simultaneously and trigger two rapid re-renders.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { error: error.message }
      }

      setSession(data.session)
      setUser(data.user)
      return {}
    } catch (err: any) {
      const message = err.message || "An error occurred during sign in"
      setError(message)
      return { error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return { error: error.message }
      }

      // Note: Supabase may require email confirmation
      // Check if user needs to verify email
      if (data.user && !data.session) {
        return { error: "Please check your email to verify your account" }
      }

      setSession(data.session)
      setUser(data.user)
      return {}
    } catch (err: any) {
      const message = err.message || "An error occurred during sign up"
      setError(message)
      return { error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    } catch (err: any) {
      setError(err.message)
      // Clear local state even if the server call fails (e.g. expired token).
      // Without this, the user is stuck on HomeScreen with no way to sign out.
      setSession(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = {
    isAuthenticated: !!session,
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    logout: signOut,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
