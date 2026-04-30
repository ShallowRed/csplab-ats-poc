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

  it('rend les 4 tab triggers', async () => {
    const router = makeRouter('/parametres')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const triggers = wrapper.findAll('[role="tab"]')
    const labels = triggers.map(t => t.text())
    expect(labels).toContain('Étapes du pipeline')
    expect(labels).toContain('Motifs de refus')
    expect(labels).toContain('Templates email')
    expect(labels).toContain('Intervieweurs')
  })

  it('?tab=motifs active le tab Motifs', async () => {
    const router = makeRouter('/parametres?tab=motifs')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const motifsTrigger = wrapper.findAll('[role="tab"]').find(t => t.text().includes('Motifs'))
    expect(motifsTrigger?.attributes('data-state')).toBe('active')
  })

  it('?tab=templates active le tab Templates', async () => {
    const router = makeRouter('/parametres?tab=templates')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const trigger = wrapper.findAll('[role="tab"]').find(t => t.text().includes('Templates'))
    expect(trigger?.attributes('data-state')).toBe('active')
  })

  it('?tab=intervieweurs active le tab Intervieweurs', async () => {
    const router = makeRouter('/parametres?tab=intervieweurs')
    await router.isReady()
    const wrapper = mount(SettingsPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const trigger = wrapper.findAll('[role="tab"]').find(t => t.text().includes('Intervieweurs'))
    expect(trigger?.attributes('data-state')).toBe('active')
  })
})
