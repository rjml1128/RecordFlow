<script setup>
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const Toaster = defineAsyncComponent(() => 
  import('@/components/ui/toast/Toaster.vue')
)

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-background">
    <div v-if="!authStore.initialized" 
         class="flex flex-col items-center justify-center min-h-screen gap-4">
      <div class="loading-spinner"></div>
      <div class="text-lg font-medium text-primary/80">
        Loading RecordFlow...
      </div>
    </div>
    <template v-else>
      <RouterView />
      <Toaster 
        :closeButton="true"
        :richColors="true"
        :duration="5000"
      />
    </template>
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite, pulse 1s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

/* Optional: Add a fade-in animation for the text */
.text-lg {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

:root {
  --toast-border-radius: 0.75rem;
}
</style>
