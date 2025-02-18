<script setup>
import { useTheme } from '@/components/ui/theme/useTheme.js'
import { Settings, Layers, LayoutDashboard, Moon, Sun, ChevronDown, User, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/services/auth/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const { logout, loading } = useAuth()
const authStore = useAuthStore()
const { toggleTheme, isDark } = useTheme()

const handleLogout = async () => {
  try {
    await logout()
    router.push('/auth')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
<template>
  <header class="border-b">
    <div class="flex h-16 items-center justify-between px-6">
      <div class="flex items-center">
        <router-link to="/" class="text-2xl text-primary font-bold mr-16">
          RecordFlow
        </router-link>
        <nav class="flex items-center">
          <router-link :to="{ name: 'overview' }" :class="[
            'flex items-center gap-2 text-sm font-medium px-4 transition-colors',
            $route.name === 'overview'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-primary'
          ]">
            <LayoutDashboard class="h-4 w-4" />
            Dashboard
          </router-link>
          <Separator orientation="vertical" class="h-6" />
          <router-link :to="{ name: 'records' }" :class="[
            'flex items-center gap-2 text-sm font-medium px-4 transition-colors',
            $route.name === 'records'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-primary'
          ]">
            <Layers class="h-4 w-4" />
            Records
          </router-link>
          <Separator orientation="vertical" class="h-6" />
          <router-link to="/settings" :class="[
            'flex items-center gap-2 text-sm font-medium px-4 transition-colors',
            $route.path.startsWith('/settings')
              ? 'text-primary'
              : 'text-muted-foreground hover:text-primary'
          ]">
            <Settings class="h-4 w-4" />
            Settings
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="toggleTheme">
          <Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </Button>
        <Separator orientation="vertical" class="h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger :as-child="true">
            <Button variant="ghost" class="flex items-center gap-1 px-2">
              <Avatar class="h-8 w-8">
                <AvatarImage 
                  v-if="authStore.user?.photoURL" 
                  :src="authStore.user.photoURL"
                  :alt="authStore.userFullName"
                  @error="console.error('Avatar image failed to load:', authStore.user.photoURL)"
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>
                  {{ authStore.userInitials }}
                </AvatarFallback>
              </Avatar>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <div class="p-2 border-b border-border">
              <p class="text-sm font-medium">{{ authStore.userFullName }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email }}</p>
            </div>
            <div class="p-1">
              <DropdownMenuItem class="flex items-center gap-2 cursor-pointer dropdown-menu-item" @click="handleLogout"
                :disabled="loading">
                <LogOut class="h-4 w-4" />
                <span>{{ loading ? 'Logging out...' : 'Log out' }}</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
