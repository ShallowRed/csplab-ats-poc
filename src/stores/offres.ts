import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Offre } from '../types/domain'
import { seed } from '../data/seed'

export const useOffresStore = defineStore('offres', () => {
  const offres = ref<Offre[]>([...seed.offres])

  const firstOffreId = computed(() => offres.value[0]?.id ?? null)

  return {
    offres,
    firstOffreId,
  }
})
