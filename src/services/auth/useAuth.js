import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, handleAuthError, mergeGoogleProfile } from '../core/firebase'
import { useAuthStore } from '@/stores/authStore'
import { useFirestore } from '../database/useFirestoreService'
import { encrypt, decrypt } from '@/services/core/crypto'
import { localDb } from '@/services/database/localDb' 

// Auth configuration as specified in project brief
const AUTH_CONFIG = {
  expiryTime: 24 * 60 * 60 * 1000,    // 24 hours
  warningWindow: 6 * 60 * 60 * 1000,   // 6 hours
  gracePeriod: 1 * 60 * 60 * 1000,     // 1 hour
  checkInterval: 15 * 60 * 1000        // Check every 15 minutes
}

export function useAuth() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref(null)
  const { getUserProfile } = useFirestore()

  // Rate limiting implementation
  const attempts = ref(0)
  const lastAttemptTime = ref(0)
  const MAX_ATTEMPTS = 5
  const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes

  const isRateLimited = () => {
    const now = Date.now()
    if (now - lastAttemptTime.value > LOCKOUT_DURATION) {
      attempts.value = 0
      return false
    }
    return attempts.value >= MAX_ATTEMPTS
  }

  const getRateLimitRemaining = () => {
    return LOCKOUT_DURATION - (Date.now() - lastAttemptTime.value)
  }

  // Store encrypted credentials locally
  const storeLocalCredentials = async (tokens) => {
    const encryptedTokens = await encrypt(tokens)
    const expiry = Date.now() + AUTH_CONFIG.expiryTime
    
    await localDb.auth.put({
      id: 1,
      tokens: encryptedTokens,
      expiry
    })
  }

  // Check auth status including grace period
  const checkAuthStatus = async () => {
    const auth = await localDb.auth.get(1)
    if (!auth) return { status: 'no-auth' }

    const now = Date.now()
    const expiry = new Date(auth.expiry)
    const graceExpiry = new Date(expiry.getTime() + AUTH_CONFIG.gracePeriod)
    
    if (graceExpiry <= now) {
      return { status: 'expired' }
    }

    if (expiry <= now) {
      return {
        status: 'grace-period',
        message: 'Authentication expired. Please connect to refresh within grace period.'
      }
    }

    // Check warning window
    const warningTime = new Date(expiry - AUTH_CONFIG.warningWindow)
    if (now >= warningTime) {
      if (navigator.onLine) {
        await refreshToken()
      } else {
        return {
          status: 'warning',
          message: 'Authentication will expire soon. Please connect to refresh.'
        }
      }
    }

    return { status: 'valid' }
  }

  // Refresh token if online
  const refreshToken = async () => {
    if (!navigator.onLine) return false
    
    try {
      const auth = await localDb.auth.get(1)
      if (!auth) return false

      const tokens = await decrypt(auth.tokens)
      // Implement your token refresh logic here
      const newTokens = await authStore.refreshToken(tokens.refreshToken)
      
      await storeLocalCredentials(newTokens)
      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      return false
    }
  }

  // Setup periodic auth check
  const setupAuthCheck = () => {
    setInterval(async () => {
      const status = await checkAuthStatus()
      
      if (status.status === 'warning' || status.status === 'grace-period') {
        // Emit warning notification
        authStore.setAuthWarning(status.message)
      }
      
      if (status.status === 'expired') {
        await logout()
      }
    }, AUTH_CONFIG.checkInterval)
  }

  const createUserProfile = async (uid, userData) => {
    try {
      const docRef = doc(db, 'users', uid)
      await setDoc(docRef, {
        ...userData,
        photoURL: userData.photoURL || null,
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Fetch and store the profile in the auth store
      const profile = await getUserProfile(uid)
      authStore.setUser(profile)
    } catch (e) {
      console.error('Error creating user profile:', e)
      throw new Error('Failed to create user profile')
    }
  }

  const registerWithEmail = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const { email, password, firstName, lastName } = userData
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await createUserProfile(userCredential.user.uid, {
        firstName,
        lastName,
        email
      })

      await createUserDocument(userCredential.user)

      return userCredential.user
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const loginWithEmail = async (email, password) => {
    if (isRateLimited()) throw new Error('Too many attempts. Please try again later.')
    
    loading.value = true
    error.value = null
    attempts.value++
    lastAttemptTime.value = Date.now()

    try {
      const tokens = await authStore.loginWithEmail(email, password)
      await storeLocalCredentials(tokens)
      setupAuthCheck()
      await createUserDocument(auth.currentUser)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await authStore.loginWithGoogle()
      
      // Create or update user document with Google profile data
      await createUserDocument(result.user)
      
      // Get the user profile and merge with Google data
      const userProfile = await getUserProfile(result.user.uid)
      if (!userProfile) {
        // Create new profile with Google data
        await createUserProfile(result.user.uid, {
          firstName: result.user.displayName?.split(' ')[0] || 'User',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          email: result.user.email,
          photoURL: result.user.photoURL,
          displayName: result.user.displayName
        })
      }

      return result
    } catch (err) {
      error.value = handleAuthError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await authStore.logout()
      await localDb.auth.delete(1)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e) {
      error.value = handleAuthError(e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createUserDocument = async (user) => {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      const { displayName, email, photoURL } = user
      await setDoc(userRef, {
        email,
        displayName,
        photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
,
      })
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
    resetPassword,
    checkAuthStatus
  }
}