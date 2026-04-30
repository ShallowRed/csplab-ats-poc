import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFiltersStore } from '../../../src/stores/filters'

describe('Filters Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty filters', () => {
    const store = useFiltersStore()
    
    expect(store.filtre.offreId).toBe(null)
    expect(store.filtre.etapeIds).toEqual([])
    expect(store.filtre.scoreMin).toBe(null)
    expect(store.filtre.dateDebut).toBe(null)
    expect(store.filtre.dateFin).toBe(null)
    expect(store.filtre.intervieweurIds).toEqual([])
    expect(store.filtre.recherche).toBe('')
  })

  it('should set offre filter', () => {
    const store = useFiltersStore()
    store.setOffreId('offre-1')
    
    expect(store.filtre.offreId).toBe('offre-1')
  })

  it('should add and remove etape filters', () => {
    const store = useFiltersStore()
    
    store.addEtapeId('etape-1')
    expect(store.filtre.etapeIds).toContain('etape-1')
    
    store.addEtapeId('etape-2')
    expect(store.filtre.etapeIds).toHaveLength(2)
    
    store.removeEtapeId('etape-1')
    expect(store.filtre.etapeIds).not.toContain('etape-1')
    expect(store.filtre.etapeIds).toContain('etape-2')
  })

  it('should set score filter', () => {
    const store = useFiltersStore()
    store.setScoreMin(3)
    
    expect(store.filtre.scoreMin).toBe(3)
  })

  it('should set date range', () => {
    const store = useFiltersStore()
    store.setDateRange('2026-01-01', '2026-04-30')
    
    expect(store.filtre.dateDebut).toBe('2026-01-01')
    expect(store.filtre.dateFin).toBe('2026-04-30')
  })

  it('should generate active chips', () => {
    const store = useFiltersStore()
    
    store.setOffreId('offre-1')
    store.addEtapeId('etape-1')
    store.setScoreMin(2)
    
    const chips = store.chipsActifs
    expect(chips.length).toBeGreaterThan(0)
    
    const offreChip = chips.find(c => c.id.startsWith('offre-'))
    expect(offreChip).toBeDefined()
    
    const etapeChip = chips.find(c => c.id.startsWith('etape-'))
    expect(etapeChip).toBeDefined()
    
    const scoreChip = chips.find(c => c.id === 'score')
    expect(scoreChip).toBeDefined()
  })

  it('should remove filters via chips', () => {
    const store = useFiltersStore()
    
    store.setOffreId('offre-1')
    store.addEtapeId('etape-1')
    
    const chips = store.chipsActifs
    const offreChip = chips.find(c => c.id.startsWith('offre-'))
    
    offreChip?.onRemove()
    expect(store.filtre.offreId).toBe(null)
  })

  it('should reset all filters', () => {
    const store = useFiltersStore()
    
    store.setOffreId('offre-1')
    store.addEtapeId('etape-1')
    store.setScoreMin(3)
    store.setRecherche('test')
    
    store.reset()
    
    expect(store.filtre.offreId).toBe(null)
    expect(store.filtre.etapeIds).toEqual([])
    expect(store.filtre.scoreMin).toBe(null)
    expect(store.filtre.recherche).toBe('')
  })

  it('should serialize to URL query', () => {
    const store = useFiltersStore()
    
    store.setOffreId('offre-1')
    store.addEtapeId('etape-1')
    store.addEtapeId('etape-2')
    store.setScoreMin(3)
    store.setRecherche('test search')
    
    const query = store.toUrlQuery()
    
    expect(query.offre).toBe('offre-1')
    expect(query.etapes).toEqual(['etape-1', 'etape-2'])
    expect(query.score).toBe('3')
    expect(query.q).toBe('test search')
  })

  it('should deserialize from URL query', () => {
    const store = useFiltersStore()
    
    const query = {
      offre: 'offre-1',
      etapes: ['etape-1', 'etape-2'],
      score: '3',
      dateDebut: '2026-01-01',
      dateFin: '2026-04-30',
      q: 'test',
    }
    
    store.applyFromUrl(query)
    
    expect(store.filtre.offreId).toBe('offre-1')
    expect(store.filtre.etapeIds).toEqual(['etape-1', 'etape-2'])
    expect(store.filtre.scoreMin).toBe(3)
    expect(store.filtre.dateDebut).toBe('2026-01-01')
    expect(store.filtre.dateFin).toBe('2026-04-30')
    expect(store.filtre.recherche).toBe('test')
  })

  it('should handle single etape in URL query', () => {
    const store = useFiltersStore()
    
    const query = {
      etapes: 'etape-1',
    }
    
    store.applyFromUrl(query)
    
    expect(store.filtre.etapeIds).toEqual(['etape-1'])
  })
})
