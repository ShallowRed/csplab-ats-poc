import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import CandidatureTable from '@/components/table/CandidatureTable.vue'
import { useDensityStore } from '@/stores/density'
import { seed } from '@/data/seed'

const candidatures = seed.candidatures.slice(0, 20)

const meta = {
  title: '06 — Sections ATS/Candidatures/CandidatureTable',
  component: CandidatureTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Table TanStack des candidatures avec sélection multiple, densité variable, et drawer au clic. Voir DDR-005, DDR-009.',
      },
    },
  },
} satisfies Meta<typeof CandidatureTable>

export default meta
type Story = StoryObj<typeof meta>

export const DensiteNormale: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
  render: () => ({
    components: { CandidatureTable },
    setup: () => ({ candidatures }),
    template: '<CandidatureTable :candidatures="candidatures" />',
  }),
}

export const DensiteCompacte: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const d = useDensityStore()
      d.densite = 'compact'
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
  render: () => ({
    components: { CandidatureTable },
    setup: () => ({ candidatures }),
    template: '<CandidatureTable :candidatures="candidatures" />',
  }),
}

export const DensiteConfortable: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const d = useDensityStore()
      d.densite = 'comfortable'
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
  render: () => ({
    components: { CandidatureTable },
    setup: () => ({ candidatures }),
    template: '<CandidatureTable :candidatures="candidatures" />',
  }),
}

export const Empty: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
  render: () => ({
    components: { CandidatureTable },
    template: '<CandidatureTable :candidatures="[]" />',
  }),
}
