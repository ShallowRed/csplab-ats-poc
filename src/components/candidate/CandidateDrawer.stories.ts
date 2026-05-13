import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import CandidateDrawer from '@/components/candidate/CandidateDrawer.vue'
import { useDrawerStore } from '@/stores/drawer'
import { seed } from '@/data/seed'
import { storybookRouter } from '@/router/storybook'

const meta = {
  title: '06 — Sections ATS/Candidatures/CandidateDrawer',
  component: CandidateDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Drawer latéral d\'exploration rapide d\'une candidature (timeline, notes, évaluations). Ouvert via `drawer.ouvrir(id)`. Voir DDR-004.',
      },
    },
  },
} satisfies Meta<typeof CandidateDrawer>

export default meta
type Story = StoryObj<typeof meta>

const orderedIds = seed.candidatures.slice(0, 5).map(c => c.id)

export const Ouvert: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const drawer = useDrawerStore()
      drawer.ouvrir(seed.candidatures[0].id)
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { CandidateDrawer },
    setup: () => ({ orderedIds }),
    router: storybookRouter,
    template: '<CandidateDrawer :ordered-ids="orderedIds" />',
  }),
}

export const Ferme: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { CandidateDrawer },
    setup: () => ({ orderedIds }),
    template: '<div><CandidateDrawer :ordered-ids="orderedIds" /><p style="padding: 1rem;">Drawer fermé — déclencher l\'ouverture via le store.</p></div>',
  }),
}
