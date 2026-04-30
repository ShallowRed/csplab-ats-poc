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
    redirect: '/tableau-de-bord',
  },
  {
    path: '/tableau-de-bord',
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
    path: '/offres/nouvelle',
    component: () => import('@/pages/OffreFormPage.vue'),
    props: true,
    meta: {
      title: 'Nouvelle offre',
      breadcrumb: [
        { label: 'Pilotage' },
        { label: 'Mes offres', to: '/offres' },
        { label: 'Nouvelle offre' },
      ],
      viewSwitcher: null,
    },
  },
  {
    path: '/offres/:id',
    component: () => import('@/pages/OffreDetailPage.vue'),
    props: true,
    meta: {
      title: 'Offre',
      breadcrumb: (route) => {
        const id = String(route.params.id)
        let titre = id
        try {
          const active = getActivePinia()
          if (active) {
            const offresStore = useOffresStore(active)
            const offre = offresStore.getById(id)
            if (offre) titre = offre.titre
          }
        } catch {
          // pinia not active
        }
        return [
          { label: 'Pilotage' },
          { label: 'Mes offres', to: '/offres' },
          { label: titre },
        ]
      },
      viewSwitcher: null,
    },
  },
  {
    path: '/offres/:id/edition',
    component: () => import('@/pages/OffreFormPage.vue'),
    props: true,
    meta: {
      title: 'Modifier l\'offre',
      breadcrumb: (route) => {
        const id = String(route.params.id)
        let titre = id
        try {
          const active = getActivePinia()
          if (active) {
            const offresStore = useOffresStore(active)
            const offre = offresStore.getById(id)
            if (offre) titre = offre.titre
          }
        } catch {
          // pinia not active
        }
        return [
          { label: 'Pilotage' },
          { label: 'Mes offres', to: '/offres' },
          { label: titre, to: `/offres/${id}` },
          { label: 'Modifier' },
        ]
      },
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
      breadcrumb: (route) => {
        const view = route.query.view === 'table' ? 'Table' : 'Kanban'
        return [
          { label: 'Candidatures' },
          { label: 'Pipeline' },
          { label: view },
        ]
      },
      viewSwitcher: (route, router) => ({
        current: route.query.view === 'table' ? 'table' : 'kanban',
        items: [
          { value: 'kanban', label: 'Kanban', icon: 'ri:layout-column-line' },
          { value: 'table', label: 'Table', icon: 'ri:table-line' },
        ],
        onChange: (value) => {
          const nextQuery = { ...route.query, view: value === 'table' ? 'table' : undefined }
          router.push({ path: route.path, query: nextQuery })
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
    path: '/parametres',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: {
      title: 'Paramètres',
      breadcrumb: [{ label: 'Accueil', to: '/' }, { label: 'Paramètres' }],
      viewSwitcher: (route, router) => ({
        current: typeof route.query.tab === 'string' && ['motifs', 'templates', 'intervieweurs'].includes(route.query.tab)
          ? route.query.tab
          : 'etapes',
        items: [
          { value: 'etapes', label: 'Étapes du pipeline', icon: 'ri:flow-chart' },
          { value: 'motifs', label: 'Motifs de refus', icon: 'ri:close-circle-line' },
          { value: 'templates', label: 'Templates email', icon: 'ri:mail-line' },
          { value: 'intervieweurs', label: 'Intervieweurs', icon: 'ri:team-line' },
        ],
        onChange: (value) => {
          const nextQuery = { ...route.query, tab: value === 'etapes' ? undefined : value }
          router.push({ path: route.path, query: nextQuery })
        },
      }),
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
