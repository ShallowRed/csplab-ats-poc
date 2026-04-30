<script setup lang="ts">
import { computed } from 'vue'
import type { DelaiEtape } from '@/composables/useDashboardMetrics'

const props = defineProps<{
  delais: DelaiEtape[]
}>()

function buildPath(points: number[]): string {
  if (points.length === 0) return ''
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = Math.max(1, max - min)
  const w = 100
  const h = 30
  const stepX = w / Math.max(1, points.length - 1)
  return points
    .map((p, i) => {
      const x = i * stepX
      const y = h - ((p - min) / range) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

const items = computed(() =>
  props.delais.map(d => ({
    ...d,
    path: buildPath(d.points),
  })),
)
</script>

<template>
  <ul class="etape-delai__list">
    <li
      v-for="item in items"
      :key="item.etapeId"
      class="etape-delai__item"
    >
      <div class="etape-delai__head">
        <span class="etape-delai__label">{{ item.etape }}</span>
        <span class="etape-delai__value">
          {{ item.delaiMoyen }}&nbsp;jour{{ item.delaiMoyen > 1 ? 's' : '' }}
        </span>
      </div>
      <svg
        class="etape-delai__sparkline"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          :d="item.path"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </li>
  </ul>
</template>

<style scoped>
.etape-delai__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.etape-delai__item {
  display: grid;
  grid-template-columns: 1fr 80px;
  align-items: center;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-2) var(--csplab-space-3);
}

.etape-delai__item + .etape-delai__item {
  border-top: 1px solid var(--border-default-grey);
}

.etape-delai__head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.etape-delai__label {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.etape-delai__value {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.etape-delai__sparkline {
  width: 80px;
  height: 28px;
  color: var(--text-default-info);
  display: block;
}
</style>
