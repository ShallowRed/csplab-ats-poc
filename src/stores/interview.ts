import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInterviewStore = defineStore('interview', () => {
  const candidatureIdOuvert = ref<string | null>(null)

  function ouvrir(candidatureId: string): void {
    candidatureIdOuvert.value = candidatureId
  }

  function fermer(): void {
    candidatureIdOuvert.value = null
  }

  return { candidatureIdOuvert, ouvrir, fermer }
})
