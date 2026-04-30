<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { SelectTrigger, type SelectTriggerProps } from 'radix-vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <SelectTrigger
    v-bind="delegatedProps"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-sm border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class,
      )
    "
  >
    <slot />
    <RiIcon name="ri:arrow-down-s-line" :size="16" class="opacity-50" />
  </SelectTrigger>
</template>
