import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import DashboardPage from './DashboardPage.vue'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/tableau-de-bord', component: DashboardPage },
      { path: '/offres', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/candidatures', component: { template: '<div />' } },
      { path: '/pipeline/:offreId?', component: { template: '<div />' } },
      { path: '/entretiens', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: '07 — Vues ATS/Tableau de bord (page)',
  component: DashboardPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page d\'accueil ATS : KPI globaux, todo list, délais d\'étape, raccourcis. Voir DDR-001.',
      },
    },
  },
} satisfies Meta<typeof DashboardPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/tableau-de-bord')
        return { router }
      },
      template: '<div style="min-height: 100vh; padding: var(--csplab-space-5); background: var(--background-default-grey);"><story /></div>',
    }),
  ],
  render: () => ({
    components: { DashboardPage },
    template: '<DashboardPage />',
  }),
}
