import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import OffreSelector from '@/components/pipeline/OffreSelector.vue'

const meta = {
  title: '04 — Composants métier/Pipeline/OffreSelector',
  component: OffreSelector,
  tags: ['autodocs'],
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
} satisfies Meta<typeof OffreSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { offreId: 'offre-1' },
  render: (args) => ({
    components: { OffreSelector },
    setup: () => ({ args }),
    template: '<OffreSelector v-bind="args" @change="(id) => console.log(\'change\', id)" />',
  }),
}
