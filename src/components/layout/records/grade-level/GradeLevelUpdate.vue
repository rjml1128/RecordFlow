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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RotateCw } from 'lucide-vue-next'
import GradeLevelToast from './GradeLevelToast.vue'
import { useGradeLevelValidation } from '@/services/validation/useGradeLevelValidation'

const props = defineProps({
  initialName: {
    type: String,
    required: true
  },
  existingNames: {
    type: Array,
    default: () => []
  },
  open: {
    type: Boolean,
    required: true
  }
})

const toast = ref()
const emit = defineEmits(['update', 'update:open'])

const gradeName = ref(props.initialName)
const isUpdating = ref(false)

const { errors, validateName, setExistingNames, getNormalizedName, getPreferredFormat } = useGradeLevelValidation()

const formatExamples = {
  'grade-number': 'Grade 1, Grade 2, Grade 3',
  'grade-word': 'Grade One, Grade Two, Grade Three',
  'year-ordinal': '1st Year, 2nd Year, 3rd Year',
  'year-word': 'First Year, Second Year, Third Year'
}

const descriptionText = computed(() => {
  const format = getPreferredFormat()
  return `Please use the format: ${formatExamples[format]}`
})

onMounted(() => {
  setExistingNames(props.existingNames)
})

const handleSubmit = async (e) => {
  e.preventDefault()
  const name = gradeName.value.trim()

  if (!validateName(name, props.initialName)) {
    toast.value.showError('validation', errors.value.name)
    return
  }

  const normalizedName = getNormalizedName(name)
  const normalizedInitial = getNormalizedName(props.initialName)
  
  if (normalizedName === normalizedInitial) {
    toast.value.showError('validation', 'The new name is the same as the current name')
    return
  }

  isUpdating.value = true
  try {
    await emit('update', normalizedName)
    toast.value.showUpdateSuccess(normalizedName)
    emit('update:open', false)
  } catch (error) {
    toast.value.showError('update', error.message)
  } finally {
    isUpdating.value = false
  }
}

const handleFocus = (e) => {
  e.target.select()
}

const closeDialog = () => {
  emit('update:open', false)
  gradeName.value = props.initialName
  errors.value = {}
}
</script>

<template>
  <Dialog 
    :open="open"
    @update:open="closeDialog"
  >
    <DialogContent class="sm:max-w-[425px]">
      <form @submit="handleSubmit">
        <DialogHeader>
          <DialogTitle>Rename Grade Level</DialogTitle>
          <DialogDescription>
            {{ descriptionText }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <Label for="grade-name">Grade Level Name</Label>
            <Input
              id="grade-name"
              v-model="gradeName"
              class="col-span-3"
              :class="{ 'border-destructive': errors.name }"
              :placeholder="existingNames[0] + ' (same format)'"
              autofocus
              :disabled="isUpdating"
              @focus="handleFocus"
            />
            <p v-if="errors.name" class="text-sm text-destructive">
              {{ errors.name }}
            </p>
            <p v-else class="text-sm text-muted-foreground">
              Names will maintain consistent formatting across all grade levels.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="ghost" 
            @click="closeDialog"
            :disabled="isUpdating"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            :disabled="isUpdating || !gradeName.trim()"
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