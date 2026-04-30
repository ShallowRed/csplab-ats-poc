<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { usePageHeader } from '@/stores/pageHeader'

const pageHeader = usePageHeader()

const viewModel = computed<string | undefined>({
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
    <div
      class="csplab-header__top"
      :class="{ 'csplab-header__top--no-tabs': !pageHeader.viewSwitcher }"
    >
      <div class="csplab-header__main">
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

        <h1 class="csplab-header__title">
          {{ pageHeader.title }}
        </h1>

        <div
          v-if="$slots.subtitle"
          class="csplab-header__subtitle"
        >
          <slot name="subtitle" />
        </div>
      </div>

      <div class="csplab-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div
      v-if="pageHeader.viewSwitcher"
      class="csplab-header__tabs-row"
    >
      <Tabs
        v-model="viewModel"
        class="csplab-header__tabs"
      >
        <TabsList
          variant="underline"
          class="csplab-header__tabs-list"
        >
          <TabsTrigger
            v-for="item in pageHeader.viewSwitcher.items"
            :key="item.value"
            :value="item.value"
            variant="underline"
            class="csplab-header__tab"
          >
            <RiIcon
              v-if="item.icon"
              :name="item.icon"
              :size="16"
              class="csplab-header__tab-icon"
            />
            {{ item.label }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div
        v-if="$slots['tabs-actions']"
        class="csplab-header__tabs-actions"
      >
        <slot name="tabs-actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.csplab-header {
  display: flex;
  flex-direction: column;
  background: var(--background-default-grey);
}

.csplab-header__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--csplab-space-4);
  padding: var(--csplab-space-4) var(--csplab-space-6) var(--csplab-space-3);
}

.csplab-header__top--no-tabs {
  border-bottom: 1px solid var(--border-default-grey);
}

.csplab-header__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
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

.csplab-header__breadcrumb-link:hover {
  text-decoration: underline;
}

.csplab-header__breadcrumb-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.csplab-header__breadcrumb-sep {
  margin: 0 var(--csplab-space-1);
  color: var(--text-mention-grey);
}

.csplab-header__title {
  font-size: var(--csplab-font-size-xl);
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-title-grey);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-header__subtitle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  margin-top: var(--csplab-space-1);
}

.csplab-header__subtitle :deep(> * + *)::before {
  content: '•';
  margin-right: var(--csplab-space-2);
  color: var(--text-mention-grey);
}

.csplab-header__actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  flex-shrink: 0;
}

.csplab-header__tabs-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--csplab-space-4);
  padding: 0 var(--csplab-space-6);
  border-bottom: 1px solid var(--border-default-grey);
}

.csplab-header__tabs {
  width: auto;
  flex: 0 0 auto;
}

.csplab-header__tabs-list {
  border-bottom: none;
}

.csplab-header__tab {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.csplab-header__tab-icon {
  flex-shrink: 0;
}

.csplab-header__tabs-actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  padding-bottom: var(--csplab-space-2);
}
</style>
