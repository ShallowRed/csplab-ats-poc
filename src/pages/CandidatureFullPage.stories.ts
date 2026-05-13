import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import CandidatureFullPage from './CandidatureFullPage.vue'
import { seed } from '@/data/seed'

const candidatureId = seed.candidatures[0].id

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/candidatures', component: { template: '<div />' } },
      { path: '/candidatures/:id', component: CandidatureFullPage, props: true },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/entretiens/:id/evaluation', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Candidature — Détail (page)',
  component: CandidatureFullPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Vue détaillée d\'une candidature (full-page) : profil, timeline, notes, entretiens, évaluations. Voir DDR-004.',
      },
    },
  },
} satisfies Meta<typeof CandidatureFullPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push(`/candidatures/${candidatureId}`)
        return { router }
      },
      template: '<div style="min-height: 100vh; background: var(--background-default-grey);"><story /></div>',
    }),
  ],
  render: () => ({
    components: { CandidatureFullPage },
    setup: () => ({ candidatureId }),
    template: '<CandidatureFullPage :id="candidatureId" />',
  }),
}
