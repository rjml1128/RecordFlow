<script setup>
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-vue-next'

defineEmits(['click'])
</script>

<template>
  <button type="button" class="w-[280px] group" @click="$emit('click')">
    <Card
      class="h-[180px] flex flex-col items-center justify-center gap-1.5
        border-2 border-dashed border-muted
        transition-colors duration-200
        group-hover:border-primary/50"
    >
      <div class="h-10 w-10 rounded-full border-2 border-muted flex items-center justify-center transition-colors duration-200 group-hover:border-primary/50">
        <Plus class="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
      </div>
      <h3 class="font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
        Add Grade Level
      </h3>
      <p class="text-sm text-muted-foreground/60 transition-colors duration-200 group-hover:text-primary/80">
        Create a new grade level
      </p>
    </Card>
  </button>
</template>