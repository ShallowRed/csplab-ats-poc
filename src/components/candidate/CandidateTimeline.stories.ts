import type { Meta, StoryObj } from '@storybook/vue3'
import CandidateTimeline from '@/components/candidate/CandidateTimeline.vue'
import { EmptyState } from '@/components/ui/empty-state'
import { seed } from '@/data/seed'

const evenementsCandidat = seed.evenements.filter(e => e.candidatureId === seed.candidatures[0].id)

const meta = {
  title: '06 — Sections ATS/Candidatures/CandidateTimeline',
  component: CandidateTimeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Timeline événementielle d\'une candidature : changements d\'étape, notes, entretiens, évaluations, emails, tags.',
      },
    },
  },
} satisfies Meta<typeof CandidateTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { evenements: evenementsCandidat },
  render: (args) => ({
    components: { CandidateTimeline },
    setup: () => ({ args }),
    template: '<div style="max-width: 640px; padding: var(--csplab-space-4);"><CandidateTimeline v-bind="args" /></div>',
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { EmptyState },
    template: `
      <div style="max-width: 640px; padding: var(--csplab-space-4);">
        <EmptyState
          title="Pas encore d'activité"
          description="Les actions sur cette candidature s'afficheront ici (étapes, notes, entretiens)."
          icon="ri:history-line"
        />
      </div>
    `,
  }),
}
