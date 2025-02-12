import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { db, dbOperations } from './lib/db'
import { auth } from './lib/firebase'
import { dataService } from './lib/dataService'
import { useAuthStore } from './stores/auth'

import './assets/main.css'

import App from './App.vue'
import router from './router/router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Make services available globally
app.config.globalProperties.$db = db
app.config.globalProperties.$dbOps = dbOperations
app.config.globalProperties.$dataService = dataService
app.config.globalProperties.$auth = auth

// Initialize app
Promise.all([
  // Initialize local database
  db.open().then(() => {
    console.log('Local database initialized successfully')
  }),
  
  // Wait for auth to initialize
  new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe()
      resolve()
    })
  })
]).then(() => {
  return Promise.all([
    // Initialize local database
    db.open().then(() => {
      console.log('Local database initialized successfully')
    }),
    
    // Wait for auth to initialize
    new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged(() => {
        unsubscribe()
        resolve()
      })
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
