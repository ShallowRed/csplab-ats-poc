import type { Meta, StoryObj } from '@storybook/vue3'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const meta = {
  title: '02 — Atomes/Label',
  component: Label,
  tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Label, Checkbox },
    template: `
      <div style="display: flex; align-items: center; gap: var(--csplab-space-2);">
        <Checkbox id="accept" />
        <Label for="accept">Tout sélectionner</Label>
      </div>
    `,
  }),
}
