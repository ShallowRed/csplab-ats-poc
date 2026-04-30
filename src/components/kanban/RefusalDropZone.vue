<script setup lang="ts">
import { ref } from 'vue'
import { useDroppable } from '@dnd-kit/vue'

const props = defineProps<{
  refusedEtapeId: string
  keyboardActive: boolean
}>()

const el = ref<HTMLElement | null>(null)
const { isDropTarget } = useDroppable({
  id: () => `column:${props.refusedEtapeId}`,
  element: el,
})
</script>

<template>
  <section
    ref="el"
    class="csplab-kanban__refusal"
    :class="(isDropTarget || keyboardActive) ? 'csplab-kanban__refusal--drop' : undefined"
    aria-label="Zone de rejet"
  >
    <div class="csplab-kanban__refusal-title">
      Rejeter
    </div>
    <div class="csplab-kanban__refusal-sub">
      Déposez ici pour ouvrir le motif
    </div>
  </section>
</template>

<style scoped>
.csplab-kanban__refusal {
  width: 220px;
  flex: 0 0 auto;
  height: 140px;
  margin-top: var(--csplab-space-8);
  border: 2px dashed var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  background: var(--background-default-grey);
  display: grid;
  place-items: center;
  text-align: center;
  padding: var(--csplab-space-4);
  color: var(--text-mention-grey);
}

.csplab-kanban__refusal--drop {
  border-color: var(--border-plain-error);
  color: var(--text-default-error);
}

.csplab-kanban__refusal-title {
  font-weight: 600;
  color: inherit;
}

.csplab-kanban__refusal-sub {
  font-size: var(--csplab-font-size-sm);
}
</style>
