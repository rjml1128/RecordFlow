<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RotateCw } from 'lucide-vue-next'

const props = defineProps({
  gradeName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['delete'])

const open = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await emit('delete')
    open.value = false
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot>
        <Button variant="outline" class="text-red-600">Delete Grade Level</Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogContent class="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this grade level and all of its associated data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          <template v-if="isDeleting">
            <RotateCw class="mr-2 h-4 w-4 animate-spin" />
            Deleting
          </template>
          <template v-else>
            Delete
          </template>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>