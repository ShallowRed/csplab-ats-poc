<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { DialogTitle, type DialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div class="flex flex-col space-y-2">
    <DialogTitle :class="cn('text-lg font-semibold text-foreground', props.class)">
      <slot />
    </DialogTitle>
  </div>
</template>
