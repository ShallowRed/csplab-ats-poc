<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePageHeader } from '@/stores/pageHeader'

const route = useRoute()
const pageHeader = usePageHeader()

onMounted(() => {
  const title = typeof route.meta.title === 'string' ? route.meta.title : 'Préférences'
  pageHeader.setTitle(title)
  pageHeader.setBreadcrumb([{ label: 'Paramètres' }, { label: title, to: '/preferences' }])
  pageHeader.setViewSwitcher(null)
})
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      Préférences
    </h1>

    <Card>
      <CardHeader class="csplab-page__card-header">
        <RiIcon
          name="ri:settings-3-line"
          :size="24"
          class="csplab-page__icon"
        />
        <CardTitle>
          Section disponible en phase 2 — non incluse dans le POC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="csplab-page__muted">
          Les préférences utilisateur ne font pas partie du POC.
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
