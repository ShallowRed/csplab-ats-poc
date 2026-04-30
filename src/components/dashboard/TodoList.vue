<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import type { TodoItem } from '@/composables/useDashboardMetrics'

const props = withDefaults(
  defineProps<{
    items: TodoItem[]
    max?: number
  }>(),
  { max: 5 },
)

const visibleItems = computed(() => props.items.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.items.length - props.max))
</script>

<template>
  <div class="todo-list">
    <ul
      v-if="visibleItems.length > 0"
      class="todo-list__items"
    >
      <li
        v-for="item in visibleItems"
        :key="item.id"
        class="todo-list__item"
      >
        <RouterLink
          :to="item.to"
          class="todo-list__link"
          :data-testid="`todo-${item.id}`"
        >
          <RiIcon
            v-if="item.icon"
            :name="item.icon"
            :size="18"
            class="todo-list__icon"
          />
          <span class="todo-list__body">
            <span class="todo-list__title">{{ item.title }}</span>
            <span
              v-if="item.subtitle"
              class="todo-list__subtitle"
            >
              {{ item.subtitle }}
            </span>
          </span>
          <span
            v-if="item.badge"
            class="todo-list__badge"
          >
            {{ item.badge }}
          </span>
          <RiIcon
            name="ri:arrow-right-s-line"
            :size="16"
            class="todo-list__chevron"
          />
        </RouterLink>
      </li>
    </ul>

    <p
      v-else
      class="todo-list__empty"
    >
      Aucune action requise.
    </p>

    <p
      v-if="overflow > 0"
      class="todo-list__more"
    >
      +{{ overflow }} autre{{ overflow > 1 ? 's' : '' }} action{{ overflow > 1 ? 's' : '' }}
    </p>
  </div>
</template>

<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.todo-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.todo-list__item + .todo-list__item {
  border-top: 1px solid var(--border-default-grey);
}

.todo-list__link {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  text-decoration: none;
  color: inherit;
  border-radius: var(--csplab-radius-sm);
}

.todo-list__link:hover {
  background: var(--background-alt-grey);
}

.todo-list__link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: -2px;
}

.todo-list__icon {
  color: var(--text-mention-grey);
  flex-shrink: 0;
}

.todo-list__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.todo-list__title {
  color: var(--text-default-grey);
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.todo-list__subtitle {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-xs);
}

.todo-list__badge {
  background: var(--background-contrast-warning);
  color: var(--text-default-warning);
  border-radius: var(--csplab-radius-sm);
  font-size: var(--csplab-font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
}

.todo-list__chevron {
  color: var(--text-mention-grey);
  flex-shrink: 0;
}

.todo-list__empty {
  margin: 0;
  padding: var(--csplab-space-4) var(--csplab-space-3);
  text-align: center;
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
}

.todo-list__more {
  margin: 0;
  padding: var(--csplab-space-1) var(--csplab-space-3) 0;
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}
</style>
