<script setup lang="ts">
import { computed, shallowRef, type ComponentPublicInstance } from 'vue'
import { MoreVertical, Plus } from 'lucide-vue-next'
import { useDroppable } from '@dnd-kit/vue'
import type { Candidat, Candidature, Etape, Intervieweur } from '@/types/domain'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import KanbanCard from './KanbanCard.vue'

const props = defineProps<{
  etape: Etape
  candidatures: Candidature[]
  candidatsById: ReadonlyMap<string, Candidat>
  intervieweursById: ReadonlyMap<string, Intervieweur>
  keyboardDropActive?: boolean
}>()

const element = shallowRef<HTMLElement | ComponentPublicInstance | null>(null)

function setElementRef(el: Element | ComponentPublicInstance | null): void {
  if (el === null) {
    element.value = null
    return
  }

  if (el instanceof HTMLElement) {
    element.value = el
    return
  }

  element.value = el
}
const droppableId = computed(() => `column:${props.etape.id}`)

const { isDropTarget } = useDroppable({
  id: droppableId,
  element,
})

const colorVar = computed(() => `var(--${props.etape.couleur})`)
</script>

<template>
  <section
    :ref="setElementRef"
    class="csplab-kanban-column"
    :data-etape-id="props.etape.id"
  >
    <header class="csplab-kanban-column__header">
      <span
        class="csplab-kanban-column__dot"
        :style="{ backgroundColor: colorVar }"
        aria-hidden="true"
      />
      <div class="csplab-kanban-column__title">
        {{ props.etape.libelle }}
      </div>
      <Badge
        variant="secondary"
        class="csplab-kanban-column__count"
      >
        {{ props.candidatures.length }}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="tertiary-no-outline"
            size="icon"
            class="h-8 w-8"
            aria-label="Actions de colonne"
          >
            <MoreVertical
              class="h-4 w-4"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem> Trier par date </DropdownMenuItem>
          <DropdownMenuItem> Tout sélectionner </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>

    <div
      class="csplab-kanban-column__body"
      :class="(isDropTarget || props.keyboardDropActive) ? 'csplab-kanban-column__body--drop' : undefined"
    >
      <div
        v-if="props.candidatures.length === 0"
        class="csplab-kanban-column__empty"
      >
        Aucun candidat à cette étape
      </div>

      <div
        v-else
        class="csplab-kanban-column__list"
      >
        <KanbanCard
          v-for="(candidature, idx) in props.candidatures"
          :key="candidature.id"
          :candidature="candidature"
          :candidat="props.candidatsById.get(candidature.candidatId)!"
          :intervieweur-assigne="candidature.assigneA ? props.intervieweursById.get(candidature.assigneA) : undefined"
          :etape-id="props.etape.id"
          :index="idx"
        />
      </div>

      <div class="csplab-kanban-column__footer">
        <Button
          type="button"
          variant="tertiary-no-outline"
          class="w-full justify-start"
          disabled
        >
          <Plus
            class="h-4 w-4"
            aria-hidden="true"
          />
          + Ajouter
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.csplab-kanban-column {
  width: 280px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  background: var(--background-alt-grey);
  overflow: hidden;
}

.csplab-kanban-column__header {
  height: 44px;
  display: grid;
  grid-template-columns: 8px 1fr auto auto;
  align-items: center;
  gap: var(--csplab-space-2);
  padding: 0 var(--csplab-space-3);
  border-bottom: 1px solid var(--border-default-grey);
  background: var(--background-default-grey);
}

.csplab-kanban-column__dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
}

.csplab-kanban-column__title {
  font-weight: 500;
  font-size: var(--csplab-font-size-base);
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-kanban-column__count {
  color: var(--text-mention-grey);
}

.csplab-kanban-column__body {
  flex: 1;
  min-height: 0;
  padding: var(--csplab-space-3);
  overflow: auto;
  border: 2px solid transparent;
  transition: border-color 150ms ease;
}

.csplab-kanban-column__body--drop {
  border-color: var(--border-action-high-blue-france);
}

.csplab-kanban-column__empty {
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
  text-align: center;
}

.csplab-kanban-column__list {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.csplab-kanban-column__footer {
  margin-top: var(--csplab-space-3);
}

@media (prefers-reduced-motion: reduce) {
  .csplab-kanban-column__body {
    transition: none;
  }
}
</style>
