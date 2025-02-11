import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
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

  async function clearUser() {
    user.value = null
    userProfile.value = null
    
    // Clean up services
    if (typeof window !== 'undefined') {
      const dataService = window.$dataService
      if (dataService) {
        dataService.cleanup()
      }
      
      const db = window.$db
      if (db && db.records) {
        await db.records.clear()
      }
    }
  }

  // Initialize auth state listener
  let unsubscribe = null
  function initialize() {
    if (unsubscribe) return

    const { getUserProfile } = useFirestore()
    
    unsubscribe = auth.onAuthStateChanged(async (userData) => {
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
        clearUser()
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
    clearUser,
    initialize,
    cleanup,
  }
})