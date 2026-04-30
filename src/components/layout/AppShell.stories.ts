import type { Meta, StoryObj } from '@storybook/vue3'
import { onMounted } from 'vue'
import AppShell from './AppShell.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageHeader } from '@/stores/pageHeader'

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { AppShell, Card, CardContent, CardHeader, CardTitle },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Démo AppShell')
      })

      return {}
    },
    template: `
      <AppShell>
        <div style="max-width: 1200px; margin: 0 auto; padding: var(--csplab-space-6);">
          <Card>
            <CardHeader>
              <CardTitle>Page de démonstration</CardTitle>
            </CardHeader>
            <CardContent>
              <p style="color: var(--text-mention-grey); margin: 0;">Placeholder pour valider le shell.</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    `,
  }),
}
