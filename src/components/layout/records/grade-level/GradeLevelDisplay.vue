<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  ChevronRight,
  BookOpen,
  GraduationCap,
  MoreVertical,
  Pencil,
  Trash2,
  CloudOff,
  Cloud,
  RefreshCw,
} from 'lucide-vue-next'

defineProps({
  gradeName: {
    type: String,
    default: 'First Year'
  },
  syncStatus: {
    type: String,
    default: 'pending',
    validator: (value) => ['synced', 'pending', 'error'].includes(value)
  }
})

defineEmits(['edit', 'delete'])

// Compute sync status details
const getSyncStatusDetails = (status) => {
  switch (status) {
    case 'synced':
      return {
        icon: Cloud,
        tooltip: 'Changes synced',
        class: 'text-green-500'
      }
    case 'pending':
      return {
        icon: RefreshCw,
        tooltip: 'Changes pending sync',
        class: 'text-yellow-500 animate-spin'
      }
    case 'error':
      return {
        icon: CloudOff,
        tooltip: 'Sync failed',
        class: 'text-red-500'
      }
    default:
      return {
        icon: RefreshCw,
        tooltip: 'Unknown sync status',
        class: 'text-gray-500'
      }
  }
}
</script>

<template>
  <Card class="w-[280px]">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <CardTitle class="text-base font-semibold text-foreground">{{ gradeName }}</CardTitle>
          <component 
            :is="getSyncStatusDetails(syncStatus).icon" 
            class="h-4 w-4"
            :class="getSyncStatusDetails(syncStatus).class"
            :title="getSyncStatusDetails(syncStatus).tooltip"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8 -mr-2">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="$emit('edit')">
              <Pencil class="mr-2 h-4 w-4" />
              <span>Update</span>
            </DropdownMenuItem>
            <DropdownMenuItem @click="$emit('delete')" class="text-destructive focus:text-destructive">
              <Trash2 class="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <Separator class="mb-4" />
    <CardContent class="grid gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BookOpen class="h-4 w-4 text-primary" />
          <span class="text-muted-foreground text-xs">No Subjects</span>
        </div>
        <Separator orientation="vertical" class="h-5" />
        <div class="flex items-center gap-2">
          <GraduationCap class="h-4 w-4 text-primary" />
          <span class="text-muted-foreground text-xs">No Classes</span>
        </div>
      </div>
      <Button variant="default" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-1">
        <span>View Subjects</span>
        <ChevronRight class="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Button>
    </CardContent>
  </Card>
</template>