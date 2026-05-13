import type { Meta, StoryObj } from '@storybook/vue3'
import { onMounted } from 'vue'
import Sidebar from './Sidebar.vue'
import { storybookRouter } from '@/router/storybook'

const meta = {
  title: '05 — Sections génériques/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

function useRouteForStory(path: string) {
  onMounted(() => {
    void storybookRouter.replace(path)
  })
}

export const Pipeline: Story = {
  render: () => ({
    components: { Sidebar },
    setup() {
      useRouteForStory('/pipeline/offre-1')
      return {}
    },
    template: '<div style="border-right: 1px solid var(--border-default-grey); width: 240px;"><Sidebar /></div>',
  }),
}

export const Candidatures: Story = {
  render: () => ({
    components: { Sidebar },
    setup() {
      useRouteForStory('/candidatures')
      return {}
    },
    template: '<div style="border-right: 1px solid var(--border-default-grey); width: 240px;"><Sidebar /></div>',
  }),
}

export const Preferences: Story = {
  render: () => ({
    components: { Sidebar },
    setup() {
      useRouteForStory('/preferences')
      return {}
    },
    template: '<div style="border-right: 1px solid var(--border-default-grey); width: 240px;"><Sidebar /></div>',
  }),
}
