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

    await router.push('/preferences')
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
    expect(wrapper.text()).toContain('Pipeline (kanban)')
    expect(wrapper.text()).toContain('Vue table')
    expect(wrapper.text()).toContain('Mes entretiens')
    expect(wrapper.text()).toContain('Intervieweurs')
    expect(wrapper.text()).toContain('Préférences')
  })

  it('marks the active item based on current route', async () => {
    const pinia = createPinia()
    const router = createAppRouter(createMemoryHistory())

    await router.push('/candidatures/table/offre-1')
    await router.isReady()

    const wrapper = mount(Sidebar, {
      global: {
        plugins: [pinia, router],
      },
    })

    const candidatures = wrapper.get('[data-testid="sidebar-link-candidatures"]')
    expect(candidatures.classes()).toContain('csplab-sidebar__link--active')
    expect(candidatures.attributes('aria-current')).toBe('page')

    const preferences = wrapper.get('[data-testid="sidebar-link-preferences"]')
    expect(preferences.classes()).not.toContain('csplab-sidebar__link--active')
    expect(preferences.attributes('aria-current')).toBeUndefined()
  })
})
