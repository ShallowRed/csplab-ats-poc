import type { Meta, StoryObj } from '@storybook/vue3'
import { setActivePinia, createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'

import OffresPage from './OffresPage.vue'
import { useOffresStore } from '@/stores/offres'

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/offres', component: OffresPage },
      { path: '/offres/nouvelle', component: { template: '<div />' } },
      { path: '/offres/:id', component: { template: '<div />' } },
      { path: '/offres/:id/edition', component: { template: '<div />' } },
      { path: '/pipeline/:offreId', component: { template: '<div />' } },
    ],
  })
}

const meta = {
  title: 'Pages/OffresPage',
  component: OffresPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof OffresPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const router = makeRouter()
        void router.push('/offres')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { OffresPage },
    template: '<OffresPage />',
  }),
}

export const Empty: Story = {
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        setActivePinia(createPinia())
        const store = useOffresStore()
        store.offres.forEach(o => store.archive(o.id))
        const router = makeRouter()
        void router.push('/offres')
        return { router }
      },
      template: '<div style="height: 100vh; display: flex; flex-direction: column;"><story /></div>',
    }),
  ],
  render: () => ({
    components: { OffresPage },
    template: '<OffresPage />',
  }),
}
