<script setup lang="ts">
import tokensVersion from '@/styles/tokens-version.json'

const colors = [
  { name: 'Action', var: '--background-action-high-blue-france' },
  { name: 'Success', var: '--text-default-success' },
  { name: 'Warning', var: '--text-default-warning' },
  { name: 'Error', var: '--text-default-error' },
  { name: 'Info', var: '--text-default-info' }
]

const statuses = [
  { name: 'Draft', var: '--csplab-status-draft' },
  { name: 'Submitted', var: '--csplab-status-submitted' },
  { name: 'Screening', var: '--csplab-status-screening' },
  { name: 'Interview', var: '--csplab-status-interview' },
  { name: 'Offer', var: '--csplab-status-offer' },
  { name: 'Rejected', var: '--csplab-status-rejected' },
  { name: 'Archived', var: '--csplab-status-archived' }
]

const fontSizes = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl']
</script>

<template>
  <div class="p-8">
    <h1
      class="text-2xl font-bold mb-2"
      style="color: var(--text-title-grey)"
    >
      CSPLab POC — Bootstrap
    </h1>
    <p
      class="mb-8"
      style="color: var(--text-mention-grey)"
    >
      DSFR {{ tokensVersion.dsfrVersion }} • Revision {{ tokensVersion.csplabRevision }} • Lot 0 terminé
    </p>

    <section class="mb-8">
      <h2
        class="text-xl font-medium mb-4"
        style="color: var(--text-title-grey)"
      >
        Couleurs Sémantiques
      </h2>
      <div class="grid grid-cols-5 gap-4">
        <div
          v-for="color in colors"
          :key="color.name"
        >
          <div
            class="h-16 rounded-md mb-2"
            :style="{ backgroundColor: `var(${color.var})` }"
          />
          <p class="text-sm">
            {{ color.name }}
          </p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2
        class="text-xl font-medium mb-4"
        style="color: var(--text-title-grey)"
      >
        Statuts Métier
      </h2>
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="status in statuses"
          :key="status.name"
        >
          <div
            class="h-12 rounded-sm mb-1"
            :style="{ backgroundColor: `var(${status.var})` }"
          />
          <p class="text-xs">
            {{ status.name }}
          </p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2
        class="text-xl font-medium mb-4"
        style="color: var(--text-title-grey)"
      >
        Échelle Typographique
      </h2>
      <div class="space-y-2">
        <p
          v-for="size in fontSizes"
          :key="size"
          :style="{ fontSize: `var(--csplab-font-size-${size})` }"
        >
          {{ size }} — The quick brown fox jumps
        </p>
      </div>
    </section>

    <section>
      <button
        class="px-6 py-3 rounded-md font-medium text-white transition-colors"
        style="
          background: var(--background-action-high-blue-france);
        "
        @focus="(e) => (e.target as HTMLElement).style.outline = 'var(--focus-ring)'"
        @blur="(e) => (e.target as HTMLElement).style.outline = 'none'"
      >
        Bouton DSFR (focus-moi)
      </button>
    </section>
  </div>
</template>

