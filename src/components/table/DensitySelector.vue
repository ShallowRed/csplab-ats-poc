<script setup lang="ts">
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDensityStore } from '@/stores/density'
import type { DensiteAffichage } from '@/types/domain'

const density = useDensityStore()

const options: Array<{ value: DensiteAffichage; label: string }> = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Normal' },
  { value: 'comfortable', label: 'Confortable' },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        aria-label="Densité d'affichage"
      >
        <RiIcon
          name="ri:list-check"
          :size="16"
        />
        {{ options.find(o => o.value === density.densite)?.label ?? 'Normal' }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="opt in options"
        :key="opt.value"
        :aria-current="density.densite === opt.value ? 'true' : undefined"
        @click="density.set(opt.value)"
      >
        {{ opt.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
