import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useIntervieweursStore } from '../../../src/stores/intervieweurs'
import { useOffresStore } from '../../../src/stores/offres'
import { seed } from '../../../src/data/seed'

describe('Intervieweurs Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from seed', () => {
    const store = useIntervieweursStore()
    expect(store.intervieweurs.length).toBe(seed.intervieweurs.length)
  })

  it('creer adds a new intervieweur with auto id', () => {
    const store = useIntervieweursStore()
    const before = store.intervieweurs.length
    const created = store.creer({
      nom: 'Test',
      prenom: 'Alice',
      email: 'a@example.com',
      role: 'rh',
    })
    expect(store.intervieweurs.length).toBe(before + 1)
    expect(created.id).toMatch(/^int-/)
    expect(store.getById(created.id)).toEqual(created)
  })

  it('modifier patches an intervieweur in place', () => {
    const store = useIntervieweursStore()
    const target = store.intervieweurs[0]
    store.modifier(target.id, { equipe: 'Pôle data' })
    expect(store.intervieweurs.find(i => i.id === target.id)?.equipe).toBe('Pôle data')
  })

  it('supprimer removes an intervieweur by id', () => {
    const store = useIntervieweursStore()
    const target = store.intervieweurs[store.intervieweurs.length - 1]
    store.supprimer(target.id)
    expect(store.intervieweurs.find(i => i.id === target.id)).toBeUndefined()
  })

  it('isUsedByOffre returns true if intervieweur is responsable or in intervieweursDefautIds', () => {
    useOffresStore() // hydrate
    const store = useIntervieweursStore()
    const offresStore = useOffresStore()
    const offreWithResponsable = offresStore.offres.find(o => o.responsableId)
    expect(offreWithResponsable).toBeDefined()
    expect(store.isUsedByOffre(offreWithResponsable!.responsableId!)).toBe(true)

    const offreWithDefaut = offresStore.offres.find(o => (o.intervieweursDefautIds?.length ?? 0) > 0)
    expect(offreWithDefaut).toBeDefined()
    expect(store.isUsedByOffre(offreWithDefaut!.intervieweursDefautIds![0])).toBe(true)
  })

  it('isUsedByOffre returns false for an unused intervieweur', () => {
    useOffresStore()
    const store = useIntervieweursStore()
    const created = store.creer({
      nom: 'Orphan',
      prenom: 'Jane',
      email: 'j@example.com',
      role: 'expert',
    })
    expect(store.isUsedByOffre(created.id)).toBe(false)
  })
})
