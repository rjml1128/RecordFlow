<script setup>
import { ref } from 'vue'
import { useTheme } from '@/components/ui/theme/useTheme.js'
import { Menu, Settings, Layers, LayoutDashboard, Moon, Sun, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/services/auth/useAuth.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const { toggleTheme, isDark } = useTheme()
const { loading, logout } = useAuth()
const isOpen = ref(false)

const handleLogout = async () => {
  try {
    isOpen.value = false
    await logout()
    router.push('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <header class="border-b">
    <div class="flex h-16 items-center justify-between px-4">
      <router-link to="/" class="text-xl font-semibold">
        RecordFlow
      </router-link>
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </Button>
        <Sheet v-model:open="isOpen">
          <SheetTrigger :as-child="true">
            <Button variant="ghost" size="icon">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[300px] sm:w-[400px] p-0">
            <div class="flex flex-col h-full">
              <div class="p-6">
                <nav class="space-y-2">
                  <router-link to="/dashboard"
                    class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    @click="isOpen = false">
                    <LayoutDashboard class="h-5 w-5" />
                    Dashboard
                  </router-link>
                  <router-link to="/records"
                    class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    @click="isOpen = false">
                    <Layers class="h-5 w-5" />
                    Records
                  </router-link>
                  <router-link to="/settings"
                    class="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    @click="isOpen = false">
                    <Settings class="h-5 w-5" />
                    Settings
                  </router-link>
                </nav>
              </div>
              <div class="mt-auto">
                <Separator class="mb-4" />
                <div class="p-6 pt-0 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage v-if="authStore.user?.photoURL" :src="authStore.user.photoURL"
                        :alt="authStore.userFullName" />
                      <AvatarFallback>
                        {{ authStore.userInitials }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col">
                      <span class="text-sm font-medium">{{ authStore.userFullName }}</span>
                      <span class="text-xs text-muted-foreground">{{ authStore.user?.email }}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" @click="handleLogout" :disabled="loading">
                    <LogOut class="h-5 w-5" />
                    <span class="sr-only">Log out</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
