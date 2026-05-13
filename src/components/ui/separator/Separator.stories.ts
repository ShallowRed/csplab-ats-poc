import type { Meta, StoryObj } from '@storybook/vue3'
import { Separator } from '@/components/ui/separator'

const meta = {
  title: '03 — Molécules/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div style="padding: var(--csplab-space-4); max-width: 480px;">
        <p style="margin: 0 0 var(--csplab-space-3);">Section A — informations candidat.</p>
        <Separator />
        <p style="margin: var(--csplab-space-3) 0 0;">Section B — historique entretiens.</p>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { Separator },
    template: `
      <div style="display: flex; align-items: center; gap: var(--csplab-space-3); padding: var(--csplab-space-4);">
        <span>12 candidats</span>
        <Separator orientation="vertical" class="h-4" />
        <span>3 entretiens à planifier</span>
        <Separator orientation="vertical" class="h-4" />
        <span>2 évaluations en attente</span>
      </div>
    `,
  }),
}
