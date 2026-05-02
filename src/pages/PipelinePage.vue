<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OffreSelector from '@/components/pipeline/OffreSelector.vue'
import FilterPopover from '@/components/filters/FilterPopover.vue'
import FilterChips from '@/components/filters/FilterChips.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import CandidatureTable from '@/components/table/CandidatureTable.vue'
import BulkActionBar from '@/components/table/BulkActionBar.vue'
import DensitySelector from '@/components/table/DensitySelector.vue'
import PageToolbar from '@/components/layout/PageToolbar.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiltersStore } from '@/stores/filters'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useSelectionStore } from '@/stores/selection'
import { seed } from '@/data/seed'

const props = defineProps<{ offreId?: string }>()

const route = useRoute()
const router = useRouter()
const filters = useFiltersStore()
const candidaturesStore = useCandidaturesStore()
const selection = useSelectionStore()

const candidatsById = new Map(seed.candidats.map(c => [c.id, c]))

const offreId = computed(() => props.offreId ?? '')
const view = computed<'kanban' | 'table'>(() => (route.query.view === 'table' ? 'table' : 'kanban'))

const totalFilteredCount = computed(() => {
  const f = filters.filtre
  return candidaturesStore.candidatures.filter((c) => {
    if (f.etapeIds.length > 0 && !f.etapeIds.includes(c.etapeId)) return false
    if (f.scoreMin !== null && (c.score ?? 0) < f.scoreMin) return false
    if (f.intervieweurIds.length > 0) {
      if (!c.assigneA || !f.intervieweurIds.includes(c.assigneA)) return false
    }
    if (f.recherche) {
      const candidat = candidatsById.get(c.candidatId)
      if (!candidat) return false
      const q = f.recherche.toLowerCase()
      const name = `${candidat.prenom} ${candidat.nom}`.toLowerCase()
      if (!name.includes(q)) return false
    }
    return true
  }).length
})

function onOffreChange(id: string): void {
  void router.push({ path: `/pipeline/${id}`, query: route.query })
}

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
    if (mode === 'kanban' && id) {
      if (candidaturesStore.candidatures.length === 0) {
        void candidaturesStore.chargerCandidatures(id)
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="csplab-pipeline">
    <PageToolbar :selection-active="selection.count > 0">
      <template #left>
        <OffreSelector
          v-if="offreId"
          :offre-id="offreId"
          @change="onOffreChange"
        />
        <FilterPopover />
      </template>

      <template #right>
        <DensitySelector v-if="view === 'table'" />
        <span class="csplab-pipeline__count">
          {{ totalFilteredCount }} candidature{{ totalFilteredCount !== 1 ? 's' : '' }}
        </span>
      </template>

      <template #selection>
        <BulkActionBar :total-filtered="totalFilteredCount" />
      </template>
    </PageToolbar>

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
          v-if="candidaturesStore.isLoading"
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

.csplab-pipeline__sep {
  width: 1px;
  height: 20px;
  background: var(--border-default-grey);
  flex-shrink: 0;
}

.csplab-pipeline__count {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  white-space: nowrap;
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
