import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', () => {
  // Grade Level Dialog
  const isGradeLevelAddOpen = ref(false)

  const openGradeLevelAdd = () => {
    isGradeLevelAddOpen.value = true
  }

  const closeGradeLevelAdd = () => {
    isGradeLevelAddOpen.value = false
  }

  return {
    // Grade Level Dialog
    isGradeLevelAddOpen,
    openGradeLevelAdd,
    closeGradeLevelAdd,
  }
})