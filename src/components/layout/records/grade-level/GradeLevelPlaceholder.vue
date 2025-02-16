<script setup>
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialogStore'

const dialog = useDialogStore()
</script>

<template>
  <button type="button" class="w-[280px]" @click="dialog.openGradeLevelAdd">
    <Card 
      class="h-[180px] flex flex-col items-center justify-center gap-2 
        border-2 border-dashed border-muted-foreground/30
        bg-muted/5
        shadow-sm
        transition-all duration-200
        hover:border-muted-foreground/50 hover:bg-muted/10 hover:shadow-md"
    >
      <Plus class="h-7 w-7 text-muted-foreground/60" />
      <h3 class="text-base font-medium text-foreground/60">Add Grade Level</h3>
      <p class="text-sm text-muted-foreground/70">Create a new grade level</p>
    </Card>
  </button>
</template>