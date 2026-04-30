import type { Meta, StoryObj } from '@storybook/vue3'
import { Button } from './index'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
  args: {
    default: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">{{ args.default }}</Button>',
  }),
  args: {
    default: 'Button',
    variant: 'default',
    size: 'default',
  },
}

export const Variants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
        </div>
        <div class="flex gap-4 items-center">
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex gap-4 items-center">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🔔</Button>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex gap-4 items-center">
        <Button>Normal</Button>
        <Button disabled>Disabled</Button>
      </div>
    `,
  }),
}
