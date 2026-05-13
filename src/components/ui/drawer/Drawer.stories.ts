import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTrigger } from './index'
import { Button } from '../button'

const meta = {
  title: '03 — Molécules/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTrigger, Button },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <Drawer v-model:open="open">
        <DrawerTrigger as-child>
          <Button variant="tertiary">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Fiche candidat</DrawerHeader>
          <div class="p-4">
            <p class="text-sm text-muted-foreground mb-4">
              Détails du candidat s'affichent ici en panneau latéral droit.
            </p>
            <div class="space-y-2">
              <div><strong>Nom:</strong> Marie Dupont</div>
              <div><strong>Email:</strong> marie.dupont@example.com</div>
              <div><strong>Téléphone:</strong> +33 6 12 34 56 78</div>
              <div><strong>Statut:</strong> Entretien</div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Save</Button>
            <Button variant="tertiary" @click="open = false">Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}
