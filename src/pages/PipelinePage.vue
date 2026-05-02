<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import FilterChips from '@/components/filters/FilterChips.vue'
import KanbanBoard from '@/components/kanban/KanbanBoard.vue'
import CandidatureTable from '@/components/table/CandidatureTable.vue'
import BulkActionBar from '@/components/table/BulkActionBar.vue'
import PageToolbar from '@/components/layout/PageToolbar.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiltersStore } from '@/stores/filters'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useSelectionStore } from '@/stores/selection'
import { seed } from '@/data/seed'

const props = defineProps<{ offreId?: string }>()

const route = useRoute()
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

// const showKanbanHint = computed(
//   () => view.value === 'kanban' && selection.count === 0,
// )
const showKanbanHint = false

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
      // Charger aussi pour le calcul du totalFilteredCount kanban
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
        <FilterChips :show-reset="false" />
      </template>

      <template #right>
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
      </template>

      <template #selection>
        <BulkActionBar :total-filtered="totalFilteredCount" />
      </template>
    </PageToolbar>

    <p
      v-if="showKanbanHint"
      class="csplab-pipeline__hint"
    >
      ⌘+clic pour sélectionner plusieurs candidatures
    </p>

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

.csplab-pipeline__hint {
  flex: 0 0 auto;
  padding: var(--csplab-space-1) var(--csplab-space-4);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  margin: 0;
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
