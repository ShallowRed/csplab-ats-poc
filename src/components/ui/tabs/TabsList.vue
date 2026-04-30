<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsList, type TabsListProps } from 'radix-vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tabsListVariants = cva('', {
  variants: {
    variant: {
      pill: 'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      underline:
        'inline-flex items-stretch h-auto bg-transparent border-b border-[var(--border-default-grey)] rounded-none p-0',
    },
  },
  defaultVariants: {
    variant: 'pill',
  },
})

interface Props extends TabsListProps {
  class?: HTMLAttributes['class']
  variant?: VariantProps<typeof tabsListVariants>['variant']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, variant: __, ...delegated } = props
  return delegated
})
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="cn(tabsListVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </TabsList>
</template>
