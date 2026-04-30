import { createRouter, createWebHistory, type RouterHistory, type RouteLocationNormalized, type Router } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getActivePinia } from 'pinia'
import { seed } from '@/data/seed'
import { useOffresStore } from '@/stores/offres'
import { usePageHeader, type BreadcrumbItem, type ViewSwitcher } from '@/stores/pageHeader'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    breadcrumb?: BreadcrumbItem[] | ((route: RouteLocationNormalized) => BreadcrumbItem[])
    viewSwitcher?: ViewSwitcher | null | ((route: RouteLocationNormalized, router: Router) => ViewSwitcher | null)
  }
}

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
  {
    path: '/',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      title: 'Tableau de bord',
      breadcrumb: [{ label: 'Pilotage' }, { label: 'Tableau de bord' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/offres',
    component: () => import('@/pages/OffresPage.vue'),
    meta: {
      title: 'Mes offres',
      breadcrumb: [{ label: 'Pilotage' }, { label: 'Mes offres', to: '/offres' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/candidatures',
    component: () => import('@/pages/CandidaturesPage.vue'),
    meta: {
      title: 'Toutes les candidatures',
      breadcrumb: [{ label: 'Candidatures' }, { label: 'Toutes les candidatures' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/candidatures/table/:offreId',
    component: () => import('@/pages/CandidaturesTablePage.vue'),
    props: true,
    meta: {
      title: 'Pipeline',
      breadcrumb: (route) => [
        { label: 'Candidatures' },
        { label: 'Pipeline', to: `/pipeline/${route.params.offreId}` },
        { label: 'Table', to: route.fullPath },
      ],
      viewSwitcher: (route, router) => ({
        current: 'table',
        onChange: (value) => {
          if (value === 'kanban') router.push(`/pipeline/${route.params.offreId}`)
        },
      }),
    },
  },
  {
    path: '/candidatures/:id',
    component: () => import('@/pages/CandidatureFullPage.vue'),
    props: true,
    meta: {
      title: 'Fiche candidat',
      breadcrumb: (route) => [
        { label: 'Candidatures' },
        { label: 'Toutes les candidatures', to: '/candidatures' },
        { label: `Candidature ${route.params.id}` },
      ],
      viewSwitcher: null,
    },
  },
  {
    path: '/pipeline/:offreId?',
    component: () => import('@/pages/PipelinePage.vue'),
    props: true,
    meta: {
      title: 'Pipeline',
      breadcrumb: (route) => [
        { label: 'Candidatures' },
        { label: 'Pipeline', to: route.fullPath },
      ],
      viewSwitcher: (route, router) => ({
        current: 'kanban',
        onChange: (value) => {
          const offreId = typeof route.params.offreId === 'string' ? route.params.offreId : ''
          if (value === 'table' && offreId) router.push(`/candidatures/table/${offreId}`)
        },
      }),
    },
    beforeEnter: (to) => {
      if (to.params.offreId) return true
      const firstOffreId = getFirstOffreId()
      if (!firstOffreId) return true
      return { path: `/pipeline/${firstOffreId}`, query: to.query }
    },
  },
  {
    path: '/entretiens',
    component: () => import('@/pages/EntretiensPage.vue'),
    meta: {
      title: 'Mes entretiens',
      breadcrumb: [{ label: 'Entretiens' }, { label: 'Mes entretiens', to: '/entretiens' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/entretiens/:id/evaluation',
    component: () => import('@/pages/EvaluationPage.vue'),
    props: true,
    meta: {
      title: 'Évaluation',
      breadcrumb: [
        { label: 'Entretiens', to: '/entretiens' },
        { label: 'Évaluation' },
      ],
      viewSwitcher: null,
    },
  },
  {
    path: '/intervieweurs',
    component: () => import('@/pages/IntervieweursPage.vue'),
    meta: {
      title: 'Intervieweurs',
      breadcrumb: [{ label: 'Entretiens' }, { label: 'Intervieweurs', to: '/intervieweurs' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/preferences',
    component: () => import('@/pages/PreferencesPage.vue'),
    meta: {
      title: 'Préférences',
      breadcrumb: [{ label: 'Paramètres' }, { label: 'Préférences', to: '/preferences' }],
      viewSwitcher: null,
    },
  },
  {
    path: '/:catchAll(.*)',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: 'Page introuvable',
      breadcrumb: [{ label: 'Erreur' }, { label: '404' }],
      viewSwitcher: null,
    },
  },
]

export function createAppRouter(history?: RouterHistory) {
  const router = createRouter({
    history: history ?? createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      return { top: 0 }
    },
  })

  router.afterEach((to) => {
    const active = getActivePinia()
    if (!active) return
    const pageHeader = usePageHeader(active)

    if (typeof to.meta.title === 'string') {
      pageHeader.setTitle(to.meta.title)
    }

    const breadcrumb = typeof to.meta.breadcrumb === 'function'
      ? to.meta.breadcrumb(to)
      : to.meta.breadcrumb ?? []
    pageHeader.setBreadcrumb(breadcrumb)

    const viewSwitcher = typeof to.meta.viewSwitcher === 'function'
      ? to.meta.viewSwitcher(to, router)
      : to.meta.viewSwitcher ?? null
    pageHeader.setViewSwitcher(viewSwitcher)
  })

  return router
}

export default createAppRouter()
