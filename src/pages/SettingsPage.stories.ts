import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import SettingsPage from './SettingsPage.vue'

function makeRouter(initialPath = '/parametres') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/parametres', component: SettingsPage },
    ],
  })
  void router.push(initialPath)
  return router
}

const meta = {
  title: '07 — Vues ATS/Paramètres (page)',
  component: SettingsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

function makeStory(initialPath: string): Story {
  return {
    decorators: [
      (story) => ({
        components: { story },
        setup() {
          setActivePinia(createPinia())
          const router = makeRouter(initialPath)
          return { router }
        },
        template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
      }),
    ],
    render: () => ({
      components: { SettingsPage },
      template: '<SettingsPage />',
    }),
  }
}

export const Default: Story = makeStory('/parametres')
export const MotifsTab: Story = makeStory('/parametres?tab=motifs')
export const TemplatesTab: Story = makeStory('/parametres?tab=templates')
export const IntervieweursTab: Story = makeStory('/parametres?tab=intervieweurs')
