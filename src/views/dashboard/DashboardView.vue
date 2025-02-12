<template>
  <div>
    <Header />
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
            <Button 
              variant="outline"
              @click="handleLogout"
              :disabled="loading"
            >
              {{ loading ? 'Logging out...' : 'Logout' }}
            </Button>
          </div>

          <div class="space-y-4">
            <!-- User Profile -->
            <div class="flex items-center space-x-4">
              <Avatar class="h-16 w-16">
                <AvatarImage 
                  v-if="authStore.user?.photoURL"
                  :src="authStore.user.photoURL"
                  alt="Profile picture"
                />
                <AvatarFallback>
                  {{ authStore.userInitials }}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 class="text-xl font-medium">{{ authStore.userFullName }}</h2>
                <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/header/Header.vue'

const router = useRouter()
const authStore = useAuthStore()
const { loading, logout } = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    router.push('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>