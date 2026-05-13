import type { Meta, StoryObj } from '@storybook/vue3'
import { Avatar, AvatarImage, AvatarFallback } from './index'

const meta = {
  title: '02 — Atomes/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    `,
  }),
}

export const Fallback: Story = {
  render: () => ({
    components: { Avatar, AvatarFallback },
    template: `
      <Avatar>
        <AvatarFallback>MP</AvatarFallback>
      </Avatar>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Avatar, AvatarImage, AvatarFallback },
    template: `
      <div class="flex gap-4 items-center">
        <Avatar class="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback class="text-xs">SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar class="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback class="text-lg">LG</AvatarFallback>
        </Avatar>
      </div>
    `,
  }),
}
