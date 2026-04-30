import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCandidaturesStore } from '../../../src/stores/candidatures'
import { mockApi } from '../../../src/lib/mockApi'

vi.mock('../../../src/stores/toast', () => ({
  useToastStore: vi.fn(() => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })),
}))

describe('Candidatures Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockApi.reset()
  })

  it('should load candidatures', async () => {
    const store = useCandidaturesStore()
    expect(store.candidatures).toHaveLength(0)

    await store.chargerCandidatures()

    expect(store.candidatures.length).toBeGreaterThan(0)
    expect(store.chargement).toBe(false)
    expect(store.erreur).toBe(null)
  })

  it('should group candidatures by offre', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const parOffre = store.parOffre
    expect(parOffre.size).toBeGreaterThan(0)

    parOffre.forEach((candidatures, offreId) => {
      candidatures.forEach(c => {
        expect(c.offreId).toBe(offreId)
      })
    })
  })

  it('should group candidatures by etape', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const parEtape = store.parEtape
    expect(parEtape.size).toBeGreaterThan(0)

    parEtape.forEach((candidatures, etapeId) => {
      candidatures.forEach(c => {
        expect(c.etapeId).toBe(etapeId)
      })
    })
  })

  it('should change etape successfully', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures[0]

    await store.changerEtape(candidature.id, 'etape-2')

    expect(candidature.etapeId).toBe('etape-2')
  })

  it('should rollback etape change on failure', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures[0]
    const _originalEtapeId = candidature.etapeId

    mockApi.failNext()
    await store.changerEtape(candidature.id, 'etape-2')

    expect(candidature.etapeId).toBe(_originalEtapeId)
  })

  it('should add tag successfully', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures[0]

    await store.ajouterTag(candidature.id, 'test-tag')

    expect(candidature.tags).toContain('test-tag')
  })

  it('should rollback tag add on failure', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures[0]
    const originalTags = [...candidature.tags]

    mockApi.failNext()
    await store.ajouterTag(candidature.id, 'test-tag')

    expect(candidature.tags).toEqual(originalTags)
  })

  it('should remove tag successfully', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures.find(c => c.tags.length > 0)
    if (!candidature) return

    const tagToRemove = candidature.tags[0]
    await store.retirerTag(candidature.id, tagToRemove)

    expect(candidature.tags).not.toContain(tagToRemove)
  })

  it('should rollback tag removal on failure', async () => {
    const store = useCandidaturesStore()
    await store.chargerCandidatures()

    const candidature = store.candidatures.find(c => c.tags.length > 0)
    if (!candidature) return

    const originalTags = [...candidature.tags]
    const tagToRemove = candidature.tags[0]

    mockApi.failNext()
    await store.retirerTag(candidature.id, tagToRemove)

    expect(candidature.tags).toEqual(originalTags)
  })
})
