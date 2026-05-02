<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  /**
   * dismissible : tag supprimable (rendu en <button> avec croix)
   * pressable  : tag activable (rendu en <button> avec aria-pressed)
   * static     : tag non interactif (rendu en <p>)
   */
  type?: 'static' | 'dismissible' | 'pressable'
  pressed?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  ariaLabel?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  type: 'static',
  pressed: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  dismiss: []
  'update:pressed': [value: boolean]
}>()

const tag = computed(() => {
  if (props.type === 'static') return 'p'
  return 'button'
})

const baseClass = computed(() =>
  cn(
    // Fondamentaux DSFR : pill, fond gris neutre, pas d'uppercase (≠ badge)
    'inline-flex items-center font-medium',
    'bg-[var(--background-contrast-grey)] text-[var(--text-action-high-grey)]',
    'rounded-full',
    props.size === 'sm'
      ? 'text-xs leading-5 min-h-6 px-2 py-0.5'
      : 'text-sm leading-6 min-h-8 px-3 py-1',
    // État interactif
    props.type !== 'static' && !props.disabled && [
      'cursor-pointer transition-colors',
      'hover:bg-[var(--background-default-grey-hover)]',
      'active:bg-[var(--background-default-grey-active)]',
    ],
    // Tag activable sélectionné
    props.type === 'pressable' && props.pressed && [
      'bg-[var(--background-action-low-blue-france,#e8edff)] text-[var(--text-action-high-blue-france)]',
      'hover:bg-[var(--background-action-low-blue-france,#e8edff)]',
    ],
    // Tag supprimable : fond bleu plein (DSFR fr-tag--dismiss)
    props.type === 'dismissible' && [
      'bg-[var(--background-action-high-blue-france)] text-[var(--text-inverted-grey)]',
      'hover:bg-[var(--background-action-high-blue-france-hover)]',
      'active:bg-[var(--background-action-high-blue-france-active)]',
      props.size === 'sm' ? 'pr-1' : 'pr-1.5',
    ],
    // Désactivé
    props.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    props.class,
  )
)

function handleClick() {
  if (props.disabled) return
  if (props.type === 'pressable') emit('update:pressed', !props.pressed)
  if (props.type === 'dismissible') emit('dismiss')
}
</script>

<template>
  <component
    :is="tag"
    :type="type !== 'static' ? 'button' : undefined"
    :aria-pressed="type === 'pressable' ? pressed : undefined"
    :aria-label="type === 'dismissible' ? (ariaLabel ?? `Retirer le filtre`) : undefined"
    :disabled="type !== 'static' && disabled ? true : undefined"
    :class="baseClass"
    @click="handleClick"
  >
    <slot />
    <!-- Croix de suppression (DSFR fr-tag--dismiss) -->
    <span
      v-if="type === 'dismissible'"
      :class="cn('ml-1 flex items-center opacity-80', size === 'sm' ? 'text-[10px]' : 'text-xs')"
      aria-hidden="true"
    >✕</span>
  </component>
</template>
