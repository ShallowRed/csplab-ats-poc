import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTemplatesStore } from '../../../src/stores/templates'
import { seed } from '../../../src/data/seed'

describe('Templates Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hydrates from seed', () => {
    const store = useTemplatesStore()
    expect(store.templates.length).toBe(seed.templates.length)
  })

  it('creer adds a new template', () => {
    const store = useTemplatesStore()
    const before = store.templates.length
    const created = store.creer('Test', 'Sujet', 'Corps')
    expect(store.templates.length).toBe(before + 1)
    expect(created.id).toMatch(/^tpl-/)
    expect(store.isOriginal(created.id)).toBe(false)
  })

  it('modifier puis reinitialiser revient au snapshot original', () => {
    const store = useTemplatesStore()
    const target = store.templates[0]
    const originalNom = target.nom
    const originalSujet = target.sujet
    store.modifier(target.id, { nom: 'Modifié', sujet: 'Modifié sujet' })
    const modified = store.templates.find(t => t.id === target.id)!
    expect(modified.nom).toBe('Modifié')
    store.reinitialiser(target.id)
    const reset = store.templates.find(t => t.id === target.id)!
    expect(reset.nom).toBe(originalNom)
    expect(reset.sujet).toBe(originalSujet)
  })

  it('supprimer removes a template by id', () => {
    const store = useTemplatesStore()
    const target = store.templates[0]
    store.supprimer(target.id)
    expect(store.templates.find(t => t.id === target.id)).toBeUndefined()
  })

  it('reinitialiser is a no-op for non-original templates', () => {
    const store = useTemplatesStore()
    const created = store.creer('Custom', 'Sujet', 'Corps')
    store.modifier(created.id, { nom: 'Renommé' })
    store.reinitialiser(created.id)
    // No snapshot existed → values stay as-is
    expect(store.templates.find(t => t.id === created.id)?.nom).toBe('Renommé')
  })
})
