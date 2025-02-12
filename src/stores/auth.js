import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/lib/firebase'
import { useFirestore } from '@/composables/useFirestore'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const userProfile = ref(null)
  const initialized = ref(false)

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
    if (userData) {
      user.value = {
        uid: userData.uid,
        email: userData.email,
        emailVerified: userData.emailVerified,
        photoURL: userData.photoURL,
        displayName: userData.displayName,
      }
    } else {
      user.value = null
    }
  }

  function setUserProfile(profile) {
    userProfile.value = profile
  }

  function clearState() {
    user.value = null
    userProfile.value = null
  }

  // Initialize auth state listener
  let unsubscribe = null
  function initialize() {
    if (unsubscribe) return

    const { getUserProfile } = useFirestore()
    
    unsubscribe = auth.onAuthStateChanged(async (userData) => {
      try {
        initialized.value = true
        
        if (userData) {
          setUser(userData)
          try {
            const profile = await getUserProfile(userData.uid)
            setUserProfile(profile)
          } catch (error) {
            console.error('Error fetching user profile:', error)
          }
        } else {
          clearState()
        }
      } catch (error) {
        console.error('Auth state change error:', error)
      }
    })
  }

  // Clean up listener
  function cleanup() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  // Initialize on store creation
  initialize()

  return {
    // State
    user,
    userProfile,
    initialized,
    
    // Getters
    isAuthenticated,
    userFullName,
    userInitials,
    
    // Actions
    setUser,
    setUserProfile,
    clearState,
    initialize,
    cleanup,
  }
})