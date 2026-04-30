<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import OffreStatusBadge from '@/components/offres/OffreStatusBadge.vue'
import PageToolbar from '@/components/layout/PageToolbar.vue'
import { useOffresStore } from '@/stores/offres'
import { seed } from '@/data/seed'
import type { Offre, OffreStatut } from '@/types/domain'

const router = useRouter()
const offresStore = useOffresStore()

const intervieweursById = new Map(seed.intervieweurs.map(i => [i.id, i]))

const STATUTS_OPTIONS: Array<{ value: OffreStatut; label: string }> = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'ouverte', label: 'Ouverte' },
  { value: 'fermee', label: 'Fermée' },
]

const filtreStatuts = ref<OffreStatut[]>([])
const filtreDirections = ref<string[]>([])
const filtreResponsables = ref<string[]>([])

type SortKey = 'titre' | 'statut' | 'candidatures' | 'dateOuverture'
const sortKey = ref<SortKey | null>('dateOuverture')
const sortDesc = ref(true)

const directions = computed(() => {
  const set = new Set(offresStore.offresVisibles.map(o => o.direction))
  return Array.from(set).sort()
})

const responsables = computed(() => {
  const ids = new Set(
    offresStore.offresVisibles
      .map(o => o.responsableId)
      .filter((id): id is string => Boolean(id)),
  )
  return Array.from(ids)
    .map(id => intervieweursById.get(id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i))
})

type Row = {
  offre: Offre
  total: number
  aTraiter: number
  responsableLabel?: string
  responsableAvatar?: string
}

const filtered = computed<Row[]>(() => {
  let list = offresStore.offresVisibles

  if (filtreStatuts.value.length > 0) {
    list = list.filter(o => filtreStatuts.value.includes(o.statut))
  }
  if (filtreDirections.value.length > 0) {
    list = list.filter(o => filtreDirections.value.includes(o.direction))
  }
  if (filtreResponsables.value.length > 0) {
    list = list.filter(o => o.responsableId && filtreResponsables.value.includes(o.responsableId))
  }

  return list.map(o => {
    const counts = offresStore.compterCandidaturesParOffre(o.id)
    const resp = o.responsableId ? intervieweursById.get(o.responsableId) : undefined
    return {
      offre: o,
      total: counts.total,
      aTraiter: counts.aTraiter,
      responsableLabel: resp ? `${resp.prenom} ${resp.nom}` : undefined,
      responsableAvatar: resp?.avatarUrl,
    }
  })
})

const sortedRows = computed<Row[]>(() => {
  const rows = [...filtered.value]
  const k = sortKey.value
  if (!k) return rows
  const dir = sortDesc.value ? -1 : 1
  rows.sort((a, b) => {
    if (k === 'titre') return a.offre.titre.localeCompare(b.offre.titre, 'fr') * dir
    if (k === 'statut') return a.offre.statut.localeCompare(b.offre.statut) * dir
    if (k === 'candidatures') return (a.total - b.total) * dir
    if (k === 'dateOuverture') return (new Date(a.offre.dateOuverture).getTime() - new Date(b.offre.dateOuverture).getTime()) * dir
    return 0
  })
  return rows
})

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value
  } else {
    sortKey.value = key
    sortDesc.value = false
  }
}

function sortIcon(key: SortKey): 'asc' | 'desc' | 'none' {
  if (sortKey.value !== key) return 'none'
  return sortDesc.value ? 'desc' : 'asc'
}

function toggleStatutFilter(s: OffreStatut): void {
  const idx = filtreStatuts.value.indexOf(s)
  if (idx >= 0) filtreStatuts.value.splice(idx, 1)
  else filtreStatuts.value.push(s)
}

function toggleDirectionFilter(d: string): void {
  const idx = filtreDirections.value.indexOf(d)
  if (idx >= 0) filtreDirections.value.splice(idx, 1)
  else filtreDirections.value.push(d)
}

function toggleResponsableFilter(id: string): void {
  const idx = filtreResponsables.value.indexOf(id)
  if (idx >= 0) filtreResponsables.value.splice(idx, 1)
  else filtreResponsables.value.push(id)
}

function resetFilters(): void {
  filtreStatuts.value = []
  filtreDirections.value = []
  filtreResponsables.value = []
}

