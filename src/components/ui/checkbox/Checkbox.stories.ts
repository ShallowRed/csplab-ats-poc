import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Checkbox } from './index'
import { Label } from '../label'

const meta = {
  title: '02 — Atomes/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Checkbox, Label },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <div class="flex items-center space-x-2">
        <Checkbox id="terms" v-model:checked="checked" />
        <Label for="terms" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </Label>
      </div>
    `,
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { Checkbox, Label },
    setup() {
      const checked = ref(true)
      return { checked }
    },
    template: `
      <div class="flex items-center space-x-2">
        <Checkbox id="checked" v-model:checked="checked" />
        <Label for="checked">Checked by default</Label>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox, Label },
    template: `
      <div class="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label for="disabled">Disabled</Label>
      </div>
    `,
  }),
}
