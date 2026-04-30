import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'csplab-theme'

export const useThemeStore = defineStore('theme', () => {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  const theme = ref<Theme>(stored ?? 'light')

  function apply(value: Theme) {
    document.documentElement.setAttribute('data-fr-theme', value)
  }

  apply(theme.value)

  watch(theme, (value) => {
    apply(value)
    localStorage.setItem(STORAGE_KEY, value)
  })

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
})
