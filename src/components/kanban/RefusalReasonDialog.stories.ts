import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import RefusalReasonDialog from '@/components/kanban/RefusalReasonDialog.vue'
import { Button } from '@/components/ui/button'

const meta = {
  title: '06 — Sections ATS/Pipeline/RefusalReasonDialog',
  component: RefusalReasonDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialogue de capture du motif de refus, déclenché par le drop sur la `RefusalDropZone`. Confirme ou annule le refus.',
      },
    },
  },
} satisfies Meta<typeof RefusalReasonDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Ouvert: Story = {
  render: () => ({
    components: { RefusalReasonDialog, Button },
    setup: () => ({ open: ref(true) }),
    template: `
      <div>
        <Button @click="open = true" variant="secondary">Ré-ouvrir le dialogue</Button>
        <RefusalReasonDialog
          :open="open"
          candidat-label="Camille Bernard"
          @update:open="(v) => open = v"
          @cancel="open = false"
          @confirm="(p) => { console.log('confirm', p); open = false; }"
        />
      </div>
    `,
  }),
}
