<template>
  <div class="h-full bg-background py-4 px-10 flex flex-col">
    <div class="mx-auto max-w-7xl flex flex-col flex-grow w-full">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p class="text-sm text-muted-foreground">Welcome back to your dashboard</p>
        </div>
      </div>
      <Separator class="my-6" />
      <div class="flex-1">
        <div class="container mx-auto px-4 py-8">
          <div class="max-w-2xl mx-auto">
            <div class="bg-white shadow rounded-lg p-6">
              <div class="flex items-center justify-between mb-6">
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
    
          <DisplayCheck/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Button } from '@/components/ui/button'
  import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
  import { Separator } from '@/components/ui/separator'
  import { useAuth } from '@/services/auth/useAuth.js'
  import { useAuthStore } from '@/stores/authStore'
  import { useRouter } from 'vue-router'
  import DisplayCheck from '@/components/layout/records/grade-level/displaycheck.vue'
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