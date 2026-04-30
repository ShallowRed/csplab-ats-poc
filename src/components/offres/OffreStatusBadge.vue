<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import type { OffreStatut } from '@/types/domain'

const props = defineProps<{
  statut: OffreStatut
}>()

const meta = computed(() => {
  switch (props.statut) {
    case 'brouillon':
      return { label: 'Brouillon', variant: 'status-draft' as const }
    case 'ouverte':
      return { label: 'Ouverte', variant: 'status-submitted' as const }
    case 'fermee':
      return { label: 'Fermée', variant: 'status-archived' as const }
    case 'archivee':
      return { label: 'Archivée', variant: 'status-rejected' as const }
  }
})
</script>

<template>
  <Badge :variant="meta.variant">
    {{ meta.label }}
  </Badge>
</template>
