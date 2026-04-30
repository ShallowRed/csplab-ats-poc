import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import SettingsPage from '../../../src/pages/SettingsPage.vue'

vi.mock('@/stores/toast', () => ({
  useToastStore: vi.fn(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })),
}))

function makeRouter(path = '/parametres') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/parametres', component: { template: '<div />' } },
    ],
  })
  void router.push(path)
  return router
}

describe('SettingsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rend les 4 panneaux de contenu', async () => {
    const router = makeRouter('/parametres')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const panels = wrapper.findAll('[role="tabpanel"]')
    const values = panels.map(p => p.attributes('data-tabs-value') ?? p.attributes('aria-labelledby') ?? '')
    expect(panels.length).toBeGreaterThanOrEqual(4)
    // Le panneau actif par défaut est "etapes"
    const active = panels.find(p => p.attributes('data-state') === 'active')
    expect(active?.text().toLowerCase()).toContain('étape')
  })

  it('?tab=motifs active le panneau Motifs', async () => {
    const router = makeRouter('/parametres?tab=motifs')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const active = wrapper.findAll('[role="tabpanel"]').find(p => p.attributes('data-state') === 'active')
    expect(active?.text().toLowerCase()).toContain('motif')
  })

  it('?tab=templates active le panneau Templates', async () => {
    const router = makeRouter('/parametres?tab=templates')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const active = wrapper.findAll('[role="tabpanel"]').find(p => p.attributes('data-state') === 'active')
    expect(active?.text().toLowerCase()).toContain('template')
  })

  it('?tab=intervieweurs active le panneau Intervieweurs', async () => {
    const router = makeRouter('/parametres?tab=intervieweurs')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const active = wrapper.findAll('[role="tabpanel"]').find(p => p.attributes('data-state') === 'active')
    expect(active?.text().toLowerCase()).toContain('intervieweur')
  })
})
