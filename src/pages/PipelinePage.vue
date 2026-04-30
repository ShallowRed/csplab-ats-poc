<script setup lang="ts">
import { computed, onBeforeUnmount, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Kanban } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageHeader } from '@/stores/pageHeader'

const props = defineProps<{ offreId?: string }>()

const route = useRoute()
const router = useRouter()
const pageHeader = usePageHeader()

const offreId = computed(() => props.offreId ?? '')

watchEffect(() => {
  const title = typeof route.meta.title === 'string' ? route.meta.title : 'Pipeline'
  pageHeader.setTitle(title)
  pageHeader.setBreadcrumb([
    { label: 'Candidatures' },
    { label: 'Pipeline', to: route.fullPath },
  ])

  pageHeader.setViewSwitcher({
    current: 'kanban',
    onChange: (value) => {
      if (value === 'table' && offreId.value) router.push(`/candidatures/table/${offreId.value}`)
    },
  })
})

onBeforeUnmount(() => {
  pageHeader.setViewSwitcher(null)
})
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      Pipeline — kanban
    </h1>

    <Card>
      <CardHeader class="csplab-page__card-header">
        <Kanban
          class="csplab-page__icon"
          aria-hidden="true"
        />
        <CardTitle>
          Vue kanban — Lot 4
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="csplab-page__muted">
          Placeholder : le kanban (colonnes, drag & drop) sera livré au Lot 4.
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
