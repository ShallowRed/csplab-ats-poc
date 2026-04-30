<script setup lang="ts">
import { computed, ref } from 'vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import { seed } from '@/data/seed'
import type { Intervieweur } from '@/types/domain'

const props = defineProps<{
  intervieweurIds: string[]
  modelValue: { date: string; heure: string; duree: number } | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { date: string; heure: string; duree: number }): void
}>()

const selectedSlot = ref(props.modelValue)
const dureeOptions = [30, 45, 60, 90, 120]
const selectedDuree = ref(props.modelValue?.duree ?? 60)

const intervieweursById = new Map<string, Intervieweur>(seed.intervieweurs.map(i => [i.id, i]))

const selectedIntervieweurs = computed(() =>
  props.intervieweurIds.map(id => intervieweursById.get(id)).filter(Boolean) as Intervieweur[],
)

// --- Week navigation ---
const today = new Date()
today.setHours(0, 0, 0, 0)

const weekOffset = ref(0)

const weekStart = computed(() => {
  const d = new Date(today)
  d.setDate(d.getDate() + weekOffset.value * 7)
  // Go to Monday
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
})

const weekDays = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    return d
  })
})

const weekLabel = computed(() => {
  const start = weekDays.value[0]
  const end = weekDays.value[4]
  const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${fmt(start)} — ${fmt(end)}`
})

// --- Busy slots (pseudo-random per interviewer/day) ---
function dateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

const busyByDate = computed(() => {
  const map = new Map<string, Set<number>>()
  weekDays.value.forEach((day, dayIdx) => {
    const key = dateStr(day)
    const busy = new Set<number>()
    props.intervieweurIds.forEach((intId, i) => {
      const h = [9, 10, 14, 15, 16][(dayIdx * 7 + i * 3) % 5]
      busy.add(h)
    })
    map.set(key, busy)
  })
  return map
})

// --- Slots grid: 8h–18h ---
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

function isBusy(date: Date, hour: number): boolean {
  return busyByDate.value.get(dateStr(date))?.has(hour) ?? false
}

function isPast(date: Date, hour: number): boolean {
  const slot = new Date(date)
  slot.setHours(hour, 0, 0, 0)
  return slot <= new Date()
}

function isSelected(date: Date, hour: number): boolean {
  return selectedSlot.value?.date === dateStr(date) &&
    selectedSlot.value?.heure === `${String(hour).padStart(2, '0')}:00`
}

function selectSlot(date: Date, hour: number): void {
  if (isBusy(date, hour) || isPast(date, hour)) return
  const heure = `${String(hour).padStart(2, '0')}:00`
  selectedSlot.value = { date: dateStr(date), heure, duree: selectedDuree.value }
  emit('update:modelValue', selectedSlot.value)
}

function onDureeChange(duree: number): void {
  selectedDuree.value = duree
  if (selectedSlot.value) {
    selectedSlot.value = { ...selectedSlot.value, duree }
    emit('update:modelValue', selectedSlot.value)
  }
}

function dayLabel(d: Date): string {
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
}

function formatSlotLabel(date: string, heure: string): string {
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' à ' + heure
}
</script>

<template>
  <div class="schedule-step">
    <!-- Durée -->
    <div class="schedule-step__section">
      <div class="schedule-step__section-label">
        Durée de l'entretien
      </div>
      <div
        class="schedule-step__duree-options"
        role="radiogroup"
        aria-label="Durée"
      >
        <Button
          v-for="d in dureeOptions"
          :key="d"
          type="button"
          :variant="selectedDuree === d ? 'primary' : 'tertiary'"
          size="sm"
          :aria-pressed="selectedDuree === d"
          @click="onDureeChange(d)"
        >
          {{ d < 60 ? `${d} min` : `${d / 60}h${d % 60 ? d % 60 : ''}` }}
        </Button>
      </div>
    </div>

    <!-- Intervieweurs sélectionnés -->
    <div
      v-if="selectedIntervieweurs.length > 0"
      class="schedule-step__section"
    >
      <div class="schedule-step__section-label">
        Disponibilités consultées
      </div>
      <div class="schedule-step__int-pills">
        <span
          v-for="int in selectedIntervieweurs"
          :key="int.id"
          class="schedule-step__int-pill"
        >
          {{ int.prenom }} {{ int.nom }}
        </span>
      </div>
    </div>

    <!-- Grille semaine -->
    <div class="schedule-step__section">
      <div class="schedule-step__week-nav">
        <Button
          type="button"
          variant="tertiary"
          size="icon"
          class="h-7 w-7"
          :disabled="weekOffset === 0"
          aria-label="Semaine précédente"
          @click="weekOffset--"
        >
          <RiIcon name="ri:arrow-left-s-line" :size="16" />
        </Button>
        <span class="schedule-step__week-label">{{ weekLabel }}</span>
        <Button
          type="button"
          variant="tertiary"
          size="icon"
          class="h-7 w-7"
          aria-label="Semaine suivante"
          @click="weekOffset++"
        >
          <RiIcon name="ri:arrow-right-s-line" :size="16" />
        </Button>
      </div>

      <div
        class="schedule-step__grid"
        role="grid"
        :aria-label="`Grille de créneaux — semaine du ${weekLabel}`"
      >
        <!-- En-tête jours -->
        <div
          class="schedule-step__grid-corner"
          role="presentation"
        />
        <div
          v-for="day in weekDays"
          :key="dateStr(day)"
          class="schedule-step__grid-day-header"
          role="columnheader"
        >
          {{ dayLabel(day) }}
        </div>

        <!-- Lignes heures -->
        <template
          v-for="hour in hours"
          :key="hour"
        >
          <div
            class="schedule-step__grid-hour"
            role="rowheader"
            :aria-label="`${hour}h`"
          >
            {{ hour }}h
          </div>
          <button
            v-for="day in weekDays"
            :key="`${dateStr(day)}-${hour}`"
            type="button"
            class="schedule-step__slot"
            :class="{
              'schedule-step__slot--busy': isBusy(day, hour),
              'schedule-step__slot--past': isPast(day, hour),
              'schedule-step__slot--selected': isSelected(day, hour),
              'schedule-step__slot--free': !isBusy(day, hour) && !isPast(day, hour),
            }"
            :disabled="isBusy(day, hour) || isPast(day, hour)"
            :aria-label="`${dayLabel(day)} ${hour}h — ${isBusy(day, hour) ? 'occupé' : isPast(day, hour) ? 'passé' : 'disponible'}`"
            :aria-pressed="isSelected(day, hour)"
            role="gridcell"
            @click="selectSlot(day, hour)"
          />
        </template>
      </div>

      <!-- Légende -->
      <div class="schedule-step__legend">
        <div class="schedule-step__legend-item">
          <div class="schedule-step__legend-dot schedule-step__legend-dot--free" />
          <span>Disponible</span>
        </div>
        <div class="schedule-step__legend-item">
          <div class="schedule-step__legend-dot schedule-step__legend-dot--busy" />
          <span>Occupé</span>
        </div>
        <div class="schedule-step__legend-item">
          <div class="schedule-step__legend-dot schedule-step__legend-dot--selected" />
          <span>Sélectionné</span>
        </div>
      </div>
    </div>

    <!-- Créneau sélectionné -->
    <div
      v-if="selectedSlot"
      class="schedule-step__selected-summary"
      role="status"
      aria-live="polite"
    >
      ✓ {{ formatSlotLabel(selectedSlot.date, selectedSlot.heure) }}
      ({{ selectedSlot.duree }} min)
    </div>
  </div>
</template>

<style scoped>
.schedule-step {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-5);
}

.schedule-step__section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.schedule-step__section-label {
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-mention-grey);
}

.schedule-step__duree-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.schedule-step__int-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.schedule-step__int-pill {
  font-size: var(--csplab-font-size-xs);
  font-weight: 500;
  background: var(--background-alt-grey);
  border-radius: var(--csplab-radius-sm);
  padding: 2px var(--csplab-space-2);
}

.schedule-step__week-nav {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}

.schedule-step__week-label {
  flex: 1;
  text-align: center;
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-default-grey);
}

/* Grid layout: 1 col (hours) + 5 cols (days) */
.schedule-step__grid {
  display: grid;
  grid-template-columns: 36px repeat(5, 1fr);
  gap: 2px;
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  overflow: hidden;
  background: var(--border-default-grey);
}

.schedule-step__grid-corner {
  background: var(--background-alt-grey);
}

.schedule-step__grid-day-header {
  background: var(--background-alt-grey);
  text-align: center;
  font-size: var(--csplab-font-size-xs);
  font-weight: 600;
  color: var(--text-mention-grey);
  padding: var(--csplab-space-2) 0;
}

.schedule-step__grid-hour {
  background: var(--background-alt-grey);
  font-size: 10px;
  color: var(--text-mention-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.schedule-step__slot {
  height: 28px;
  border: none;
  cursor: pointer;
  transition: background 80ms ease;
}

.schedule-step__slot--free {
  background: var(--background-default-grey);
}

.schedule-step__slot--free:hover {
  background: var(--background-contrast-blue-france);
}

.schedule-step__slot--busy {
  background: var(--background-contrast-error);
  cursor: not-allowed;
  opacity: 0.6;
}

.schedule-step__slot--past {
  background: var(--background-alt-grey);
  cursor: not-allowed;
  opacity: 0.4;
}

.schedule-step__slot--selected {
  background: var(--background-action-high-blue-france) !important;
}

.schedule-step__legend {
  display: flex;
  gap: var(--csplab-space-4);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.schedule-step__legend-item {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.schedule-step__legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.schedule-step__legend-dot--free { background: var(--background-default-grey); border: 1px solid var(--border-default-grey); }
.schedule-step__legend-dot--busy { background: var(--background-contrast-error); }
.schedule-step__legend-dot--selected { background: var(--background-action-high-blue-france); }

.schedule-step__selected-summary {
  padding: var(--csplab-space-3);
  background: var(--background-contrast-blue-france);
  border: 1px solid var(--border-action-high-blue-france);
  border-radius: var(--csplab-radius-md);
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  color: var(--text-action-high-blue-france);
}

@media (prefers-reduced-motion: reduce) {
  .schedule-step__slot { transition: none; }
}
</style>
