import { describe, it, expect } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'

describe('router', () => {
  it('redirects /pipeline to /pipeline/:offreId', async () => {
    const router = createAppRouter(createMemoryHistory())

    await router.push('/pipeline')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/pipeline/offre-1')
  })

  it('matches 404 route for unknown path', async () => {
    const router = createAppRouter(createMemoryHistory())

    await router.push('/does-not-exist')
    await router.isReady()

    expect(router.currentRoute.value.matched.length).toBeGreaterThan(0)
    expect(router.currentRoute.value.matched.some(m => m.path === '/:catchAll(.*)')).toBe(true)
    expect(router.currentRoute.value.fullPath).toBe('/does-not-exist')
  })
})
