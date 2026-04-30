<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      404 — Page introuvable
    </h1>
    <p class="csplab-page__muted">
      La page demandée n'existe pas ou a été déplacée.
    </p>

    <div class="csplab-page__actions">
      <Button as-child>
        <RouterLink to="/">
          Retour à l'accueil
        </RouterLink>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.csplab-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--csplab-space-6);
}

.csplab-page__title {
  font-size: var(--csplab-font-size-2xl);
  font-weight: 700;
  color: var(--text-title-grey);
  margin: 0 0 var(--csplab-space-3);
}

.csplab-page__muted {
  margin: 0;
  color: var(--text-mention-grey);
}

.csplab-page__actions {
  margin-top: var(--csplab-space-6);
}
</style>
