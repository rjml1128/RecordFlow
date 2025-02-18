<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-vue-next'
import { useDialogStore } from '@/stores/dialogStore'
import GradeLevelEmptyState from '@/components/layout/records/grade-level/GradeLevelEmptyState.vue'
import GradeLevelAdd from '@/components/layout/records/grade-level/GradeLevelAdd.vue'
import GradeLevelUpdate from '@/components/layout/records/grade-level/GradeLevelUpdate.vue'
import GradeLevelDelete from '@/components/layout/records/grade-level/GradeLevelDelete.vue'
import GradeLevelDisplay from '@/components/layout/records/grade-level/GradeLevelDisplay.vue'
import GradeLevelPlaceholder from '@/components/layout/records/grade-level/GradeLevelPlaceholder.vue'
import { useGradeLevelValidation } from '@/services/validation/useGradeLevelValidation'

const dialog = useDialogStore()
const { getNormalizedName } = useGradeLevelValidation()

// Track existing grade levels
const gradeLevels = ref([])
const selectedGradeLevel = ref(null)
const isUpdateDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)

const handleAdd = async (name) => {
  try {
    // TODO: Save to database
    console.log('Adding grade level:', name)
    gradeLevels.value.push(name)
  } catch (error) {
    throw new Error('Failed to add grade level')
  }
}

const handleUpdate = async (oldName, newName) => {
  try {
    console.log('Updating grade level:', oldName, 'to', newName)
    const index = gradeLevels.value.findIndex(name => 
      getNormalizedName(name) === getNormalizedName(oldName)
    )
    if (index !== -1) {
      gradeLevels.value[index] = newName
    }
  } catch (error) {
    throw new Error('Failed to update grade level')
  }
}

const handleDelete = async (name) => {
  try {
    console.log('Deleting grade level:', name)
    const index = gradeLevels.value.findIndex(n => 
      getNormalizedName(n) === getNormalizedName(name)
    )
    if (index !== -1) {
      gradeLevels.value.splice(index, 1)
      isDeleteDialogOpen.value = false
      selectedGradeLevel.value = null
    }
  } catch (error) {
    throw new Error('Failed to delete grade level')
  }
}

const openAddDialog = () => {
  dialog.openGradeLevelAdd()
}

const handleOpenChange = (value) => {
  if (value) {
    dialog.openGradeLevelAdd()
  } else {
    dialog.closeGradeLevelAdd()
  }
}

const openUpdateDialog = (grade) => {
  selectedGradeLevel.value = grade
  isUpdateDialogOpen.value = true
}

const closeUpdateDialog = () => {
  isUpdateDialogOpen.value = false
  selectedGradeLevel.value = null
}

const openDeleteDialog = (grade) => {
  selectedGradeLevel.value = grade
  isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
  isDeleteDialogOpen.value = false
  selectedGradeLevel.value = null
}
</script>

<template>
  <div class="h-full bg-background flex flex-col">
    <!-- Container with responsive padding -->
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col flex-grow">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">Grade Levels</h1>
          <p class="text-muted-foreground text-sm">Manage all your handled grade levels</p>
        </div>
        <Button 
          variant="outline" 
          class="flex bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto
            ring-offset-background transition-colors focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50"
          @click="openAddDialog"
        >
          <Plus class="mr-1 h-4 w-4" />
          Create Now
        </Button>
      </div>
      <Separator class="my-4 sm:my-6" />
      
      <!-- Content area -->
      <div class="flex-1">
        <!-- Empty State -->
        <div v-if="!gradeLevels.length" class="flex items-center justify-center min-h-[400px]">
          <GradeLevelEmptyState @create="openAddDialog" />
        </div>
        
        <!-- Grade Levels Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="grade in gradeLevels" :key="grade" class="flex justify-center">
            <GradeLevelDisplay 
              :gradeName="grade"
              @edit="openUpdateDialog(grade)"
              @delete="openDeleteDialog(grade)"
            />
          </div>
          <!-- Placeholder Card -->
          <div class="flex justify-center">
            <GradeLevelPlaceholder />
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <GradeLevelAdd 
      :open="dialog.isGradeLevelAddOpen"
      @update:open="handleOpenChange"
      @add="handleAdd"
      :existingNames="gradeLevels"
    />

    <GradeLevelUpdate 
      v-if="selectedGradeLevel"
      :initialName="selectedGradeLevel"
      :existingNames="gradeLevels"
      @update="newName => handleUpdate(selectedGradeLevel, newName)"
      :open="isUpdateDialogOpen"
      @update:open="closeUpdateDialog"
    />

    <GradeLevelDelete
      v-if="selectedGradeLevel"
      :gradeName="selectedGradeLevel"
      :open="isDeleteDialogOpen"
      @update:open="closeDeleteDialog"
      @delete="() => handleDelete(selectedGradeLevel)"
    />
  </div>
</template>
