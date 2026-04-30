import { defineStore } from 'pinia'
import { ref } from 'vue'

type OngletDrawer = 'profil' | 'activite' | 'entretiens' | 'documents'

export const useDrawerStore = defineStore('drawer', () => {
  const candidatureIdOuvert = ref<string | null>(null)
  const ongletActif = ref<OngletDrawer>('profil')
  const pleinEcran = ref(false)

  function ouvrir(id: string) {
    candidatureIdOuvert.value = id
    ongletActif.value = 'profil'
  }

  function fermer() {
    candidatureIdOuvert.value = null
  }

  function setOnglet(onglet: OngletDrawer) {
    ongletActif.value = onglet
  }

  function togglePleinEcran() {
    pleinEcran.value = !pleinEcran.value
  }

  function naviguerSuivant(idsListeFiltree: string[]) {
    if (!candidatureIdOuvert.value) return
    const index = idsListeFiltree.indexOf(candidatureIdOuvert.value)
    if (index !== -1 && index < idsListeFiltree.length - 1) {
      candidatureIdOuvert.value = idsListeFiltree[index + 1]
      ongletActif.value = 'profil'
    }
  }

  function naviguerPrecedent(idsListeFiltree: string[]) {
    if (!candidatureIdOuvert.value) return
    const index = idsListeFiltree.indexOf(candidatureIdOuvert.value)
    if (index > 0) {
      candidatureIdOuvert.value = idsListeFiltree[index - 1]
      ongletActif.value = 'profil'
    }
  }

  return {
    candidatureIdOuvert,
    ongletActif,
    pleinEcran,
    ouvrir,
    fermer,
    setOnglet,
    togglePleinEcran,
    naviguerSuivant,
    naviguerPrecedent,
  }
})
