import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOffresStore, ETAPES_A_TRAITER } from '../../../src/stores/offres'
import { seed } from '../../../src/data/seed'

describe('Offres Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from seed', () => {
    const store = useOffresStore()
    expect(store.offres.length).toBe(seed.offres.length)
  })

  it('exposes offresVisibles excluding archivees', () => {
    const store = useOffresStore()
    const first = store.offres[0]
    store.archive(first.id)
    expect(store.offresVisibles.find(o => o.id === first.id)).toBeUndefined()
    expect(store.offres.find(o => o.id === first.id)?.statut).toBe('archivee')
  })

  it('firstOffreId prefers ouverte status', () => {
    const store = useOffresStore()
    const id = store.firstOffreId
    expect(id).toBeTruthy()
    const offre = store.getById(id!)
    expect(offre?.statut).toBe('ouverte')
  })

  it('create returns a new offre with brouillon status by default', () => {
    const store = useOffresStore()
    const before = store.offres.length
    const created = store.create({
      titre: 'Test offre',
      service: 'DGAFP',
      direction: 'DGAFP',
      localisation: 'Paris 7e',
      pipelineId: seed.pipelines[0].id,
      typeContrat: 'titulaire',
    })
    expect(created.id).toMatch(/^offre-/)
    expect(created.statut).toBe('brouillon')
    expect(store.offres.length).toBe(before + 1)
    expect(store.getById(created.id)).toEqual(created)
  })

  it('changeStatut to fermee sets dateFermeture', () => {
    const store = useOffresStore()
    const ouverte = store.offres.find(o => o.statut === 'ouverte')!
    expect(ouverte.dateFermeture).toBeUndefined()
    store.changeStatut(ouverte.id, 'fermee')
    expect(ouverte.statut).toBe('fermee')
    expect(ouverte.dateFermeture).toBeDefined()
  })

  it('changeStatut blocks regression from fermee/archivee to brouillon', () => {
    const store = useOffresStore()
    const offre = store.offres.find(o => o.statut === 'fermee')!
    store.changeStatut(offre.id, 'brouillon')
    expect(offre.statut).toBe('fermee')
  })

  it('changeStatut from fermee back to ouverte clears dateFermeture', () => {
    const store = useOffresStore()
    const offre = store.offres.find(o => o.statut === 'ouverte')!
    store.changeStatut(offre.id, 'fermee')
    expect(offre.dateFermeture).toBeDefined()
    store.changeStatut(offre.id, 'ouverte')
    expect(offre.dateFermeture).toBeUndefined()
  })

  it('duplicate creates an independent brouillon copy with " (copie)" suffix', () => {
    const store = useOffresStore()
    const source = store.offres[1]
    const copy = store.duplicate(source.id)
    expect(copy.id).not.toBe(source.id)
    expect(copy.titre).toBe(`${source.titre} (copie)`)
    expect(copy.statut).toBe('brouillon')
    expect(copy.dateFermeture).toBeUndefined()
    if (source.etapesIds) {
      expect(copy.etapesIds).not.toBe(source.etapesIds)
      expect(copy.etapesIds).toEqual(source.etapesIds)
    }
    if (source.intervieweursDefautIds) {
      expect(copy.intervieweursDefautIds).not.toBe(source.intervieweursDefautIds)
    }
  })

  it('archive sets statut to archivee', () => {
    const store = useOffresStore()
    const offre = store.offres[0]
    store.archive(offre.id)
    expect(offre.statut).toBe('archivee')
  })

  it('compterCandidaturesParOffre returns total and aTraiter counts', () => {
    const store = useOffresStore()
    const target = seed.candidatures[0]
    if (!target) return
    const counts = store.compterCandidaturesParOffre(target.offreId)
    expect(counts.total).toBeGreaterThan(0)
    const expectedATraiter = seed.candidatures.filter(
      c => c.offreId === target.offreId && (ETAPES_A_TRAITER as readonly string[]).includes(c.etapeId),
    ).length
    expect(counts.aTraiter).toBe(expectedATraiter)
  })

  it('update applies a partial patch', () => {
    const store = useOffresStore()
    const offre = store.offres[0]
    store.update(offre.id, { titre: 'Renommé' })
    expect(store.getById(offre.id)?.titre).toBe('Renommé')
  })
})
