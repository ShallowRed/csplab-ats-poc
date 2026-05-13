import type { Meta, StoryObj } from '@storybook/vue3'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

const meta = {
  title: '03 — Molécules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Button, RiIcon },
    template: `
      <TooltipProvider :delay-duration="200">
        <div style="display: flex; gap: var(--csplab-space-3); padding: var(--csplab-space-8);">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="tertiary-no-outline" size="icon" aria-label="Planifier">
                <RiIcon name="ri:calendar-line" :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Planifier un entretien</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="tertiary-no-outline" size="icon" aria-label="Évaluer">
                <RiIcon name="ri:clipboard-line" :size="16" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Évaluer</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    `,
  }),
}
