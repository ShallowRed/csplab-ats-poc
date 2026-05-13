import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import ScheduleStep from '@/components/interview/ScheduleStep.vue'
import { seed } from '@/data/seed'

const meta = {
  title: '04 — Composants métier/Entretiens/ScheduleStep',
  component: ScheduleStep,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Étape de planification d\'entretien : sélection d\'un créneau dans une grille semaine + ajustement de la durée. Voir DDR-006 et DDR-007.',
      },
    },
  },
} satisfies Meta<typeof ScheduleStep>

export default meta
type Story = StoryObj<typeof meta>

const FIRST_TWO_INTERVIEWEURS = seed.intervieweurs.slice(0, 2).map(i => i.id)

export const Default: Story = {
  render: () => ({
    components: { ScheduleStep },
    setup: () => ({
      intervieweurIds: FIRST_TWO_INTERVIEWEURS,
      slot: ref<{ date: string; heure: string; duree: number } | null>(null),
    }),
    template: `
      <div style="max-width: 720px;">
        <ScheduleStep
          :intervieweur-ids="intervieweurIds"
          :model-value="slot"
          @update:model-value="(v) => slot = v"
        />
      </div>
    `,
  }),
}

export const AvecCreneauPreselectionne: Story = {
  render: () => ({
    components: { ScheduleStep },
    setup: () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return {
        intervieweurIds: FIRST_TWO_INTERVIEWEURS,
        slot: ref({ date: tomorrow.toISOString().split('T')[0], heure: '14:30', duree: 60 }),
      }
    },
    template: `
      <div style="max-width: 720px;">
        <ScheduleStep
          :intervieweur-ids="intervieweurIds"
          :model-value="slot"
          @update:model-value="(v) => slot = v"
        />
      </div>
    `,
  }),
}
