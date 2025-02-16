<script setup>
import { defineAsyncComponent } from 'vue'
import GradeLevelAdd from '@/components/layout/records/grade-level/GradeLevelAdd.vue'

const Toaster = defineAsyncComponent(() => 
  import('@/components/ui/toast/Toaster.vue')
)
</script>

<template>
  <div class="min-h-screen bg-background">
    <RouterView />
    <GradeLevelAdd />
    <Toaster 
      :closeButton="true"
      :richColors="true"
      :duration="5000"
    />
  </div>
</template>

<style>
:root {
  --toast-border-radius: 0.75rem;
}
</style>
