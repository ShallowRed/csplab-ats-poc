<script setup lang="ts">
import { computed } from 'vue'
import { useRadiusStore, type RadiusMode } from '@/stores/radius'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

const radiusStore = useRadiusStore()

const CONFIG: Record<RadiusMode, { icon: string; title: string }> = {
  square:  { icon: 'ri:checkbox-blank-line',   title: 'Angles droits (DSFR)' },
  soft:    { icon: 'ri:rounded-corner',         title: 'Légers arrondis' },
  rounded: { icon: 'ri:checkbox-blank-circle-line', title: 'Arrondis webapp' },
}

const current = computed(() => CONFIG[radiusStore.radiusMode])
</script>

<template>
  <button
    type="button"
    class="radius-switcher"
    :aria-label="current.title"
    :title="current.title"
    @click="radiusStore.cycle()"
  >
    <RiIcon
      :name="current.icon"
      :size="16"
    />
  </button>
</template>

<style scoped>
.radius-switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: var(--csplab-radius-md);
  background: transparent;
  color: var(--text-mention-grey);
  cursor: pointer;
}

.radius-switcher:hover {
  background: var(--background-alt-grey);
}

.radius-switcher:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
</style>
