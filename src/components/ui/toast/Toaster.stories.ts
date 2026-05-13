import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { Toaster } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { useToastStore } from '@/stores/toast'

const meta = {
  title: '03 — Molécules/Toaster',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    () => {
      setActivePinia(createPinia())
      return { template: '<story />' }
    },
  ],
  render: () => ({
    components: { Toaster, Button },
    setup() {
      const toast = useToastStore()
      function success() { toast.success('Candidature déplacée vers Présélection') }
      function info() { toast.info('Mode brouillon activé') }
      function error() { toast.error('Le déplacement a échoué — réessayer ?') }
      return { success, info, error }
    },
    template: `
      <div style="padding: var(--csplab-space-6); display: flex; gap: var(--csplab-space-2); flex-wrap: wrap;">
        <Button variant="secondary" @click="success">Toast succès</Button>
        <Button variant="secondary" @click="info">Toast info</Button>
        <Button variant="destructive" @click="error">Toast erreur</Button>
        <Toaster />
      </div>
    `,
  }),
}
