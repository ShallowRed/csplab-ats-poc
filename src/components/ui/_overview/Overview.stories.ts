import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Button } from '../button'
import { Badge } from '../badge'
import { Avatar, AvatarImage, AvatarFallback } from '../avatar'
import { Checkbox } from '../checkbox'
import { RadioGroup, RadioGroupItem } from '../radio-group'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Label } from '../label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'
import { Separator } from '../separator'
import { Skeleton } from '../skeleton'

const meta = {
  title: 'UI/Overview',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AllComponents: Story = {
  render: () => ({
    components: {
      Button,
      Badge,
      Avatar,
      AvatarImage,
      AvatarFallback,
      Checkbox,
      RadioGroup,
      RadioGroupItem,
      Input,
      Textarea,
      Label,
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
      Separator,
      Skeleton,
    },
    setup() {
      const checked = ref(false)
      const radioValue = ref('option1')
      return { checked, radioValue }
    },
    template: `
      <div class="p-8 space-y-8 max-w-4xl">
        <div>
          <h2 class="text-2xl font-bold mb-4">Composants UI - Catalogue</h2>
          <p class="text-muted-foreground">
            Recette de composants shadcn-vue adaptés aux tokens DSFR pour le POC CSPLab ATS.
          </p>
        </div>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Button</h3>
          <div class="flex gap-3 flex-wrap">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Badge</h3>
          <div class="space-y-2">
            <div class="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div class="flex gap-2 flex-wrap">
              <Badge variant="status-draft">Brouillon</Badge>
              <Badge variant="status-submitted">Soumise</Badge>
              <Badge variant="status-screening">Présélection</Badge>
              <Badge variant="status-interview">Entretien</Badge>
              <Badge variant="status-offer">Offre</Badge>
              <Badge variant="status-rejected">Rejetée</Badge>
              <Badge variant="status-archived">Archivée</Badge>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Avatar</h3>
          <div class="flex gap-3 items-center">
            <Avatar class="h-6 w-6">
              <AvatarFallback class="text-xs">SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar class="h-12 w-12">
              <AvatarFallback class="text-lg">LG</AvatarFallback>
            </Avatar>
          </div>
        </section>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Form Controls</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Checkbox id="demo" v-model:checked="checked" />
              <Label for="demo">Accept terms and conditions</Label>
            </div>
            <RadioGroup v-model="radioValue">
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label for="r1">Option 1</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label for="r2">Option 2</Label>
              </div>
            </RadioGroup>
            <div class="space-y-2">
              <Label for="input">Input</Label>
              <Input id="input" placeholder="Saisir du texte..." />
            </div>
            <div class="space-y-2">
              <Label for="textarea">Textarea</Label>
              <Textarea id="textarea" placeholder="Saisir un commentaire..." />
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Card</h3>
          <Card class="w-[350px]">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p class="text-sm">Card content area with any elements.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <h3 class="text-xl font-semibold mb-3">Skeleton</h3>
          <div class="space-y-2">
            <Skeleton class="h-12 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
            <Skeleton class="h-4 w-[150px]" />
          </div>
        </section>
      </div>
    `,
  }),
}
