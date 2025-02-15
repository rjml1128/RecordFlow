<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { LayoutDashboard, Layers, Settings, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const navigationMap = {
  'dashboard': {
    icon: LayoutDashboard,
    mainText: 'Dashboard',
    subText: 'Overview'
  },
  'records': {
    icon: Layers,
    mainText: 'Records',
    subText: 'Grade Levels'
  },
  'settings': {
    icon: Settings,
    mainText: 'Settings',
    subText: 'General'
  }
}

const currentNav = computed(() => {
  const mainPath = route.path.split('/')[1]
  const subPath = route.path.split('/')[2]
  const nav = navigationMap[mainPath] || null
  if (nav && subPath) {
    nav.subText = subPath
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return nav
})
</script>

<template>
  <Breadcrumb v-if="currentNav">
    <BreadcrumbList class="inline-flex items-center">
      <BreadcrumbItem class="inline-flex items-center">
        <BreadcrumbLink as-child>
          <RouterLink :to="`/${route.path.split('/')[1]}`" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
            <component 
              :is="currentNav.icon" 
              class="text-primary h-4 w-4" 
            />
          </RouterLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem class="inline-flex items-center">
        <ChevronRight class="w-4 h-4 text-gray-500" />
        <span class="text-sm font-normal text-gray-700 dark:text-gray-400">
          {{ currentNav.subText }}
        </span>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>