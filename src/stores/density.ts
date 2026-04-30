import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { DensiteAffichage } from '../types/domain'

const STORAGE_KEY = 'csplab.density'

export const useDensityStore = defineStore('density', () => {
  const densite = ref<DensiteAffichage>(loadFromStorage())

  watch(densite, (newValue) => {
    localStorage.setItem(STORAGE_KEY, newValue)
  })

  function set(d: DensiteAffichage) {
    densite.value = d
  }

  function loadFromStorage(): DensiteAffichage {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'compact' || stored === 'comfortable') {
      return stored
    }
    return 'default'
  }

  return {
    densite,
    set,
  }
})
