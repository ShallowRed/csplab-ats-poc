<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Tag } from '@/components/ui/tag'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DsfrPagination from '@/components/ui/pagination/DsfrPagination.vue'
import PageToolbar from '@/components/layout/PageToolbar.vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { useEntretiensStore } from '@/stores/entretiens'
import { useOffresStore } from '@/stores/offres'
import { seed } from '@/data/seed'
import type { Entretien } from '@/types/domain'

type StatutFilter = 'tous' | 'planifie' | 'realise' | 'annule'

const PAGE_SIZE = 10

const router = useRouter()
const entretiensStore = useEntretiensStore()
const offresStore = useOffresStore()

const candidatById = new Map(seed.candidats.map(c => [c.id, c]))
const candidatureById = new Map(seed.candidatures.map(c => [c.id, c]))
const intervieweurById = new Map(seed.intervieweurs.map(i => [i.id, i]))

const filtreStatut = ref<StatutFilter>('tous')
const ALL_OFFRES = '__all__'
const filtreOffreId = ref<string>(ALL_OFFRES)
const currentPage = ref(1)

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

const allRows = computed<Row[]>(() => {
  let list: Entretien[] = entretiensStore.entretiens

  if (filtreStatut.value !== 'tous') {
    list = list.filter(e => e.statut === filtreStatut.value)
  }
  if (filtreOffreId.value && filtreOffreId.value !== ALL_OFFRES) {
    list = list.filter(e => {
      const cand = candidatureById.get(e.candidatureId)
      return cand?.offreId === filtreOffreId.value
    })
  }

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

const rows = computed<Row[]>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allRows.value.slice(start, start + PAGE_SIZE)
})

const aVenirCount = computed(() => entretiensStore.aVenir.length)

function onFilterChange(): void {
  currentPage.value = 1
}

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
  <div class="entretiens-page">
    <PageToolbar>
      <template #left>
        <Select
          :model-value="filtreStatut"
          @update:model-value="(v) => { filtreStatut = (v as StatutFilter); onFilterChange() }"
        >
          <SelectTrigger
            class="entretiens-page__select-trigger"
            aria-label="Filtrer par statut"
          >
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">
              Tous les statuts
            </SelectItem>
            <SelectItem value="planifie">
              À venir
            </SelectItem>
            <SelectItem value="realise">
              Réalisés
            </SelectItem>
            <SelectItem value="annule">
              Annulés
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          :model-value="filtreOffreId"
          @update:model-value="(v) => { filtreOffreId = v ?? ALL_OFFRES; onFilterChange() }"
        >
          <SelectTrigger
            class="entretiens-page__select-trigger entretiens-page__select-trigger--wide"
            aria-label="Filtrer par offre"
          >
            <SelectValue placeholder="Toutes les offres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="ALL_OFFRES">
              Toutes les offres
            </SelectItem>
            <SelectItem
              v-for="o in offresOptions"
              :key="o.id"
              :value="o.id"
            >
              {{ o.titre }}
            </SelectItem>
          </SelectContent>
        </Select>
      </template>

      <template #right>
        <span class="entretiens-page__count">
          {{ allRows.length }} résultat{{ allRows.length !== 1 ? 's' : '' }}
        </span>
      </template>
    </PageToolbar>

    <div class="entretiens-page__body">
      <div class="entretiens-page__container page-wide">
        <header class="entretiens-page__header">
          <p class="entretiens-page__subtitle">
            <RiIcon
              name="ri:calendar-check-line"
              :size="14"
              aria-hidden="true"
            />
            {{ aVenirCount }} entretien{{ aVenirCount !== 1 ? 's' : '' }} à venir
          </p>
        </header>

        <div
          v-if="allRows.length === 0"
          class="entretiens-page__empty"
        >
          <EmptyState
            icon="ri:calendar-line"
            title="Aucun entretien"
            description="Aucun entretien ne correspond à vos filtres."
          />
        </div>

        <template v-else>
          <div class="entretiens-page__table-wrapper">
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
                    <Tag size="sm">
                      {{ TYPE_LABEL[row.entretien.type] }}
                    </Tag>
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
                      :variant="row.entretien.statut === 'realise' && !row.aEvaluation ? 'primary' : 'tertiary'"
                      size="sm"
                      @click="onAction(row)"
                    >
                      {{ actionLabel(row) }}
                      <RiIcon
                        name="ri:arrow-right-line"
                        :size="14"
                      />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              v-if="allRows.length > PAGE_SIZE"
              class="entretiens-page__table-footer"
            >
              <span
                class="entretiens-page__pagination-info"
                aria-live="polite"
              >
                Page {{ currentPage }} / {{ Math.ceil(allRows.length / PAGE_SIZE) }}
              </span>
              <DsfrPagination
                :page="currentPage"
                :page-size="PAGE_SIZE"
                :total="allRows.length"
                @update:page="currentPage = $event"
              />
            </div>
          </div>
        </template>
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

.entretiens-page__subtitle {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
}

.entretiens-page__select-trigger {
  width: 160px;
}

.entretiens-page__select-trigger--wide {
  width: 220px;
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

.entretiens-page__table tbody tr:hover td {
  background: var(--background-alt-grey);
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
  flex-shrink: 0;
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
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entretiens-page__th-action,
.entretiens-page__td-action {
  text-align: right;
}

.entretiens-page__empty {
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
}

.entretiens-page__table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--csplab-space-1) var(--csplab-space-3);
  border-top: 1px solid var(--border-default-grey);
  background: var(--background-alt-grey);
}

.entretiens-page__pagination-info {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}
</style>
