<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { DragDropProvider, PointerSensor } from '@dnd-kit/vue'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/vue'
import { seed } from '@/data/seed'
import { mockApi } from '@/lib/mockApi'
import type { Candidat, Candidature, Etape, Intervieweur, Offre } from '@/types/domain'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useOffresStore } from '@/stores/offres'
import { useToastStore } from '@/stores/toast'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import KanbanColumn from './KanbanColumn.vue'
import RefusalDropZone from './RefusalDropZone.vue'
import RefusalReasonDialog from './RefusalReasonDialog.vue'
import { createKanbanFlow } from '@/kanban/kanbanFlow'

const props = defineProps<{
  offreId: string
}>()

const candidaturesStore = useCandidaturesStore()
const offresStore = useOffresStore()
const toast = useToastStore()

const etapes = ref<Etape[]>([])
const etapesLoading = ref(false)

const draggingId = ref<string | null>(null)

const liveMessage = ref('')

const candidatsById: ReadonlyMap<string, Candidat> = new Map(seed.candidats.map(c => [c.id, c]))
const intervieweursById: ReadonlyMap<string, Intervieweur> = new Map(seed.intervieweurs.map(i => [i.id, i]))

const offre = computed<Offre | undefined>(() => offresStore.offres.find(o => o.id === props.offreId))

const etapesVisibles = computed(() => etapes.value
  .filter(e => e.visibleKanban)
  .sort((a, b) => a.ordre - b.ordre),
)

const etapesById = computed(() => new Map(etapes.value.map(e => [e.id, e] as const)))

const refusedEtapeId = computed(() => {
  const refused = etapes.value.find(e => e.libelle.toLowerCase() === 'refusée')
    ?? etapes.value.find(e => e.couleur === 'csplab-status-rejected')
  return refused?.id ?? 'etape-7'
})

const orderByEtapeId = ref<Record<string, string[]>>({})

function defaultIdsForEtape(etapeId: string): string[] {
  return candidaturesStore.candidatures
    .filter(c => c.etapeId === etapeId)
    .sort((a, b) => new Date(b.derniereActivite).getTime() - new Date(a.derniereActivite).getTime())
    .map(c => c.id)
}

watchEffect(() => {
  if (draggingId.value) return
  if (etapesVisibles.value.length === 0) return

  const next: Record<string, string[]> = { ...orderByEtapeId.value }

  etapesVisibles.value.forEach((etape) => {
    const wanted = defaultIdsForEtape(etape.id)
    const current = next[etape.id]

    if (!current) {
      next[etape.id] = wanted
      return
    }

    const wantedSet = new Set(wanted)
    const preserved = current.filter(id => wantedSet.has(id))
    const preservedSet = new Set(preserved)
    const appended = wanted.filter(id => !preservedSet.has(id))
    next[etape.id] = [...preserved, ...appended]
  })

  orderByEtapeId.value = next
})

const candidaturesById = computed(() => new Map(candidaturesStore.candidatures.map(c => [c.id, c] as const)))

const candidaturesByEtape = computed(() => {
  const result = new Map<string, Candidature[]>()

  etapesVisibles.value.forEach((etape) => {
    const ids = orderByEtapeId.value[etape.id] ?? defaultIdsForEtape(etape.id)
    const inEtape: Candidature[] = []

    ids.forEach((id) => {
      const c = candidaturesById.value.get(id)
      if (c && c.etapeId === etape.id) inEtape.push(c)
    })

    result.set(etape.id, inEtape)
  })

  return result
})

function getEtapeIdForCandidature(candidatureId: string): string | null {
  return candidaturesById.value.get(candidatureId)?.etapeId ?? null
}

