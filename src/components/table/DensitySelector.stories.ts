import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import DensitySelector from '@/components/table/DensitySelector.vue'

const meta = {
  title: '05 — Sections génériques/DensitySelector',
  component: DensitySelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Sélecteur de densité d\'affichage (compact / normal / confortable). Influence les sections ATS (table, kanban). Voir DDR-009.',
      },
    },
  },
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
} satisfies Meta<typeof DensitySelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { DensitySelector },
    template: '<DensitySelector />',
  }),
}
