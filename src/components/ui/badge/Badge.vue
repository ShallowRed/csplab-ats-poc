<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
        'status-draft':
          'border-[var(--csplab-status-draft)] bg-[color-mix(in_srgb,var(--csplab-status-draft)_15%,transparent)] text-[var(--csplab-status-draft)]',
        'status-submitted':
          'border-[var(--csplab-status-submitted)] bg-[color-mix(in_srgb,var(--csplab-status-submitted)_15%,transparent)] text-[var(--csplab-status-submitted)]',
        'status-screening':
          'border-[var(--csplab-status-screening)] bg-[color-mix(in_srgb,var(--csplab-status-screening)_15%,transparent)] text-[var(--csplab-status-screening)]',
        'status-interview':
          'border-[var(--csplab-status-interview)] bg-[color-mix(in_srgb,var(--csplab-status-interview)_15%,transparent)] text-[var(--csplab-status-interview)]',
        'status-offer':
          'border-[var(--csplab-status-offer)] bg-[color-mix(in_srgb,var(--csplab-status-offer)_15%,transparent)] text-[var(--csplab-status-offer)]',
        'status-rejected':
          'border-[var(--csplab-status-rejected)] bg-[color-mix(in_srgb,var(--csplab-status-rejected)_15%,transparent)] text-[var(--csplab-status-rejected)]',
        'status-archived':
          'border-[var(--csplab-status-archived)] bg-[color-mix(in_srgb,var(--csplab-status-archived)_15%,transparent)] text-[var(--csplab-status-archived)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props {
  variant?: VariantProps<typeof badgeVariants>['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </div>
</template>
