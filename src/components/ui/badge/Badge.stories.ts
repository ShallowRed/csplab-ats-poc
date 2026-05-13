import type { Meta, StoryObj } from '@storybook/vue3'
import { Badge } from './index'

const meta = {
  title: '02 — Atomes/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'status-draft',
        'status-submitted',
        'status-screening',
        'status-interview',
        'status-offer',
        'status-rejected',
        'status-archived',
      ],
    },
  },
  args: {
    default: 'Badge',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">{{ args.default }}</Badge>',
  }),
  args: {
    default: 'Badge',
    variant: 'default',
  },
}

export const Variants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    `,
  }),
}

export const StatusVariants: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex gap-2 flex-wrap">
        <Badge variant="status-draft">Brouillon</Badge>
        <Badge variant="status-submitted">Soumise</Badge>
        <Badge variant="status-screening">Présélection</Badge>
        <Badge variant="status-interview">Entretien</Badge>
        <Badge variant="status-offer">Offre</Badge>
        <Badge variant="status-rejected">Rejetée</Badge>
        <Badge variant="status-archived">Archivée</Badge>
      </div>
    `,
  }),
}
