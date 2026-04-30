<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePageHeader, type ViewMode } from '@/stores/pageHeader'

const pageHeader = usePageHeader()

const viewModel = computed<ViewMode | undefined>({
  get() {
    return pageHeader.viewSwitcher?.current
  },
  set(value) {
    if (!value || !pageHeader.viewSwitcher) return
    pageHeader.viewSwitcher.onChange(value)
  },
})
</script>

<template>
  <header
    role="banner"
    class="csplab-header"
  >
    <div class="csplab-header__left">
      <nav
        v-if="pageHeader.breadcrumb.length > 0"
        aria-label="Fil d'Ariane"
        class="csplab-header__breadcrumb"
      >
        <ol class="csplab-header__breadcrumb-list">
          <li
            v-for="(item, idx) in pageHeader.breadcrumb"
            :key="`${idx}-${item.label}`"
            class="csplab-header__breadcrumb-item"
          >
            <RouterLink
              v-if="item.to"
              :to="item.to"
              class="csplab-header__breadcrumb-link"
            >
              {{ item.label }}
            </RouterLink>
            <span
              v-else
              class="csplab-header__breadcrumb-label"
            >
              {{ item.label }}
            </span>
            <span
              v-if="idx < pageHeader.breadcrumb.length - 1"
              aria-hidden="true"
              class="csplab-header__breadcrumb-sep"
            >
              ›
            </span>
          </li>
        </ol>
      </nav>

      <div class="csplab-header__title">
        {{ pageHeader.title }}
      </div>
    </div>

    <div class="csplab-header__center">
      <Tabs
        v-if="pageHeader.viewSwitcher"
        v-model="viewModel"
      >
        <TabsList class="csplab-header__tabs">
          <TabsTrigger value="kanban">
            Kanban
          </TabsTrigger>
          <TabsTrigger value="table">
            Table
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <div class="csplab-header__right">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.csplab-header {
  height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 var(--csplab-space-6);
  background: var(--background-default-grey);
  border-bottom: 1px solid var(--border-default-grey);
  gap: var(--csplab-space-4);
}

.csplab-header__left {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.csplab-header__title {
  font-size: var(--csplab-font-size-lg);
  font-weight: 700;
  color: var(--text-title-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-header__breadcrumb {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.csplab-header__breadcrumb-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-1);
  margin: 0;
  padding: 0;
}

.csplab-header__breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.csplab-header__breadcrumb-link {
  color: var(--text-action-high-blue-france);
  text-decoration: none;
}

.csplab-header__breadcrumb-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.csplab-header__breadcrumb-sep {
  margin: 0 var(--csplab-space-1);
  color: var(--text-mention-grey);
}

.csplab-header__center {
  display: flex;
  justify-content: center;
}

.csplab-header__tabs {
  background: var(--background-alt-grey);
}

.csplab-header__right {
  display: flex;
  justify-content: flex-end;
  gap: var(--csplab-space-2);
}
</style>
