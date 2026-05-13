import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'

import FilterChips from './FilterChips.vue'
import { useFiltersStore } from '@/stores/filters'
import { seed } from '@/data/seed'

const meta = {
  title: '05 — Sections génériques/FilterChips',
  component: FilterChips,
  tags: ['autodocs'],
  argTypes: {
    showReset: { control: 'boolean' },
  },
} satisfies Meta<typeof FilterChips>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { showReset: true },
  decorators: [
    () => {
      setActivePinia(createPinia())
      const filters = useFiltersStore()
      filters.reset()
      return { template: '<story />' }
    },
  ],
}

export const WithFilters: Story = {
  args: { showReset: true },
  decorators: [
    () => {
      setActivePinia(createPinia())
      const filters = useFiltersStore()
      filters.reset()
      const etape = seed.etapes.find(e => e.visibleKanban)
      if (etape) filters.addEtapeId(etape.id)
      filters.setScoreMin(3)
      const intervieweur = seed.intervieweurs[0]
      if (intervieweur) filters.addIntervieweurId(intervieweur.id)
      filters.setRecherche('Dupont')
      return { template: '<story />' }
    },
  ],
}

export const WithoutReset: Story = {
  args: { showReset: false },
  decorators: [
    () => {
      setActivePinia(createPinia())
      const filters = useFiltersStore()
      filters.reset()
      filters.setScoreMin(2)
      return { template: '<story />' }
    },
  ],
}
