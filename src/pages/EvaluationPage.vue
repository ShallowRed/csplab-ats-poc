<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageHeader } from '@/stores/pageHeader'

const props = defineProps<{ id: string }>()

const route = useRoute()
const pageHeader = usePageHeader()

onMounted(() => {
  const title = typeof route.meta.title === 'string' ? route.meta.title : 'Évaluation'
  pageHeader.setTitle(title)
  pageHeader.setBreadcrumb([
    { label: 'Entretiens', to: '/entretiens' },
    { label: `Entretien ${props.id}` },
    { label: title },
  ])
  pageHeader.setViewSwitcher(null)
})
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      Évaluation
    </h1>

    <Card>
      <CardHeader>
        <CardTitle>
          Formulaire d'évaluation — Lot 8
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="csplab-page__muted">
          Placeholder : le formulaire complet sera livré au Lot 8.
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

.csplab-page__muted {
  margin: 0;
  color: var(--text-mention-grey);
}
</style>
