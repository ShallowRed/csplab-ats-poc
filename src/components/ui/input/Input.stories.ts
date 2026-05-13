import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
  title: '02 — Atomes/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Input, Label },
    setup: () => ({ value: ref('') }),
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="firstname">Prénom</Label>
        <Input id="firstname" v-model="value" placeholder="Jean" />
      </div>
    `,
  }),
}

export const Email: Story = {
  render: () => ({
    components: { Input, Label },
    setup: () => ({ value: ref('agent@beta.gouv.fr') }),
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="email">Email</Label>
        <Input id="email" type="email" v-model="value" />
      </div>
    `,
  }),
}

export const Numerique: Story = {
  render: () => ({
    components: { Input, Label },
    setup: () => ({ value: ref<number | string>(60) }),
    template: `
      <div style="max-width: 200px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="duree">Durée (min)</Label>
        <Input id="duree" type="number" v-model="value" />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div style="max-width: 360px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="ref">Référence</Label>
        <Input id="ref" disabled placeholder="Auto-générée" />
      </div>
    `,
  }),
}
