import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PipelinePage from './PipelinePage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/pipeline/:offreId?', component: PipelinePage },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/candidatures', component: { template: '<div />' } },
      { path: '/candidatures/:id', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Pipeline — Kanban (page)',
  component: PipelinePage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Vue pipeline d\'une offre : sélection d\'offre + kanban des étapes + drag & drop. Voir DDR-005, DDR-006.',
      },
    },
  },
} satisfies Meta<typeof PipelinePage>

export default meta
type Story = StoryObj<typeof meta>

export const OffreParDefaut: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/pipeline/offre-1')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { PipelinePage },
    template: '<PipelinePage offre-id="offre-1" />',
  }),
}

export const SansOffreSelectionnee: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/pipeline')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { PipelinePage },
    template: '<PipelinePage />',
  }),
}
