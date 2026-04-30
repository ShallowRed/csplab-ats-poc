<script setup lang="ts">
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Chip = {
  id: string
  label: string
  onRemove: () => void
}

defineProps<{
  chips: Chip[]
}>()
</script>

<template>
  <div
    v-if="chips.length > 0"
    class="flex flex-wrap items-center gap-2"
  >
    <Badge
      v-for="chip in chips"
      :key="chip.id"
      variant="secondary"
      class="gap-2"
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
  </div>
</template>
