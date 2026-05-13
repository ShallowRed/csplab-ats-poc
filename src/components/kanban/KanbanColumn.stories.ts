import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { DragDropProvider } from '@dnd-kit/vue'
import KanbanColumn from '@/components/kanban/KanbanColumn.vue'
import { seed } from '@/data/seed'
import { storybookRouter } from '@/router/storybook'

const candidatsById = new Map(seed.candidats.map(c => [c.id, c]))
const intervieweursById = new Map(seed.intervieweurs.map(i => [i.id, i]))

const meta = {
  title: '06 — Sections ATS/Pipeline/KanbanColumn',
  component: KanbanColumn,
  tags: ['autodocs'],
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="width: 320px; background: var(--csplab-kanban-bg, #f6f6f6); padding: var(--csplab-space-3); min-height: 600px;"><story /></div>' }
    },
  ],
} satisfies Meta<typeof KanbanColumn>

export default meta
type Story = StoryObj<typeof meta>

const etape = seed.etapes.find(e => e.id === 'etape-2')!
const candidatures = seed.candidatures.filter(c => c.etapeId === 'etape-2').slice(0, 5)
const offre = seed.offres.find(o => o.id === candidatures[0]?.offreId)

export const Default: Story = {
  args: { etape, candidatures, candidatsById, intervieweursById, offreTitre: offre?.titre },
  render: (args) => ({
    components: { KanbanColumn, DragDropProvider },
    setup: () => ({ args }),
    router: storybookRouter,
    template: '<DragDropProvider><KanbanColumn v-bind="args" /></DragDropProvider>',
  }),
}

export const Empty: Story = {
  args: { etape, candidatures: [], candidatsById, intervieweursById, offreTitre: offre?.titre },
  render: (args) => ({
    components: { KanbanColumn, DragDropProvider },
    setup: () => ({ args }),
    template: '<DragDropProvider><KanbanColumn v-bind="args" /></DragDropProvider>',
  }),
}

export const KeyboardDropActive: Story = {
  args: { etape, candidatures: candidatures.slice(0, 2), candidatsById, intervieweursById, offreTitre: offre?.titre, keyboardDropActive: true },
  render: (args) => ({
    components: { KanbanColumn, DragDropProvider },
    setup: () => ({ args }),
    router: storybookRouter,
    template: '<DragDropProvider><KanbanColumn v-bind="args" /></DragDropProvider>',
  }),
}