const hasActiveFilters = computed(() =>
  filtreStatuts.value.length > 0 || filtreDirections.value.length > 0 || filtreResponsables.value.length > 0,
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function goNouvelle(): void {
  void router.push('/offres/nouvelle')
}

function goDetail(id: string): void {
  void router.push(`/offres/${id}`)
}

function goPipeline(id: string): void {
  void router.push(`/pipeline/${id}`)
}

function goEdit(id: string): void {
  void router.push(`/offres/${id}/edition`)
}

function onClose(id: string): void {
  offresStore.changeStatut(id, 'fermee')
}

function onArchive(id: string): void {
  offresStore.archive(id)
}

function onDuplicate(id: string): void {
  const cloned = offresStore.duplicate(id)
  void router.push(`/offres/${cloned.id}/edition`)
}
</script>

<template>
  <div class="offres-page">
    <PageToolbar>
      <template #left>
        <details class="offres-page__filter">
          <summary class="offres-page__filter-trigger">
            <span>Statut</span>
            <Badge
              v-if="filtreStatuts.length > 0"
              variant="secondary"
            >
              {{ filtreStatuts.length }}
            </Badge>
            <RiIcon
              name="ri:arrow-down-s-line"
              :size="14"
            />
          </summary>
          <div class="offres-page__filter-panel">
            <label
              v-for="opt in STATUTS_OPTIONS"
              :key="opt.value"
              class="offres-page__filter-option"
            >
              <input
                type="checkbox"
                :checked="filtreStatuts.includes(opt.value)"
                @change="toggleStatutFilter(opt.value)"
              >
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </details>

        <details class="offres-page__filter">
          <summary class="offres-page__filter-trigger">
            <span>Direction</span>
            <Badge
              v-if="filtreDirections.length > 0"
              variant="secondary"
            >
              {{ filtreDirections.length }}
            </Badge>
            <RiIcon
              name="ri:arrow-down-s-line"
              :size="14"
            />
          </summary>
          <div class="offres-page__filter-panel">
            <label
              v-for="d in directions"
              :key="d"
              class="offres-page__filter-option"
            >
              <input
                type="checkbox"
                :checked="filtreDirections.includes(d)"
                @change="toggleDirectionFilter(d)"
              >
              <span>{{ d }}</span>
            </label>
          </div>
        </details>

        <details class="offres-page__filter">
          <summary class="offres-page__filter-trigger">
            <span>Responsable</span>
            <Badge
              v-if="filtreResponsables.length > 0"
              variant="secondary"
            >
              {{ filtreResponsables.length }}
            </Badge>
            <RiIcon
              name="ri:arrow-down-s-line"
              :size="14"
            />
          </summary>
          <div class="offres-page__filter-panel">
            <label
              v-for="r in responsables"
              :key="r.id"
              class="offres-page__filter-option"
            >
              <input
                type="checkbox"
                :checked="filtreResponsables.includes(r.id)"
                @change="toggleResponsableFilter(r.id)"
              >
              <Avatar class="h-5 w-5">
                <AvatarImage
                  :src="r.avatarUrl ?? ''"
                  :alt="`${r.prenom} ${r.nom}`"
                />
                <AvatarFallback class="text-xs">
                  {{ r.prenom.charAt(0) }}{{ r.nom.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <span>{{ r.prenom }} {{ r.nom }}</span>
            </label>
          </div>
        </details>

        <Button
          v-if="hasActiveFilters"
          type="button"
          variant="tertiary-no-outline"
          size="sm"
          @click="resetFilters"
        >
          Tout effacer
        </Button>
      </template>

      <template #right>
        <Button
          type="button"
          variant="primary"
          @click="goNouvelle"
        >
          <RiIcon
            name="ri:add-line"
            :size="16"
            class="mr-1"
          />
          Nouvelle offre
        </Button>
      </template>
    </PageToolbar>

    <div
      v-if="offresStore.offresVisibles.length === 0"
      class="offres-page__empty"
    >
      <EmptyState
        icon="ri:briefcase-line"
        title="Aucune offre"
        description="Créez une première offre pour commencer"
        size="md"
      >
        <Button
          type="button"
          variant="primary"
          class="mt-3"
          @click="goNouvelle"
        >
          Créer une offre
        </Button>
      </EmptyState>
    </div>

    <div
      v-else
      class="offres-page__table-wrap"
    >
      <table
        class="offres-table"
        aria-label="Liste des offres"
      >
        <thead class="offres-table__head">
          <tr>
            <th class="offres-table__th">
              <button
                type="button"
                class="offres-table__sort"
                @click="toggleSort('titre')"
              >
                <span>Intitulé</span>
                <RiIcon
                  v-if="sortIcon('titre') === 'asc'"
                  name="ri:arrow-up-line"
                  :size="12"
                />
                <RiIcon
                  v-else-if="sortIcon('titre') === 'desc'"
                  name="ri:arrow-down-line"
                  :size="12"
                />
                <RiIcon
                  v-else
                  name="ri:expand-up-down-line"
                  :size="12"
                  class="opacity-30"
                />
              </button>
            </th>
            <th class="offres-table__th">
              Direction
            </th>
            <th class="offres-table__th">
              <button
                type="button"
                class="offres-table__sort"
                @click="toggleSort('statut')"
              >
                <span>Statut</span>
                <RiIcon
                  v-if="sortIcon('statut') === 'asc'"
                  name="ri:arrow-up-line"
                  :size="12"
                />
                <RiIcon
                  v-else-if="sortIcon('statut') === 'desc'"
                  name="ri:arrow-down-line"
                  :size="12"
                />
                <RiIcon
                  v-else
                  name="ri:expand-up-down-line"
                  :size="12"
                  class="opacity-30"
                />
              </button>
            </th>
            <th class="offres-table__th">
              <button
                type="button"
                class="offres-table__sort"
                @click="toggleSort('candidatures')"
              >
                <span>Candidatures</span>
                <RiIcon
                  v-if="sortIcon('candidatures') === 'asc'"
                  name="ri:arrow-up-line"
                  :size="12"
                />
                <RiIcon
                  v-else-if="sortIcon('candidatures') === 'desc'"
                  name="ri:arrow-down-line"
                  :size="12"
                />
                <RiIcon
                  v-else
                  name="ri:expand-up-down-line"
                  :size="12"
                  class="opacity-30"
                />
              </button>
            </th>
            <th class="offres-table__th">
              Type
            </th>
            <th class="offres-table__th">
              <button
                type="button"
                class="offres-table__sort"
                @click="toggleSort('dateOuverture')"
              >
                <span>Ouverte le</span>
                <RiIcon
                  v-if="sortIcon('dateOuverture') === 'asc'"
                  name="ri:arrow-up-line"
                  :size="12"
                />
                <RiIcon
                  v-else-if="sortIcon('dateOuverture') === 'desc'"
                  name="ri:arrow-down-line"
                  :size="12"
                />
                <RiIcon
                  v-else
                  name="ri:expand-up-down-line"
                  :size="12"
                  class="opacity-30"
                />
              </button>
            </th>
            <th class="offres-table__th">
              Responsable
            </th>
            <th class="offres-table__th offres-table__th--actions" />
          </tr>
        </thead>
        <tbody class="offres-table__body">
          <tr v-if="sortedRows.length === 0">
            <td
              colspan="8"
              class="offres-table__empty"
            >
              <EmptyState
                icon="ri:filter-off-line"
                title="Aucune offre ne correspond aux filtres"
                description="Modifiez ou réinitialisez les filtres"
                size="sm"
              />
            </td>
          </tr>
          <tr
            v-for="row in sortedRows"
            :key="row.offre.id"
            class="offres-table__row"
            data-testid="offres-table-row"
            @click="goDetail(row.offre.id)"
          >
            <td class="offres-table__td offres-table__td--titre">
              <button
                type="button"
                class="offres-table__titre-btn"
                @click.stop="goDetail(row.offre.id)"
              >
                {{ row.offre.titre }}
              </button>
              <div class="offres-table__sub">
                {{ row.offre.localisation }}
              </div>
            </td>
            <td class="offres-table__td">
              <Badge variant="secondary">
                {{ row.offre.direction }}
              </Badge>
            </td>
            <td class="offres-table__td">
              <OffreStatusBadge :statut="row.offre.statut" />
            </td>
            <td class="offres-table__td">
              <span>{{ row.total }}</span>
              <span class="offres-table__sub"> / {{ row.aTraiter }} à traiter</span>
            </td>
            <td class="offres-table__td">
              <span class="offres-table__type">{{ row.offre.typeContrat }}</span>
            </td>
            <td class="offres-table__td offres-table__td--date">
              {{ formatDate(row.offre.dateOuverture) }}
            </td>
            <td class="offres-table__td">
              <div
                v-if="row.responsableLabel"
                class="offres-table__resp"
              >
                <Avatar class="h-6 w-6">
                  <AvatarImage
                    :src="row.responsableAvatar ?? ''"
                    :alt="row.responsableLabel"
                  />
                  <AvatarFallback class="text-xs">
                    {{ row.responsableLabel.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <span>{{ row.responsableLabel }}</span>
              </div>
              <span
                v-else
                class="offres-table__sub"
              >—</span>
            </td>
            <td
              class="offres-table__td offres-table__td--actions"
              @click.stop
            >
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button
                    type="button"
                    variant="tertiary-no-outline"
                    size="icon"
                    class="h-7 w-7"
                    :aria-label="`Actions pour ${row.offre.titre}`"
                  >
                    <RiIcon
                      name="ri:more-fill"
                      :size="16"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="goDetail(row.offre.id)">
                    Voir
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="goPipeline(row.offre.id)">
                    Ouvrir le pipeline
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="goEdit(row.offre.id)">
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="row.offre.statut === 'ouverte'"
                    @click="onClose(row.offre.id)"
                  >
                    Fermer
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="onDuplicate(row.offre.id)">
                    Dupliquer
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="onArchive(row.offre.id)">
                    Archiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.offres-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.offres-page__filter {
  position: relative;
}

.offres-page__filter-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  padding: var(--csplab-space-1) var(--csplab-space-2);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  font-size: var(--csplab-font-size-sm);
  background: var(--background-default-grey);
  cursor: pointer;
  list-style: none;
}

.offres-page__filter-trigger::-webkit-details-marker {
  display: none;
}

.offres-page__filter-panel {
  position: absolute;
  z-index: 10;
  margin-top: var(--csplab-space-1);
  padding: var(--csplab-space-2);
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  box-shadow: 0 4px 12px var(--csplab-shadow-color, rgba(0, 0, 0, 0.08));
  min-width: 200px;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.offres-page__filter-option {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
  padding: var(--csplab-space-1);
  border-radius: var(--csplab-radius-sm);
}

.offres-page__filter-option:hover {
  background: var(--background-alt-grey);
}

.offres-page__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.offres-page__table-wrap {
  flex: 1;
  overflow: auto;
  padding: var(--csplab-space-4);
}

.offres-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--csplab-font-size-sm);
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  overflow: hidden;
}

.offres-table__head {
  background: var(--background-alt-grey);
  border-bottom: 1px solid var(--border-default-grey);
}

.offres-table__th {
  padding: var(--csplab-space-2) var(--csplab-space-3);
  text-align: left;
  font-weight: 600;
  color: var(--text-mention-grey);
  white-space: nowrap;
}

.offres-table__th--actions {
  width: 40px;
  text-align: right;
  padding-right: var(--csplab-space-3);
}

.offres-table__sort {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: inherit;
  color: inherit;
  padding: 0;
}

.offres-table__sort:hover {
  color: var(--text-action-high-blue-france);
}

.offres-table__row {
  border-bottom: 1px solid var(--border-default-grey);
  transition: background 100ms ease;
  cursor: pointer;
}

.offres-table__row:last-child {
  border-bottom: none;
}

.offres-table__row:hover {
  background: var(--background-alt-grey);
}

.offres-table__td {
  padding: var(--csplab-space-3);
  vertical-align: middle;
}

.offres-table__td--titre {
  min-width: 240px;
}

.offres-table__td--date {
  white-space: nowrap;
  color: var(--text-mention-grey);
}

.offres-table__td--actions {
  width: 40px;
  text-align: right;
}

.offres-table__titre-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-action-high-blue-france);
  padding: 0;
  text-align: left;
}

.offres-table__titre-btn:hover {
  text-decoration: underline;
}

.offres-table__sub {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.offres-table__type {
  text-transform: capitalize;
}

.offres-table__resp {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-2);
  white-space: nowrap;
}

.offres-table__empty {
  padding: var(--csplab-space-4);
}
</style>
