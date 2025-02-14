<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RotateCw } from 'lucide-vue-next'
import GradeLevelToast from './GradeLevelToast.vue'

const props = defineProps({
  initialName: {
    type: String,
    required: true
  },
  trigger: {
    type: null,
    required: false
  }
})

const toast = ref()
const emit = defineEmits(['update'])

const open = ref(false)
const gradeName = ref(props.initialName)
const isUpdating = ref(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  const name = gradeName.value.trim()
  if (name) {
    isUpdating.value = true
    try {
      await emit('update', name)
      toast.value.showUpdateSuccess(name)
      open.value = false
    } catch (error) {
      toast.value.showError('update', error.message)
    } finally {
      isUpdating.value = false
    }
  }
}

const handleFocus = (e) => {
  e.target.select()
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button variant="outline">Edit Grade Level</Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle>Renaming Rules</DialogTitle>
          <DialogDescription>
            Please enter a unique grade level name. Duplicate names are not allowed.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="grade-name">Grade Level Name</Label>
            <Input
              id="grade-name"
              v-model="gradeName"
              class="col-span-3"
              autofocus
              :disabled="isUpdating"
              @focus="handleFocus"
            />
            <p class="text-sm text-muted-foreground">
              This name will be displayed in the grade levels list.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="ghost" 
            @click="open = false"
            :disabled="isUpdating"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            :disabled="isUpdating"
          >
            <template v-if="isUpdating">
              <RotateCw class="mr-2 h-4 w-4 animate-spin" />
              Updating
            </template>
            <template v-else>
              Update
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <GradeLevelToast ref="toast" />
</template>