import type { Meta, StoryObj } from '@storybook/vue3'
import { onMounted } from 'vue'
import HeaderContextual from './HeaderContextual.vue'
import { Button } from '@/components/ui/button'
import { usePageHeader } from '@/stores/pageHeader'

const meta = {
  title: 'Layout/HeaderContextual',
  component: HeaderContextual,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeaderContextual>

export default meta
type Story = StoryObj<typeof meta>

export const BasicNoTabs: Story = {
  render: () => ({
    components: { HeaderContextual, Button },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Mes offres')
        pageHeader.setBreadcrumb([
          { label: 'Pilotage' },
          { label: 'Mes offres' },
        ])
      })

      return {}
    },
    template: `
      <HeaderContextual>
        <template #actions>
          <Button variant="tertiary" size="sm">Exporter</Button>
          <Button size="sm">Nouvelle offre</Button>
        </template>
      </HeaderContextual>
    `,
  }),
}

export const WithTabs: Story = {
  render: () => ({
    components: { HeaderContextual, Button },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Pipeline')
        pageHeader.setBreadcrumb([
          { label: 'Candidatures' },
          { label: 'Pipeline' },
        ])
        pageHeader.setViewSwitcher({
          current: 'kanban',
          items: [
            { value: 'kanban', label: 'Kanban', icon: 'ri-layout-column-line' },
            { value: 'table', label: 'Tableau', icon: 'ri-table-line' },
          ],
          onChange: (value) => {
            if (!pageHeader.viewSwitcher) return
            pageHeader.viewSwitcher.current = value
          },
        })
      })

      return {}
    },
    template: `
      <HeaderContextual>
        <template #actions>
          <Button variant="tertiary" size="sm">Filtres</Button>
          <Button size="sm">+ Candidat</Button>
        </template>
      </HeaderContextual>
    `,
  }),
}

export const WithSubtitle: Story = {
  render: () => ({
    components: { HeaderContextual, Button },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Développeur·euse Vue.js senior')
        pageHeader.setBreadcrumb([
          { label: 'Pilotage' },
          { label: 'Mes offres', to: '/offres' },
          { label: 'Développeur·euse Vue.js senior' },
        ])
      })

      return {}
    },
    template: `
      <HeaderContextual>
        <template #subtitle>
          <span>📍 Paris</span>
          <span>CDI</span>
          <span>Réf. #1234</span>
        </template>
        <template #actions>
          <Button variant="tertiary" size="sm">Partager</Button>
          <Button variant="secondary" size="sm">Aperçu</Button>
          <Button size="sm">Modifier</Button>
        </template>
      </HeaderContextual>
    `,
  }),
}

export const WithTabsActions: Story = {
  render: () => ({
    components: { HeaderContextual, Button },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Pipeline')
        pageHeader.setBreadcrumb([
          { label: 'Candidatures' },
          { label: 'Pipeline' },
        ])
        pageHeader.setViewSwitcher({
          current: 'table',
          items: [
            { value: 'kanban', label: 'Kanban', icon: 'ri-layout-column-line' },
            { value: 'table', label: 'Tableau', icon: 'ri-table-line' },
          ],
          onChange: (value) => {
            if (!pageHeader.viewSwitcher) return
            pageHeader.viewSwitcher.current = value
          },
        })
      })

      return {}
    },
    template: `
      <HeaderContextual>
        <template #actions>
          <Button variant="tertiary" size="sm">Exporter</Button>
        </template>
        <template #tabs-actions>
          <Button size="sm">+ Ajouter candidat</Button>
        </template>
      </HeaderContextual>
    `,
  }),
}
