import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import EntretiensPage from './EntretiensPage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/entretiens', component: EntretiensPage },
      { path: '/entretiens/:id/evaluation', component: { template: '<div />' } },
      { path: '/candidatures/:id', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Entretiens — Planning (page)',
  component: EntretiensPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Planning des entretiens (calendrier Schedule-X) avec lien vers l\'évaluation. Voir DDR-006.',
      },
    },
  },
} satisfies Meta<typeof EntretiensPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/entretiens')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { EntretiensPage },
    template: '<EntretiensPage />',
  }),
}
