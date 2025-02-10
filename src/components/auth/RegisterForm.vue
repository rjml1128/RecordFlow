<template>
  <div class="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-1">Create an Account</h2>
      <p class="text-sm text-muted-foreground">Start your journey with RecordFlow</p>
    </div>

    <Button 
      variant="outline" 
      class="mb-6 h-12" 
      @click="handleGoogleRegister" 
      :disabled="loading"
    >
      <IconGoogle class="mr-2 w-5 h-5" />
      Sign up with Google
    </Button>

    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">Or Sign up with Email</span>
      </div>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <Label for="firstName">First Name</Label>
          <Input 
            id="firstName" 
            type="text" 
            v-model="form.firstName" 
            placeholder="John" 
            required 
            :disabled="loading" 
          />
        </div>
        <div class="flex-1">
          <Label for="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            type="text" 
            v-model="form.lastName" 
            placeholder="Doe" 
            required 
            :disabled="loading" 
          />
        </div>
      </div>
      <div>
        <Label for="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          v-model="form.email" 
          placeholder="Email@example.com" 
          autocomplete="username" 
          required 
          :disabled="loading" 
        />
      </div>
      <div>
        <Label for="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          v-model="form.password" 
          placeholder="Password" 
          autocomplete="new-password" 
          required 
          :disabled="loading" 
          @input="validatePassword" 
        />
        <div v-if="passwordStrength" :class="['text-xs mt-1', strengthColor]">
          Password strength: {{ passwordStrength }}
        </div>
      </div>
      <div>
        <Label for="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          v-model="form.confirmPassword" 
          placeholder="Confirm password" 
          autocomplete="new-password" 
          required 
          :disabled="loading" 
        />
      </div>
      <div v-if="passwordError" class="text-red-500 text-sm mb-4">{{ passwordError }}</div>
      
      <div class="flex items-center space-x-2">
        <Checkbox id="terms" v-model="acceptTerms" required :disabled="loading" />
        <Label for="terms" class="font-normal">
          <p class="text-xs text-muted-foreground mt-2">
            By checking this box, you agree to our
            <a href="/terms" class="text-blue-600 hover:underline">Terms of Service</a>
            and acknowledge that you have read our
            <a href="/privacy" class="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </Label>
      </div>

      <Button
        type="submit"
        class="w-full h-12 bg-blue-600 hover:bg-blue-500"
        :disabled="!isFormValid || loading"
      >
        <template v-if="loading">
          <span class="animate-spin mr-2">⌛</span>
          Creating Account...
        </template>
        <template v-else>
          Create Account
        </template>
      </Button>
    </form>

    <p class="text-sm text-center text-muted-foreground mt-2">
      Already have an account?
      <Button 
        variant="link" 
        @click="$router.push('/auth')" 
        class="px-0" 
        :disabled="loading"
      >
        Sign In
      </Button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import IconGoogle from '@/components/icons/IconGoogle.vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { 
  loading, 
  error, 
  registerWithEmail,
  loginWithGoogle
} = useAuth()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const acceptTerms = ref(false)
const passwordError = ref('')
const passwordStrength = ref('')

// Password strength validation
const validatePassword = () => {
  const password = form.value.password
  if (!password) {
    passwordStrength.value = ''
    return
  }

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const isLongEnough = password.length >= 8

  let strength = 0
  if (hasLower) strength++
  if (hasUpper) strength++
  if (hasNumber) strength++
  if (hasSpecial) strength++
  if (isLongEnough) strength++

  switch (strength) {
    case 0:
    case 1:
      passwordStrength.value = 'Very Weak'
      break
    case 2:
      passwordStrength.value = 'Weak'
      break
    case 3:
      passwordStrength.value = 'Medium'
      break
    case 4:
      passwordStrength.value = 'Strong'
      break
    case 5:
      passwordStrength.value = 'Very Strong'
      break
  }
}

const strengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 'Very Weak':
    case 'Weak':
      return 'text-red-500'
    case 'Medium':
      return 'text-yellow-500'
    case 'Strong':
    case 'Very Strong':
      return 'text-green-500'
    default:
      return ''
  }
})

// Watch for password changes to clear error and validate
watch(() => form.value.password, () => {
  passwordError.value = ''
  validatePassword()
})

// Form validation
const isFormValid = computed(() => {
  return form.value.firstName.trim() !== '' &&
         form.value.lastName.trim() !== '' &&
         form.value.email.trim() !== '' &&
         form.value.password !== '' &&
         form.value.confirmPassword !== '' &&
         acceptTerms.value &&
         !passwordError.value &&
         passwordStrength.value !== 'Very Weak' &&
         passwordStrength.value !== 'Weak'
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    form.value.password = ''
    form.value.confirmPassword = ''
    return
  }

  if (!acceptTerms.value) {
    error.value = 'Please accept the terms and conditions.'
    return
  }

  try {
    await registerWithEmail({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    })
    router.push('/dashboard')
  } catch {
    form.value.password = ''
    form.value.confirmPassword = ''
  }
}

const handleGoogleRegister = async () => {
  try {
    await loginWithGoogle()
    router.push('/dashboard')
  } catch {
    // Error is already handled in the composable
  }
}
</script>
