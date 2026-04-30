import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import EntretiensPage from '../../../src/pages/EntretiensPage.vue'
import { useEntretiensStore } from '../../../src/stores/entretiens'

vi.mock('@/stores/toast', () => ({
  useToastStore: vi.fn(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })),
}))

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/entretiens', component: { template: '<div />' } },
      { path: '/entretiens/:id/evaluation', component: { template: '<div />' } },
      { path: '/candidatures/:id', component: { template: '<div />' } },
    ],
  })
}

describe('EntretiensPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rend une ligne par entretien', async () => {
    const router = makeRouter()
    await router.push('/entretiens')
    await router.isReady()

    const store = useEntretiensStore()
    const wrapper = mount(EntretiensPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('[data-testid="entretien-row"]')
    expect(rows.length).toBe(store.entretiens.length)
  })

  it('filtre par statut "À venir"', async () => {
    const router = makeRouter()
    await router.push('/entretiens')
    await router.isReady()

    const store = useEntretiensStore()
    const expectedAVenir = store.entretiens.filter(e => e.statut === 'planifie').length

    const wrapper = mount(EntretiensPage, { global: { plugins: [router] } })
    await wrapper.vm.$nextTick()

    const select = wrapper.find('[data-testid="entretiens-filter-statut"]')
    await select.setValue('planifie')

    const rows = wrapper.findAll('[data-testid="entretien-row"]')
    expect(rows.length).toBe(expectedAVenir)
  })
})
