import type { Meta, StoryObj } from '@storybook/vue3'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './index'
import { Button } from '../button'

const meta = {
  title: '03 — Molécules/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button },
    template: `
      <Card class="w-[360px]">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Vous avez 3 nouveaux messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm">Contenu de la carte. Texte standard sur fond contrast-grey.</p>
        </CardContent>
        <CardFooter>
          <Button>Voir tout</Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const Hierarchy: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <div class="flex flex-col gap-8 p-6" style="background: var(--background-default-grey);">
        <section>
          <h3 class="text-sm font-medium mb-2 text-[var(--text-mention-grey)]">
            1. Carte sur fond page (default-grey)
          </h3>
          <Card class="w-[360px]">
            <CardHeader>
              <CardTitle>Carte directe</CardTitle>
              <CardDescription>contrast-grey sur default-grey</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm">Le fond contrast-grey doit ressortir nettement vs la page.</p>
            </CardContent>
          </Card>
        </section>

        <section style="background: var(--background-alt-grey); padding: 1rem; border-radius: 8px;">
          <h3 class="text-sm font-medium mb-2 text-[var(--text-mention-grey)]">
            2. Carte dans wrapper alt-grey (ex. colonne kanban)
          </h3>
          <Card class="w-[360px]">
            <CardHeader>
              <CardTitle>Carte sur section</CardTitle>
              <CardDescription>contrast-grey sur alt-grey</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm">Le contraste reste lisible : alt-grey #f6f6f6 → contrast-grey #eeeeee.</p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h3 class="text-sm font-medium mb-2 text-[var(--text-mention-grey)]">
            3. Cartes imbriquées (carte enfant dans carte)
          </h3>
          <Card class="w-[420px]">
            <CardHeader>
              <CardTitle>Carte parente</CardTitle>
              <CardDescription>contrast-grey + bordure</CardDescription>
            </CardHeader>
            <CardContent>
              <Card class="border-[var(--border-default-grey)]" style="background: var(--background-elevated-grey);">
                <CardHeader>
                  <CardTitle class="text-base">Carte enfant</CardTitle>
                  <CardDescription>elevated-grey pour rester visible</CardDescription>
                </CardHeader>
                <CardContent>
                  <p class="text-sm">Imbrication : la bordure et le fond elevated-grey distinguent l'enfant.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </section>
      </div>
    `,
  }),
}
