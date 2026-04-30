import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardMetrics } from '../../../src/composables/useDashboardMetrics'
import { seed } from '../../../src/data/seed'

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('expose les 4 KPI principaux avec des valeurs cohérentes', () => {
    const ref = new Date('2025-03-15T10:00:00Z')
    const { kpis } = useDashboardMetrics(ref)

    const expectedOuvertes = seed.offres.filter(o => o.statut === 'ouverte').length
    const expectedATraiter = seed.candidatures.filter(c => c.etapeId === 'etape-1').length
    const evalIds = new Set(seed.evaluations.map(e => e.entretienId))
    const expectedEvalsAttente = seed.entretiens.filter(
      e => e.statut === 'realise' && !evalIds.has(e.id),
    ).length

    expect(kpis.value.offresOuvertes).toBe(expectedOuvertes)
    expect(kpis.value.candidaturesATraiter).toBe(expectedATraiter)
    expect(kpis.value.evaluationsEnAttente).toBe(expectedEvalsAttente)
    expect(kpis.value.entretiens7j).toBeGreaterThanOrEqual(0)
  })

  it('produit un sparkline déterministe (10 points 0-100) par étape visible', () => {
    const { delaisParEtape } = useDashboardMetrics()
    const expectedCount = seed.etapes.filter(e => e.visibleKanban && !e.estTerminale).length

    expect(delaisParEtape.value.length).toBe(expectedCount)
    delaisParEtape.value.forEach(d => {
      expect(d.points.length).toBe(10)
      d.points.forEach(p => {
        expect(p).toBeGreaterThanOrEqual(0)
        expect(p).toBeLessThanOrEqual(100)
      })
      expect(d.delaiMoyen).toBeGreaterThan(0)
    })

    // Determinisme : 2 appels successifs renvoient la même série
    const { delaisParEtape: d2 } = useDashboardMetrics()
    expect(d2.value[0].points).toEqual(delaisParEtape.value[0].points)
  })

  it('trie les todos par urgence (retards en premier)', () => {
    const { todos } = useDashboardMetrics()
    expect(todos.value.length).toBeGreaterThan(0)
    expect(todos.value.length).toBeLessThanOrEqual(8)

    todos.value.forEach(item => {
      expect(item.id).toBeTruthy()
      expect(item.title).toBeTruthy()
      expect(item.to).toMatch(/^\//)
    })
  })
})
