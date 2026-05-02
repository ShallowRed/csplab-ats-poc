<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsTrigger, type TabsTriggerProps } from 'radix-vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        pill:
          'rounded-sm px-3 py-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
        underline:
          'relative px-4 py-3 rounded-none bg-transparent text-[var(--text-mention-grey)] border-b-2 border-transparent -mb-px hover:text-[var(--text-default-grey)] hover:border-[var(--border-default-grey)] data-[state=active]:text-[var(--text-action-high-blue-france)] data-[state=active]:border-[var(--text-action-high-blue-france)]',
        segment:
          'gap-1.5 px-3 py-1.5 rounded-[var(--csplab-radius-sm)] text-[var(--text-mention-grey)] text-sm font-medium transition-colors hover:bg-[var(--background-default-grey-hover)] hover:text-[var(--text-default-grey)] data-[state=active]:bg-[var(--background-default-grey)] data-[state=active]:text-[var(--text-default-grey)] data-[state=active]:shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'pill',
    },
  },
)

interface Props extends TabsTriggerProps {
  class?: HTMLAttributes['class']
  variant?: VariantProps<typeof tabsTriggerVariants>['variant']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, variant: __, ...delegated } = props
  return delegated
})
</script>

<template>
  <TabsTrigger
    v-bind="delegatedProps"
    :class="cn(tabsTriggerVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </TabsTrigger>
</template>
