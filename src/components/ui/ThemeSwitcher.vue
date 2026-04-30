<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import RiIcon from '@/components/ui/icon/RiIcon.vue'

const themeStore = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="theme-switcher"
    :aria-label="themeStore.theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'"
    :title="themeStore.theme === 'light' ? 'Mode sombre' : 'Mode clair'"
    @click="themeStore.toggle()"
  >
    <RiIcon
      :name="themeStore.theme === 'light' ? 'ri:moon-line' : 'ri:sun-line'"
      :size="16"
    />
  </button>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: var(--csplab-radius-md);
  background: transparent;
  color: var(--text-mention-grey);
  cursor: pointer;
}

.theme-switcher:hover {
  background: var(--background-alt-grey);
}

.theme-switcher:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
</style>
