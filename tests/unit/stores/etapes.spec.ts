import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEtapesStore } from '../../../src/stores/etapes'
import { seed } from '../../../src/data/seed'

describe('Etapes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from seed', () => {
    const store = useEtapesStore()
    expect(store.etapes.length).toBe(seed.etapes.length)
  })

  it('ajouter places new étape at last position with coherent ordre', () => {
    const store = useEtapesStore()
    const before = store.etapes.length
    const created = store.ajouter('Mon étape')
    expect(store.etapes.length).toBe(before + 1)
    expect(created.libelle).toBe('Mon étape')
    expect(created.ordre).toBe(before + 1)
    const sorted = store.etapesTriees
    expect(sorted[sorted.length - 1].id).toBe(created.id)
  })

  it('reordonner met à jour les ordre selon idsOrdonnes', () => {
    const store = useEtapesStore()
    const ids = store.etapesTriees.map(e => e.id)
    const reversed = [...ids].reverse()
    store.reordonner(reversed)
    const sortedIds = store.etapesTriees.map(e => e.id)
    expect(sortedIds).toEqual(reversed)
    store.etapesTriees.forEach((e, idx) => {
      expect(e.ordre).toBe(idx + 1)
    })
  })

  it('deplacer up/down swaps adjacent étapes', () => {
    const store = useEtapesStore()
    const initial = store.etapesTriees.map(e => e.id)
    const second = initial[1]
    store.deplacer(second, 'up')
    expect(store.etapesTriees[0].id).toBe(second)
    store.deplacer(second, 'down')
    expect(store.etapesTriees[1].id).toBe(second)
  })

  it('supprimer renumeroter les ordre restants', () => {
    const store = useEtapesStore()
    const target = store.etapesTriees[2]
    const beforeCount = store.etapes.length
    store.supprimer(target.id)
    expect(store.etapes.length).toBe(beforeCount - 1)
    store.etapesTriees.forEach((e, idx) => {
      expect(e.ordre).toBe(idx + 1)
    })
  })

  it('etapesVisiblesKanban filters and sorts', () => {
    const store = useEtapesStore()
    const visible = store.etapesVisiblesKanban
    expect(visible.length).toBeGreaterThan(0)
    visible.forEach(e => expect(e.visibleKanban).toBe(true))
    for (let i = 1; i < visible.length; i++) {
      expect(visible[i].ordre).toBeGreaterThan(visible[i - 1].ordre)
    }
  })

  it('modifier patches an étape in place', () => {
    const store = useEtapesStore()
    const target = store.etapes[0]
    store.modifier(target.id, { libelle: 'Renommé', visibleKanban: false })
    const after = store.etapes.find(e => e.id === target.id)
    expect(after?.libelle).toBe('Renommé')
    expect(after?.visibleKanban).toBe(false)
  })

  it('slugify produces ascii dash-separated codes', () => {
    const store = useEtapesStore()
    expect(store.slugify('Entretien manager')).toBe('entretien-manager')
    expect(store.slugify('Décision finale')).toBe('decision-finale')
  })
})
