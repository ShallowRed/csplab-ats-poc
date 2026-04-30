import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMotifsRefusStore } from '../../../src/stores/motifsRefus'
import { seed } from '../../../src/data/seed'

describe('MotifsRefus Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from seed', () => {
    const store = useMotifsRefusStore()
    expect(store.motifs.length).toBe(seed.motifsRefus.length)
  })

  it('ajouter creates a motif with default values', () => {
    const store = useMotifsRefusStore()
    const before = store.motifs.length
    const created = store.ajouter('Test motif', 'Texte type')
    expect(store.motifs.length).toBe(before + 1)
    expect(created.libelle).toBe('Test motif')
    expect(created.texteType).toBe('Texte type')
    expect(created.id).toMatch(/^motif-/)
  })

  it('modifier patches a motif in place', () => {
    const store = useMotifsRefusStore()
    const target = store.motifs[0]
    store.modifier(target.id, { libelle: 'Nouveau libellé' })
    expect(store.motifs.find(m => m.id === target.id)?.libelle).toBe('Nouveau libellé')
  })

  it('supprimer removes a motif by id', () => {
    const store = useMotifsRefusStore()
    const target = store.motifs[0]
    store.supprimer(target.id)
    expect(store.motifs.find(m => m.id === target.id)).toBeUndefined()
  })
})
