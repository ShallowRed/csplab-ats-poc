import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DsfrPagination from '@/components/ui/pagination/DsfrPagination.vue'

const meta = {
  title: '02 — Atomes/Pagination',
  component: DsfrPagination,
  tags: ['autodocs'],
} satisfies Meta<typeof DsfrPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { DsfrPagination },
    setup: () => ({ page: ref(1) }),
    template: `
      <DsfrPagination :page="page" :page-size="20" :total="247" @update:page="(p) => page = p" />
    `,
  }),
}

export const SecondePage: Story = {
  render: () => ({
    components: { DsfrPagination },
    setup: () => ({ page: ref(3) }),
    template: `
      <DsfrPagination :page="page" :page-size="20" :total="247" @update:page="(p) => page = p" />
    `,
  }),
}

export const PageUnique: Story = {
  render: () => ({
    components: { DsfrPagination },
    setup: () => ({ page: ref(1) }),
    template: `
      <DsfrPagination :page="page" :page-size="20" :total="8" @update:page="(p) => page = p" />
    `,
  }),
}
