import type { Meta, StoryObj } from '@storybook/vue3'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

const meta = {
  title: '03 — Molécules/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const ActionsCarte: Story = {
  render: () => ({
    components: { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Button, RiIcon },
    template: `
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="tertiary-no-outline" size="icon" aria-label="Actions">
            <RiIcon name="ri:more-2-fill" :size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Voir la fiche</DropdownMenuItem>
          <DropdownMenuItem>Planifier un entretien</DropdownMenuItem>
          <DropdownMenuItem>Envoyer un email</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Archiver</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    `,
  }),
}
