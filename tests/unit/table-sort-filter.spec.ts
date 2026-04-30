import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import { useDensityStore } from '@/stores/density'
import { useSelectionStore } from '@/stores/selection'
import type { Candidature } from '@/types/domain'

function makeCandidature(overrides: Partial<Candidature> = {}): Candidature {
  return {
    id: 'cand-1',
    offreId: 'offre-1',
    candidatId: 'candidat-1',
    etapeId: 'etape-1',
    dateCandidat: '2026-01-15',
    score: 3,
    assigneA: 'int-1',
    tags: ['tag-a', 'tag-b'],
    derniereActivite: '2026-01-20',
    ...overrides,
  }
}

function applyFilters(
  candidatures: Candidature[],
  filtre: { etapeIds: string[]; scoreMin: number | null; intervieweurIds: string[]; recherche: string },
  candidatsById: Map<string, { prenom: string; nom: string }>,
): Candidature[] {
  return candidatures.filter(c => {
    if (filtre.etapeIds.length > 0 && !filtre.etapeIds.includes(c.etapeId)) return false
    if (filtre.scoreMin !== null && (c.score ?? 0) < filtre.scoreMin) return false
    if (filtre.intervieweurIds.length > 0) {
      if (!c.assigneA || !filtre.intervieweurIds.includes(c.assigneA)) return false
    }
    if (filtre.recherche) {
      const q = filtre.recherche.toLowerCase()
      const candidat = candidatsById.get(c.candidatId)
      const name = candidat ? `${candidat.prenom} ${candidat.nom}`.toLowerCase() : ''
      if (!name.includes(q)) return false
    }
    return true
  })
}

const candidatsById = new Map([
  ['candidat-1', { prenom: 'Alice', nom: 'Martin' }],
  ['candidat-2', { prenom: 'Bob', nom: 'Dupont' }],
  ['candidat-3', { prenom: 'Claire', nom: 'Lefebvre' }],
])