function reorderWithinEtape(etapeId: string, activeId: string, overId: string): void {
  const current = orderByEtapeId.value[etapeId]
  if (!current) return

  const fromIndex = current.indexOf(activeId)
  const toIndex = current.indexOf(overId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

  const next = [...current]
  next.splice(fromIndex, 1)
  next.splice(toIndex, 0, activeId)

  orderByEtapeId.value = {
    ...orderByEtapeId.value,
    [etapeId]: next,
  }
}

function getDropEtapeId(targetId: unknown): string | null {
  if (typeof targetId !== 'string') return null

  if (targetId.startsWith('column:')) {
    return targetId.replace('column:', '')
  }

  return getEtapeIdForCandidature(targetId)
}

const flow = computed(() => createKanbanFlow({
  candidaturesStore,
  toast,
  etapesById: etapesById.value,
  refusedEtapeId: refusedEtapeId.value,
}))

const dialogOpen = computed(() => flow.value.pendingRefusal.value !== null)

const dialogCandidatLabel = computed(() => {
  const pending = flow.value.pendingRefusal.value
  if (!pending) return 'ce candidat'

  const candidature = candidaturesById.value.get(pending.candidatureId)
  if (!candidature) return 'ce candidat'

  const candidat = candidatsById.get(candidature.candidatId)
  if (!candidat) return 'ce candidat'

  return `${candidat.prenom} ${candidat.nom}`
})

function announce(message: string): void {
  liveMessage.value = ''
  requestAnimationFrame(() => {
    liveMessage.value = message
  })
}

function announceDragStart(candidatureId: string): void {
  const candidatId = candidaturesById.value.get(candidatureId)?.candidatId
  const candidat = candidatId ? candidatsById.get(candidatId) : undefined
  const label = candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'
  announce(`${label} sélectionné, déplacement en cours. Utilisez les flèches pour choisir une colonne, Espace pour déposer, Échap pour annuler.`)
}

function onDragStart(event: DragStartEvent): void {
  const id = event.operation.source?.id
  draggingId.value = typeof id === 'string' ? id : null
  if (typeof id === 'string') {
    announceDragStart(id)
  }
}

function onDragOver(event: DragOverEvent): void {
  const activeId = event.operation.source?.id
  const overId = event.operation.target?.id

  if (typeof activeId !== 'string' || typeof overId !== 'string') return

  const etapeId = getEtapeIdForCandidature(activeId)
  const overEtapeId = getEtapeIdForCandidature(overId)

  if (!etapeId || !overEtapeId || etapeId !== overEtapeId) return

  reorderWithinEtape(etapeId, activeId, overId)
}

async function onDragEnd(event: DragEndEvent): Promise<void> {
  const activeId = event.operation.source?.id
  const targetId = event.operation.target?.id

  draggingId.value = null

  if (event.canceled) return
  if (typeof activeId !== 'string') return

  const toEtapeId = getDropEtapeId(targetId)
  const fromEtapeId = getEtapeIdForCandidature(activeId)

  if (!toEtapeId || !fromEtapeId || toEtapeId === fromEtapeId) return

  const candidatId = candidaturesById.value.get(activeId)?.candidatId
  const candidat = candidatId ? candidatsById.get(candidatId) : undefined
  if (candidat) {
    if (toEtapeId === refusedEtapeId.value) {
      announce(`Motif requis pour rejeter ${candidat.prenom} ${candidat.nom}.`)
    } else {
      announce(`${candidat.prenom} ${candidat.nom} déplacé vers ${etapesById.value.get(toEtapeId)?.libelle ?? 'une étape'}.`)
    }
  }

  await flow.value.handleDrop({ candidatureId: activeId, toEtapeId })
}

const keyboardActiveId = ref<string | null>(null)
const keyboardOverEtapeId = ref<string | null>(null)
const keyboardOverIndex = ref<number>(0)

function onBoardKeydown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null
  if (!target) return

  const cardEl = target.closest<HTMLElement>('[data-kanban-card-id]')
  if (!cardEl) return

  const candidatureId = cardEl.dataset.kanbanCardId
  if (!candidatureId) return

  const candidatId = candidaturesById.value.get(candidatureId)?.candidatId
  const candidat = candidatId ? candidatsById.get(candidatId) : undefined
  const label = candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'

  const pressed = event.key

  if (pressed === ' ' && !keyboardActiveId.value) {
    event.preventDefault()
    event.stopPropagation()

    keyboardActiveId.value = candidatureId
    keyboardOverEtapeId.value = getEtapeIdForCandidature(candidatureId)

    const etapeId = keyboardOverEtapeId.value
    const index = etapeId ? (orderByEtapeId.value[etapeId]?.indexOf(candidatureId) ?? 0) : 0
    keyboardOverIndex.value = Math.max(0, index)

    announce(`${label} sélectionné, déplacement en cours. Utilisez les flèches pour choisir une colonne, Espace pour déposer, Échap pour annuler.`)
    return
  }

  if (pressed === ' ' && keyboardActiveId.value === candidatureId) {
    event.preventDefault()
    event.stopPropagation()

    const toEtapeId = keyboardOverEtapeId.value
    if (!toEtapeId) return

    keyboardActiveId.value = null
    keyboardOverEtapeId.value = null

    void flow.value.handleDrop({ candidatureId, toEtapeId })
    if (toEtapeId === refusedEtapeId.value) {
      announce('Motif requis pour rejeter le candidat.')
    } else {
      announce(`Déplacé vers ${etapesById.value.get(toEtapeId)?.libelle ?? 'une étape'}.`)
    }
    return
  }

  if (pressed === 'Escape' && keyboardActiveId.value) {
    event.preventDefault()
    event.stopPropagation()

    keyboardActiveId.value = null
    keyboardOverEtapeId.value = null
    announce('Déplacement annulé.')
    return
  }

  if (!keyboardActiveId.value) return

  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(pressed)) return

  event.preventDefault()
  event.stopPropagation()

  const currentEtapeId = keyboardOverEtapeId.value
  if (!currentEtapeId) return

  const refusedStub: Pick<Etape, 'id' | 'libelle'> = { id: refusedEtapeId.value, libelle: 'Refusée' }
  const etapesList = [...etapesVisibles.value, refusedStub as Etape]
  const currentColIndex = etapesList.findIndex(e => e.id === currentEtapeId)
  if (currentColIndex === -1) return

  if (pressed === 'ArrowLeft' || pressed === 'ArrowRight') {
    const nextColIndex = pressed === 'ArrowLeft' ? currentColIndex - 1 : currentColIndex + 1
    const nextEtape = etapesList[nextColIndex]
    if (!nextEtape) return

    keyboardOverEtapeId.value = nextEtape.id

    const len = (orderByEtapeId.value[nextEtape.id] ?? defaultIdsForEtape(nextEtape.id)).length
    keyboardOverIndex.value = Math.min(keyboardOverIndex.value, Math.max(0, len - 1))
  }

  if (pressed === 'ArrowUp' || pressed === 'ArrowDown') {
    const ids = orderByEtapeId.value[currentEtapeId] ?? defaultIdsForEtape(currentEtapeId)
    const len = ids.length
    if (len === 0) {
      keyboardOverIndex.value = 0
    } else {
      const delta = pressed === 'ArrowUp' ? -1 : 1
      keyboardOverIndex.value = Math.min(len - 1, Math.max(0, keyboardOverIndex.value + delta))
    }
  }

  const stage = etapesById.value.get(keyboardOverEtapeId.value ?? '')
    ?? (keyboardOverEtapeId.value === refusedEtapeId.value ? ({ libelle: 'Refusée' } as Etape) : undefined)
  const ids = keyboardOverEtapeId.value ? (orderByEtapeId.value[keyboardOverEtapeId.value] ?? defaultIdsForEtape(keyboardOverEtapeId.value)) : []
  const total = Math.max(1, ids.length)
  const pos = Math.min(total, keyboardOverIndex.value + 1)

  announce(`Position : colonne ${stage?.libelle ?? 'inconnue'}, position ${pos} sur ${total}.`)
}

