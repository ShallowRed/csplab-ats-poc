<script setup lang="ts">
import { computed, ref } from 'vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
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
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="tertiary"
        size="sm"
      >
        <RiIcon
          name="ri:equalizer-line"
          :size="16"
        />
        Filtres
        <Tag
          v-if="hasActiveFilters"
          size="sm"
          class="ml-1"
        >
          {{ filters.chipsActifs.length }}
        </Tag>
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="filter-popover__content"
      align="start"
    >
      <div class="filter-popover__section">
        <div class="filter-popover__section-title">
          Étape
        </div>
        <div
          v-for="etape in etapesOptions"
          :key="etape.id"
          class="filter-popover__option"
        >
          <Checkbox
            :id="`etape-${etape.id}`"
            :checked="filters.filtre.etapeIds.includes(etape.id)"
            @update:checked="toggleEtape(etape.id)"
          />
          <Label :for="`etape-${etape.id}`">{{ etape.libelle }}</Label>
        </div>
      </div>

      <div class="filter-popover__section">
        <div class="filter-popover__section-title">
          Score minimum
        </div>
        <div
          v-for="opt in scoreOptions"
          :key="opt.value"
          class="filter-popover__option"
        >
          <Checkbox
            :id="`score-${opt.value}`"
            :checked="filters.filtre.scoreMin === opt.value"
            @update:checked="setScore(opt.value)"
          />
          <Label :for="`score-${opt.value}`">{{ opt.label }}</Label>
        </div>
      </div>

      <div class="filter-popover__section">
        <div class="filter-popover__section-title">
          Intervieweur assigné
        </div>
        <div
          v-for="intervieweur in intervieweursOptions"
          :key="intervieweur.id"
          class="filter-popover__option"
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
        class="filter-popover__footer"
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
</template>

<style scoped>
.filter-popover__content {
  width: 320px;
  max-height: 480px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.filter-popover__section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.filter-popover__section-title {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-title-grey);
}

.filter-popover__option {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.filter-popover__footer {
  padding-top: var(--csplab-space-2);
  border-top: 1px solid var(--border-default-grey);
}
</style>
