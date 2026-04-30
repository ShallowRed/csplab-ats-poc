import type { Meta, StoryObj } from '@storybook/vue3'
import { onMounted } from 'vue'
import HeaderContextual from './HeaderContextual.vue'
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

export const TitreSimple: Story = {
  render: () => ({
    components: { HeaderContextual },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Pipeline')
      })

      return {}
    },
    template: '<HeaderContextual />',
  }),
}

export const AvecBreadcrumb: Story = {
  render: () => ({
    components: { HeaderContextual },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Fiche candidat')
        pageHeader.setBreadcrumb([
          { label: 'Candidatures', to: '/candidatures' },
          { label: 'Fiche candidat' },
        ])
      })

      return {}
    },
    template: '<HeaderContextual />',
  }),
}

export const AvecSelecteurDeVue: Story = {
  render: () => ({
    components: { HeaderContextual },
    setup() {
      const pageHeader = usePageHeader()

      onMounted(() => {
        pageHeader.reset()
        pageHeader.setTitle('Pipeline')
        pageHeader.setViewSwitcher({
          current: 'kanban',
          onChange: (value) => {
            if (!pageHeader.viewSwitcher) return
            pageHeader.viewSwitcher.current = value
          },
        })
      })

      return {}
    },
    template: '<HeaderContextual />',
  }),
}
