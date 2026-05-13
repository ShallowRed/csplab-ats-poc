import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import InterviewSlideOver from '@/components/interview/InterviewSlideOver.vue'
import { Button } from '@/components/ui/button'
import { useInterviewStore } from '@/stores/interview'
import { seed } from '@/data/seed'

const meta = {
  title: '06 — Sections ATS/Entretiens/InterviewSlideOver',
  component: InterviewSlideOver,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Wizard de planification d\'entretien (slide-over latéral) : type → intervieweurs → créneau → confirmation. Voir DDR-006, DDR-007.',
      },
    },
  },
} satisfies Meta<typeof InterviewSlideOver>

export default meta
type Story = StoryObj<typeof meta>

export const Ouvert: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      const interview = useInterviewStore()
      interview.ouvrir(seed.candidatures[0].id)
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { InterviewSlideOver },
    template: '<InterviewSlideOver />',
  }),
}

export const ToggleManuel: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { InterviewSlideOver, Button },
    setup() {
      const interview = useInterviewStore()
      const candidatureId = seed.candidatures[0].id
      return { interview, candidatureId }
    },
    template: `
      <div style="padding: var(--csplab-space-4);">
        <Button @click="interview.ouvrir(candidatureId)">Ouvrir le wizard</Button>
        <InterviewSlideOver />
      </div>
    `,
  }),
}
