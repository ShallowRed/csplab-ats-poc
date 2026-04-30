import { defineStore } from 'pinia'
import { ref } from 'vue'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export type ViewMode = 'table' | 'kanban'

export type ViewSwitcherItem = {
  value: string
  label: string
  icon?: string
}

export type ViewSwitcher = {
  current: string
  items: ViewSwitcherItem[]
  onChange: (value: string) => void
}

export const usePageHeader = defineStore('pageHeader', () => {
  const title = ref<string>('')
  const breadcrumb = ref<BreadcrumbItem[]>([])
  const viewSwitcher = ref<ViewSwitcher | null>(null)

  function setTitle(value: string): void {
    title.value = value
  }

  function setBreadcrumb(items: BreadcrumbItem[]): void {
    breadcrumb.value = items
  }

  function setViewSwitcher(value: ViewSwitcher | null): void {
    viewSwitcher.value = value
  }

  function reset(): void {
    title.value = ''
    breadcrumb.value = []
    viewSwitcher.value = null
  }

  return {
    title,
    breadcrumb,
    viewSwitcher,
    setTitle,
    setBreadcrumb,
    setViewSwitcher,
    reset,
  }
})
