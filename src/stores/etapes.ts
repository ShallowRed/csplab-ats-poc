import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Etape } from '../types/domain'
import { seed } from '../data/seed'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const useEtapesStore = defineStore('etapes', () => {
  const etapes = ref<Etape[]>(seed.etapes.map(e => ({ ...e })))

  function load(): void {
    etapes.value = seed.etapes.map(e => ({ ...e }))
  }

  function nextId(): string {
    const nums = etapes.value
      .map(e => Number.parseInt(e.id.replace(/^etape-/, ''), 10))
      .filter(n => !Number.isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `etape-${max + 1}`
  }

  function renumeroter(): void {
    etapes.value
      .slice()
      .sort((a, b) => a.ordre - b.ordre)
      .forEach((etape, index) => {
        etape.ordre = index + 1
      })
  }

  function ajouter(libelle = 'Nouvelle étape'): Etape {
    const pipelineId = etapes.value[0]?.pipelineId ?? 'pipe-1'
    const ordre = etapes.value.length + 1
    const etape: Etape = {
      id: nextId(),
      pipelineId,
      libelle,
      ordre,
      couleur: 'csplab-status-screening',
      estTerminale: false,
      visibleKanban: true,
    }
    etapes.value.push(etape)
    return etape
  }

  function modifier(id: string, patch: Partial<Etape>): void {
    const etape = etapes.value.find(e => e.id === id)
    if (!etape) return
    if (typeof patch.libelle === 'string' && patch.code === undefined) {
      // keep code in sync if libelle changed and code not explicitly overridden
    }
    Object.assign(etape, patch)
  }

  function supprimer(id: string): void {
    const index = etapes.value.findIndex(e => e.id === id)
    if (index === -1) return
    etapes.value.splice(index, 1)
    renumeroter()
  }

  function reordonner(idsOrdonnes: string[]): void {
    const map = new Map(etapes.value.map(e => [e.id, e] as const))
    const reordered: Etape[] = []
    idsOrdonnes.forEach((id, index) => {
      const e = map.get(id)
      if (e) {
        e.ordre = index + 1
        reordered.push(e)
      }
    })
    // append any étape not present in idsOrdonnes (defensive)
    etapes.value.forEach((e) => {
      if (!idsOrdonnes.includes(e.id)) {
        e.ordre = reordered.length + 1
        reordered.push(e)
      }
    })
    etapes.value = reordered
  }

  function deplacer(id: string, direction: 'up' | 'down'): void {
    const sorted = etapes.value.slice().sort((a, b) => a.ordre - b.ordre)
    const index = sorted.findIndex(e => e.id === id)
    if (index === -1) return
    const swap = direction === 'up' ? index - 1 : index + 1
    if (swap < 0 || swap >= sorted.length) return
    const ids = sorted.map(e => e.id)
    ;[ids[index], ids[swap]] = [ids[swap], ids[index]]
    reordonner(ids)
  }

  const etapesTriees = computed<Etape[]>(() =>
    etapes.value.slice().sort((a, b) => a.ordre - b.ordre),
  )

  const etapesVisiblesKanban = computed<Etape[]>(() =>
    etapes.value.filter(e => e.visibleKanban).sort((a, b) => a.ordre - b.ordre),
  )

  return {
    etapes,
    etapesTriees,
    etapesVisiblesKanban,
    load,
    ajouter,
    modifier,
    supprimer,
    reordonner,
    deplacer,
    slugify,
  }
})
