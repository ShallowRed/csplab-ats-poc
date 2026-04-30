<script setup lang="ts">
import { computed, ref } from 'vue'
import { X, SlidersHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useFiltersStore } from '@/stores/filters'
import { seed } from '@/data/seed'

const filters = useFiltersStore()

const open = ref(false)

const etapesOptions = computed(() => seed.etapes.filter(e => e.visibleKanban))
const intervieweursOptions = computed(() => seed.intervieweurs)

const scoreOptions = [
  { value: 1, label: '≥ 1 / 4' },
  { value: 2, label: '≥ 2 / 4' },
  { value: 3, label: '≥ 3 / 4' },
]

function toggleEtape(id: string): void {
  if (filters.filtre.etapeIds.includes(id)) {
    filters.removeEtapeId(id)
  } else {
    filters.addEtapeId(id)
  }
}

function toggleIntervieweur(id: string): void {
  if (filters.filtre.intervieweurIds.includes(id)) {
    filters.removeIntervieweurId(id)
  } else {
    filters.addIntervieweurId(id)
  }
}

function setScore(value: number): void {
  filters.setScoreMin(filters.filtre.scoreMin === value ? null : value)
}

const hasActiveFilters = computed(() => filters.chipsActifs.length > 0)
</script>

<template>
  <div class="filter-chips">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
        >
          <SlidersHorizontal
            class="h-4 w-4"
            aria-hidden="true"
          />
          Filtres
          <Badge
            v-if="hasActiveFilters"
            variant="secondary"
            class="ml-1"
          >
            {{ filters.chipsActifs.length }}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        class="filter-chips__popover"
        align="start"
      >
        <div class="filter-chips__section">
          <div class="filter-chips__section-title">
            Étape
          </div>
          <div
            v-for="etape in etapesOptions"
            :key="etape.id"
            class="filter-chips__option"
          >
            <Checkbox
              :id="`etape-${etape.id}`"
              :checked="filters.filtre.etapeIds.includes(etape.id)"
              @update:checked="toggleEtape(etape.id)"
            />
            <Label :for="`etape-${etape.id}`">{{ etape.libelle }}</Label>
          </div>
        </div>

        <div class="filter-chips__section">
          <div class="filter-chips__section-title">
            Score minimum
          </div>
          <div
            v-for="opt in scoreOptions"
            :key="opt.value"
            class="filter-chips__option"
          >
            <Checkbox
              :id="`score-${opt.value}`"
              :checked="filters.filtre.scoreMin === opt.value"
              @update:checked="setScore(opt.value)"
            />
            <Label :for="`score-${opt.value}`">{{ opt.label }}</Label>
          </div>
        </div>

        <div class="filter-chips__section">
          <div class="filter-chips__section-title">
            Intervieweur assigné
          </div>
          <div
            v-for="intervieweur in intervieweursOptions"
            :key="intervieweur.id"
            class="filter-chips__option"
          >
            <Checkbox
              :id="`int-${intervieweur.id}`"
              :checked="filters.filtre.intervieweurIds.includes(intervieweur.id)"
              @update:checked="toggleIntervieweur(intervieweur.id)"
            />
            <Label :for="`int-${intervieweur.id}`">
              {{ intervieweur.prenom }} {{ intervieweur.nom }}
            </Label>
          </div>
        </div>

        <div
          v-if="hasActiveFilters"
          class="filter-chips__footer"
        >
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            @click="filters.reset()"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </PopoverContent>
    </Popover>

    <div
      v-if="hasActiveFilters"
      class="filter-chips__active"
      role="list"
      aria-label="Filtres actifs"
    >
      <Badge
        v-for="chip in filters.chipsActifs"
        :key="chip.id"
        variant="secondary"
        class="filter-chips__chip"
        role="listitem"
      >
        {{ chip.label }}
        <button
          type="button"
          class="filter-chips__chip-remove"
          :aria-label="`Supprimer le filtre ${chip.label}`"
          @click="chip.onRemove()"
        >
          <X
            class="h-3 w-3"
            aria-hidden="true"
          />
        </button>
      </Badge>

      <Button
        type="button"
        variant="tertiary-no-outline"
        size="sm"
        @click="filters.reset()"
      >
        Tout effacer
      </Button>
    </div>
  </div>
</template>

<style scoped>
.filter-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.filter-chips__popover {
  width: 320px;
  max-height: 480px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.filter-chips__section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.filter-chips__section-title {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-title-grey);
}

.filter-chips__option {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.filter-chips__footer {
  padding-top: var(--csplab-space-2);
  border-top: 1px solid var(--border-default-grey);
}

.filter-chips__active {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--csplab-space-2);
}

.filter-chips__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.filter-chips__chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  color: inherit;
  opacity: 0.7;
}

.filter-chips__chip-remove:hover {
  opacity: 1;
}
</style>
