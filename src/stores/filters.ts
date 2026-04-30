import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FiltreCandidatures } from '../types/domain'
import { seed } from '../data/seed'

export const useFiltersStore = defineStore('filters', () => {
  const filtre = ref<FiltreCandidatures>({
    offreId: null,
    etapeIds: [],
    scoreMin: null,
    dateDebut: null,
    dateFin: null,
    intervieweurIds: [],
    recherche: '',
  })

  const chipsActifs = computed(() => {
    const chips: Array<{ id: string; label: string; onRemove: () => void }> = []

    if (filtre.value.offreId) {
      const offre = seed.offres.find(o => o.id === filtre.value.offreId)
      if (offre) {
        chips.push({
          id: `offre-${filtre.value.offreId}`,
          label: `Offre: ${offre.titre}`,
          onRemove: () => setOffreId(null),
        })
      }
    }

    filtre.value.etapeIds.forEach(etapeId => {
      const etape = seed.etapes.find(e => e.id === etapeId)
      if (etape) {
        chips.push({
          id: `etape-${etapeId}`,
          label: `Étape: ${etape.libelle}`,
          onRemove: () => removeEtapeId(etapeId),
        })
      }
    })

    if (filtre.value.scoreMin !== null) {
      chips.push({
        id: 'score',
        label: `Score ≥ ${filtre.value.scoreMin}`,
        onRemove: () => setScoreMin(null),
      })
    }

    if (filtre.value.dateDebut || filtre.value.dateFin) {
      const debut = filtre.value.dateDebut ? new Date(filtre.value.dateDebut).toLocaleDateString('fr-FR') : '...'
      const fin = filtre.value.dateFin ? new Date(filtre.value.dateFin).toLocaleDateString('fr-FR') : '...'
      chips.push({
        id: 'dates',
        label: `Période: ${debut} → ${fin}`,
        onRemove: () => setDateRange(null, null),
      })
    }

    filtre.value.intervieweurIds.forEach(intId => {
      const intervieweur = seed.intervieweurs.find(i => i.id === intId)
      if (intervieweur) {
        chips.push({
          id: `int-${intId}`,
          label: `Intervieweur: ${intervieweur.prenom} ${intervieweur.nom}`,
          onRemove: () => removeIntervieweurId(intId),
        })
      }
    })

    if (filtre.value.recherche) {
      chips.push({
        id: 'recherche',
        label: `Recherche: "${filtre.value.recherche}"`,
        onRemove: () => setRecherche(''),
      })
    }

    return chips
  })

  function setOffreId(id: string | null) {
    filtre.value.offreId = id
  }

  function setEtapeIds(ids: string[]) {
    filtre.value.etapeIds = ids
  }

  function addEtapeId(id: string) {
    if (!filtre.value.etapeIds.includes(id)) {
      filtre.value.etapeIds.push(id)
    }
  }

  function removeEtapeId(id: string) {
    const index = filtre.value.etapeIds.indexOf(id)
    if (index !== -1) {
      filtre.value.etapeIds.splice(index, 1)
    }
  }

  function setScoreMin(score: number | null) {
    filtre.value.scoreMin = score
  }

  function setDateRange(debut: string | null, fin: string | null) {
    filtre.value.dateDebut = debut
    filtre.value.dateFin = fin
  }

  function setIntervieweurIds(ids: string[]) {
    filtre.value.intervieweurIds = ids
  }

  function addIntervieweurId(id: string) {
    if (!filtre.value.intervieweurIds.includes(id)) {
      filtre.value.intervieweurIds.push(id)
    }
  }

  function removeIntervieweurId(id: string) {
    const index = filtre.value.intervieweurIds.indexOf(id)
    if (index !== -1) {
      filtre.value.intervieweurIds.splice(index, 1)
    }
  }

  function setRecherche(recherche: string) {
    filtre.value.recherche = recherche
  }

  function reset() {
    filtre.value = {
      offreId: null,
      etapeIds: [],
      scoreMin: null,
      dateDebut: null,
      dateFin: null,
      intervieweurIds: [],
      recherche: '',
    }
  }

  function applyFromUrl(query: Record<string, string | string[]>) {
    if (query.offre && typeof query.offre === 'string') {
      filtre.value.offreId = query.offre
    }
    if (query.etapes) {
      filtre.value.etapeIds = Array.isArray(query.etapes) ? query.etapes : [query.etapes]
    }
    if (query.score && typeof query.score === 'string') {
      filtre.value.scoreMin = parseInt(query.score, 10)
    }
    if (query.dateDebut && typeof query.dateDebut === 'string') {
      filtre.value.dateDebut = query.dateDebut
    }
    if (query.dateFin && typeof query.dateFin === 'string') {
      filtre.value.dateFin = query.dateFin
    }
    if (query.intervieweurs) {
      filtre.value.intervieweurIds = Array.isArray(query.intervieweurs) ? query.intervieweurs : [query.intervieweurs]
    }
    if (query.q && typeof query.q === 'string') {
      filtre.value.recherche = query.q
    }
  }

  function toUrlQuery(): Record<string, string | string[]> {
    const query: Record<string, string | string[]> = {}
    if (filtre.value.offreId) query.offre = filtre.value.offreId
    if (filtre.value.etapeIds.length > 0) query.etapes = filtre.value.etapeIds
    if (filtre.value.scoreMin !== null) query.score = String(filtre.value.scoreMin)
    if (filtre.value.dateDebut) query.dateDebut = filtre.value.dateDebut
    if (filtre.value.dateFin) query.dateFin = filtre.value.dateFin
    if (filtre.value.intervieweurIds.length > 0) query.intervieweurs = filtre.value.intervieweurIds
    if (filtre.value.recherche) query.q = filtre.value.recherche
    return query
  }

  return {
    filtre,
    chipsActifs,
    setOffreId,
    setEtapeIds,
    addEtapeId,
    removeEtapeId,
    setScoreMin,
    setDateRange,
    setIntervieweurIds,
    addIntervieweurId,
    removeIntervieweurId,
    setRecherche,
    reset,
    applyFromUrl,
    toUrlQuery,
  }
})
