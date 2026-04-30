import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import OffresPage from '../../../src/pages/OffresPage.vue'
import { useOffresStore } from '../../../src/stores/offres'

vi.mock('@/stores/toast', () => ({
  useToastStore: vi.fn(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })),
}))

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/offres/nouvelle', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/offres/:id/edition', component: { template: '<div />' } },
      { path: '/pipeline/:offreId', component: { template: '<div />' } },
    ],
  })
}

describe('OffresPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('rend une ligne par offre visible', async () => {
    const router = makeRouter()
    await router.push('/offres')
    await router.isReady()

    const store = useOffresStore()
    const expected = store.offresVisibles.length

    const wrapper = mount(OffresPage, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('[data-testid="offres-table-row"]')
    expect(rows.length).toBe(expected)
  })

  it('navigue vers la page de détail au clic sur une ligne', async () => {
    const router = makeRouter()
    await router.push('/offres')
    await router.isReady()
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(OffresPage, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()

    const firstRow = wrapper.find('[data-testid="offres-table-row"]')
    await firstRow.trigger('click')

    expect(pushSpy).toHaveBeenCalled()
    const arg = pushSpy.mock.calls[0]![0]
    expect(typeof arg).toBe('string')
    expect(String(arg)).toMatch(/^\/offres\/offre-/)
  })

  it("affiche l'EmptyState quand il n'y a aucune offre visible", async () => {
    const router = makeRouter()
    await router.push('/offres')
    await router.isReady()

    const store = useOffresStore()
    // On archive toutes les offres pour vider offresVisibles
    const ids = store.offres.map(o => o.id)
    ids.forEach(id => store.archive(id))

    const wrapper = mount(OffresPage, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Aucune offre')
  })

  it('filtre les lignes par statut', async () => {
    const router = makeRouter()
    await router.push('/offres')
    await router.isReady()

    const store = useOffresStore()
    const expectedOuvertes = store.offresVisibles.filter(o => o.statut === 'ouverte').length

    const wrapper = mount(OffresPage, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()

    // Active le filtre "ouverte" via le checkbox
    const statutCheckboxes = wrapper.findAll('.offres-page__filter-panel input[type="checkbox"]')
    // Le premier panel est "Statut" : indices 0=brouillon, 1=ouverte, 2=fermee
    const ouverteCb = statutCheckboxes[1]
    expect(ouverteCb).toBeTruthy()
    await ouverteCb.setValue(true)
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('[data-testid="offres-table-row"]')
    expect(rows.length).toBe(expectedOuvertes)
  })
})