describe('table filtering logic', () => {
  const candidatures = [
    makeCandidature({ id: 'c1', candidatId: 'candidat-1', etapeId: 'etape-1', score: 3, assigneA: 'int-1' }),
    makeCandidature({ id: 'c2', candidatId: 'candidat-2', etapeId: 'etape-2', score: 1, assigneA: 'int-2' }),
    makeCandidature({ id: 'c3', candidatId: 'candidat-3', etapeId: 'etape-1', score: 4, assigneA: 'int-1' }),
  ]

  const noFiltre = { etapeIds: [], scoreMin: null, intervieweurIds: [], recherche: '' }

  it('returns all candidatures when no filter active', () => {
    const result = applyFilters(candidatures, noFiltre, candidatsById)
    expect(result).toHaveLength(3)
  })

  it('filters by etape', () => {
    const result = applyFilters(candidatures, { ...noFiltre, etapeIds: ['etape-1'] }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c1', 'c3'])
  })

  it('filters by multiple etapes', () => {
    const result = applyFilters(candidatures, { ...noFiltre, etapeIds: ['etape-1', 'etape-2'] }, candidatsById)
    expect(result).toHaveLength(3)
  })

  it('filters by scoreMin', () => {
    const result = applyFilters(candidatures, { ...noFiltre, scoreMin: 3 }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c1', 'c3'])
  })

  it('excludes candidature with score below min', () => {
    const result = applyFilters(candidatures, { ...noFiltre, scoreMin: 4 }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c3'])
  })

  it('filters by intervieweur assigné', () => {
    const result = applyFilters(candidatures, { ...noFiltre, intervieweurIds: ['int-2'] }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c2'])
  })

  it('filters by recherche (nom candidat)', () => {
    const result = applyFilters(candidatures, { ...noFiltre, recherche: 'alice' }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c1'])
  })

  it('recherche is case-insensitive', () => {
    const result = applyFilters(candidatures, { ...noFiltre, recherche: 'DUPONT' }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c2'])
  })

  it('combines etape + score filters', () => {
    const result = applyFilters(candidatures, { ...noFiltre, etapeIds: ['etape-1'], scoreMin: 4 }, candidatsById)
    expect(result.map(c => c.id)).toEqual(['c3'])
  })

  it('returns empty when no match', () => {
    const result = applyFilters(candidatures, { ...noFiltre, recherche: 'zzz-aucun' }, candidatsById)
    expect(result).toHaveLength(0)
  })
})

describe('table sorting logic', () => {
  function sortByField<T extends Record<string, unknown>>(
    items: T[],
    key: keyof T,
    desc = false,
  ): T[] {
    return [...items].sort((a, b) => {
      const va = a[key]
      const vb = b[key]
      let cmp = 0
      if (typeof va === 'string' && typeof vb === 'string') {
        cmp = va.localeCompare(vb, 'fr')
      } else if (typeof va === 'number' && typeof vb === 'number') {
        cmp = va - vb
      }
      return desc ? -cmp : cmp
    })
  }

  it('sorts by date ascending', () => {
    const rows = [
      { dateCandidat: '2026-03-01' },
      { dateCandidat: '2026-01-15' },
      { dateCandidat: '2026-02-10' },
    ]
    const sorted = sortByField(rows, 'dateCandidat')
    expect(sorted.map(r => r.dateCandidat)).toEqual(['2026-01-15', '2026-02-10', '2026-03-01'])
  })

  it('sorts by date descending', () => {
    const rows = [
      { dateCandidat: '2026-03-01' },
      { dateCandidat: '2026-01-15' },
      { dateCandidat: '2026-02-10' },
    ]
    const sorted = sortByField(rows, 'dateCandidat', true)
    expect(sorted.map(r => r.dateCandidat)).toEqual(['2026-03-01', '2026-02-10', '2026-01-15'])
  })

  it('sorts by score ascending', () => {
    const rows = [{ score: 3 }, { score: 1 }, { score: 4 }, { score: 2 }]
    const sorted = sortByField(rows, 'score')
    expect(sorted.map(r => r.score)).toEqual([1, 2, 3, 4])
  })

  it('sorts by nom ascending', () => {
    const rows = [{ nom: 'Martin' }, { nom: 'Dupont' }, { nom: 'Lefebvre' }]
    const sorted = sortByField(rows, 'nom')
    expect(sorted.map(r => r.nom)).toEqual(['Dupont', 'Lefebvre', 'Martin'])
  })
})

describe('density store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('defaults to "default" density', () => {
    const store = useDensityStore()
    expect(store.densite).toBe('default')
  })

  it('sets density to compact', () => {
    const store = useDensityStore()
    store.set('compact')
    expect(store.densite).toBe('compact')
  })

  it('sets density to comfortable', () => {
    const store = useDensityStore()
    store.set('comfortable')
    expect(store.densite).toBe('comfortable')
  })
})

describe('selection store — shift-click range', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('selects a range forward', () => {
    const store = useSelectionStore()
    const ids = ['a', 'b', 'c', 'd', 'e']
    store.selectRange('b', 'd', ids)
    expect(store.isSelected('a')).toBe(false)
    expect(store.isSelected('b')).toBe(true)
    expect(store.isSelected('c')).toBe(true)
    expect(store.isSelected('d')).toBe(true)
    expect(store.isSelected('e')).toBe(false)
  })

  it('selects a range in reverse', () => {
    const store = useSelectionStore()
    const ids = ['a', 'b', 'c', 'd', 'e']
    store.selectRange('d', 'b', ids)
    expect(store.isSelected('b')).toBe(true)
    expect(store.isSelected('c')).toBe(true)
    expect(store.isSelected('d')).toBe(true)
    expect(store.count).toBe(3)
  })

  it('single-item range selects only that item', () => {
    const store = useSelectionStore()
    const ids = ['a', 'b', 'c']
    store.selectRange('b', 'b', ids)
    expect(store.count).toBe(1)
    expect(store.isSelected('b')).toBe(true)
  })

  it('adds to existing selection on range', () => {
    const store = useSelectionStore()
    const ids = ['a', 'b', 'c', 'd']
    store.toggle('a')
    store.selectRange('c', 'd', ids)
    expect(store.isSelected('a')).toBe(true)
    expect(store.isSelected('c')).toBe(true)
    expect(store.isSelected('d')).toBe(true)
    expect(store.count).toBe(3)
  })
})