onMounted(async () => {
  if (!offre.value) return

  etapesLoading.value = true
  try {
    const [etapesLoaded] = await Promise.all([
      mockApi.listEtapes(offre.value.pipelineId),
      candidaturesStore.chargerCandidatures(props.offreId),
    ])
    etapes.value = etapesLoaded
  } finally {
    etapesLoading.value = false
  }
})

const isInitialLoading = computed(() => etapesLoading.value || candidaturesStore.chargement)
const isEmpty = computed(() => !isInitialLoading.value && candidaturesStore.candidatures.length === 0)
</script>

<template>
  <div
    class="csplab-kanban"
    @keydown.capture="onBoardKeydown"
  >
    <div
      role="status"
      aria-live="assertive"
      class="sr-only"
    >
      {{ liveMessage }}
    </div>

    <div
      v-if="isInitialLoading"
      class="csplab-kanban__skeleton"
    >
      <div
        v-for="col in 3"
        :key="col"
        class="csplab-kanban__skeleton-col"
      >
        <Skeleton class="h-10 w-full" />
        <div class="grid gap-2">
          <Skeleton
            v-for="card in 5"
            :key="card"
            class="h-24 w-full"
          />
        </div>
      </div>
    </div>

    <div
      v-else-if="isEmpty"
      class="csplab-kanban__empty"
    >
      <Card class="max-w-[520px] w-full">
        <CardContent class="p-6 text-center text-muted-foreground">
          Aucune candidature pour cette offre.
        </CardContent>
      </Card>
    </div>

    <DragDropProvider
      v-else
      :sensors="[PointerSensor]"
      @drag-start="onDragStart"
      @drag-over="onDragOver"
      @drag-end="onDragEnd"
    >
      <div class="csplab-kanban__board">
        <KanbanColumn
          v-for="etape in etapesVisibles"
          :key="etape.id"
          :etape="etape"
          :candidatures="candidaturesByEtape.get(etape.id) ?? []"
          :candidats-by-id="candidatsById"
          :intervieweurs-by-id="intervieweursById"
          :offre-titre="offre?.titre"
          :keyboard-drop-active="keyboardActiveId !== null && keyboardOverEtapeId === etape.id"
        />

        <RefusalDropZone
          :refused-etape-id="refusedEtapeId"
          :keyboard-active="keyboardActiveId !== null && keyboardOverEtapeId === refusedEtapeId"
        />
      </div>
    </DragDropProvider>

    <RefusalReasonDialog
      :open="dialogOpen"
      :candidat-label="dialogCandidatLabel"
      @cancel="flow.cancelRefusal()"
      @confirm="flow.confirmRefusal($event)"
      @update:open="(v) => { if (!v) flow.cancelRefusal() }"
    />
  </div>
</template>

<style scoped>
.csplab-kanban {
  height: 100%;
}

.csplab-kanban__board {
  height: 100%;
  display: flex;
  gap: var(--csplab-space-4);
  padding: var(--csplab-space-4);
  overflow-x: auto;
  overflow-y: hidden;
}

.csplab-kanban__skeleton {
  height: 100%;
  display: flex;
  gap: var(--csplab-space-4);
  padding: var(--csplab-space-4);
  overflow: hidden;
}

.csplab-kanban__skeleton-col {
  width: 280px;
  flex: 0 0 auto;
  display: grid;
  gap: var(--csplab-space-3);
}

.csplab-kanban__empty {
  height: 100%;
  display: grid;
  place-items: center;
  padding: var(--csplab-space-4);
}
</style>
