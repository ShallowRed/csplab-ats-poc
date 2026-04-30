<script setup lang="ts">
import { computed, shallowRef, type ComponentPublicInstance } from 'vue'
import { Calendar, ClipboardCheck, Eye } from 'lucide-vue-next'
import { useSortable } from '@dnd-kit/vue/sortable'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { Candidat, Candidature, Intervieweur } from '@/types/domain'
import { useDrawerStore } from '@/stores/drawer'
import { useSelectionStore } from '@/stores/selection'

type DebugState = {
  hover?: boolean
  dragging?: boolean
  selected?: boolean
  focusVisible?: boolean
}

const props = defineProps<{
  candidature: Candidature
  candidat: Candidat
  intervieweurAssigne?: Intervieweur
  etapeId: string
  index: number
  debug?: DebugState
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

const { isDragging } = useSortable({
  id: computed(() => props.candidature.id),
  group: computed(() => props.etapeId),
  index: computed(() => props.index),
  element,
  data: computed(() => ({ etapeId: props.etapeId })),
})

const drawer = useDrawerStore()
const selection = useSelectionStore()

const fullName = computed(() => `${props.candidat.prenom} ${props.candidat.nom}`)

const tagsDisplay = computed(() => {
  const visible = props.candidature.tags.slice(0, 3)
  const remaining = Math.max(0, props.candidature.tags.length - visible.length)
  return { visible, remaining }
})

const ageInStageDays = computed(() => {
  const last = new Date(props.candidature.derniereActivite).getTime()
  const now = Date.now()
  const days = Math.floor((now - last) / (24 * 60 * 60 * 1000))
  return days
})

const showAgeBadge = computed(() => ageInStageDays.value > 7)

const isSelected = computed(() => props.debug?.selected ?? selection.isSelected(props.candidature.id))

function openDrawer(): void {
  drawer.ouvrir(props.candidature.id)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    openDrawer()
  }
}

function stop(event: Event): void {
  event.stopPropagation()
}
</script>

<template>
  <TooltipProvider>
    <Card
      :ref="setElementRef"
      :data-kanban-card-id="props.candidature.id"
      :data-kanban-etape-id="props.etapeId"
      role="button"
      tabindex="0"
      :aria-label="`Ouvrir la candidature de ${fullName}`"
      :class="cn(
        'csplab-kanban-card',
        isSelected && 'csplab-kanban-card--selected',
        (props.debug?.hover ?? false) && 'csplab-kanban-card--hover',
        (props.debug?.focusVisible ?? false) && 'csplab-kanban-card--focus',
        (props.debug?.dragging ?? false) && 'csplab-kanban-card--dragging',
        isDragging && 'csplab-kanban-card--dragging',
      )"
      @click="openDrawer"
      @keydown="onKeydown"
    >
      <div class="csplab-kanban-card__inner">
        <div
          class="csplab-kanban-card__overlay"
          @click="stop"
        >
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                type="button"
                variant="tertiary-no-outline"
                size="icon"
                class="h-7 w-7"
                @click="stop"
              >
                <Calendar
                  class="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Planifier</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                type="button"
                variant="tertiary-no-outline"
                size="icon"
                class="h-7 w-7"
                @click="stop"
              >
                <ClipboardCheck
                  class="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Évaluer</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                type="button"
                variant="tertiary-no-outline"
                size="icon"
                class="h-7 w-7"
                @click="stop"
              >
                <Eye
                  class="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voir fiche</TooltipContent>
          </Tooltip>
        </div>

        <div class="csplab-kanban-card__row csplab-kanban-card__row--top">
          <Avatar class="h-6 w-6">
            <AvatarImage
              :src="props.candidat.photoUrl ?? ''"
              :alt="fullName"
            />
            <AvatarFallback class="text-xs">
              {{ props.candidat.prenom.charAt(0) }}{{ props.candidat.nom.charAt(0) }}
            </AvatarFallback>
          </Avatar>
          <div
            class="csplab-kanban-card__name"
            :title="fullName"
          >
            {{ fullName }}
          </div>
        </div>

        <div class="csplab-kanban-card__sub">
          Poste candidaté
        </div>

        <div class="csplab-kanban-card__tags">
          <Badge
            v-for="tag in tagsDisplay.visible"
            :key="tag"
            variant="secondary"
            class="csplab-kanban-card__tag"
          >
            {{ tag }}
          </Badge>
          <Badge
            v-if="tagsDisplay.remaining > 0"
            variant="secondary"
            class="csplab-kanban-card__tag"
          >
            +{{ tagsDisplay.remaining }}
          </Badge>
        </div>

        <div class="csplab-kanban-card__row csplab-kanban-card__row--bottom">
          <Badge
            v-if="props.candidature.score !== undefined"
            variant="secondary"
          >
            ★ {{ props.candidature.score }}/4
          </Badge>

          <div class="csplab-kanban-card__assignee">
            <template v-if="props.intervieweurAssigne">
              <Avatar class="h-4 w-4">
                <AvatarImage
                  :src="props.intervieweurAssigne.avatarUrl ?? ''"
                  :alt="`${props.intervieweurAssigne.prenom} ${props.intervieweurAssigne.nom}`"
                />
                <AvatarFallback class="text-xs">
                  {{ props.intervieweurAssigne.prenom.charAt(0) }}{{ props.intervieweurAssigne.nom.charAt(0) }}
                </AvatarFallback>
              </Avatar>
            </template>
            <span class="csplab-kanban-card__assignee-label">
              {{ props.intervieweurAssigne ? 'Assigné' : 'Non assigné' }}
            </span>
          </div>

          <Badge
            v-if="showAgeBadge"
            variant="status-rejected"
          >
            {{ ageInStageDays }}j
          </Badge>
        </div>
      </div>
    </Card>
  </TooltipProvider>
</template>

<style scoped>
.csplab-kanban-card {
  position: relative;
  padding: var(--csplab-space-3);
  background: var(--background-default-grey);
  box-shadow: var(--csplab-shadow-sm);
  cursor: grab;
  user-select: none;
  outline: none;
}

.csplab-kanban-card__inner {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.csplab-kanban-card--hover,
.csplab-kanban-card:hover {
  box-shadow: var(--csplab-shadow-md);
}

.csplab-kanban-card--dragging {
  opacity: 0.6;
  transform: rotate(2deg);
  box-shadow: var(--csplab-shadow-lg);
}

.csplab-kanban-card--selected {
  border: 2px solid var(--border-action-high-blue-france);
}

.csplab-kanban-card:focus-visible,
.csplab-kanban-card--focus {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.csplab-kanban-card__overlay {
  position: absolute;
  right: var(--csplab-space-2);
  top: var(--csplab-space-2);
  display: flex;
  gap: var(--csplab-space-1);
  opacity: 0;
  transition: opacity 150ms ease;
}

.csplab-kanban-card:hover .csplab-kanban-card__overlay,
.csplab-kanban-card:focus-visible .csplab-kanban-card__overlay {
  opacity: 1;
}

.csplab-kanban-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-2);
}

.csplab-kanban-card__row--top {
  justify-content: flex-start;
}

.csplab-kanban-card__name {
  min-width: 0;
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-kanban-card__sub {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
}

.csplab-kanban-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-1);
}

.csplab-kanban-card__tag {
  max-width: 100%;
}

.csplab-kanban-card__assignee {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.csplab-kanban-card__assignee-label {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

@media (prefers-reduced-motion: reduce) {
  .csplab-kanban-card__overlay {
    transition: none;
  }
  .csplab-kanban-card--dragging {
    transform: none;
  }
}
</style>
