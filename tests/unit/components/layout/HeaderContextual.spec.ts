import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HeaderContextual from '@/components/layout/HeaderContextual.vue'
import { usePageHeader } from '@/stores/pageHeader'

describe('HeaderContextual', () => {
  it('shows the title from the store', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const pageHeader = usePageHeader()
    pageHeader.setTitle('Pipeline')

    const wrapper = mount(HeaderContextual, {
      global: {
        plugins: [pinia],
      },
    })

    expect(wrapper.text()).toContain('Pipeline')
  })

  it('renders slotted actions', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const pageHeader = usePageHeader()
    pageHeader.setTitle('Mes offres')

    const wrapper = mount(HeaderContextual, {
      global: {
        plugins: [pinia],
      },
      slots: {
        actions: '<button type="button">Nouveau</button>',
      },
    })

    expect(wrapper.get('button').text()).toBe('Nouveau')
  })
})
