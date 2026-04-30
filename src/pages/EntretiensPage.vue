<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import PageToolbar from '@/components/layout/PageToolbar.vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { useEntretiensStore } from '@/stores/entretiens'
import { useOffresStore } from '@/stores/offres'
import { seed } from '@/data/seed'
import type { Entretien } from '@/types/domain'

type StatutFilter = 'tous' | 'planifie' | 'realise' | 'annule'

const router = useRouter()
const entretiensStore = useEntretiensStore()
const offresStore = useOffresStore()

const candidatById = new Map(seed.candidats.map(c => [c.id, c]))
const candidatureById = new Map(seed.candidatures.map(c => [c.id, c]))
const intervieweurById = new Map(seed.intervieweurs.map(i => [i.id, i]))

const filtreStatut = ref<StatutFilter>('tous')
const filtreOffreId = ref<string>('')

const TYPE_LABEL: Record<Entretien['type'], string> = {
  rh: 'RH',
  technique: 'Technique',
  manager: 'Manager',
  jury: 'Jury',
}

const STATUT_LABEL: Record<Entretien['statut'], string> = {
  planifie: 'À venir',
  realise: 'Réalisé',
  annule: 'Annulé',
}

const STATUT_VARIANT: Record<Entretien['statut'], 'status-interview' | 'status-offer' | 'status-rejected'> = {
  planifie: 'status-interview',
  realise: 'status-offer',
  annule: 'status-rejected',
}

const offresOptions = computed(() =>
  offresStore.offresVisibles.map(o => ({ id: o.id, titre: o.titre })),
)

type Row = {
  entretien: Entretien
  candidatNom: string
  candidatAvatar?: string
  candidatInitiales: string
  offreTitre: string
  intervieweurs: { id: string; initiales: string; nom: string; avatar?: string }[]
  aEvaluation: boolean
}

function rowFor(entretien: Entretien): Row | null {
  const candidature = candidatureById.get(entretien.candidatureId)
  if (!candidature) return null
  const candidat = candidatById.get(candidature.candidatId)
  if (!candidat) return null
  const offre = offresStore.getById(candidature.offreId)
  return {
    entretien,
    candidatNom: `${candidat.prenom} ${candidat.nom}`,
    candidatAvatar: candidat.photoUrl,
    candidatInitiales: `${candidat.prenom.charAt(0)}${candidat.nom.charAt(0)}`.toUpperCase(),
    offreTitre: offre?.titre ?? '—',
    intervieweurs: entretien.intervieweurIds
      .map(id => intervieweurById.get(id))
      .filter((i): i is NonNullable<typeof i> => Boolean(i))
      .map(i => ({
        id: i.id,
        nom: `${i.prenom} ${i.nom}`,
        initiales: `${i.prenom.charAt(0)}${i.nom.charAt(0)}`.toUpperCase(),
        avatar: i.avatarUrl,
      })),
    aEvaluation: entretiensStore.aEvaluation(entretien.id),
  }
}

const rows = computed<Row[]>(() => {
  let list: Entretien[] = entretiensStore.entretiens

  if (filtreStatut.value !== 'tous') {
    list = list.filter(e => e.statut === filtreStatut.value)
  }
  if (filtreOffreId.value) {
    list = list.filter(e => {
      const cand = candidatureById.get(e.candidatureId)
      return cand?.offreId === filtreOffreId.value
    })
  }

  // Tri : asc si on regarde "à venir", desc sinon
  const ascending = filtreStatut.value === 'planifie'
  const sorted = [...list].sort((a, b) => {
    const ta = new Date(a.date).getTime()
    const tb = new Date(b.date).getTime()
    return ascending ? ta - tb : tb - ta
  })

  return sorted
    .map(rowFor)
    .filter((r): r is Row => r !== null)
})

