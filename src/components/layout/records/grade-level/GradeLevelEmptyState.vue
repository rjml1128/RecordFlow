<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SwatchBook, Plus } from 'lucide-vue-next'
import { useGradeLevelDialogStore } from './useGradeLevelDialogStore'

const dialog = useGradeLevelDialogStore()
</script>

<template>
  <Card class="w-full max-w-sm border-0 shadow-none">
    <CardContent class="pt-12 pb-8 text-center flex flex-col items-center space-y-6">
      <SwatchBook class="w-10 h-10 text-primary" />

      <div class="space-y-2">
        <h3 class="text-card-title text-primary">No Grade Levels Yet</h3>
        <p class="text-card-description">Get started by creating your first grade level by clicking the create button.</p>
      </div>

      <Button 
        variant="outline" 
        class="bg-primary text-white hover:bg-primary/90 hover:text-white"
        @click="dialog.openAddDialog"
      >
        <Plus class="mr-1 h-4 w-4" />
        Create Now
      </Button>
    </CardContent>
  </Card>
</template>