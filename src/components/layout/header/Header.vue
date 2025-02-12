<template>
  <component :is="isLargeScreen ? DesktopHeader : MobileHeader" />
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core'
import DesktopHeader from './DesktopHeader.vue'
import MobileHeader from './MobileHeader.vue'

const isLargeScreen = useMediaQuery('(min-width: 768px)')
</script>