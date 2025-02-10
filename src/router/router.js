import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'

const routes = [
  {
    path: '/',
    redirect: '/auth'
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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
