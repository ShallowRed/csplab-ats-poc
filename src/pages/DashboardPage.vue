<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import TodoList from '@/components/dashboard/TodoList.vue'
import EtapeDelaiCard from '@/components/dashboard/EtapeDelaiCard.vue'
import { useDashboardMetrics } from '@/composables/useDashboardMetrics'

const { kpis, todos, delaisParEtape } = useDashboardMetrics()
</script>

<template>
  <div class="csplab-page-surface">
    <div class="csplab-page-content dashboard min-h-screen">
      <header class="dashboard__header">
        <p class="dashboard__intro">
          Vue d'ensemble de votre activité de recrutement.
        </p>
      </header>

      <section
        class="dashboard__kpis"
        aria-label="Indicateurs clés"
      >
        <KpiCard
          label="Offres ouvertes"
          :value="kpis.offresOuvertes"
          :sublabel="kpis.offresOuvertesNouvelles7j > 0
            ? `${kpis.offresOuvertesNouvelles7j} nouvelle${kpis.offresOuvertesNouvelles7j > 1 ? 's' : ''} cette semaine`
            : 'Aucune nouveauté cette semaine'"
          icon="ri:briefcase-line"
          to="/offres"
        />
        <KpiCard
          label="Candidatures à traiter"
          :value="kpis.candidaturesATraiter"
          :sublabel="kpis.candidaturesATraiterRetard > 0
            ? `${kpis.candidaturesATraiterRetard} en attente depuis +48 h`
            : 'Toutes traitées dans les délais'"
          icon="ri:user-search-line"
          :tone="kpis.candidaturesATraiterRetard > 0 ? 'attention' : 'default'"
          to="/candidatures"
        />
        <KpiCard
          label="Entretiens à 7 jours"
          :value="kpis.entretiens7j"
          :sublabel="kpis.entretiensAujourdhui > 0
            ? `${kpis.entretiensAujourdhui} aujourd'hui`
            : 'Aucun aujourd\'hui'"
          icon="ri:calendar-event-line"
          to="/entretiens"
        />
        <KpiCard
          label="Évaluations en attente"
          :value="kpis.evaluationsEnAttente"
          :sublabel="kpis.evaluationsEnAttenteRetard > 0
            ? `${kpis.evaluationsEnAttenteRetard} depuis +3 jours`
            : 'À jour'"
          icon="ri:clipboard-line"
          :tone="kpis.evaluationsEnAttenteRetard > 0 ? 'attention' : 'default'"
          to="/entretiens"
        />
      </section>

      <section
        class="dashboard__grid"
        aria-label="Suivi opérationnel"
      >
        <Card class="dashboard__card dashboard__card--todo">
          <CardHeader class="dashboard__card-header">
            <CardTitle>Mes actions du jour</CardTitle>
            <Button
              v-if="todos.length > 0"
              as-child
              variant="link"
              size="sm"
            >
              <RouterLink to="/candidatures">
                Voir tous
              </RouterLink>
            </Button>
          </CardHeader>
          <CardContent>
            <TodoList
              :items="todos"
              :max="5"
            />
          </CardContent>
        </Card>

        <Card class="dashboard__card dashboard__card--delais">
          <CardHeader class="dashboard__card-header">
            <CardTitle>Délais moyens par étape</CardTitle>
          </CardHeader>
          <CardContent>
            <EtapeDelaiCard :delais="delaisParEtape" />
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-6);
}

.dashboard__header {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.dashboard__title {
  font-size: var(--csplab-font-size-2xl);
  font-weight: 700;
  color: var(--text-title-grey);
  margin: 0;
}

.dashboard__intro {
  color: var(--text-mention-grey);
  margin: 0;
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--csplab-space-4);
}

@media (max-width: 1024px) {
  .dashboard__kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .dashboard__kpis {
    grid-template-columns: minmax(0, 1fr);
  }
}

.dashboard__grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--csplab-space-4);
  align-items: start;
}

@media (max-width: 1024px) {
  .dashboard__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.dashboard__card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-2);
}
</style>
