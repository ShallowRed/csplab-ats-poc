<script setup lang="ts">
import { computed } from 'vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFiltersStore } from '@/stores/filters'

withDefaults(
  defineProps<{
    showReset?: boolean
  }>(),
  {
    showReset: true,
  },
)

const filters = useFiltersStore()

const chips = computed(() => filters.chipsActifs)
const hasActiveFilters = computed(() => chips.value.length > 0)
</script>

<template>
  <div
    v-if="hasActiveFilters"
    class="flex flex-wrap items-center gap-2"
    role="list"
    aria-label="Filtres actifs"
  >
    <Badge
      v-for="chip in chips"
      :key="chip.id"
      variant="secondary"
      class="gap-2"
      role="listitem"
    >
      <span class="truncate max-w-[240px]">{{ chip.label }}</span>
      <Button
        type="button"
        variant="tertiary-no-outline"
        size="icon"
        class="h-5 w-5"
        :aria-label="`Retirer le filtre ${chip.label}`"
        @click.stop="chip.onRemove()"
      >
        <RiIcon
          name="ri:close-line"
          :size="14"
        />
      </Button>
    </Badge>

    <Button
      v-if="showReset"
      type="button"
      variant="tertiary-no-outline"
      size="sm"
      @click="filters.reset()"
    >
      Tout effacer
    </Button>
  </div>
</template>
