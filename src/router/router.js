import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AuthView from '@/views/auth/AuthView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: to => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/dashboard' : '/auth'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    children: [
      {
        path: '', // Default to login
        name: 'login',
        component: () => import('@/components/auth/LoginForm.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/components/auth/RegisterForm.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthRoute = to.path.startsWith('/auth')

  // Wait for auth store to be initialized
  if (!authStore.initialized) {
    // Create a promise that resolves when initialization is complete
    await new Promise(resolve => {
      const unwatch = watch(
        () => authStore.initialized,
        (initialized) => {
          if (initialized) {
            unwatch()
            resolve()
          }
        },
        { immediate: true }
      )
    })
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route while not authenticated
    next('/auth')
  } else if (isAuthRoute && authStore.isAuthenticated) {
    // Redirect to dashboard if trying to access any auth route while authenticated
    next('/dashboard')
  } else {
    next()
  }
})

export default router
