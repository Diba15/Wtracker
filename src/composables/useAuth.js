import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

const user = ref(null)
const session = ref(null)
const loading = ref(true)

// Check current session
export const checkUser = async () => {
  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    session.value = currentSession
    user.value = currentSession?.user ?? null
  } catch (error) {
    console.error('Error checking user:', error)
  } finally {
    loading.value = false
  }
}

// Listen to auth state changes
export const initAuth = () => {
  supabase.auth.onAuthStateChange((_event, currentSession) => {
    session.value = currentSession
    user.value = currentSession?.user ?? null
    loading.value = false
  })
}

export function useAuth() {
  // Sign up with email and password
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata, // Additional user metadata
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      user.value = data.user
      session.value = data.session
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
      session.value = null
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    checkUser,
  }
}

