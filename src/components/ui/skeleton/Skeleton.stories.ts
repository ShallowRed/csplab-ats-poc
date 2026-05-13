import type { Meta, StoryObj } from '@storybook/vue3'
import { Skeleton } from '@/components/ui/skeleton'

const meta = {
  title: '02 — Atomes/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Skeleton },
    template: '<Skeleton class="h-6 w-48" />',
  }),
}

export const CarteCandidatLoading: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div style="border: 1px solid var(--border-default-grey); border-radius: var(--csplab-radius-md); padding: var(--csplab-space-3); width: 280px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <div style="display: flex; align-items: center; gap: var(--csplab-space-2);">
          <Skeleton class="h-6 w-6 rounded-full" />
          <Skeleton class="h-4 w-32" />
        </div>
        <Skeleton class="h-3 w-40" />
        <div style="display: flex; gap: var(--csplab-space-1);">
          <Skeleton class="h-5 w-12" />
          <Skeleton class="h-5 w-16" />
        </div>
      </div>
    `,
  }),
}
