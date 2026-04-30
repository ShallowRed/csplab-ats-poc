<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Card } from '@/components/ui/card'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

type Tone = 'default' | 'attention' | 'success'

const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    sublabel?: string
    icon?: string
    tone?: Tone
    to?: string
  }>(),
  {
    tone: 'default',
  },
)

const toneClass = computed(() => `kpi-card--${props.tone}`)
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    class="kpi-card"
    :class="[toneClass, { 'kpi-card--clickable': Boolean(to) }]"
    :data-testid="`kpi-card-${label}`"
  >
    <Card class="kpi-card__inner">
      <div class="kpi-card__top">
        <span class="kpi-card__label">{{ label }}</span>
        <RiIcon
          v-if="icon"
          :name="icon"
          :size="20"
          class="kpi-card__icon"
        />
      </div>
      <div class="kpi-card__value">
        {{ value }}
      </div>
      <div
        v-if="sublabel"
        class="kpi-card__sublabel"
      >
        {{ sublabel }}
      </div>
    </Card>
  </component>
</template>

<style scoped>
.kpi-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: var(--csplab-radius-md);
  outline: none;
}

.kpi-card__inner {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
  padding: var(--csplab-space-4);
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  transition: border-color 120ms ease;
}

.kpi-card--clickable:hover .kpi-card__inner,
.kpi-card--clickable:focus-visible .kpi-card__inner {
  border-color: var(--border-action-high-blue-france);
}

.kpi-card:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.kpi-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-2);
}

.kpi-card__label {
  font-size: var(--csplab-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-mention-grey);
  font-weight: 600;
}

.kpi-card__icon {
  color: var(--text-mention-grey);
}

.kpi-card--attention .kpi-card__icon,
.kpi-card--attention .kpi-card__value {
  color: var(--text-default-warning);
}

.kpi-card--success .kpi-card__icon,
.kpi-card--success .kpi-card__value {
  color: var(--text-default-success);
}

.kpi-card__value {
  font-size: var(--csplab-font-size-2xl);
  font-weight: 700;
  color: var(--text-title-grey);
  line-height: 1.1;
}

.kpi-card__sublabel {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}
</style>
