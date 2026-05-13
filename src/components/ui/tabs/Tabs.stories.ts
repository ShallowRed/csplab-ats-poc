import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './index'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'

const meta = {
  title: '03 — Molécules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, CardDescription, CardHeader, CardTitle },
    setup() {
      const activeTab = ref('account')
      return { activeTab }
    },
    template: `
      <Tabs v-model="activeTab" class="w-[400px]">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <p class="text-sm">Account content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <p class="text-sm">Password content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    `,
  }),
}
