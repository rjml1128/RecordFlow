import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth } from './services/core/firebase'
import { useAuthStore } from './stores/authStore'
import { createServices } from './services'

import './assets/main.css'

import App from './App.vue'
import router from './router/router'

const app = createApp(App)
const pinia = createPinia()

// Install plugins
app.use(pinia)
app.use(router)
app.use(createServices())

// Initialize app after auth is ready
auth.authStateReady().then(() => {
  return Promise.all([
    // Wait for auth to initialize
    new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged(() => {
        unsubscribe()
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

  // Mount the app
  app.mount('#app')
})
.catch(err => {
  console.error('Failed to initialize:', err)
})
