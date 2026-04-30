<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    selectionActive?: boolean
  }>(),
  {
    selectionActive: false,
  },
)

const slots = useSlots()
const isSelectionMode = computed(
  () => Boolean(props.selectionActive) && Boolean(slots.selection),
)
</script>

<template>
  <div
    class="csplab-page-toolbar"
    :class="{ 'csplab-page-toolbar--selection': isSelectionMode }"
  >
    <slot
      v-if="isSelectionMode"
      name="selection"
    />

    <template v-else>
      <div class="csplab-page-toolbar__left">
        <slot name="left" />
      </div>
      <div class="csplab-page-toolbar__right">
        <slot name="right" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.csplab-page-toolbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-3) var(--csplab-space-4);
  background: var(--background-default-grey);
  border-bottom: 1px solid var(--border-default-grey);
}

.csplab-page-toolbar--selection {
  background: var(--background-contrast-blue-france);
  border-bottom-color: var(--border-action-high-blue-france);
}

.csplab-page-toolbar__left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
  min-width: 0;
}

.csplab-page-toolbar__right {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}
</style>
