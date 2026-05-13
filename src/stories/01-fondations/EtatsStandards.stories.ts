import type { Meta, StoryObj } from '@storybook/vue3'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'

const meta = {
  title: '01 — Fondations/États standards',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Catalogue des 4 états standards à supporter dans chaque section data : **Loading / Empty / Error / Success**.\n\n'
          + 'Référence : DDR-008. Toute section ATS qui consomme un store ou un appel asynchrone doit déclarer ces 4 stories.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div style="padding: var(--csplab-space-6); max-width: 720px; display: flex; flex-direction: column; gap: var(--csplab-space-3);">
        <Skeleton class="h-8 w-1/3" />
        <Skeleton class="h-4 w-2/3" />
        <Skeleton class="h-4 w-1/2" />
        <div style="display: flex; gap: var(--csplab-space-3); margin-top: var(--csplab-space-4);">
          <Skeleton class="h-24 w-1/3" />
          <Skeleton class="h-24 w-1/3" />
          <Skeleton class="h-24 w-1/3" />
        </div>
      </div>
    `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { EmptyState, Button },
    template: `
      <div style="padding: var(--csplab-space-8); background: var(--background-alt-grey); min-height: 320px; display: grid; place-items: center;">
        <EmptyState
          icon="ri:inbox-line"
          title="Aucune candidature pour cette offre"
          description="Les candidatures déposées apparaîtront ici dès leur réception."
          size="md"
        >
          <template #actions>
            <Button variant="secondary" size="sm">Partager le lien de candidature</Button>
          </template>
        </EmptyState>
      </div>
    `,
  }),
}

export const Error: Story = {
  render: () => ({
    components: { EmptyState, Button },
    template: `
      <div style="padding: var(--csplab-space-8); background: var(--background-alt-grey); min-height: 320px; display: grid; place-items: center;">
        <div style="text-align: center; max-width: 420px;">
          <div style="width: 56px; height: 56px; border-radius: 999px; background: var(--background-contrast-error); color: var(--text-default-error); display: grid; place-items: center; margin: 0 auto var(--csplab-space-4); font-size: 28px;">!</div>
          <h3 style="margin: 0 0 var(--csplab-space-2); font-size: var(--csplab-font-size-lg); color: var(--text-title-grey);">Impossible de charger les candidatures</h3>
          <p style="margin: 0 0 var(--csplab-space-4); color: var(--text-mention-grey); font-size: var(--csplab-font-size-sm);">Une erreur est survenue côté serveur. Vous pouvez réessayer ou recharger la page.</p>
          <Button variant="secondary" size="sm">Réessayer</Button>
        </div>
      </div>
    `,
  }),
}

export const Success: Story = {
  render: () => ({
    template: `
      <div style="padding: var(--csplab-space-6); max-width: 640px;">
        <p style="color: var(--text-mention-grey); margin-bottom: var(--csplab-space-3);">État nominal : contenu disponible et chargé.</p>
        <div style="background: var(--background-default-grey); border: 1px solid var(--border-default-grey); border-radius: var(--csplab-radius-md); padding: var(--csplab-space-4);">
          <h3 style="margin: 0 0 var(--csplab-space-2); color: var(--text-title-grey);">12 candidatures à traiter</h3>
          <p style="margin: 0; color: var(--text-default-grey);">Données mock chargées depuis seed.ts</p>
        </div>
      </div>
    `,
  }),
}
