import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import DashboardPage from '../../../src/pages/DashboardPage.vue'

vi.mock('@/stores/toast', () => ({
  useToastStore: vi.fn(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })),
}))

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/tableau-de-bord', component: { template: '<div />' } },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/candidatures', component: { template: '<div />' } },
      { path: '/candidatures/:id', component: { template: '<div />' } },
      { path: '/entretiens', component: { template: '<div />' } },
      { path: '/entretiens/:id/evaluation', component: { template: '<div />' } },
    ],
  })
}

describe('DashboardPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rend les 4 KPI principaux', async () => {
    const router = makeRouter()
    await router.push('/tableau-de-bord')
    await router.isReady()

    const wrapper = mount(DashboardPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="kpi-card-Offres ouvertes"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="kpi-card-Candidatures à traiter"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="kpi-card-Entretiens à 7 jours"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="kpi-card-Évaluations en attente"]').exists()).toBe(true)
  })

  it('le KPI offres pointe vers /offres (RouterLink)', async () => {
    const router = makeRouter()
    await router.push('/tableau-de-bord')
    await router.isReady()

    const wrapper = mount(DashboardPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const link = wrapper.find('[data-testid="kpi-card-Offres ouvertes"]')
    expect(link.attributes('href')).toBe('/offres')
  })

  it('ne contient plus la mention "hors périmètre"', async () => {
    const router = makeRouter()
    await router.push('/tableau-de-bord')
    await router.isReady()

    const wrapper = mount(DashboardPage, { global: { plugins: [router] } })
    expect(wrapper.text()).not.toMatch(/hors périmètre/i)
    expect(wrapper.text()).not.toMatch(/redirection/i)
  })
})
