<script setup lang="ts">
import { RiIcon } from '@/components/ui/icon'

defineProps<{
  icon?: string
  title: string
  description?: string
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div
    class="csplab-empty"
    :class="`csplab-empty--${size ?? 'md'}`"
    role="status"
  >
    <RiIcon
      v-if="icon"
      :name="icon"
      :size="size === 'sm' ? 24 : 40"
      class="csplab-empty__icon"
    />
    <p class="csplab-empty__title">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="csplab-empty__desc"
    >
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<style scoped>
.csplab-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--csplab-space-2);
  color: var(--text-mention-grey);
}

.csplab-empty--md {
  padding: var(--csplab-space-8) var(--csplab-space-4);
}

.csplab-empty--sm {
  padding: var(--csplab-space-4) var(--csplab-space-3);
}

.csplab-empty__icon {
  color: var(--text-mention-grey);
  opacity: 0.7;
}

.csplab-empty__title {
  font-weight: 600;
  color: var(--text-default-grey);
  font-size: var(--csplab-font-size-sm);
  margin: 0;
}

.csplab-empty__desc {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  margin: 0;
  max-width: 38ch;
}
</style>
