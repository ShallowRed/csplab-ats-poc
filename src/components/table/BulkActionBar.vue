<script setup lang="ts">
import { computed, ref } from 'vue'
import { X, ChevronDown, Tag, Archive, Mail } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSelectionStore } from '@/stores/selection'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useToastStore } from '@/stores/toast'
import { seed } from '@/data/seed'

const props = defineProps<{
  totalFiltered: number
}>()

const selection = useSelectionStore()
const candidaturesStore = useCandidaturesStore()
const toast = useToastStore()

const etapesOptions = computed(() =>
  seed.etapes.filter(e => !e.estTerminale && e.visibleKanban),
)

const loading = ref(false)

async function changerEtape(etapeId: string): Promise<void> {
  const ids = [...selection.selectedIds]
  if (ids.length === 0) return

  loading.value = true
  try {
    const results = await Promise.allSettled(
      ids.map(id => candidaturesStore.changerEtape(id, etapeId, undefined, { toast: false })),
    )
    const failed = results.filter(r => r.status === 'rejected').length
    if (failed > 0) {
      toast.error(`${failed} changement(s) ont échoué`)
    } else {
      const etapeLabel = seed.etapes.find(e => e.id === etapeId)?.libelle ?? 'nouvelle étape'
      toast.success(`${ids.length} candidature(s) déplacée(s) vers ${etapeLabel}`)
    }
    selection.clear()
  } finally {
    loading.value = false
  }
}

function archiver(): void {
  const count = selection.count
  selection.clear()
  toast.success(`${count} candidature(s) archivée(s) (simulation POC)`)
}

function emailTemplate(): void {
  toast.success('Modèle email ouvert (simulation POC)')
}

const label = computed(() => {
  if (selection.selectAllMatching) return `${props.totalFiltered} candidature(s) sélectionnée(s)`
  return `${selection.count} sélectionné(e)(s)`
})
</script>

<template>
  <div
    class="bulk-bar"
    role="status"
    aria-live="polite"
  >
    <div class="bulk-bar__left">
      <Badge variant="secondary">
        {{ label }}
      </Badge>

      <Button
        type="button"
        variant="tertiary-no-outline"
        size="sm"
        @click="selection.clear()"
      >
        <X
          class="h-4 w-4"
          aria-hidden="true"
        />
        Désélectionner
      </Button>
    </div>

    <div class="bulk-bar__actions">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            :disabled="loading"
          >
            Changer l'étape
            <ChevronDown
              class="h-4 w-4 ml-1"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            v-for="etape in etapesOptions"
            :key="etape.id"
            @click="changerEtape(etape.id)"
          >
            {{ etape.libelle }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="tertiary"
        size="sm"
        :disabled="loading"
        @click="emailTemplate"
      >
        <Mail
          class="h-4 w-4"
          aria-hidden="true"
        />
        Email
      </Button>

      <Button
        type="button"
        variant="tertiary"
        size="sm"
        :disabled="loading"
      >
        <Tag
          class="h-4 w-4"
          aria-hidden="true"
        />
        Tag
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        :disabled="loading"
        @click="archiver"
      >
        <Archive
          class="h-4 w-4"
          aria-hidden="true"
        />
        Archiver
      </Button>
    </div>
  </div>
</template>

<style scoped>
.bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-2) var(--csplab-space-4);
  background: var(--background-contrast-blue-france);
  border: 1px solid var(--border-action-high-blue-france);
  border-radius: var(--csplab-radius-md);
}

.bulk-bar__left {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}

.bulk-bar__actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  flex-wrap: wrap;
}
</style>
