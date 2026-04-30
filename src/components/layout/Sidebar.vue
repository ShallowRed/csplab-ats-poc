<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useOffresStore } from '@/stores/offres'

type NavItem = {
  key: string
  label: string
  to: string
  activePath?: string
  icon: string
  activeMatch: 'exact' | 'prefix'
}

type NavSection = {
  label: string
  items: NavItem[]
}

const route = useRoute()
const offresStore = useOffresStore()

const firstOffreId = computed(() => offresStore.firstOffreId ?? 'offre-1')

const sections = computed<NavSection[]>(() => [
  {
    label: 'Pilotage',
    items: [
      {
        key: 'offres',
        label: 'Mes offres',
        to: '/offres',
        icon: 'ri:briefcase-line',
        activeMatch: 'prefix',
      },
      {
        key: 'dashboard',
        label: 'Tableau de bord',
        to: '/tableau-de-bord',
        icon: 'ri:dashboard-line',
        activeMatch: 'prefix',
      },
    ],
  },
  {
    label: 'Candidatures',
    items: [
      {
        key: 'candidatures',
        label: 'Toutes les candidatures',
        to: '/candidatures',
        icon: 'ri:group-line',
        activeMatch: 'prefix',
      },
      {
        key: 'pipeline',
        label: 'Pipeline',
        to: `/pipeline/${firstOffreId.value}`,
        activePath: '/pipeline',
        icon: 'ri:layout-column-line',
        activeMatch: 'prefix',
      },
    ],
  },
  {
    label: 'Entretiens',
    items: [
      {
        key: 'entretiens',
        label: 'Mes entretiens',
        to: '/entretiens',
        icon: 'ri:calendar-line',
        activeMatch: 'prefix',
      },
      {
        key: 'intervieweurs',
        label: 'Intervieweurs',
        to: '/intervieweurs',
        icon: 'ri:user-follow-line',
        activeMatch: 'prefix',
      },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      {
        key: 'preferences',
        label: 'Préférences',
        to: '/preferences',
        icon: 'ri:settings-3-line',
        activeMatch: 'prefix',
      },
    ],
  },
])

function isItemActive(item: NavItem): boolean {
  const matchPath = item.activePath ?? item.to

  if (item.activeMatch === 'exact') return route.path === matchPath
  if (route.path === matchPath) return true
  return route.path.startsWith(`${matchPath}/`)
}
</script>

<template>
  <div class="csplab-sidebar">
    <div class="csplab-sidebar__header">
      <div class="csplab-sidebar__brand">
        <div class="csplab-sidebar__logo">
          CSPLab
        </div>
        <div class="csplab-sidebar__subtitle">
          ATS
        </div>
      </div>
    </div>

    <nav class="csplab-sidebar__nav">
      <div
        v-for="section in sections"
        :key="section.label"
        class="csplab-sidebar__section"
      >
        <div class="csplab-sidebar__section-title">
          {{ section.label }}
        </div>
        <ul class="csplab-sidebar__items">
          <li
            v-for="item in section.items"
            :key="item.key"
            class="csplab-sidebar__item"
          >
            <RouterLink
              :to="item.to"
              class="csplab-sidebar__link"
              :class="{ 'csplab-sidebar__link--active': isItemActive(item) }"
              :aria-current="isItemActive(item) ? 'page' : undefined"
              :data-testid="`sidebar-link-${item.key}`"
            >
              <span
                class="csplab-sidebar__active-indicator"
                aria-hidden="true"
              />
              <component
                :is="RiIcon"
                :name="item.icon"
                :size="16"
                class="csplab-sidebar__icon"
              />
              <span class="csplab-sidebar__label">
                {{ item.label }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <div class="csplab-sidebar__footer">
      <div class="csplab-sidebar__user">
        <Avatar class="csplab-sidebar__avatar">
          <AvatarFallback>
            MD
          </AvatarFallback>
        </Avatar>
        <div class="csplab-sidebar__user-meta">
          <div class="csplab-sidebar__user-name">
            Marie Dupont
          </div>
          <div class="csplab-sidebar__user-role">
            RH
          </div>
        </div>
      </div>
      <button
        type="button"
        class="csplab-sidebar__settings"
        aria-label="Paramètres"
      >
        <RiIcon
          name="ri:settings-3-line"
          :size="16"
          class="csplab-sidebar__icon"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.csplab-sidebar {
  height: 100vh;
  width: 240px;
  display: grid;
  grid-template-rows: 64px 1fr 72px;
}

.csplab-sidebar__header {
  display: flex;
  align-items: center;
  padding: 0 var(--csplab-space-4);
}

.csplab-sidebar__brand {
  display: grid;
  gap: var(--csplab-space-1);
}

.csplab-sidebar__logo {
  font-weight: 800;
  font-size: var(--csplab-font-size-lg);
  color: var(--text-title-blue-france);
  line-height: 1;
}

.csplab-sidebar__subtitle {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  line-height: 1;
}

.csplab-sidebar__nav {
  overflow: auto;
  padding: var(--csplab-space-2) 0;
}

.csplab-sidebar__section {
  padding: 0;
}

.csplab-sidebar__section-title {
  padding: var(--csplab-space-4) var(--csplab-space-4) var(--csplab-space-2);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.csplab-sidebar__items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.csplab-sidebar__item {
  padding: 0;
}

.csplab-sidebar__link {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  padding: 0 var(--csplab-space-3);
  color: var(--text-default-grey);
  text-decoration: none;
}

.csplab-sidebar__link:hover {
  background: var(--background-alt-grey);
}

.csplab-sidebar__link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: -2px;
}

.csplab-sidebar__link--active {
  background: var(--background-alt-blue-france);
  color: var(--text-action-high-blue-france);
}

.csplab-sidebar__active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: transparent;
}

.csplab-sidebar__link--active .csplab-sidebar__active-indicator {
  background: var(--background-action-high-blue-france);
}

.csplab-sidebar__icon {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.csplab-sidebar__label {
  font-size: var(--csplab-font-size-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-sidebar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--csplab-space-4);
  border-top: 1px solid var(--border-default-grey);
}

.csplab-sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  min-width: 0;
}

.csplab-sidebar__avatar {
  width: 32px;
  height: 32px;
}

.csplab-sidebar__user-meta {
  min-width: 0;
  display: grid;
}

.csplab-sidebar__user-name {
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-title-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.csplab-sidebar__user-role {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.csplab-sidebar__settings {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: var(--csplab-radius-md);
  background: transparent;
  color: var(--text-mention-grey);
  cursor: pointer;
}

.csplab-sidebar__settings:hover {
  background: var(--background-alt-grey);
}

.csplab-sidebar__settings:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}
</style>
