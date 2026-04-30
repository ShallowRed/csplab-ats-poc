<script setup lang="ts">
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{ offreId: string }>()
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      Pipeline — vue table
    </h1>

    <Card>
      <CardHeader class="csplab-page__card-header">
        <RiIcon
          name="ri:table-line"
          :size="24"
          class="csplab-page__icon"
        />
        <CardTitle>
          Vue table — Lot 5
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="csplab-page__muted">
          Placeholder : la table (tri, colonnes, sélection) sera livrée au Lot 5.
        </p>
      </CardContent>
    </Card>
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
  margin: 0 0 var(--csplab-space-4);
}

.csplab-page__card-header {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.csplab-page__icon {
  width: 24px;
  height: 24px;
  color: var(--text-mention-grey);
}

.csplab-page__muted {
  margin: 0;
  color: var(--text-mention-grey);
}
</style>
