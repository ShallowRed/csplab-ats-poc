import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger } from './index'
import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'

const meta = {
  title: '03 — Molécules/Dialog',
  component: Dialog,
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, Button, Input, Label },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button variant="tertiary">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Edit profile</DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">Name</Label>
              <Input id="name" value="Pedro Duarte" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="username" class="text-right">Username</Label>
              <Input id="username" value="@peduarte" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}
