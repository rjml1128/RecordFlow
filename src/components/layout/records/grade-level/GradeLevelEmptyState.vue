<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SwatchBook, Plus } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialogStore'

const dialog = useDialogStore()
</script>

<template>
  <Card class="w-full max-w-sm border-0 shadow-none">
    <CardContent class="pt-12 pb-8 text-center flex flex-col items-center space-y-6">
      <SwatchBook class="w-10 h-10 text-primary" />

      <div class="space-y-2">
        <h3 class="text-lg font-semibold text-primary">No Grade Levels Yet</h3>
        <p class="text-sm text-muted-foreground">Get started by creating your first grade level by clicking the create button.</p>
      </div>

      <Button 
        variant="outline" 
        class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground 
          ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"        @click="dialog.openGradeLevelAdd"
      >
        <Plus class="mr-1 h-4 w-4" />
        Create Now
      </Button>
    </CardContent>
  </Card>
</template>