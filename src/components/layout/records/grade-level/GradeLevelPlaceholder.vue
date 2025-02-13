<script setup>
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-vue-next'
</script>

<template>
  <button class="block w-full cursor-pointer">
    <Card class="w-[320px] border-2 border-dashed border-border/85 hover:border-muted-foreground/90 bg-background/60 hover:bg-muted/40 transition-all duration-200 group">
      <CardContent class="p-6 min-h-[224px] flex flex-col items-center justify-center">
        <div class="flex flex-col items-center py-8 space-y-4">
          <div 
            class="rounded-full border-2 border-border/85 group-hover:border-muted-foreground/90 p-2 transition-all duration-200"
          >
            <Plus 
              class="h-6 w-6 text-muted-foreground/90 group-hover:text-muted-foreground transition-all duration-200" 
            />
          </div>
          <div class="space-y-1 text-center">
            <h3 class="font-medium text-muted-foreground/90 group-hover:text-muted-foreground transition-all duration-200">
              Add Grade Level
            </h3>
            <p class="text-sm text-muted-foreground/85 group-hover:text-muted-foreground transition-all duration-200">
              Create a new grade level
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </button>
</template>