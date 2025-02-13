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

const open = ref(false)
const gradeName = ref('')

const handleSubmit = (e) => {
  e.preventDefault()
  // Handle the form submission here
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">Add Grade Level</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle>Naming Rules</DialogTitle>
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
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>