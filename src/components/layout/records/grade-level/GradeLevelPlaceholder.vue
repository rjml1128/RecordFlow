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
        bg-muted/5 hover:bg-muted/10
        transition-colors duration-200
        hover:border-muted-foreground/50 hover:shadow-sm
        group cursor-pointer"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="p-2 rounded-full bg-muted/20 group-hover:bg-muted/30 transition-colors">
          <Plus class="h-6 w-6 text-muted-foreground/60" />
        </div>
        <div class="text-center">
          <h3 class="text-base font-semibold text-foreground/60">Add Grade Level</h3>
          <p class="text-sm text-muted-foreground/70">Create a new grade level</p>
        </div>
      </div>
    </Card>
  </button>
</template>