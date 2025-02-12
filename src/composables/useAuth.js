import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, handleAuthError, mergeGoogleProfile } from '@/lib/firebase'
import { useAuthStore } from '@/stores/auth'
import { useFirestore } from './useFirestore'

export function useAuth() {
  const loading = ref(false)
  const error = ref('')
  const authStore = useAuthStore()
  const { getUserProfile } = useFirestore()

  // Rate limiting implementation
  const MAX_ATTEMPTS = 5
  const RATE_LIMIT_DURATION = 300000 // 5 minutes
  const loginAttempts = ref(0)
  const lastAttemptTime = ref(null)
  const rateLimitExpiry = ref(null)

  const isRateLimited = () => {
    if (!rateLimitExpiry.value) return false
    return Date.now() < rateLimitExpiry.value
  }

  const getRateLimitRemaining = () => {
    if (!rateLimitExpiry.value) return 0
    return Math.max(0, rateLimitExpiry.value - Date.now())
  }

  const checkRateLimit = () => {
    if (isRateLimited()) {
      return true
    }

    if (lastAttemptTime.value && Date.now() - lastAttemptTime.value > RATE_LIMIT_DURATION) {
      loginAttempts.value = 0
    }

    lastAttemptTime.value = Date.now()
    loginAttempts.value++

    if (loginAttempts.value > MAX_ATTEMPTS) {
      rateLimitExpiry.value = Date.now() + RATE_LIMIT_DURATION
      return true
    }

    return false
  }

  const resetRateLimit = () => {
    loginAttempts.value = 0
    rateLimitExpiry.value = null
  }

  const createUserProfile = async (uid, userData) => {
    try {
      const docRef = doc(db, 'users', uid)
      await setDoc(docRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Fetch and store the profile in the auth store
      const profile = await getUserProfile(uid)
      authStore.setUserProfile(profile)
    } catch (e) {
      console.error('Error creating user profile:', e)
      throw new Error('Failed to create user profile')
    }
  }

  const registerWithEmail = async (userData) => {
    loading.value = true
    error.value = ''

    try {
      const { email, password, firstName, lastName } = userData
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await createUserProfile(userCredential.user.uid, {
        firstName,
        lastName,
        email
      })

      return userCredential.user
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const loginWithEmail = async (email, password) => {
    if (checkRateLimit()) {
      error.value = 'Too many login attempts. Please try again later.'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = ''

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      resetRateLimit()
      return userCredential.user
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    if (checkRateLimit()) {
      error.value = 'Too many login attempts. Please try again later.'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = ''

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await mergeGoogleProfile(result.user, result.user.providerData[0])
      
      // Create/update profile for Google users
      await createUserProfile(result.user.uid, {
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photoURL: result.user.photoURL
      })

      resetRateLimit()
      return result.user
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = ''

    try {
      // First clear services and database
      if (typeof window !== 'undefined') {
        if (window.$dataService) {
          window.$dataService.cleanup()
        }
        
        if (window.$db?.records) {
          await window.$db.records.clear()
        }
      }
      
      // Then sign out from Firebase
      await signOut(auth)
      
      // Reset all state
      resetRateLimit()
      loginAttempts.value = 0
      lastAttemptTime.value = null
      rateLimitExpiry.value = null
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    loading.value = true
    error.value = ''

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    isRateLimited,
    getRateLimitRemaining,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    resetPassword
  }
}