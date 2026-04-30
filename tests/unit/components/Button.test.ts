import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with default text', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
      slots: {
        default: 'Click me',
      },
      attrs: {
        onClick,
      },
    })

    await wrapper.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Delete',
      },
    })
    
    expect(wrapper.classes()).toContain('bg-[var(--background-action-high-red-marianne)]')
  })
})
