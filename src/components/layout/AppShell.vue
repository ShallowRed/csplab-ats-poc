<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from './Sidebar.vue'
import HeaderContextual from './HeaderContextual.vue'
import CandidateDrawer from '@/components/candidate/CandidateDrawer.vue'
import InterviewSlideOver from '@/components/interview/InterviewSlideOver.vue'
import { RouterView } from 'vue-router'
import { useCandidaturesStore } from '@/stores/candidatures'

const candidaturesStore = useCandidaturesStore()
const orderedIds = computed(() => candidaturesStore.candidatures.map(c => c.id))
</script>

<template>
  <a
    class="csplab-skip-link"
    href="#contenu-principal"
  >
    Aller au contenu
  </a>

  <div class="csplab-shell">
    <aside
      aria-label="Navigation principale"
      class="csplab-shell__sidebar"
    >
      <Sidebar />
    </aside>

    <div class="csplab-shell__main">
      <HeaderContextual />

      <main
        id="contenu-principal"
        tabindex="-1"
        class="csplab-shell__content"
      >
        <slot>
          <RouterView />
        </slot>
      </main>
    </div>
  </div>

  <CandidateDrawer :ordered-ids="orderedIds" />
  <InterviewSlideOver />
</template>

<style scoped>
.csplab-skip-link {
  position: absolute;
  left: var(--csplab-space-4);
  top: var(--csplab-space-4);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  color: var(--text-action-high-blue-france);
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 150ms ease;
  z-index: 50;
}

.csplab-skip-link:focus {
  transform: translateY(0);
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.csplab-shell {
  height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: var(--background-default-grey);
}

.csplab-shell__sidebar {
  background: var(--background-alt-grey);
  border-right: 1px solid var(--border-default-grey);
  overflow: hidden;
}

.csplab-shell__main {
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.csplab-shell__content {
  overflow: auto;
}

.csplab-shell__content:focus {
  outline: none;
}
</style>
