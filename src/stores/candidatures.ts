import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockApi } from '../lib/mockApi'
import type { Candidature } from '../types/domain'
import { useToastStore } from './toast'

export const useCandidaturesStore = defineStore('candidatures', () => {
  const candidatures = ref<Candidature[]>([])
  const chargement = ref(false)
  const erreur = ref<string | null>(null)
  const toast = useToastStore()

  const parOffre = computed(() => {
    const map = new Map<string, Candidature[]>()
    candidatures.value.forEach(c => {
      if (!map.has(c.offreId)) map.set(c.offreId, [])
      map.get(c.offreId)!.push(c)
    })
    return map
  })

  const parEtape = computed(() => {
    const map = new Map<string, Candidature[]>()
    candidatures.value.forEach(c => {
      if (!map.has(c.etapeId)) map.set(c.etapeId, [])
      map.get(c.etapeId)!.push(c)
    })
    return map
  })

  async function chargerCandidatures(offreId?: string) {
    chargement.value = true
    erreur.value = null
    try {
      const filtre = offreId ? { offreId, etapeIds: [], scoreMin: null, dateDebut: null, dateFin: null, intervieweurIds: [], recherche: '' } : undefined
      candidatures.value = await mockApi.listCandidatures(filtre)
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : 'Erreur de chargement'
      toast.error('Échec du chargement des candidatures')
    } finally {
      chargement.value = false
    }
  }

  async function changerEtape(candidatureId: string, etapeId: string, motif?: string) {
    const candidature = candidatures.value.find(c => c.id === candidatureId)
    if (!candidature) return

    const ancienneEtapeId = candidature.etapeId
    candidature.etapeId = etapeId
    candidature.derniereActivite = new Date().toISOString()

    try {
      await mockApi.changerEtape(candidatureId, etapeId, motif)
      toast.success('Étape modifiée', {
        undo: async () => {
          candidature.etapeId = ancienneEtapeId
          await mockApi.changerEtape(candidatureId, ancienneEtapeId, 'Annulation')
        }
      })
    } catch {
      candidature.etapeId = ancienneEtapeId
      toast.error('Échec du changement d\'étape')
    }
  }

  async function ajouterTag(candidatureId: string, tag: string) {
    const candidature = candidatures.value.find(c => c.id === candidatureId)
    if (!candidature || candidature.tags.includes(tag)) return

    candidature.tags.push(tag)
    candidature.derniereActivite = new Date().toISOString()

    try {
      await mockApi.ajouterTag(candidatureId, tag)
      toast.success(`Tag "${tag}" ajouté`, {
        undo: async () => {
          const index = candidature.tags.indexOf(tag)
          if (index !== -1) candidature.tags.splice(index, 1)
          await mockApi.retirerTag(candidatureId, tag)
        }
      })
    } catch {
      const index = candidature.tags.indexOf(tag)
      if (index !== -1) candidature.tags.splice(index, 1)
      toast.error('Échec de l\'ajout du tag')
    }
  }

  async function retirerTag(candidatureId: string, tag: string) {
    const candidature = candidatures.value.find(c => c.id === candidatureId)
    if (!candidature) return

    const index = candidature.tags.indexOf(tag)
    if (index === -1) return

    candidature.tags.splice(index, 1)
    candidature.derniereActivite = new Date().toISOString()

    try {
      await mockApi.retirerTag(candidatureId, tag)
      toast.success(`Tag "${tag}" retiré`, {
        undo: async () => {
          candidature.tags.push(tag)
          await mockApi.ajouterTag(candidatureId, tag)
        }
      })
    } catch {
      candidature.tags.push(tag)
      toast.error('Échec du retrait du tag')
    }
  }

  return {
    candidatures,
    chargement,
    erreur,
    parOffre,
    parEtape,
    chargerCandidatures,
    changerEtape,
    ajouterTag,
    retirerTag,
  }
})
