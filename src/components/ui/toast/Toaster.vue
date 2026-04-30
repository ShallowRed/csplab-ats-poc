<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner'
import { useThemeStore } from '@/stores/theme'

defineProps<{
  class?: string
}>()

const themeStore = useThemeStore()
</script>

<template>
  <Sonner
    :theme="themeStore.theme"
    position="bottom-right"
    :duration="5000"
    :toast-options="{
      classes: {
        toast: 'group toast',
        title: 'text-sm font-semibold',
        description: 'text-sm text-muted-foreground',
        actionButton: 'bg-primary text-primary-foreground',
        cancelButton: 'bg-muted text-muted-foreground',
      },
    }"
  />
</template>
