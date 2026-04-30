<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useSelectionStore } from '@/stores/selection'
import { useFiltersStore } from '@/stores/filters'
import CandidatureTable from '@/components/table/CandidatureTable.vue'
import FilterChips from '@/components/filters/FilterChips.vue'
import FilterPopover from '@/components/filters/FilterPopover.vue'
import BulkActionBar from '@/components/table/BulkActionBar.vue'
import DensitySelector from '@/components/table/DensitySelector.vue'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const route = useRoute()
const candidaturesStore = useCandidaturesStore()
const selection = useSelectionStore()
const filters = useFiltersStore()

const tableRef = ref<InstanceType<typeof CandidatureTable> | null>(null)
const totalFiltered = computed(() => tableRef.value?.filteredCount ?? candidaturesStore.candidatures.length)

onMounted(async () => {
  const offreId = typeof route.params.offreId === 'string' ? route.params.offreId : undefined

  if (offreId) {
    filters.setOffreId(offreId)
    await candidaturesStore.chargerCandidatures(offreId)
  } else {
    filters.setOffreId(null)
    await candidaturesStore.chargerCandidatures()
  }
})
</script>

<template>
  <div class="candidatures-page">
    <div class="candidatures-page__toolbar">
      <div class="candidatures-page__toolbar-left">
        <FilterPopover />
        <FilterChips />
        <Input
          v-model="filters.filtre.recherche"
          type="search"
          placeholder="Rechercher un candidat…"
          class="candidatures-page__search"
          aria-label="Rechercher un candidat"
        />
      </div>

      <div class="candidatures-page__toolbar-right">
        <span class="candidatures-page__count">
          {{ totalFiltered }} résultat{{ totalFiltered !== 1 ? 's' : '' }}
        </span>
        <DensitySelector />
      </div>
    </div>

    <BulkActionBar
      v-if="selection.count > 0"
      :total-filtered="totalFiltered"
    />

    <div
      v-if="candidaturesStore.chargement"
      class="candidatures-page__skeleton"
    >
      <Skeleton
        v-for="i in 8"
        :key="i"
        class="h-12 w-full"
      />
    </div>

    <CandidatureTable
      v-else
      ref="tableRef"
      :candidatures="candidaturesStore.candidatures"
    />
  </div>
</template>

<style scoped>
.candidatures-page {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
  padding: var(--csplab-space-4);
  height: 100%;
  min-height: 0;
}

.candidatures-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--csplab-space-3);
}

.candidatures-page__toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.candidatures-page__toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}

.candidatures-page__search {
  width: 240px;
}

.candidatures-page__count {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.candidatures-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}
</style>
