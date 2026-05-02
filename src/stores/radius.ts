import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type RadiusMode = 'square' | 'soft' | 'rounded'

const STORAGE_KEY = 'csplab-radius-mode'
const MODES: RadiusMode[] = ['square', 'soft', 'rounded']

export const useRadiusStore = defineStore('radius', () => {
  const stored = localStorage.getItem(STORAGE_KEY) as RadiusMode | null
  const radiusMode = ref<RadiusMode>(stored ?? 'soft')

  function apply(value: RadiusMode) {
    document.documentElement.setAttribute('data-radius-mode', value)
  }

  apply(radiusMode.value)

  watch(radiusMode, (value) => {
    apply(value)
    localStorage.setItem(STORAGE_KEY, value)
  })

  function cycle() {
    const idx = MODES.indexOf(radiusMode.value)
    radiusMode.value = MODES[(idx + 1) % MODES.length]
  }

  return { radiusMode, cycle }
})
