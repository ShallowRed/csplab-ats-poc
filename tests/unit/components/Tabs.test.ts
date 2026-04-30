import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs', () => {
  it('renders tabs triggers and content', () => {
    const wrapper = mount({
      components: { Tabs, TabsList, TabsTrigger, TabsContent },
      setup() {
        const activeTab = ref('tab1')
        return { activeTab }
      },
      template: `
        <Tabs v-model="activeTab" activation-mode="manual">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      `,
    })

    expect(wrapper.text()).toContain('Tab 1')
    expect(wrapper.text()).toContain('Tab 2')
  })

  it('changes active tab when trigger is clicked', async () => {
    const activeTab = ref('tab1')
    const wrapper = mount({
      components: { Tabs, TabsList, TabsTrigger, TabsContent },
      setup() {
        return { activeTab }
      },
      template: `
        <Tabs v-model="activeTab" activation-mode="manual">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      `,
    })

    const triggers = wrapper.findAll('[role="tab"]')
    await triggers[1].trigger('mousedown')
    await triggers[1].trigger('click')
    
    expect(activeTab.value).toBe('tab2')
  })

  it('displays correct content based on active tab', () => {
    const wrapper = mount({
      components: { Tabs, TabsList, TabsTrigger, TabsContent },
      setup() {
        const activeTab = ref('tab1')
        return { activeTab }
      },
      template: `
        <Tabs v-model="activeTab">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      `,
    })

    expect(wrapper.text()).toContain('Content 1')
  })
})
