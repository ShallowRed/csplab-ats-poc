import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'

const meta = {
  title: '06 — Sections ATS/Pipeline/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Tableau kanban complet pour une offre : colonnes (étapes visibles) + zone de rejet + drag & drop @dnd-kit. Voir DDR-005, DDR-006.',
      },
    },
  },
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="height: 100vh; padding: var(--csplab-space-4); background: var(--background-default-grey);"><story /></div>' }
    },
  ],
} satisfies Meta<typeof KanbanBoard>

export default meta
type Story = StoryObj<typeof meta>

export const OffreOuverte: Story = {
  args: { offreId: 'offre-1' },
}

export const AutreOffre: Story = {
  args: { offreId: 'offre-2' },
}
