import type { Meta, StoryObj } from '@storybook/vue3'
import RiIcon from './RiIcon.vue'

const meta = {
  title: '02 — Atomes/RiIcon',
  component: RiIcon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
  },
  args: {
    name: 'ri:add-line',
    size: 16,
  },
} satisfies Meta<typeof RiIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { RiIcon },
    setup() {
      return { args }
    },
    template: '<RiIcon v-bind="args" />',
  }),
  args: { name: 'ri:add-line', size: 24 },
}

export const Sizes: Story = {
  render: () => ({
    components: { RiIcon },
    setup() {
      return { sizes: [12, 16, 20, 24, 32] }
    },
    template: `
      <div class="flex gap-4 items-end">
        <div v-for="s in sizes" :key="s" class="flex flex-col items-center gap-2">
          <RiIcon name="ri:add-line" :size="s" />
          <span class="text-xs text-[var(--text-mention-grey)]">{{ s }}px</span>
        </div>
      </div>
    `,
  }),
}

const SAMPLE_ICONS = [
  'ri:add-line',
  'ri:close-line',
  'ri:check-line',
  'ri:search-line',
  'ri:user-line',
  'ri:mail-line',
  'ri:calendar-line',
  'ri:edit-line',
  'ri:delete-bin-line',
  'ri:more-2-fill',
  'ri:arrow-right-line',
  'ri:settings-3-line',
  'ri:notification-3-line',
  'ri:eye-line',
  'ri:price-tag-3-line',
] as const

export const Sample: Story = {
  render: () => ({
    components: { RiIcon },
    setup() {
      return { icons: SAMPLE_ICONS }
    },
    template: `
      <div class="grid grid-cols-5 gap-4">
        <div v-for="icon in icons" :key="icon" class="flex flex-col items-center gap-2 p-3 border border-[var(--border-default-grey)] rounded">
          <RiIcon :name="icon" :size="24" />
          <code class="text-xs text-[var(--text-mention-grey)]">{{ icon }}</code>
        </div>
      </div>
    `,
  }),
}
