<script setup>
import { Card, CardContent } from '@/components/ui/card'
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
  MoreVertical,
  Pencil,
  Trash,
  Users, 
  Bookmark,
  GraduationCap
} from 'lucide-vue-next'

const props = defineProps({
  gradeName: {
    type: String,
    default: 'First Year'
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <Card class="w-[320px] bg-white border-gray-200 shadow-sm">
    <CardContent class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ gradeName }}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
              <MoreVertical class="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-[160px]">
            <DropdownMenuItem @click="emit('edit')" class="text-gray-700">
              <Pencil class="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="emit('delete')" class="text-red-600">
              <Trash class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator class="my-4 bg-gray-200" />

      <div class="flex items-center justify-between mb-4 text-xs">
        <div class="flex items-center gap-2">
          <Bookmark class="h-4 w-4 text-gray-400" />
          <span class="text-xs text-gray-500">No Subjects</span>
        </div>
        <Separator orientation="vertical" class="h-6 bg-gray-200" />
        <div class="flex items-center gap-2">
          <GraduationCap class="h-4 w-4 text-gray-400" />
          <span class="text-xs text-gray-500">No Classes</span>
        </div>
      </div>

      <Button variant="default" class="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium">
        View Details
        <ChevronRight class="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
</template>