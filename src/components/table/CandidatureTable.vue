<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useVueTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/vue-table'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { useSelectionStore } from '@/stores/selection'
import { useDrawerStore } from '@/stores/drawer'
import { useDensityStore } from '@/stores/density'
import { useFiltersStore } from '@/stores/filters'
import { seed } from '@/data/seed'
import type { Candidat, Candidature, Etape, Intervieweur } from '@/types/domain'

type Row = {
  candidature: Candidature
  candidat: Candidat
  etape: Etape | undefined
  assigneLabel: string | undefined
  assigneAvatar: string | undefined
  ageJours: number
}

const props = defineProps<{
  candidatures: Candidature[]
}>()

const selection = useSelectionStore()
const drawer = useDrawerStore()
const density = useDensityStore()
const filters = useFiltersStore()

const candidatsById = new Map(seed.candidats.map(c => [c.id, c]))
const etapesById = new Map(seed.etapes.map(e => [e.id, e]))
const intervieweursById = new Map<string, Intervieweur>(seed.intervieweurs.map(i => [i.id, i]))

function ageJours(candidature: Candidature): number {
  return Math.floor((Date.now() - new Date(candidature.derniereActivite).getTime()) / 86_400_000)
}

const rows = computed<Row[]>(() =>
  props.candidatures.map(c => {
    const candidat = candidatsById.get(c.candidatId)!
    const etape = etapesById.get(c.etapeId)
    const assigneInt = c.assigneA ? intervieweursById.get(c.assigneA) : undefined
    return {
      candidature: c,
      candidat,
      etape,
      assigneLabel: assigneInt ? `${assigneInt.prenom} ${assigneInt.nom}` : undefined,
      assigneAvatar: assigneInt?.avatarUrl,
      ageJours: ageJours(c),
    }
  }),
)

