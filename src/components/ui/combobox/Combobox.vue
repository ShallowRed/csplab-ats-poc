<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ComboboxRoot, type ComboboxRootEmits, type ComboboxRootProps, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxRootProps<any> & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ComboboxRootEmits<any>>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :class="cn('relative', props.class)"
  >
    <slot />
  </ComboboxRoot>
</template>
