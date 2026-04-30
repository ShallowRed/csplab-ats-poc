import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Entretien } from '../types/domain'
import { seed } from '../data/seed'

export const useEntretiensStore = defineStore('entretiens', () => {
  const entretiens = ref<Entretien[]>(seed.entretiens.map(e => ({ ...e })))

  function load(): void {
    entretiens.value = seed.entretiens.map(e => ({ ...e }))
  }

  function getById(id: string): Entretien | undefined {
    return entretiens.value.find(e => e.id === id)
  }

  const aVenir = computed<Entretien[]>(() =>
    entretiens.value
      .filter(e => e.statut === 'planifie')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  )

  const realises = computed<Entretien[]>(() =>
    entretiens.value
      .filter(e => e.statut === 'realise')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

  function aEvaluation(entretienId: string): boolean {
    return seed.evaluations.some(ev => ev.entretienId === entretienId)
  }

  return {
    entretiens,
    aVenir,
    realises,
    load,
    getById,
    aEvaluation,
  }
})
