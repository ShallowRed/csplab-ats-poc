import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const meta = {
  title: '02 — Atomes/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Recommandation: Story = {
  render: () => ({
    components: { RadioGroup, RadioGroupItem, Label },
    setup: () => ({ value: ref('oui') }),
    template: `
      <RadioGroup v-model="value" style="display: flex; gap: var(--csplab-space-4);">
        <div style="display: flex; align-items: center; gap: var(--csplab-space-2);">
          <RadioGroupItem id="r-oui" value="oui" />
          <Label for="r-oui">Favorable</Label>
        </div>
        <div style="display: flex; align-items: center; gap: var(--csplab-space-2);">
          <RadioGroupItem id="r-mitige" value="mitige" />
          <Label for="r-mitige">Mitigé</Label>
        </div>
        <div style="display: flex; align-items: center; gap: var(--csplab-space-2);">
          <RadioGroupItem id="r-non" value="non" />
          <Label for="r-non">Défavorable</Label>
        </div>
      </RadioGroup>
    `,
  }),
}
