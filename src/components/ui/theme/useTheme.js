import { ref, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

// Constants for theme values to avoid magic strings
const THEME = {
  DARK: 'dark',
  LIGHT: 'light'
}

export function useTheme() {
  const colorMode = useColorMode({
    // Ensures theme persists across page reloads
    storageKey: 'recordflow-theme',
    // Syncs with system theme by default
    emitAuto: true
  })

  const toggleTheme = () => {
    try {
      colorMode.value = colorMode.value === THEME.DARK ? THEME.LIGHT : THEME.DARK
    } catch (error) {
      console.error('Failed to toggle theme:', error)
    }
  }

  // Watch for theme changes and update DOM
  watch(colorMode, (newMode) => {
    try {
      console.log('Theme changed to:', newMode)
      if (newMode === THEME.DARK) {
        document.documentElement.classList.add(THEME.DARK)
      } else {
        document.documentElement.classList.remove(THEME.DARK)
      }
    } catch (error) {
      console.error('Failed to update theme classes:', error)
    }
  }, { immediate: true })

  return {
    mode: colorMode,
    isDark: () => colorMode.value === THEME.DARK,
    toggleTheme
  }
}