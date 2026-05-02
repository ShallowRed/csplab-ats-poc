<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type HTMLAttributes } from 'vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 leading-none whitespace-nowrap rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:bg-[var(--background-disabled-grey)] disabled:text-[var(--text-disabled-grey)] disabled:border-transparent',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--background-action-high-blue-france)] text-[var(--text-inverted-grey)] hover:bg-[var(--background-action-high-blue-france-hover)] active:bg-[var(--background-action-high-blue-france-active)]',
        secondary:
          'bg-transparent text-[var(--text-action-high-blue-france)] shadow-[inset_0_0_0_1px_var(--border-action-high-blue-france)] hover:bg-[var(--background-default-grey-hover)] active:bg-[var(--background-default-grey-active)]',
        tertiary:
          'bg-transparent text-[var(--text-action-high-blue-france)] shadow-[inset_0_0_0_1px_var(--border-default-grey)] hover:bg-[var(--background-default-grey-hover)] active:bg-[var(--background-default-grey-active)]',
        'tertiary-no-outline':
          'bg-transparent text-[var(--text-action-high-grey)] hover:bg-[var(--background-default-grey-hover)] active:bg-[var(--background-default-grey-active)]',
        destructive:
          'bg-[var(--background-action-high-red-marianne)] text-[var(--text-inverted-grey)] hover:bg-[var(--background-action-high-red-marianne-hover)] active:bg-[var(--background-action-high-red-marianne-active)]',
        link:
          'bg-transparent text-[var(--text-action-high-blue-france)] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'py-2 px-4 text-sm',
        lg: 'py-3 px-6 text-base',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

interface Props extends PrimitiveProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  class?: HTMLAttributes['class']
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  asChild: false,
})
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
