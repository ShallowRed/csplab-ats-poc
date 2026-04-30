import type { Meta, StoryObj } from '@storybook/vue3'
import EmptyState from './EmptyState.vue'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Aucun élément',
  },
}

export const Compact: Story = {
  args: {
    title: 'Aucun candidat à cette étape',
    size: 'sm',
  },
}

export const WithIcon: Story = {
  args: {
    icon: 'ri:inbox-line',
    title: 'Aucune candidature pour cette offre',
    size: 'md',
  },
}

export const WithDescription: Story = {
  args: {
    icon: 'ri:filter-off-line',
    title: 'Aucune candidature ne correspond aux filtres',
    description: 'Modifiez ou réinitialisez les filtres pour afficher des candidatures',
    size: 'md',
  },
}
