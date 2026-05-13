import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import FilterPopover from '@/components/filters/FilterPopover.vue'
import { useFiltersStore } from '@/stores/filters'

const meta = {
  title: '05 — Sections génériques/FilterPopover',
  component: FilterPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Popover regroupant les filtres avancés (étapes, intervieweurs, score). Combiné avec `FilterChips` qui affiche les filtres actifs.',
      },
    },
  },
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="padding: var(--csplab-space-4);"><story /></div>' }
    },
  ],
} satisfies Meta<typeof FilterPopover>

export default meta
type Story = StoryObj<typeof meta>

export const VierEtFerme: Story = {
  render: () => ({
    components: { FilterPopover },
    template: '<FilterPopover />',
  }),
}

export const AvecFiltresActifs: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const filters = useFiltersStore()
      filters.filtre.etapeIds = ['etape-2', 'etape-3']
      filters.filtre.scoreMinimum = 2
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { FilterPopover },
    template: '<FilterPopover />',
  }),
}
