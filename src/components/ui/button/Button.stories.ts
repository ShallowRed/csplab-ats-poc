import type { Meta, StoryObj } from '@storybook/vue3'
import { Bell, Plus } from 'lucide-vue-next'
import { Button } from './index'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'tertiary-no-outline', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
  args: {
    default: 'Bouton',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const VARIANTS = ['primary', 'secondary', 'tertiary', 'tertiary-no-outline', 'destructive'] as const
const SIZES = ['sm', 'md', 'lg', 'icon'] as const

export const Default: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">{{ args.default }}</Button>',
  }),
  args: {
    default: 'Bouton',
    variant: 'primary',
    size: 'md',
  },
}

export const Matrix: Story = {
  render: () => ({
    components: { Button },
    setup() {
      return { variants: VARIANTS, sizes: SIZES }
    },
    template: `
      <div class="flex flex-col gap-6">
        <div v-for="v in variants" :key="v" class="flex flex-col gap-2">
          <div class="text-xs font-medium uppercase tracking-wide text-[var(--text-mention-grey)]">{{ v }}</div>
          <div class="flex gap-3 items-center">
            <Button v-for="s in sizes" :key="s" :variant="v" :size="s" :aria-label="s === 'icon' ? v + ' icon' : undefined">
              <template v-if="s === 'icon'">★</template>
              <template v-else>{{ s }}</template>
            </Button>
          </div>
        </div>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex gap-3 items-center flex-wrap">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="tertiary-no-outline">Tertiary no outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex gap-3 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Notifications">★</Button>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { Button },
    setup() {
      return { variants: VARIANTS }
    },
    template: `
      <div class="flex flex-col gap-3">
        <div v-for="v in variants" :key="v" class="flex gap-3 items-center">
          <span class="w-40 text-xs font-medium uppercase tracking-wide text-[var(--text-mention-grey)]">{{ v }}</span>
          <Button :variant="v">Default</Button>
          <Button :variant="v" disabled>Disabled</Button>
        </div>
      </div>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { Button, Plus },
    template: `
      <div class="flex gap-3 items-center">
        <Button variant="primary"><Plus class="h-4 w-4" aria-hidden="true" />Ajouter</Button>
        <Button variant="secondary"><Plus class="h-4 w-4" aria-hidden="true" />Ajouter</Button>
        <Button variant="tertiary"><Plus class="h-4 w-4" aria-hidden="true" />Ajouter</Button>
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { Button, Bell },
    template: `
      <div class="flex gap-3 items-center">
        <Button variant="primary" size="icon" aria-label="Notifications"><Bell class="h-4 w-4" aria-hidden="true" /></Button>
        <Button variant="secondary" size="icon" aria-label="Notifications"><Bell class="h-4 w-4" aria-hidden="true" /></Button>
        <Button variant="tertiary" size="icon" aria-label="Notifications"><Bell class="h-4 w-4" aria-hidden="true" /></Button>
        <Button variant="tertiary-no-outline" size="icon" aria-label="Notifications"><Bell class="h-4 w-4" aria-hidden="true" /></Button>
      </div>
    `,
  }),
}

