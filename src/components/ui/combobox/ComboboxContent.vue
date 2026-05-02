<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ComboboxContent, type ComboboxContentProps, ComboboxPortal, ComboboxViewport } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent
      v-bind="delegatedProps"
      :class="
        cn(
          'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-sm border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          props.class,
        )
      "
    >
      <ComboboxViewport class="p-1">
        <slot />
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxPortal>
</template>
