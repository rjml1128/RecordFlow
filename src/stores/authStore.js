import { defineStore } from 'pinia'

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
      return `${state.user.firstName} ${state.user.lastName}`
    },
    userInitials: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName[0]}${state.user.lastName[0]}`
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
    }
  }
})