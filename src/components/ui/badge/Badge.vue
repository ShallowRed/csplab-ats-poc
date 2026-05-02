<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'

// Icônes Remix Icons pour les badges système DSFR
const SYSTEM_ICONS: Record<string, string> = {
  default: '',
  secondary: '',
  destructive: 'ri:close-circle-fill',
  outline: '',
  'status-draft': '',
  'status-submitted': 'ri:information-fill',
  'status-screening': 'ri:search-2-line',
  'status-interview': 'ri:calendar-event-fill',
  'status-offer': 'ri:checkbox-circle-fill',
  'status-rejected': 'ri:close-circle-fill',
  'status-archived': 'ri:archive-fill',
}

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--background-contrast-grey)] text-[var(--text-default-grey)]',
        secondary:
          'bg-[var(--background-alt-grey)] text-[var(--text-mention-grey)]',
        destructive:
          'bg-[var(--background-contrast-error)] text-[var(--text-default-error)]',
        outline:
          'bg-transparent shadow-[inset_0_0_0_1px_var(--border-default-grey)] text-[var(--text-default-grey)]',
        'status-draft':
          'bg-[color-mix(in_srgb,var(--csplab-status-draft)_12%,transparent)] text-[var(--csplab-status-draft)]',
        'status-submitted':
          'bg-[var(--background-contrast-info)] text-[var(--text-default-info)]',
        'status-screening':
          'bg-[color-mix(in_srgb,var(--csplab-status-screening)_12%,transparent)] text-[var(--csplab-status-screening)]',
        'status-interview':
          'bg-[var(--background-contrast-warning)] text-[var(--text-default-warning)]',
        'status-offer':
          'bg-[var(--background-contrast-success)] text-[var(--text-default-success)]',
        'status-rejected':
          'bg-[var(--background-contrast-error)] text-[var(--text-default-error)]',
        'status-archived':
          'bg-[color-mix(in_srgb,var(--csplab-status-archived)_12%,transparent)] text-[var(--csplab-status-archived)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props {
  variant?: VariantProps<typeof badgeVariants>['variant']
  /** Forcer ou supprimer l'icône système. `false` = pas d'icône. */
  icon?: string | false
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const resolvedIcon = computed(() => {
  if (props.icon === false) return ''
  if (props.icon) return props.icon
  return SYSTEM_ICONS[props.variant ?? 'default'] ?? ''
})
</script>

<template>
  <p :class="cn(badgeVariants({ variant }), props.class)">
    <Icon
      v-if="resolvedIcon"
      :icon="resolvedIcon"
      :width="12"
      :height="12"
      aria-hidden="true"
      class="shrink-0"
    />
    <slot />
  </p>
</template>
