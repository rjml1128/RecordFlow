<script setup>
import { ref, watch } from 'vue'
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
import { RotateCw, Trash2 } from 'lucide-vue-next'
import GradeLevelToast from './GradeLevelToast.vue'

const props = defineProps({
  gradeName: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})

const toast = ref()
const emit = defineEmits(['delete', 'update:open'])

const isDeleting = ref(false)

// Watch external open prop
watch(() => props.open, (newValue) => {
  if (!newValue) {
    isDeleting.value = false
  }
})

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await emit('delete')
    toast.value.showDeleteSuccess(props.gradeName)
    emit('update:open', false)
  } catch (error) {
    toast.value.showError('delete', error.message)
  } finally {
    isDeleting.value = false
  }
}

const closeDialog = () => {
  emit('update:open', false)
}
</script>

<template>
  <AlertDialog 
    :open="open"
    @update:open="closeDialog"
  >
    <AlertDialogContent class="sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the grade level
          <span class="font-semibold">"{{ gradeName }}"</span> and all of its data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel 
          :disabled="isDeleting"
          @click="closeDialog"
        >
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