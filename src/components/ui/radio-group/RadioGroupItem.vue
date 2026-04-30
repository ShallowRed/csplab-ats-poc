<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, type RadioGroupItemProps } from 'radix-vue'
import { Circle } from 'lucide-vue-next'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<RadioGroupItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <RadioGroupItem
    v-bind="delegatedProps"
    :class="
      cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a76f6] disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <RadioGroupIndicator class="flex items-center justify-center">
      <Circle class="h-3.5 w-3.5 fill-primary" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
