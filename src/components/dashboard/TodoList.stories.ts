import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import TodoList from '@/components/dashboard/TodoList.vue'
import { EmptyState } from '@/components/ui/empty-state'
import type { TodoItem } from '@/composables/useDashboardMetrics'

const ITEMS: TodoItem[] = [
  {
    id: 'eval-ent-1',
    title: 'Évaluer l\'entretien de Camille Bernard',
    subtitle: 'Réalisé il y a 5 jours',
    badge: 'Retard',
    to: '/entretiens/ent-1/evaluation',
    icon: 'ri:clipboard-line',
  },
  {
    id: 'eval-ent-2',
    title: 'Évaluer l\'entretien de Marc Petit',
    subtitle: 'Réalisé il y a 4 jours',
    badge: 'Retard',
    to: '/entretiens/ent-2/evaluation',
    icon: 'ri:clipboard-line',
  },
  {
    id: 'ent-1',
    title: 'Entretien avec Léa Garnier',
    subtitle: 'Aujourd\'hui à 14:30',
    to: '/candidatures/c-1',
    icon: 'ri:calendar-event-line',
  },
  {
    id: 'cand-1',
    title: 'Trier la candidature de Lucas Marchand',
    subtitle: 'Reçue il y a 3 jours',
    to: '/candidatures/c-2',
    icon: 'ri:user-search-line',
  },
  {
    id: 'cand-2',
    title: 'Trier la candidature de Sophie Lefèvre',
    subtitle: 'Reçue il y a 2 jours',
    to: '/candidatures/c-3',
    icon: 'ri:user-search-line',
  },
]

const meta = {
  title: '04 — Composants métier/Dashboard/TodoList',
  component: TodoList,
  tags: ['autodocs'],
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="max-width: 520px;"><story /></div>' }
    },
  ],
} satisfies Meta<typeof TodoList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { items: ITEMS, max: 5 },
}

export const TroncatureAvecOverflow: Story = {
  args: { items: ITEMS, max: 3 },
}

export const Empty: Story = {
  render: () => ({
    components: { EmptyState },
    template: `
      <EmptyState
        title="Tout est à jour"
        description="Aucune tâche urgente n'attend votre attention."
        icon="ri:checkbox-circle-line"
      />
    `,
  }),
}
