import type { Meta, StoryObj } from '@storybook/vue3'
import { Tag } from '@/components/ui/tag'

const meta = {
  title: '02 — Atomes/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['static', 'dismissible', 'pressable'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    pressed: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Statique: Story = {
  args: { type: 'static', size: 'md' },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: '<Tag v-bind="args">senior</Tag>',
  }),
}

export const Tailles: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: var(--csplab-space-2); align-items: center;">
        <Tag size="sm">sm</Tag>
        <Tag size="md">md</Tag>
      </div>
    `,
  }),
}

export const Pressable: Story = {
  args: { type: 'pressable', pressed: false },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: '<Tag v-bind="args">Filtre actif</Tag>',
  }),
}

export const Dismissible: Story = {
  args: { type: 'dismissible' },
  render: (args) => ({
    components: { Tag },
    setup: () => ({ args }),
    template: '<Tag v-bind="args" aria-label="Retirer le filtre senior">senior</Tag>',
  }),
}

export const ListeFilters: Story = {
  render: () => ({
    components: { Tag },
    template: `
      <div style="display: flex; gap: var(--csplab-space-2); flex-wrap: wrap;">
        <Tag type="dismissible">Étape : Présélection</Tag>
        <Tag type="dismissible">Score ≥ 3</Tag>
        <Tag type="dismissible">Intervieweur : Dupont</Tag>
        <Tag type="dismissible">Recherche : « junior »</Tag>
      </div>
    `,
  }),
}
