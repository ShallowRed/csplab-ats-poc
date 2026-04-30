<script setup lang="ts">
import {
  AvatarRoot,
  type AvatarRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<AvatarRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AvatarRoot
    v-bind="forwarded"
    :class="
      cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        props.class,
      )
    "
  >
    <slot />
  </AvatarRoot>
</template>