const filteredRows = computed<Row[]>(() => {
  const f = filters.filtre
  return rows.value.filter(r => {
    if (f.etapeIds.length > 0 && !f.etapeIds.includes(r.candidature.etapeId)) return false
    if (f.scoreMin !== null && (r.candidature.score ?? 0) < f.scoreMin) return false
    if (f.intervieweurIds.length > 0) {
      if (!r.candidature.assigneA || !f.intervieweurIds.includes(r.candidature.assigneA)) return false
    }
    if (f.recherche) {
      const q = f.recherche.toLowerCase()
      const name = `${r.candidat.prenom} ${r.candidat.nom}`.toLowerCase()
      if (!name.includes(q)) return false
    }
    return true
  })
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const helper = createColumnHelper<Row>()

const columns = [
  helper.display({
    id: 'select',
    header: ({ table }) => ({
      checked: table.getIsAllPageRowsSelected(),
      indeterminate: table.getIsSomePageRowsSelected(),
    }),
    cell: ({ row }) => row.original.candidature.id,
    enableSorting: false,
  }),
  helper.accessor(r => `${r.candidat.prenom} ${r.candidat.nom}`, {
    id: 'nom',
    header: 'Candidat',
    enableSorting: true,
  }),
  helper.accessor(r => r.etape?.libelle ?? '', {
    id: 'etape',
    header: 'Étape',
    enableSorting: true,
  }),
  helper.accessor(r => r.candidature.dateCandidat, {
    id: 'date',
    header: 'Candidaté le',
    enableSorting: true,
  }),
  helper.accessor(r => r.candidature.score ?? -1, {
    id: 'score',
    header: 'Score',
    enableSorting: true,
  }),
  helper.accessor(r => r.assigneLabel ?? '', {
    id: 'assigne',
    header: 'Assigné à',
    enableSorting: true,
  }),
  helper.display({
    id: 'tags',
    header: 'Tags',
    enableSorting: false,
  }),
  helper.display({
    id: 'actions',
    header: '',
    enableSorting: false,
  }),
]

const table = useVueTable({
  get data() { return filteredRows.value },
  columns,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
  onSortingChange: updater => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  manualPagination: true,
})

const tableRows = computed(() => table.getRowModel().rows)
const allVisibleIds = computed(() => filteredRows.value.map(r => r.candidature.id))
const allSelected = computed(() => selection.isAllVisibleSelected(allVisibleIds.value))
const someSelected = computed(() => selection.count > 0 && !allSelected.value)

function toggleAll(): void {
  if (allSelected.value) {
    selection.clear()
  } else {
    selection.selectAllVisible(allVisibleIds.value)
  }
}

const lastClickedId = ref<string | null>(null)

function onRowClick(event: MouseEvent, id: string): void {
  if (event.shiftKey && lastClickedId.value) {
    selection.selectRange(lastClickedId.value, id, allVisibleIds.value)
  } else {
    selection.toggle(id)
    lastClickedId.value = id
  }
}

function openDrawer(id: string): void {
  drawer.ouvrir(id)
}

const rowHeight = computed(() => {
  if (density.densite === 'compact') return 40
  if (density.densite === 'comfortable') return 72
  return 56
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function sortIcon(colId: string): 'asc' | 'desc' | 'none' {
  const s = sorting.value.find(s => s.id === colId)
  if (!s) return 'none'
  return s.desc ? 'desc' : 'asc'
}

function toggleSort(colId: string): void {
  const current = sortIcon(colId)
  if (current === 'none') {
    sorting.value = [{ id: colId, desc: false }]
  } else if (current === 'asc') {
    sorting.value = [{ id: colId, desc: true }]
  } else {
    sorting.value = []
  }
}

watch(filteredRows, () => {
  if (selection.selectAllMatching) selection.clear()
})

defineExpose({ filteredCount: computed(() => filteredRows.value.length) })
</script>

<template>
  <div class="cand-table-wrapper">
    <table
      class="cand-table"
      :data-density="density.densite"
      aria-label="Liste des candidatures"
    >
      <thead class="cand-table__head">
        <tr>
          <th class="cand-table__th cand-table__th--check">
            <Checkbox
              :checked="allSelected"
              :indeterminate="someSelected"
              aria-label="Tout sélectionner"
              @update:checked="toggleAll"
            />
          </th>
          <th
            v-for="col in ['nom','etape','date','score','assigne','tags','actions']"
            :key="col"
            class="cand-table__th"
            :class="col === 'actions' ? 'cand-table__th--actions' : ''"
            :aria-sort="col !== 'tags' && col !== 'actions' ? (sortIcon(col) === 'none' ? 'none' : sortIcon(col) === 'asc' ? 'ascending' : 'descending') : undefined"
          >
            <template v-if="col === 'actions'" />
            <template v-else-if="col === 'tags'">
              Tags
            </template>
            <button
              v-else
              type="button"
              class="cand-table__sort-btn"
              @click="toggleSort(col)"
            >
              <span>{{ { nom: 'Candidat', etape: 'Étape', date: 'Candidaté le', score: 'Score', assigne: 'Assigné à' }[col] }}</span>
              <RiIcon
                v-if="sortIcon(col) === 'asc'"
                name="ri:arrow-up-line"
                :size="12"
              />
              <RiIcon
                v-else-if="sortIcon(col) === 'desc'"
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
        </tr>
      </thead>

      <tbody class="cand-table__body">
        <tr
          v-if="tableRows.length === 0"
        >
          <td
            colspan="8"
            class="cand-table__empty"
          >
            <EmptyState
              icon="ri:filter-off-line"
              title="Aucune candidature ne correspond aux filtres"
              description="Modifiez ou réinitialisez les filtres pour afficher des candidatures"
              size="md"
            />
          </td>
        </tr>

        <tr
          v-for="row in tableRows"
          :key="row.original.candidature.id"
          class="cand-table__row"
          :class="selection.isSelected(row.original.candidature.id) && 'cand-table__row--selected'"
          :style="{ height: `${rowHeight}px` }"
          @click.exact="onRowClick($event, row.original.candidature.id)"
          @click.shift.prevent="onRowClick($event, row.original.candidature.id)"
        >
          <td
            class="cand-table__td cand-table__td--check"
            @click.stop
          >
            <Checkbox
              :checked="selection.isSelected(row.original.candidature.id)"
              :aria-label="`Sélectionner ${row.original.candidat.prenom} ${row.original.candidat.nom}`"
              @update:checked="selection.toggle(row.original.candidature.id)"
            />
          </td>

          <td class="cand-table__td cand-table__td--name">
            <div class="cand-table__name-cell">
              <Avatar class="h-7 w-7 flex-shrink-0">
                <AvatarImage
                  :src="row.original.candidat.photoUrl ?? ''"
                  :alt="`${row.original.candidat.prenom} ${row.original.candidat.nom}`"
                />
                <AvatarFallback class="text-xs">
                  {{ row.original.candidat.prenom.charAt(0) }}{{ row.original.candidat.nom.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                class="cand-table__name-btn"
                @click.stop="openDrawer(row.original.candidature.id)"
              >
                {{ row.original.candidat.prenom }} {{ row.original.candidat.nom }}
              </button>
            </div>
          </td>

          <td class="cand-table__td">
            <Badge
              v-if="row.original.etape"
              variant="secondary"
            >
              {{ row.original.etape.libelle }}
            </Badge>
          </td>

          <td class="cand-table__td cand-table__td--date">
            {{ formatDate(row.original.candidature.dateCandidat) }}
          </td>

          <td class="cand-table__td">
            <span v-if="row.original.candidature.score !== undefined">
              ★ {{ row.original.candidature.score }}/4
            </span>
            <span
              v-else
              class="cand-table__muted"
            >—</span>
          </td>

          <td class="cand-table__td">
            <div
              v-if="row.original.assigneLabel"
              class="cand-table__assignee"
            >
              <Avatar class="h-5 w-5">
                <AvatarImage
                  :src="row.original.assigneAvatar ?? ''"
                  :alt="row.original.assigneLabel"
                />
                <AvatarFallback class="text-xs">
                  {{ row.original.assigneLabel.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <span class="cand-table__assignee-label">{{ row.original.assigneLabel }}</span>
            </div>
            <span
              v-else
              class="cand-table__muted"
            >—</span>
          </td>

          <td class="cand-table__td">
            <div class="cand-table__tags">
              <Badge
                v-for="tag in row.original.candidature.tags.slice(0, 2)"
                :key="tag"
                variant="secondary"
                class="cand-table__tag"
              >
                {{ tag }}
              </Badge>
              <Badge
                v-if="row.original.candidature.tags.length > 2"
                variant="secondary"
                class="cand-table__tag"
              >
                +{{ row.original.candidature.tags.length - 2 }}
              </Badge>
            </div>
          </td>

          <td
            class="cand-table__td cand-table__td--actions"
            @click.stop
          >
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  type="button"
                  variant="tertiary-no-outline"
                  size="icon"
                  class="h-7 w-7"
                  :aria-label="`Actions pour ${row.original.candidat.prenom} ${row.original.candidat.nom}`"
                >
                  <RiIcon
                    name="ri:more-fill"
                    :size="16"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="openDrawer(row.original.candidature.id)">
                  Voir la fiche
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Planifier un entretien
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cand-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
}

.cand-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--csplab-font-size-sm);
}

.cand-table__head {
  background: var(--background-alt-grey);
  border-bottom: 1px solid var(--border-default-grey);
}

.cand-table__th {
  padding: var(--csplab-space-2) var(--csplab-space-3);
  text-align: left;
  font-weight: 600;
  color: var(--text-mention-grey);
  white-space: nowrap;
}

.cand-table__th--check,
.cand-table__td--check {
  width: 40px;
  padding-left: var(--csplab-space-3);
}

.cand-table__th--actions,
.cand-table__td--actions {
  width: 40px;
  text-align: right;
  padding-right: var(--csplab-space-3);
}

.cand-table__sort-btn {
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

.cand-table__sort-btn:hover {
  color: var(--text-action-high-blue-france);
}

.cand-table__body .cand-table__row {
  border-bottom: 1px solid var(--border-default-grey);
  transition: background 100ms ease;
}

.cand-table__body .cand-table__row:last-child {
  border-bottom: none;
}

.cand-table__body .cand-table__row:hover {
  background: var(--background-alt-grey);
}

.cand-table__row--selected {
  background: var(--background-contrast-blue-france) !important;
}

.cand-table__td {
  padding: var(--csplab-space-2) var(--csplab-space-3);
  vertical-align: middle;
}

.cand-table__td--name {
  min-width: 200px;
}

.cand-table__td--date {
  white-space: nowrap;
  color: var(--text-mention-grey);
}

.cand-table__name-cell {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.cand-table__name-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-action-high-blue-france);
  padding: 0;
  text-align: left;
}

.cand-table__name-btn:hover {
  text-decoration: underline;
}

.cand-table__assignee {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.cand-table__assignee-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.cand-table__tags {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--csplab-space-1);
}

.cand-table__tag {
  white-space: nowrap;
}

.cand-table__muted {
  color: var(--text-mention-grey);
}

.cand-table__empty {
  padding: 0;
}

/* Density variants */
.cand-table[data-density='compact'] .cand-table__td,
.cand-table[data-density='compact'] .cand-table__th {
  padding-top: var(--csplab-space-1);
  padding-bottom: var(--csplab-space-1);
}

.cand-table[data-density='comfortable'] .cand-table__td,
.cand-table[data-density='comfortable'] .cand-table__th {
  padding-top: var(--csplab-space-4);
  padding-bottom: var(--csplab-space-4);
}

@media (prefers-reduced-motion: reduce) {
  .cand-table__body .cand-table__row {
    transition: none;
  }
}
</style>
