import { defineStore } from 'pinia'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  getAuth,
  signOut
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    authWarning: null,
    initialized: false
  }),

  getters: {
    userFullName: (state) => {
      if (!state.user) return ''
      return state.user.displayName || `${state.user.firstName} ${state.user.lastName}`
    },
    userInitials: (state) => {
      if (!state.user) return ''
      const firstName = state.user.firstName || state.user.displayName?.split(' ')[0]
      const lastName = state.user.lastName || state.user.displayName?.split(' ').slice(1).join(' ')
      return firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'U'
    },
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    setInitialized(value) {
      this.initialized = value
    },

    setAuthWarning(message) {
      this.authWarning = message
    },

    setUser(user) {
      this.user = user
    },

    async refreshToken(refreshToken) {
      try {
        // Implement your token refresh logic here
        // This should call your authentication provider's refresh endpoint
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken })
        })
        const data = await response.json()
        return data.tokens
      } catch (error) {
        throw new Error('Failed to refresh token')
      }
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null
      
      try {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        
        // Note: The actual user data will be set by the auth state listener
        // in main.js which calls mergeGoogleProfile and then setUser
        // This is to ensure consistent user data structure across the app
        return result
      } catch (error) {
        console.error('Google login error:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        const auth = getAuth()
        await signOut(auth)
        this.user = null
      } finally {
        this.loading = false
      }
    }
  }
})