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

const emit = defineEmits(['add'])

const open = ref(false)
const gradeName = ref('')
const isSaving = ref(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  if (gradeName.value.trim()) {
    isSaving.value = true
    try {
      await emit('add', gradeName.value.trim())
      gradeName.value = ''
      open.value = false
    } finally {
      isSaving.value = false
    }
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button variant="outline">Add Grade Level</Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle>Add New Grade Level</DialogTitle>
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
              placeholder="Example: Grade 1, Freshman"
              class="col-span-3"
              autofocus
              :disabled="isSaving"
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
            :disabled="isSaving"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            :disabled="isSaving"
          >
            <template v-if="isSaving">
              <RotateCw class="mr-2 h-4 w-4 animate-spin" />
              Saving
            </template>
            <template v-else>
              Add
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>