import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox', () => {
  it('renders correctly', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.exists()).toBe(true)
  })

  it('updates v-model value when clicked', async () => {
    const checked = ref(false)
    const wrapper = mount(Checkbox, {
      props: {
        checked: checked.value,
        'onUpdate:checked': (value: boolean) => {
          checked.value = value
        },
      },
    })

    await wrapper.trigger('click')
    expect(checked.value).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
      },
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('shows checked state visually', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        checked: true,
      },
    })
    
    expect(wrapper.attributes('data-state')).toBe('checked')
  })
})
