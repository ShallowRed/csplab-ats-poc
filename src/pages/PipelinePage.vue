<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import FilterChips from '@/components/filters/FilterChips.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import CandidatureTable from '@/components/table/CandidatureTable.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiltersStore } from '@/stores/filters'
import { useCandidaturesStore } from '@/stores/candidatures'

const props = defineProps<{ offreId?: string }>()

const route = useRoute()
const filters = useFiltersStore()
const candidaturesStore = useCandidaturesStore()

const offreId = computed(() => props.offreId ?? '')
const view = computed<'kanban' | 'table'>(() => (route.query.view === 'table' ? 'table' : 'kanban'))

watchEffect(() => {
  if (offreId.value) {
    filters.setOffreId(offreId.value)
  }
})

watch(
  [offreId, view],
  ([id, mode]) => {
    if (mode === 'table' && id) {
      void candidaturesStore.chargerCandidatures(id)
    }
  },
  { immediate: true },
)
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
        v-if="view === 'kanban' && offreId"
        :offre-id="offreId"
      />
      <div
        v-else-if="view === 'table' && offreId"
        class="csplab-pipeline__table"
      >
        <div
          v-if="candidaturesStore.chargement"
          class="csplab-pipeline__skeleton"
        >
          <Skeleton
            v-for="i in 8"
            :key="i"
            class="h-12 w-full"
          />
        </div>
        <CandidatureTable
          v-else
          :candidatures="candidaturesStore.candidatures"
        />
      </div>
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

.csplab-pipeline__table {
  height: 100%;
  overflow: auto;
  padding: var(--csplab-space-4);
}

.csplab-pipeline__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}
</style>
