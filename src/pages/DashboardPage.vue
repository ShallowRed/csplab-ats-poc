<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePageHeader } from '@/stores/pageHeader'

const router = useRouter()
const route = useRoute()
const pageHeader = usePageHeader()

onMounted(() => {
  const title = typeof route.meta.title === 'string' ? route.meta.title : 'Tableau de bord'
  pageHeader.setTitle(title)
  pageHeader.setBreadcrumb([{ label: 'Pilotage' }, { label: title }])

  router.replace('/pipeline')
})
</script>

<template>
  <div class="csplab-page">
    <h1 class="csplab-page__title">
      Tableau de bord
    </h1>
    <p class="csplab-page__muted">
      Redirection vers le pipeline (le dashboard agrégé est hors périmètre du POC).
    </p>
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
  color: var(--text-mention-grey);
  margin: 0;
}
</style>
