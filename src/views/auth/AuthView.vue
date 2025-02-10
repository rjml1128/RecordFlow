<template>
  <div class="min-h-screen w-full flex">
    <!-- Left Section - Welcome Message -->
    <div class="hidden lg:flex w-1/2 bg-blue-600 text-white p-12 flex-col items-center justify-center relative overflow-hidden">
      <div class="max-w-md text-center relative z-10">
        <h2 class="text-4xl font-bold mb-4">Welcome to RecordFlow</h2>
        <p class="mb-6 text-blue-100">
          Manage student records effortlessly. Simplify grading and secure data access with ease.
        </p>
        <div class="relative w-96 h-72 mx-auto mb-8">
          <img src="@/assets/placeholder.svg" alt="Teacher using RecordFlow" class="object-contain w-full h-full" />
        </div>
        <h3 class="text-2xl font-semibold mb-2">Transform your teaching</h3>
        <p class="text-blue-100">Simple. Powerful. Always at your fingertips.</p>
      </div>
    </div>

    <!-- Right Section - Authentication Form -->
    <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-blue-600">RecordFlow</h1>
      </div>

      <component :is="currentForm" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const LoginForm = defineAsyncComponent(() => import('@/components/auth/LoginForm.vue'))
const RegisterForm = defineAsyncComponent(() => import('@/components/auth/RegisterForm.vue'))

const route = useRoute()

// Dynamically switch between login and register forms
const currentForm = computed(() => {
  return route.name === 'register' ? RegisterForm : LoginForm
})
</script>
