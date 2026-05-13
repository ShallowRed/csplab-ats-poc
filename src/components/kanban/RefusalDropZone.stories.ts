import type { Meta, StoryObj } from '@storybook/vue3'
import { DragDropProvider } from '@dnd-kit/vue'
import RefusalDropZone from '@/components/kanban/RefusalDropZone.vue'

const meta = {
  title: '04 — Composants métier/Pipeline/RefusalDropZone',
  component: RefusalDropZone,
  tags: ['autodocs'],
} satisfies Meta<typeof RefusalDropZone>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: { refusedEtapeId: 'etape-7', keyboardActive: false },
  render: (args) => ({
    components: { RefusalDropZone, DragDropProvider },
    setup: () => ({ args }),
    template: '<DragDropProvider><RefusalDropZone v-bind="args" /></DragDropProvider>',
  }),
}

export const KeyboardActive: Story = {
  args: { refusedEtapeId: 'etape-7', keyboardActive: true },
  render: (args) => ({
    components: { RefusalDropZone, DragDropProvider },
    setup: () => ({ args }),
    template: '<DragDropProvider><RefusalDropZone v-bind="args" /></DragDropProvider>',
  }),
}
