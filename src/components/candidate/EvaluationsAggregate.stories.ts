import type { Meta, StoryObj } from '@storybook/vue3'
import EvaluationsAggregate from '@/components/candidate/EvaluationsAggregate.vue'
import { EmptyState } from '@/components/ui/empty-state'
import { seed } from '@/data/seed'

const cand = seed.candidatures[0]
const entretiens = seed.entretiens.filter(e => e.candidatureId === cand.id)
const evaluations = seed.evaluations.filter(e => e.candidatureId === cand.id)

const meta = {
  title: '06 — Sections ATS/Candidatures/EvaluationsAggregate',
  component: EvaluationsAggregate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Vue agrégée des évaluations soumises pour une candidature : par entretien, avec recommandation et moyenne par critère.',
      },
    },
  },
} satisfies Meta<typeof EvaluationsAggregate>

export default meta
type Story = StoryObj<typeof meta>

export const AvecEvaluations: Story = {
  args: { entretiens, evaluations },
  render: (args) => ({
    components: { EvaluationsAggregate },
    setup: () => ({ args }),
    template: '<div style="max-width: 640px; padding: var(--csplab-space-4);"><EvaluationsAggregate v-bind="args" /></div>',
  }),
}

export const AucuneEvaluation: Story = {
  args: { entretiens: [], evaluations: [] },
  render: (args) => ({
    components: { EvaluationsAggregate, EmptyState },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 640px; padding: var(--csplab-space-4);">
        <EvaluationsAggregate v-bind="args" />
      </div>
    `,
  }),
}
