import { describe, it, expect } from 'vitest'
import { seed } from '../../../src/data/seed'
import { createSeededFaker } from '../../../src/data/factories'

describe('Seed Data', () => {
  it('should be deterministic', () => {
    expect(seed.candidats[0].nom).toBe(seed.candidats[0].nom)
    expect(seed.offres[0].titre).toBe(seed.offres[0].titre)
  })

  it('should generate expected number of entities', () => {
    expect(seed.pipelines).toHaveLength(1)
    expect(seed.etapes).toHaveLength(8)
    expect(seed.offres).toHaveLength(5)
    expect(seed.candidats).toHaveLength(60)
    expect(seed.candidatures).toHaveLength(60)
    expect(seed.intervieweurs).toHaveLength(8)
    expect(seed.modelesEvaluation).toHaveLength(3)
    expect(seed.entretiens).toHaveLength(30)
    expect(seed.evaluations).toHaveLength(20)
    expect(seed.evenements.length).toBeGreaterThan(100)
  })

  it('should have pyramidal distribution of candidatures', () => {
    const distribution = new Map<string, number>()
    seed.candidatures.forEach(c => {
      distribution.set(c.etapeId, (distribution.get(c.etapeId) || 0) + 1)
    })

    expect(distribution.get('etape-1')).toBe(25)
    expect(distribution.get('etape-2')).toBe(15)
    expect(distribution.get('etape-3')).toBe(10)
    expect(distribution.get('etape-4')).toBe(5)
    expect(distribution.get('etape-5')).toBe(3)
    expect(distribution.get('etape-6')).toBe(1)
    expect(distribution.get('etape-7')).toBe(1)
  })

  it('should have referential integrity - no orphan candidatIds', () => {
    const candidatIds = new Set(seed.candidats.map(c => c.id))
    seed.candidatures.forEach(cand => {
      expect(candidatIds.has(cand.candidatId)).toBe(true)
    })
  })

  it('should have referential integrity - no orphan etapeIds', () => {
    const etapeIds = new Set(seed.etapes.map(e => e.id))
    seed.candidatures.forEach(cand => {
      expect(etapeIds.has(cand.etapeId)).toBe(true)
    })
  })

  it('should have referential integrity - no orphan offreIds', () => {
    const offreIds = new Set(seed.offres.map(o => o.id))
    seed.candidatures.forEach(cand => {
      expect(offreIds.has(cand.offreId)).toBe(true)
    })
  })

  it('should have entretiens only for advanced-stage candidatures', () => {
    const eligibleEtapes = new Set(['etape-3', 'etape-4', 'etape-5', 'etape-6', 'etape-7'])
    const candidatureIds = new Set(
      seed.candidatures.filter(c => eligibleEtapes.has(c.etapeId)).map(c => c.id)
    )

    seed.entretiens.forEach(ent => {
      expect(candidatureIds.has(ent.candidatureId)).toBe(true)
    })
  })

  it('should have evaluations only for realized entretiens', () => {
    const realizedEntretienIds = new Set(
      seed.entretiens.filter(e => e.statut === 'realise').map(e => e.id)
    )

    seed.evaluations.forEach(evaluation => {
      expect(realizedEntretienIds.has(evaluation.entretienId)).toBe(true)
    })
  })

  it('should have scores only for candidatures past etape-3', () => {
    const withScoreEtapes = new Set(['etape-3', 'etape-4', 'etape-5', 'etape-6', 'etape-7'])
    
    seed.candidatures.forEach(cand => {
      if (withScoreEtapes.has(cand.etapeId)) {
        expect(cand.score).toBeDefined()
        expect(cand.score).toBeGreaterThanOrEqual(0)
        expect(cand.score).toBeLessThanOrEqual(4)
      }
    })
  })

  it('should have at least one event per candidature', () => {
    const eventsByCandidatureId = new Map<string, number>()
    seed.evenements.forEach(evt => {
      eventsByCandidatureId.set(evt.candidatureId, (eventsByCandidatureId.get(evt.candidatureId) || 0) + 1)
    })

    seed.candidatures.forEach(cand => {
      const count = eventsByCandidatureId.get(cand.id) || 0
      expect(count).toBeGreaterThanOrEqual(1)
    })
  })

  it('should have chronological events', () => {
    const dates = seed.evenements.map(e => new Date(e.date).getTime())
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1])
    }
  })
})
