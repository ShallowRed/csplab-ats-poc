<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  name: string
  size?: number | string
  class?: string
}

const props = withDefaults(defineProps<Props>(), { size: 16 })

const fullName = computed(() =>
  props.name.startsWith('ri:') ? props.name : `ri:${props.name}`,
)
</script>

<template>
  <Icon :icon="fullName" :width="size" :height="size" :class="props.class" style="display:block" aria-hidden="true" />
</template>
