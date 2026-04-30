import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MotifRefus } from '../types/domain'
import { seed } from '../data/seed'

export const useMotifsRefusStore = defineStore('motifsRefus', () => {
  const motifs = ref<MotifRefus[]>(seed.motifsRefus.map(m => ({ ...m })))

  function load(): void {
    motifs.value = seed.motifsRefus.map(m => ({ ...m }))
  }

  function nextId(): string {
    const nums = motifs.value
      .map(m => Number.parseInt(m.id.replace(/^motif-/, ''), 10))
      .filter(n => !Number.isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `motif-${max + 1}`
  }

  function ajouter(libelle = 'Nouveau motif', texteType = ''): MotifRefus {
    const motif: MotifRefus = { id: nextId(), libelle, texteType }
    motifs.value.push(motif)
    return motif
  }

  function modifier(id: string, patch: Partial<MotifRefus>): void {
    const motif = motifs.value.find(m => m.id === id)
    if (!motif) return
    Object.assign(motif, patch)
  }

  function supprimer(id: string): void {
    const index = motifs.value.findIndex(m => m.id === id)
    if (index === -1) return
    motifs.value.splice(index, 1)
  }

  return { motifs, load, ajouter, modifier, supprimer }
})
