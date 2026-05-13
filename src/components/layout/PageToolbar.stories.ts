import type { Meta, StoryObj } from '@storybook/vue3'
import PageToolbar from './PageToolbar.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: '05 — Sections génériques/PageToolbar',
  component: PageToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PageToolbar, Button, Badge },
    template: `
      <PageToolbar>
        <template #left>
          <Badge variant="secondary">Filtre actif</Badge>
          <Badge variant="secondary">Score ≥ 3</Badge>
        </template>
        <template #right>
          <Button variant="tertiary">Filtrer</Button>
          <Button variant="tertiary-no-outline">Réinitialiser</Button>
        </template>
      </PageToolbar>
    `,
  }),
}

export const SelectionMode: Story = {
  render: () => ({
    components: { PageToolbar, Button, Badge },
    template: `
      <PageToolbar :selection-active="true">
        <template #selection>
          <div style="display:flex;align-items:center;gap:var(--csplab-space-3)">
            <Badge variant="secondary">3 sélectionné(e)(s)</Badge>
            <Button variant="tertiary-no-outline" size="sm">Désélectionner</Button>
          </div>
          <div style="display:flex;align-items:center;gap:var(--csplab-space-2)">
            <Button variant="tertiary" size="sm">Changer l'étape</Button>
            <Button variant="destructive" size="sm">Archiver</Button>
          </div>
        </template>
      </PageToolbar>
    `,
  }),
}
