<script setup lang="ts">
import { computed } from 'vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

defineExpose({ totalPages })
const isFirst = computed(() => props.page <= 1)
const isLast = computed(() => props.page >= totalPages.value)

const pageNumbers = computed<Array<number | '…'>>(() => {
  const n = totalPages.value
  const p = props.page
  if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1)
  // Fenêtre glissante : toujours première, dernière, et 3 autour de la courante
  const pages = new Set<number>()
  pages.add(1)
  pages.add(n)
  for (let i = Math.max(2, p - 1); i <= Math.min(n - 1, p + 1); i++) pages.add(i)
  const sorted = Array.from(pages).sort((a, b) => a - b)
  const result: Array<number | '…'> = []
  let prev = 0
  for (const num of sorted) {
    if (num - prev > 1) result.push('…')
    result.push(num)
    prev = num
  }
  return result
})

function go(p: number): void {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <nav
    role="navigation"
    class="dsfr-pagination"
    aria-label="Pagination"
  >
    <ul class="dsfr-pagination__list">
      <!-- Première page -->
      <li>
        <button
          type="button"
          class="dsfr-pagination__link dsfr-pagination__link--first"
          title="Première page"
          :aria-disabled="isFirst || undefined"
          :disabled="isFirst"
          @click="go(1)"
        >
          <RiIcon
            name="ri:arrow-left-double-line"
            :size="16"
            aria-hidden="true"
          />
        </button>
      </li>

      <!-- Page précédente -->
      <li>
        <button
          type="button"
          class="dsfr-pagination__link dsfr-pagination__link--prev"
          title="Page précédente"
          :aria-disabled="isFirst || undefined"
          :disabled="isFirst"
          @click="go(page - 1)"
        >
          <RiIcon
            name="ri:arrow-left-s-line"
            :size="16"
            aria-hidden="true"
          />
        </button>
      </li>

      <!-- Numéros de pages -->
      <li
        v-for="(item, idx) in pageNumbers"
        :key="`${item}-${idx}`"
      >
        <span
          v-if="item === '…'"
          class="dsfr-pagination__link dsfr-pagination__link--ellipsis"
          aria-hidden="true"
        >…</span>
        <button
          v-else
          type="button"
          class="dsfr-pagination__link"
          :class="{ 'dsfr-pagination__link--active': item === page }"
          :title="`Page ${item}`"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </li>

      <!-- Page suivante -->
      <li>
        <button
          type="button"
          class="dsfr-pagination__link dsfr-pagination__link--next"
          title="Page suivante"
          :aria-disabled="isLast || undefined"
          :disabled="isLast"
          @click="go(page + 1)"
        >
          <RiIcon
            name="ri:arrow-right-s-line"
            :size="16"
            aria-hidden="true"
          />
        </button>
      </li>

      <!-- Dernière page -->
      <li>
        <button
          type="button"
          class="dsfr-pagination__link dsfr-pagination__link--last"
          title="Dernière page"
          :aria-disabled="isLast || undefined"
          :disabled="isLast"
          @click="go(totalPages)"
        >
          <RiIcon
            name="ri:arrow-right-double-line"
            :size="16"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.dsfr-pagination {
  display: flex;
  align-items: center;
}

.dsfr-pagination__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dsfr-pagination__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 var(--csplab-space-1);
  border: none;
  border-radius: var(--csplab-radius-sm);
  background: none;
  color: var(--text-action-high-blue-france);
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background 100ms ease;
}

.dsfr-pagination__link:hover:not(:disabled) {
  background: var(--background-default-grey-hover);
}

.dsfr-pagination__link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.dsfr-pagination__link:disabled {
  color: var(--text-disabled-grey);
  cursor: not-allowed;
}

.dsfr-pagination__link--active {
  background: var(--background-action-high-blue-france);
  color: var(--text-inverted-grey);
  cursor: default;
}

.dsfr-pagination__link--active:hover {
  background: var(--background-action-high-blue-france);
}

.dsfr-pagination__link--ellipsis {
  color: var(--text-mention-grey);
  cursor: default;
  min-width: 28px;
}
</style>
