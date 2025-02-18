import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './services/core/firebase'
import { useAuthStore } from './stores/authStore'
import { createServices } from './services'
import { mergeGoogleProfile } from './services/core/firebase'

import './assets/main.css'

import App from './App.vue'
import router from './router/router'

// Create app instance immediately
const app = createApp(App)
const pinia = createPinia()

// Install plugins
app.use(pinia)
app.use(router)
app.use(createServices())

// Mount the app immediately to show loading state
app.mount('#app')

// Initialize auth and services after mount
auth.authStateReady()
  .then(() => {
    return Promise.all([
      // Wait for auth to initialize and set up persistent listener
      new Promise(resolve => {
        auth.onAuthStateChanged(async (user) => {
          const authStore = useAuthStore()
          if (user) {
            // Merge and update user profile data
            const userData = await mergeGoogleProfile(user)
            authStore.setUser(userData)
          } else {
            authStore.setUser(null)
          }
          resolve()
        })
      }),
      
      // Initialize services as needed
      window.$db?.open().then(() => {
        console.log('Local database initialized successfully')
      })
    ])
  })
  .then(() => {
    // Setup navigation guards
    router.beforeEach((to, from, next) => {
      const authStore = useAuthStore()
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

      if (requiresAuth && !authStore.isAuthenticated) {
        next('/auth')
      } else if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
        next('/dashboard')
      } else {
        next()
      }
    })

    // Signal that initialization is complete
    const authStore = useAuthStore()
    authStore.setInitialized(true)
  })
  .catch(err => {
    console.error('Failed to initialize:', err)
  })
