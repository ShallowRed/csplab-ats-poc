import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getActivePinia } from 'pinia'
import { seed } from '@/data/seed'
import { useOffresStore } from '@/stores/offres'

function getFirstOffreId(): string | null {
  try {
    const active = getActivePinia()
    if (active) {
      const offresStore = useOffresStore(active)
      return offresStore.firstOffreId
    }
  } catch {
    // No active Pinia (e.g. unit tests creating a router standalone)
  }

  return seed.offres[0]?.id ?? null
}

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/DashboardPage.vue'), meta: { title: 'Tableau de bord' } },
  { path: '/offres', component: () => import('@/pages/OffresPage.vue'), meta: { title: 'Mes offres' } },
  { path: '/candidatures', component: () => import('@/pages/CandidaturesPage.vue'), meta: { title: 'Toutes les candidatures' } },
  { path: '/candidatures/table/:offreId', component: () => import('@/pages/CandidaturesTablePage.vue'), props: true, meta: { title: 'Pipeline' } },
  { path: '/candidatures/:id', component: () => import('@/pages/CandidatureFullPage.vue'), props: true, meta: { title: 'Fiche candidat' } },
  {
    path: '/pipeline/:offreId?',
    component: () => import('@/pages/PipelinePage.vue'),
    props: true,
    meta: { title: 'Pipeline' },
    beforeEnter: (to) => {
      if (to.params.offreId) return true
      const firstOffreId = getFirstOffreId()
      if (!firstOffreId) return true
      return { path: `/pipeline/${firstOffreId}`, query: to.query }
    },
  },
  { path: '/entretiens', component: () => import('@/pages/EntretiensPage.vue'), meta: { title: 'Mes entretiens' } },
  { path: '/entretiens/:id/evaluation', component: () => import('@/pages/EvaluationPage.vue'), props: true, meta: { title: 'Évaluation' } },
  { path: '/intervieweurs', component: () => import('@/pages/IntervieweursPage.vue'), meta: { title: 'Intervieweurs' } },
  { path: '/preferences', component: () => import('@/pages/PreferencesPage.vue'), meta: { title: 'Préférences' } },
  { path: '/:catchAll(.*)', component: () => import('@/pages/NotFoundPage.vue') },
]

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    history: history ?? createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      return { top: 0 }
    },
  })
}

export default createAppRouter()
