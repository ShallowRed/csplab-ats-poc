import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('Smoke tests', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render App component', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('CSPLab POC')
  })

  it('should display DSFR version', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('1.14.4')
  })
})
