import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { db, dbOperations } from './lib/db'
import { auth } from './lib/firebase'
import { dataService } from './lib/dataService'

import App from './App.vue'
import router from './router/router'

const app = createApp(App)

// Make services available globally
app.config.globalProperties.$db = db
app.config.globalProperties.$dbOps = dbOperations
app.config.globalProperties.$dataService = dataService
app.config.globalProperties.$auth = auth

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})

app.use(createPinia())
app.use(router)

// Initialize database
db.open().then(() => {
  console.log('Local database initialized successfully')
}).catch(err => {
  console.error('Failed to initialize local database:', err)
})

// Mount the app
app.mount('#app')
