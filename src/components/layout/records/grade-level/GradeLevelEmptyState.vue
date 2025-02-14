<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SwatchBook, Plus } from 'lucide-vue-next'
</script>

<template>
  <Card class="w-full max-w-sm border-0 shadow-none">
    <CardContent class="pt-12 pb-8 text-center flex flex-col items-center space-y-6">
      <SwatchBook class="w-10 h-10 text-primary" />

      <div class="space-y-2">
        <h3 class="font-semibold text-lg">No Grade Levels Yet</h3>
        <p class="text-sm text-muted-foreground">Get started by creating your first grade level.</p>
      </div>

      <Button>
        <Plus class=" h-4 w-4" />
        Create Now
      </Button>
    </CardContent>
  </Card>
</template>