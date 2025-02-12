<template>
  <header class="border-b">
    <div class="flex h-16 items-center justify-between px-6">
      <div class="flex items-center">
        <router-link to="/" class="text-xl font-semibold mr-16">
          RecordFlow
        </router-link>
        <nav class="flex items-center">
          <router-link
            to="/dashboard"
            class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-4"
          >
            <LayoutDashboard class="h-4 w-4" />
            Dashboard
          </router-link>
          <Separator orientation="vertical" class="h-6" />
          <router-link
            to="/records"
            class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-4"
          >
            <Layers class="h-4 w-4" />
            Records
          </router-link>
          <Separator orientation="vertical" class="h-6" />
          <router-link
            to="/settings"
            class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary px-4"
          >
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
            <Button variant="ghost" class="flex items-center gap-2 px-2">
              <div class="h-8 w-8 rounded-full bg-muted" />
              <span class="text-sm">myflowacct2</span>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuItem class="flex items-center gap-2 cursor-pointer dropdown-menu-item">
              <User class="h-4 w-4" />
              <span>Manage Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem class="flex items-center gap-2 cursor-pointer dropdown-menu-item">
              <LogOut class="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import { Settings, Layers, LayoutDashboard, Moon, Sun, ChevronDown, User, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

const { toggleTheme, isDark } = useTheme()
</script>
