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
import GradeLevelToast from './GradeLevelToast.vue'

const props = defineProps({
  gradeName: {
    type: String,
    required: true
  }
})

const toast = ref()
const emit = defineEmits(['delete'])

const open = ref(false)
const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await emit('delete')
    toast.value.showDeleteSuccess(props.gradeName)
    open.value = false
  } catch (error) {
    toast.value.showError('delete', error.message)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot>
        <Button variant="outline" class="text-destructive hover:bg-destructive/10">Delete Grade Level</Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogContent class="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the grade level
          <span class="font-semibold">"{{ gradeName }}"</span> and all of its data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          <template v-if="isDeleting">
            <RotateCw class="mr-2 h-4 w-4 animate-spin" />
            Deleting
          </template>
          <template v-else>
            <Trash2 class="mr-2 h-4 w-4" /> Delete
          </template>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <GradeLevelToast ref="toast" />
</template>