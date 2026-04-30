import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NouvelleOffre, Offre, OffreStatut } from '../types/domain'
import { seed } from '../data/seed'

export const ETAPES_A_TRAITER = ['etape-1', 'etape-2'] as const

export const useOffresStore = defineStore('offres', () => {
  const offres = ref<Offre[]>(seed.offres.map(o => ({ ...o })))

  function load(): void {
    offres.value = seed.offres.map(o => ({ ...o }))
  }

  function getById(id: string): Offre | undefined {
    return offres.value.find(o => o.id === id)
  }

  function nextId(): string {
    const nums = offres.value
      .map(o => Number.parseInt(o.id.replace(/^offre-/, ''), 10))
      .filter(n => !Number.isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `offre-${max + 1}`
  }

  function create(payload: NouvelleOffre): Offre {
    const offre: Offre = {
      id: nextId(),
      titre: payload.titre,
      service: payload.service ?? payload.direction,
      direction: payload.direction,
      localisation: payload.localisation,
      statut: payload.statut ?? 'brouillon',
      dateOuverture: payload.dateOuverture ?? new Date().toISOString().split('T')[0],
      pipelineId: payload.pipelineId,
      etapesIds: payload.etapesIds ? [...payload.etapesIds] : undefined,
      responsableId: payload.responsableId,
      intervieweursDefautIds: payload.intervieweursDefautIds ? [...payload.intervieweursDefautIds] : undefined,
      descriptif: payload.descriptif,
      typeContrat: payload.typeContrat,
      corps: payload.corps,
      grade: payload.grade,
    }
    offres.value.push(offre)
    return offre
  }

  function update(id: string, patch: Partial<Offre>): Offre {
    const offre = getById(id)
    if (!offre) throw new Error(`Offre ${id} introuvable`)
    Object.assign(offre, patch)
    return offre
  }

  function changeStatut(id: string, statut: OffreStatut): void {
    const offre = getById(id)
    if (!offre) return
    if ((offre.statut === 'fermee' || offre.statut === 'archivee') && statut === 'brouillon') {
      return
    }
    const previous = offre.statut
    offre.statut = statut
    if (statut === 'fermee' && !offre.dateFermeture) {
      offre.dateFermeture = new Date().toISOString().split('T')[0]
    }
    if (statut === 'ouverte' && previous !== 'ouverte') {
      offre.dateFermeture = undefined
    }
  }

  function duplicate(id: string): Offre {
    const source = getById(id)
    if (!source) throw new Error(`Offre ${id} introuvable`)
    const clone: Offre = {
      ...source,
      id: nextId(),
      titre: `${source.titre} (copie)`,
      statut: 'brouillon',
      dateOuverture: new Date().toISOString().split('T')[0],
      dateFermeture: undefined,
      etapesIds: source.etapesIds ? [...source.etapesIds] : undefined,
      intervieweursDefautIds: source.intervieweursDefautIds ? [...source.intervieweursDefautIds] : undefined,
    }
    offres.value.push(clone)
    return clone
  }

  function archive(id: string): void {
    changeStatut(id, 'archivee')
  }

  const offresVisibles = computed<Offre[]>(() =>
    offres.value.filter(o => o.statut !== 'archivee'),
  )

  const offresParStatut = computed<Map<OffreStatut, Offre[]>>(() => {
    const map = new Map<OffreStatut, Offre[]>()
    offres.value.forEach(o => {
      if (!map.has(o.statut)) map.set(o.statut, [])
      map.get(o.statut)!.push(o)
    })
    return map
  })

  function compterCandidaturesParOffre(offreId: string): { total: number; aTraiter: number } {
    const candidatures = seed.candidatures.filter(c => c.offreId === offreId)
    const aTraiter = candidatures.filter(c => (ETAPES_A_TRAITER as readonly string[]).includes(c.etapeId)).length
    return { total: candidatures.length, aTraiter }
  }

  const firstOffreId = computed<string | null>(() => {
    const visible = offresVisibles.value.find(o => o.statut === 'ouverte')
      ?? offresVisibles.value[0]
    return visible?.id ?? null
  })

  return {
    offres,
    offresVisibles,
    offresParStatut,
    firstOffreId,
    load,
    getById,
    create,
    update,
    changeStatut,
    duplicate,
    archive,
    compterCandidaturesParOffre,
  }
})
