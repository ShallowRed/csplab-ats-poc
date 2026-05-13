import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { DragDropProvider } from '@dnd-kit/vue'
import KanbanCard from '@/components/kanban/KanbanCard.vue'
import { seed } from '@/data/seed'
import { storybookRouter } from '@/router/storybook'

const candidature = seed.candidatures[0]
const candidat = seed.candidats.find(c => c.id === candidature.candidatId)!
const intervieweur = candidature.intervieweurAssigne
  ? seed.intervieweurs.find(i => i.id === candidature.intervieweurAssigne)
  : undefined
const offre = seed.offres.find(o => o.id === candidature.offreId)

const meta = {
  title: '04 — Composants métier/Pipeline/KanbanCard',
  component: KanbanCard,
  tags: ['autodocs'],
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="width: 280px; padding: var(--csplab-space-3); background: var(--csplab-kanban-bg, #f6f6f6);"><story /></div>' }
    },
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Carte d\'une candidature dans le board kanban. Affiche avatar, nom, offre, tags, intervieweur assigné, et badge âge si > 7j. Cliquable pour ouvrir le drawer (cmd+clic = sélection multiple). Voir DDR-005.',
      },
    },
  },
} satisfies Meta<typeof KanbanCard>

export default meta
type Story = StoryObj<typeof meta>

const BASE_ARGS = {
  candidature,
  candidat,
  intervieweurAssigne: intervieweur,
  offreTitre: offre?.titre,
  etapeId: candidature.etapeId,
  index: 0,
}

function wrapWithDnd(args: any) {
  return {
    components: { KanbanCard, DragDropProvider },
    setup: () => ({ args }),
    router: storybookRouter,
    template: '<DragDropProvider><KanbanCard v-bind="args" /></DragDropProvider>',
  }
}

export const Default: Story = {
  args: BASE_ARGS,
  render: (args) => wrapWithDnd(args),
}

export const Hover: Story = {
  args: { ...BASE_ARGS, debug: { hover: true } },
  render: (args) => wrapWithDnd(args),
}

export const Selected: Story = {
  args: { ...BASE_ARGS, debug: { selected: true } },
  render: (args) => wrapWithDnd(args),
}

export const Dragging: Story = {
  args: { ...BASE_ARGS, debug: { dragging: true } },
  render: (args) => wrapWithDnd(args),
}

export const FocusVisible: Story = {
  args: { ...BASE_ARGS, debug: { focusVisible: true } },
  render: (args) => wrapWithDnd(args),
}
