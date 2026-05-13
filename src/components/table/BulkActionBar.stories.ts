import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import BulkActionBar from '@/components/table/BulkActionBar.vue'
import { useSelectionStore } from '@/stores/selection'
import { seed } from '@/data/seed'

const meta = {
  title: '05 — Sections génériques/BulkActionBar',
  component: BulkActionBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barre d\'actions groupées affichée quand des candidatures sont sélectionnées. Visible également sur le kanban (clic + Cmd) — voir DDR-005.',
      },
    },
  },
} satisfies Meta<typeof BulkActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const TroisSelectionnees: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const selection = useSelectionStore()
      seed.candidatures.slice(0, 3).forEach(c => selection.toggle(c.id))
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { BulkActionBar },
    template: '<BulkActionBar :total-filtered="42" />',
  }),
}

export const DouzeSelectionnees: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const selection = useSelectionStore()
      seed.candidatures.slice(0, 12).forEach(c => selection.toggle(c.id))
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { BulkActionBar },
    template: '<BulkActionBar :total-filtered="42" />',
  }),
}
