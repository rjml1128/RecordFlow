import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGradeLevelDialogStore = defineStore('gradeLevelDialog', () => {
  const isAddDialogOpen = ref(false)

  const openAddDialog = () => {
    isAddDialogOpen.value = true
  }

  const closeAddDialog = () => {
    isAddDialogOpen.value = false
  }

  return {
    isAddDialogOpen,
    openAddDialog,
    closeAddDialog
  }
})
