import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import EvaluationPage from './EvaluationPage.vue'
import { seed } from '@/data/seed'

const entretienId = seed.entretiens[0].id

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/entretiens', component: { template: '<div />' } },
      { path: '/entretiens/:id/evaluation', component: EvaluationPage, props: true },
      { path: '/candidatures/:id', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Evaluation — Saisie (page)',
  component: EvaluationPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page de saisie d\'évaluation post-entretien (formulaire critères + recommandation). Voir DDR-007.',
      },
    },
  },
} satisfies Meta<typeof EvaluationPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push(`/entretiens/${entretienId}/evaluation`)
        return { router }
      },
      template: '<div style="min-height: 100vh; background: var(--background-default-grey);"><story /></div>',
    }),
  ],
  render: () => ({
    components: { EvaluationPage },
    setup: () => ({ entretienId }),
    template: '<EvaluationPage :id="entretienId" />',
  }),
}
