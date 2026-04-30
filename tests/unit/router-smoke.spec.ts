import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'

const testPaths = [
  '/',
  '/tableau-de-bord',
  '/offres',
  '/candidatures',
  '/candidatures/cand-1',
  '/pipeline',
  '/pipeline/offre-1',
  '/pipeline/offre-1?view=table',
  '/entretiens',
  '/entretiens/ent-1/evaluation',
  '/intervieweurs',
  '/preferences',
  '/route-inexistante-404',
]

describe('router smoke', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  for (const path of testPaths) {
    it(`résout la route ${path} sans erreur`, async () => {
      const router = createAppRouter(createMemoryHistory())
      await router.push(path)
      await router.isReady()
      expect(router.currentRoute.value.matched.length).toBeGreaterThan(0)
    })
  }
})
