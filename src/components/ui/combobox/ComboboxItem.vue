<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ComboboxItem, ComboboxItemIndicator, type ComboboxItemProps } from 'radix-vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ComboboxItem
    v-bind="delegatedProps"
    :class="
      cn(
        'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <slot />
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <ComboboxItemIndicator>
        <RiIcon
          name="ri:check-line"
          :size="16"
        />
      </ComboboxItemIndicator>
    </span>
  </ComboboxItem>
</template>
