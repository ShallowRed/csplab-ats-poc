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
import { useOffresStore } from '@/stores/offres'
import type { Offre } from '@/types/domain'

const props = defineProps<{
  offreId: string
}>()

const emit = defineEmits<{
  (e: 'change', id: string): void
}>()

const offresStore = useOffresStore()
const open = ref(false)

const offresOuvertes = computed<Offre[]>(() =>
  offresStore.offresVisibles.filter(o => o.statut === 'ouverte' || o.statut === 'fermee'),
)

const offreCourante = computed<Offre | undefined>(() =>
  offresStore.getById(props.offreId),
)

const STATUT_META: Record<string, { dot: string; label: string }> = {
  ouverte:   { dot: 'var(--csplab-status-interview)', label: 'Ouverte' },
  fermee:    { dot: 'var(--csplab-status-archived)',  label: 'Fermée' },
  brouillon: { dot: 'var(--csplab-status-draft)',     label: 'Brouillon' },
  archivee:  { dot: 'var(--csplab-status-rejected)',  label: 'Archivée' },
}

function select(id: string): void {
  open.value = false
  if (id !== props.offreId) emit('change', id)
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        :aria-label="`Changer d'offre, offre courante : ${offreCourante?.titre ?? '—'}`"
        aria-haspopup="listbox"
        :aria-expanded="open"
      >
        <span
          v-if="offreCourante"
          class="offre-selector__dot"
          :style="{ background: STATUT_META[offreCourante.statut]?.dot }"
          aria-hidden="true"
        />
        <span class="offre-selector__titre">
          {{ offreCourante?.titre ?? '—' }}
        </span>
        <Tag
          v-if="offreCourante"
          size="sm"
          class="offre-selector__direction-tag"
        >
          {{ offreCourante.direction }}
        </Tag>
        <RiIcon
          name="ri:arrow-down-s-line"
          :size="14"
          aria-hidden="true"
        />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      class="offre-selector__popover"
      align="start"
      role="listbox"
      :aria-label="`Sélectionner une offre`"
    >
      <div class="offre-selector__list">
        <button
          v-for="offre in offresOuvertes"
          :key="offre.id"
          type="button"
          class="offre-selector__option"
          :class="{ 'offre-selector__option--active': offre.id === offreId }"
          role="option"
          :aria-selected="offre.id === offreId"
          @click="select(offre.id)"
        >
          <span
            class="offre-selector__dot"
            :style="{ background: STATUT_META[offre.statut]?.dot }"
            aria-hidden="true"
          />
          <span class="offre-selector__option-body">
            <span class="offre-selector__option-titre">{{ offre.titre }}</span>
            <span class="offre-selector__option-sub">{{ offre.direction }} · {{ offre.localisation }}</span>
          </span>
          <RiIcon
            v-if="offre.id === offreId"
            name="ri:check-line"
            :size="14"
            class="offre-selector__check"
            aria-hidden="true"
          />
        </button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped>
.offre-selector__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.offre-selector__titre {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.offre-selector__direction-tag {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.offre-selector__popover {
  width: 400px;
  padding: var(--csplab-space-1);
}

.offre-selector__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.offre-selector__option {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  width: 100%;
  padding: var(--csplab-space-2) var(--csplab-space-2);
  background: none;
  border: none;
  border-radius: var(--csplab-radius-sm);
  cursor: pointer;
  text-align: left;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  transition: background 80ms ease;
}

.offre-selector__option:hover {
  background: var(--background-alt-grey);
}

.offre-selector__option:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.offre-selector__option--active {
  background: var(--background-alt-blue-france);
}

.offre-selector__option-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.offre-selector__option-titre {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offre-selector__option-sub {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offre-selector__check {
  flex-shrink: 0;
  color: var(--text-action-high-blue-france);
}
</style>
