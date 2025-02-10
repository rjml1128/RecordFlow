import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const userProfile = ref(null)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const userFullName = computed(() => {
    if (!userProfile.value) return ''
    return `${userProfile.value.firstName} ${userProfile.value.lastName}`.trim()
  })
  const userInitials = computed(() => {
    if (!userProfile.value) return ''
    return `${userProfile.value.firstName.charAt(0)}${userProfile.value.lastName.charAt(0)}`.toUpperCase()
  })

  // Actions
  function setUser(userData) {
    user.value = {
      uid: userData.uid,
      email: userData.email,
      emailVerified: userData.emailVerified,
      photoURL: userData.photoURL,
      displayName: userData.displayName,
    }
  }

  function setUserProfile(profile) {
    userProfile.value = profile
  }

  function clearUser() {
    user.value = null
    userProfile.value = null
  }

  return {
    // State
    user,
    userProfile,
    
    // Getters
    isAuthenticated,
    userFullName,
    userInitials,
    
    // Actions
    setUser,
    setUserProfile,
    clearUser,
  }
})