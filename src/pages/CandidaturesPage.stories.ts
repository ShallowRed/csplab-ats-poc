import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import CandidaturesPage from './CandidaturesPage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/candidatures', component: CandidaturesPage },
      { path: '/candidatures/:id', component: { template: '<div />' } },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/pipeline/:offreId?', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Candidatures — Table (page)',
  component: CandidaturesPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Vue table des candidatures avec filtres, densité, sélection multiple, drawer latéral. Voir DDR-004, DDR-005, DDR-009.',
      },
    },
  },
} satisfies Meta<typeof CandidaturesPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/candidatures')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { CandidaturesPage },
    template: '<CandidaturesPage />',
  }),
}

export const FiltreParOffre: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/candidatures?offreId=offre-1')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { CandidaturesPage },
    template: '<CandidaturesPage />',
  }),
}
