<script setup>
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RotateCw, Plus } from 'lucide-vue-next'
import GradeLevelToast from './GradeLevelToast.vue'
import { useGradeLevelValidation } from '@/services/validation/useGradeLevelValidation'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  existingNames: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add', 'update:open'])
const toast = ref()

const gradeName = ref('')
const isSaving = ref(false)

const { errors, validateName, setExistingNames, getNormalizedName, getPreferredFormat } = useGradeLevelValidation()

const formatExamples = {
  'grade-number': 'Grade 1, Grade 2, Grade 3',
  'grade-word': 'Grade One, Grade Two, Grade Three',
  'year-ordinal': '1st Year, 2nd Year, 3rd Year',
  'year-word': 'First Year, Second Year, Third Year',
  null: 'Grade 1, First Year, 1st Year, or Grade One'
}

const descriptionText = computed(() => {
  if (!props.existingNames.length) {
    return `Choose your preferred format. Your first entry will set the format for all entries.`
  }
  const format = getPreferredFormat()
  return `Please use the format: ${formatExamples[format]}`
})

const placeholderText = computed(() => {
  if (!props.existingNames.length) {
    return "Example: Grade 1, Grade One or 1st Year, First Year."
  }
  return props.existingNames[0] + ' (same format)'
})

onMounted(() => {
  setExistingNames(props.existingNames)
})

const handleSubmit = async (e) => {
  e.preventDefault()
  const name = gradeName.value.trim()
  
  if (!validateName(name)) {
    toast.value.showError('validation', errors.value.name)
    return
  }

  const normalizedName = getNormalizedName(name)
  isSaving.value = true
  
  try {
    await emit('add', normalizedName)
    toast.value.showAddSuccess(normalizedName)
    gradeName.value = ''
    emit('update:open', false)
  } catch (error) {
    toast.value.showError('add', error.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Dialog 
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent class="sm:max-w-[425px]">
      <form @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle class="text-lg font-semibold leading-none tracking-tight">Add New Grade Level</DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
            {{ descriptionText }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="grade-name">Grade Level Name</Label>
            <Input
              id="grade-name"
              v-model="gradeName"
              :placeholder="placeholderText"
              class="col-span-3"
              :class="{ 'border-destructive': errors.name }"
              autofocus
              :disabled="isSaving"
            />
            <p v-if="errors.name" class="text-sm text-destructive">
              {{ errors.name }}
            </p>
            <p v-else class="text-[0.8rem] text-muted-foreground">
              Names will maintain consistent formatting across all grade levels.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="ghost" 
            @click="emit('update:open', false)"
            :disabled="isSaving"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            class="bg-primary text-primary-foreground hover:bg-primary/90"
            :disabled="isSaving"
          >
            <template v-if="isSaving">
              <RotateCw class="mr-2 h-4 w-4 animate-spin" />
              Saving
            </template>
            <template v-else>
              <Plus class="mr-2 h-4 w-4" />
              Add
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  <GradeLevelToast ref="toast" />
</template>