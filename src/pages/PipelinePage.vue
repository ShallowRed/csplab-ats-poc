<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import FilterChips from '@/components/filters/FilterChips.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import { useFiltersStore } from '@/stores/filters'

const props = defineProps<{ offreId?: string }>()

const filters = useFiltersStore()

const offreId = computed(() => props.offreId ?? '')

watchEffect(() => {
  if (offreId.value) {
    filters.setOffreId(offreId.value)
  }
})
</script>

<template>
  <div class="csplab-pipeline">
    <div class="csplab-pipeline__filters">
      <div class="csplab-pipeline__chips">
        <FilterChips :chips="filters.chipsActifs" />
      </div>

      <div class="csplab-pipeline__actions">
        <Button
          type="button"
          variant="tertiary"
        >
          Filtrer
        </Button>
        <Button
          type="button"
          variant="tertiary-no-outline"
          @click="filters.reset()"
        >
          Réinitialiser
        </Button>
      </div>
    </div>

    <div class="csplab-pipeline__board">
      <KanbanBoard
        v-if="offreId"
        :offre-id="offreId"
      />
    </div>
  </div>
</template>

<style scoped>
.csplab-pipeline {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.csplab-pipeline__filters {
  flex: 0 0 auto;
  padding: var(--csplab-space-4);
  border-bottom: 1px solid var(--border-default-grey);
  background: var(--background-default-grey);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-4);
}

.csplab-pipeline__chips {
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.csplab-pipeline__actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.csplab-pipeline__board {
  flex: 1;
  min-height: 0;
}
</style>
