<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ComboboxInput, type ComboboxInputProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxInputProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ComboboxInput
    v-bind="delegatedProps"
    :class="
      cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a76f6] disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
