import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import { createAppRouter } from '@/router'

describe('Sidebar', () => {
  it('renders navigation sections and items', async () => {
    const pinia = createPinia()
    const router = createAppRouter(createMemoryHistory())

    await router.push('/parametres')
    await router.isReady()

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(wrapper.text()).toContain('Pilotage')
    expect(wrapper.text()).toContain('Candidatures')
    expect(wrapper.text()).toContain('Entretiens')
    expect(wrapper.text()).toContain('Paramètres')

    expect(wrapper.text()).toContain('Tableau de bord')
    expect(wrapper.text()).toContain('Mes offres')
    expect(wrapper.text()).toContain('Toutes les candidatures')
    expect(wrapper.text()).toContain('Pipeline')
    expect(wrapper.text()).toContain('Mes entretiens')
  })

  it('marks the active item based on current route', async () => {
    const pinia = createPinia()
    const router = createAppRouter(createMemoryHistory())

    await router.push('/pipeline/offre-1?view=table')
    await router.isReady()

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [pinia, router],
      },
    })

    const pipeline = wrapper.get('[data-testid="sidebar-link-pipeline"]')
    expect(pipeline.classes()).toContain('csplab-sidebar__link--active')
    expect(pipeline.attributes('aria-current')).toBe('page')

    const offres = wrapper.get('[data-testid="sidebar-link-offres"]')
    expect(offres.classes()).not.toContain('csplab-sidebar__link--active')
    expect(offres.attributes('aria-current')).toBeUndefined()
  })
})
