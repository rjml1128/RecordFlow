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

const emit = defineEmits(['update'])

const open = ref(false)
const gradeName = ref(props.initialName)

const handleSubmit = (e) => {
  e.preventDefault()
  emit('update', gradeName.value)
  open.value = false
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
              @focus="handleFocus"
            />
            <p class="text-sm text-muted-foreground">
              This name will be displayed in the grade levels list.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" @click="open = false">
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>