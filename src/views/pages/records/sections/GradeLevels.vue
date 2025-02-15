<template>
  <div class="h-full bg-background py-4 px-10 flex flex-col">
    <div class="mx-auto max-w-7xl flex flex-col flex-grow w-full">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl text-primary font-semibold tracking-tight">Grade Levels</h1>
          <p class="text-sm text-muted-foreground">Manage all your handled grade levels</p>
        </div>
        <Button variant="outline" class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <Plus class="mr-1 h-4 w-4" />
        Create Now
      </Button>
      </div>
      <Separator class="my-6" />
      <!-- Content area with empty state -->
      <div class="flex-1 flex items-center justify-center min-h-[400px]">
        <GradeLevelEmptyState />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-vue-next'
import GradeLevelEmptyState from '@/components/layout/records/grade-level/GradeLevelEmptyState.vue'
</script>