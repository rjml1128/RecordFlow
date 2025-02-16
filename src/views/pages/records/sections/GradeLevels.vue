<script setup>
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialogStore'
import GradeLevelEmptyState from '@/components/layout/records/grade-level/GradeLevelEmptyState.vue'

const dialog = useDialogStore()
</script>

<template>
  <div class="h-full bg-background flex flex-col">
    <!-- Container with responsive padding -->
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-grow">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold tracking-tight">Grade Levels</h1>
          <p class="text-muted-foreground">Manage all your handled grade levels</p>
        </div>
        <Button 
          variant="outline" 
          class="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto
            ring-offset-background transition-colors focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50"
          @click="dialog.openGradeLevelAdd"
 
        >
          <Plus class="mr-1 h-4 w-4" />
          Create Now
        </Button>
      </div>
      <Separator class="my-4 sm:my-6" />
      <!-- Content area with empty state -->
      <div class="flex-1 flex items-center justify-center min-h-[400px] bg-background/50">
        <GradeLevelEmptyState />
      </div>
    </div>
  </div>
</template>

