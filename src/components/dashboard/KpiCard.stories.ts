import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import KpiCard from '@/components/dashboard/KpiCard.vue'

const meta = {
  title: '04 — Composants métier/Dashboard/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<div style="max-width: 320px;"><story /></div>' }
    },
  ],
} satisfies Meta<typeof KpiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Offres ouvertes',
    value: 12,
    sublabel: '3 nouvelles cette semaine',
    icon: 'ri:briefcase-line',
  },
}

export const Attention: Story = {
  args: {
    label: 'Candidatures à traiter',
    value: 27,
    sublabel: '8 en retard (> 48h)',
    icon: 'ri:user-search-line',
    tone: 'attention',
  },
}

export const Success: Story = {
  args: {
    label: 'Évaluations soumises',
    value: 18,
    sublabel: 'Aucun retard',
    icon: 'ri:checkbox-circle-line',
    tone: 'success',
  },
}

export const Clickable: Story = {
  args: {
    label: 'Entretiens cette semaine',
    value: 9,
    sublabel: '3 aujourd\'hui',
    icon: 'ri:calendar-event-line',
    to: '/entretiens',
  },
}

export const Catalogue: Story = {
  render: () => ({
    components: { KpiCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--csplab-space-3); width: 100%; max-width: 640px;">
        <KpiCard label="Offres ouvertes" :value="12" sublabel="3 nouvelles cette semaine" icon="ri:briefcase-line" />
        <KpiCard label="Candidatures à traiter" :value="27" sublabel="8 en retard" icon="ri:user-search-line" tone="attention" />
        <KpiCard label="Entretiens 7j" :value="9" sublabel="3 aujourd'hui" icon="ri:calendar-event-line" />
        <KpiCard label="Évaluations" :value="18" sublabel="À jour" icon="ri:clipboard-line" tone="success" />
      </div>
    `,
  }),
}
