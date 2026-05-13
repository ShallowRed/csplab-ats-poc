import type { Meta, StoryObj } from '@storybook/vue3'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

const meta = {
  title: '03 — Molécules/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Popover, PopoverContent, PopoverTrigger, Button },
    template: `
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="secondary">Ouvrir le popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div style="display: flex; flex-direction: column; gap: var(--csplab-space-2); min-width: 240px;">
            <strong>Détails complémentaires</strong>
            <p style="margin: 0; color: var(--text-mention-grey); font-size: var(--csplab-font-size-sm);">
              Le popover sert aux contenus secondaires (filtres avancés, sélecteur, raccourcis).
            </p>
          </div>
        </PopoverContent>
      </Popover>
    `,
  }),
}