const aVenirCount = computed(() => entretiensStore.aVenir.length)

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatHeure(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function actionLabel(row: Row): string {
  if (row.entretien.statut === 'realise' && !row.aEvaluation) return 'Évaluer'
  return 'Voir'
}

function onAction(row: Row): void {
  if (row.entretien.statut === 'realise' && !row.aEvaluation) {
    void router.push(`/entretiens/${row.entretien.id}/evaluation`)
    return
  }
  void router.push(`/candidatures/${row.entretien.candidatureId}`)
}
</script>

<template>
  <div class="entretiens-page csplab-page-surface">
    <PageToolbar>
      <template #left>
        <label class="entretiens-page__filter-group">
          <span class="entretiens-page__filter-label">Statut</span>
          <select
            v-model="filtreStatut"
            class="entretiens-page__select"
            data-testid="entretiens-filter-statut"
          >
            <option value="tous">
              Tous
            </option>
            <option value="planifie">
              À venir
            </option>
            <option value="realise">
              Réalisés
            </option>
            <option value="annule">
              Annulés
            </option>
          </select>
        </label>

        <label class="entretiens-page__filter-group">
          <span class="entretiens-page__filter-label">Offre</span>
          <select
            v-model="filtreOffreId"
            class="entretiens-page__select"
            data-testid="entretiens-filter-offre"
          >
            <option value="">
              Toutes
            </option>
            <option
              v-for="o in offresOptions"
              :key="o.id"
              :value="o.id"
            >
              {{ o.titre }}
            </option>
          </select>
        </label>
      </template>

      <template #right>
        <span class="entretiens-page__count">
          {{ rows.length }} résultat{{ rows.length !== 1 ? 's' : '' }}
        </span>
      </template>
    </PageToolbar>

    <div class="entretiens-page__body">
      <div class="entretiens-page__container csplab-page-content">
        <header class="entretiens-page__header">
          <h1 class="entretiens-page__title">
            Mes entretiens
          </h1>
          <p class="entretiens-page__subtitle">
            {{ aVenirCount }} entretien{{ aVenirCount !== 1 ? 's' : '' }} à venir
          </p>
        </header>

        <div
          v-if="rows.length === 0"
          class="entretiens-page__empty"
        >
          <EmptyState
            icon="ri:calendar-line"
            title="Aucun entretien"
            description="Aucun entretien ne correspond à vos filtres."
          />
        </div>

        <div
          v-else
          class="entretiens-page__table-wrapper"
        >
          <table class="entretiens-page__table">
            <thead>
              <tr>
                <th scope="col">
                  Date / heure
                </th>
                <th scope="col">
                  Candidat
                </th>
                <th scope="col">
                  Offre
                </th>
                <th scope="col">
                  Type
                </th>
                <th scope="col">
                  Intervieweurs
                </th>
                <th scope="col">
                  Statut
                </th>
                <th
                  scope="col"
                  class="entretiens-page__th-action"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.entretien.id"
                data-testid="entretien-row"
              >
                <td>
                  <div class="entretiens-page__date">
                    <span class="entretiens-page__date-day">{{ formatDate(row.entretien.date) }}</span>
                    <span class="entretiens-page__date-time">{{ formatHeure(row.entretien.date) }}</span>
                  </div>
                </td>
                <td>
                  <div class="entretiens-page__candidat">
                    <Avatar class="entretiens-page__avatar">
                      <AvatarImage
                        v-if="row.candidatAvatar"
                        :src="row.candidatAvatar"
                        :alt="row.candidatNom"
                      />
                      <AvatarFallback>{{ row.candidatInitiales }}</AvatarFallback>
                    </Avatar>
                    <span>{{ row.candidatNom }}</span>
                  </div>
                </td>
                <td class="entretiens-page__offre">
                  {{ row.offreTitre }}
                </td>
                <td>
                  {{ TYPE_LABEL[row.entretien.type] }}
                </td>
                <td>
                  <div class="entretiens-page__intervieweurs">
                    <Avatar
                      v-for="i in row.intervieweurs"
                      :key="i.id"
                      class="entretiens-page__avatar entretiens-page__avatar--sm"
                      :title="i.nom"
                    >
                      <AvatarImage
                        v-if="i.avatar"
                        :src="i.avatar"
                        :alt="i.nom"
                      />
                      <AvatarFallback>{{ i.initiales }}</AvatarFallback>
                    </Avatar>
                  </div>
                </td>
                <td>
                  <Badge :variant="STATUT_VARIANT[row.entretien.statut]">
                    {{ STATUT_LABEL[row.entretien.statut] }}
                  </Badge>
                </td>
                <td class="entretiens-page__td-action">
                  <Button
                    type="button"
                    variant="tertiary"
                    size="sm"
                    @click="onAction(row)"
                  >
                    {{ actionLabel(row) }}
                    <RiIcon
                      name="ri:arrow-right-line"
                      :size="14"
                      class="entretiens-page__action-icon"
                    />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entretiens-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.entretiens-page__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.entretiens-page__container {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.entretiens-page__header {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.entretiens-page__title {
  margin: 0;
  font-size: var(--csplab-font-size-2xl);
  font-weight: 700;
  color: var(--text-title-grey);
}

.entretiens-page__subtitle {
  margin: 0;
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
}

.entretiens-page__filter-group {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.entretiens-page__filter-label {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.entretiens-page__select {
  height: 32px;
  padding: 0 var(--csplab-space-2);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-sm);
  background: var(--background-default-grey);
  color: var(--text-default-grey);
  font-size: var(--csplab-font-size-sm);
}

.entretiens-page__select:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 1px;
}

.entretiens-page__count {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  white-space: nowrap;
}

.entretiens-page__table-wrapper {
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  overflow: hidden;
}

.entretiens-page__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--csplab-font-size-sm);
}

.entretiens-page__table th,
.entretiens-page__table td {
  padding: var(--csplab-space-2) var(--csplab-space-3);
  text-align: left;
  border-bottom: 1px solid var(--border-default-grey);
}

.entretiens-page__table thead th {
  font-weight: 600;
  color: var(--text-mention-grey);
  text-transform: uppercase;
  font-size: var(--csplab-font-size-xs);
  letter-spacing: 0.02em;
  background: var(--background-alt-grey);
}

.entretiens-page__table tbody tr:last-child td {
  border-bottom: 0;
}

.entretiens-page__date {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.entretiens-page__date-day {
  font-weight: 500;
  color: var(--text-default-grey);
}

.entretiens-page__date-time {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-xs);
}

.entretiens-page__candidat {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.entretiens-page__avatar {
  width: 28px;
  height: 28px;
}

.entretiens-page__avatar--sm {
  width: 24px;
  height: 24px;
}

.entretiens-page__intervieweurs {
  display: flex;
  align-items: center;
}

.entretiens-page__intervieweurs > * + * {
  margin-left: -6px;
  border: 2px solid var(--background-default-grey);
}

.entretiens-page__offre {
  color: var(--text-default-grey);
}

.entretiens-page__th-action,
.entretiens-page__td-action {
  text-align: right;
}

.entretiens-page__action-icon {
  margin-left: var(--csplab-space-1);
}

.entretiens-page__empty {
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
}
</style>
