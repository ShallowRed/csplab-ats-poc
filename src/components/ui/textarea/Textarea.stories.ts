import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const meta = {
  title: '02 — Atomes/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Textarea, Label },
    setup: () => ({ value: ref('') }),
    template: `
      <div style="max-width: 480px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="commentaire">Commentaire global</Label>
        <Textarea id="commentaire" v-model="value" placeholder="Saisissez un commentaire…" rows="4" />
      </div>
    `,
  }),
}

export const PreRempli: Story = {
  render: () => ({
    components: { Textarea, Label },
    setup: () => ({ value: ref('Candidat très solide sur la technique. À revoir sur la communication transverse.') }),
    template: `
      <div style="max-width: 480px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label for="c">Commentaire</Label>
        <Textarea id="c" v-model="value" rows="4" />
      </div>
    `,
  }),
}
