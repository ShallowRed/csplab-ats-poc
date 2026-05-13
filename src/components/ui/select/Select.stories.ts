import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const meta = {
  title: '02 — Atomes/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label },
    setup: () => ({ value: ref<string | undefined>(undefined) }),
    template: `
      <div style="max-width: 320px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label>Type d'entretien</Label>
        <Select v-model="value">
          <SelectTrigger>
            <SelectValue placeholder="Choisir un type…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rh">Entretien RH</SelectItem>
            <SelectItem value="technique">Entretien technique</SelectItem>
            <SelectItem value="manager">Entretien manager</SelectItem>
            <SelectItem value="jury">Jury</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}
