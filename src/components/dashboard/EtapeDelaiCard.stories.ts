import type { Meta, StoryObj } from '@storybook/vue3'
import EtapeDelaiCard from '@/components/dashboard/EtapeDelaiCard.vue'
import type { DelaiEtape } from '@/composables/useDashboardMetrics'

const DELAIS: DelaiEtape[] = [
  { etapeId: 'etape-1', etape: 'Candidature reçue', delaiMoyen: 2, points: [40, 45, 38, 50, 42, 48, 36, 44, 41, 47] },
  { etapeId: 'etape-2', etape: 'Présélection', delaiMoyen: 4, points: [60, 65, 70, 62, 75, 68, 72, 80, 71, 73] },
  { etapeId: 'etape-3', etape: 'Entretien RH', delaiMoyen: 6, points: [55, 50, 60, 65, 58, 62, 70, 66, 64, 68] },
  { etapeId: 'etape-4', etape: 'Entretien manager', delaiMoyen: 5, points: [45, 52, 48, 55, 50, 58, 53, 60, 57, 62] },
  { etapeId: 'etape-5', etape: 'Décision', delaiMoyen: 3, points: [30, 35, 32, 28, 36, 33, 38, 34, 31, 37] },
]

const meta = {
  title: '04 — Composants métier/Dashboard/EtapeDelaiCard',
  component: EtapeDelaiCard,
  tags: ['autodocs'],
} satisfies Meta<typeof EtapeDelaiCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { delais: DELAIS },
}
