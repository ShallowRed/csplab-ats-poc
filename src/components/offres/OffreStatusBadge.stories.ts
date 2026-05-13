import type { Meta, StoryObj } from '@storybook/vue3'
import OffreStatusBadge from './OffreStatusBadge.vue'

const meta = {
  title: '04 — Composants métier/Offres/OffreStatusBadge',
  component: OffreStatusBadge,
  tags: ['autodocs'],
  argTypes: {
    statut: {
      control: 'inline-radio',
      options: ['brouillon', 'ouverte', 'fermee', 'archivee'],
    },
  },
} satisfies Meta<typeof OffreStatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Brouillon: Story = { args: { statut: 'brouillon' } }
export const Ouverte: Story = { args: { statut: 'ouverte' } }
export const Fermee: Story = { args: { statut: 'fermee' } }
export const Archivee: Story = { args: { statut: 'archivee' } }
