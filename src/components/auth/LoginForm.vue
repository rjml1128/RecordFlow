<template>
  <div class="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-1">Login</h2>
      <p class="text-sm text-muted-foreground">Access your personalized teaching dashboard</p>
    </div>

    <Button 
      variant="outline" 
      class="mb-6 h-12" 
      @click="handleGoogleLogin"
      :disabled="loading || isRateLimited()"
    >
      <IconGoogle class="mr-2 w-5 h-5" />
      Sign in with Google
    </Button>

    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">Or Sign in with Email</span>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <div v-if="isRateLimited()" class="text-red-500 text-sm">
        Too many login attempts. Please try again in {{ Math.ceil(getRateLimitRemaining() / 1000) }} seconds.
      </div>
      <div>
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Email@example.com"
          class="h-12"
          v-model="form.email"
          autocomplete="username"
          required
          :disabled="loading || isRateLimited()"
        />
      </div>
      <div>
        <Label for="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          class="h-12"
          v-model="form.password"
          autocomplete="current-password"
          required
          :disabled="loading || isRateLimited()"
        />
      </div>
      <div class="flex items-center justify-between">
        <Button 
          type="button" 
          variant="link" 
          class="px-0 text-sm text-blue-600"
          @click="handleForgotPassword"
          :disabled="loading || isRateLimited()"
        >
          Forgot password?
        </Button>
      </div>
      <Button 
        type="submit" 
        class="w-full h-12 bg-blue-600 hover:bg-blue-500"
        :disabled="!isFormValid || loading || isRateLimited()"
      >
        <template v-if="loading">
          <span class="animate-spin mr-2">⌛</span>
          Signing In...
        </template>
        <template v-else>
          Sign In
        </template>
      </Button>
    </form>

    <p class="text-sm text-center text-muted-foreground mt-2">
      New to RecordFlow?
      <Button 
        variant="link" 
        @click="$router.push('/auth/register')" 
        class="px-0"
        :disabled="loading || isRateLimited()"
      >
        Create an Account
      </Button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { 
  loading, 
  error,
  isRateLimited,
  getRateLimitRemaining,
  loginWithEmail,
  loginWithGoogle,
  resetPassword
} = useAuth()

const form = ref({ email: '', password: '' })

const isFormValid = computed(() => {
  return form.value.email.trim() !== '' && form.value.password !== ''
})

const handleLogin = async () => {
  try {
    await loginWithEmail(form.value.email, form.value.password)
    router.push('/dashboard')
  } catch {
    form.value.password = ''
  }
}

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    router.push('/dashboard')
  } catch {
    // Error is already handled in the composable
  }
}

const handleForgotPassword = async () => {
  if (!form.value.email) {
    error.value = 'Please enter your email address'
    return
  }

  try {
    await resetPassword(form.value.email)
    error.value = 'Password reset email sent. Please check your inbox.'
  } catch {
    // Error is already handled in the composable
  }
}
</script>