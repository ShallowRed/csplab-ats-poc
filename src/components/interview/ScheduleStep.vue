<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewWeek } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
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

// Generate mock busy slots for selected interviewers
function generateBusySlots(): Array<{ start: string; end: string; title: string }> {
  const slots: Array<{ start: string; end: string; title: string }> = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const today = new Date(now)
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = new Date(today)
    day.setDate(day.getDate() + dayOffset)
    if (day.getDay() === 0 || day.getDay() === 6) continue

    const dateStr = day.toISOString().split('T')[0]

    // Pseudo-random busy slots based on day/intervieweur
    props.intervieweurIds.forEach((intId, i) => {
      const seed1 = (dayOffset * 7 + i * 3) % 5
      const hours = [9, 10, 14, 15, 16][seed1]
      const intervieweur = intervieweursById.get(intId)
      const label = intervieweur ? `${intervieweur.prenom} ${intervieweur.nom}` : 'Intervieweur'
      slots.push({
        start: `${dateStr} ${String(hours).padStart(2, '0')}:00`,
        end: `${dateStr} ${String(hours + 1).padStart(2, '0')}:00`,
        title: `Occupé — ${label}`,
      })
    })
  }
  return slots
}

// Free slots: 9h-12h and 14h-18h each weekday, minus busy slots
function generateFreeSlots(): Array<{ date: string; heure: string; label: string }> {
  const busy = generateBusySlots()
  const busySet = new Set(busy.map(s => s.start))
  const result: Array<{ date: string; heure: string; label: string }> = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let dayOffset = 1; dayOffset <= 10; dayOffset++) {
    const day = new Date(today)
    day.setDate(day.getDate() + dayOffset)
    if (day.getDay() === 0 || day.getDay() === 6) continue

    const dateStr = day.toISOString().split('T')[0]
    const dayLabel = day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

    const hours = [9, 10, 11, 14, 15, 16, 17]
    hours.forEach(h => {
      const key = `${dateStr} ${String(h).padStart(2, '0')}:00`
      if (!busySet.has(key)) {
        result.push({ date: dateStr, heure: `${String(h).padStart(2, '0')}:00`, label: dayLabel })
      }
    })
  }
  return result
}

const freeSlots = computed(() => generateFreeSlots())

const slotsByDate = computed(() => {
  const map = new Map<string, typeof freeSlots.value>()
  freeSlots.value.forEach(slot => {
    const arr = map.get(slot.date) ?? []
    arr.push(slot)
    map.set(slot.date, arr)
  })
  return map
})

const calendarEl = shallowRef<HTMLElement | null>(null)

const calendarEvents = computed(() =>
  generateBusySlots().map((s, i) => ({ id: String(i), ...s })),
)

const now = new Date()
const todayStr = now.toISOString().split('T')[0]

const calendar = createCalendar({
  views: [createViewWeek()],
  defaultView: createViewWeek().name,
  selectedDate: todayStr,
  events: calendarEvents.value,
  locale: 'fr-FR',
  firstDayOfWeek: 1,
  callbacks: {},
})

function selectSlot(date: string, heure: string): void {
  selectedSlot.value = { date, heure, duree: selectedDuree.value }
  emit('update:modelValue', selectedSlot.value)
}

function isSelected(date: string, heure: string): boolean {
  return selectedSlot.value?.date === date && selectedSlot.value?.heure === heure
}

function onDureeChange(duree: number): void {
  selectedDuree.value = duree
  if (selectedSlot.value) {
    selectedSlot.value = { ...selectedSlot.value, duree }
    emit('update:modelValue', selectedSlot.value)
  }
}

const groupedDates = computed(() => [...slotsByDate.value.entries()])
</script>

<template>
  <div class="schedule-step">
    <div class="schedule-step__duree">
      <span class="schedule-step__label">Durée</span>
      <div
        class="schedule-step__duree-options"
        role="radiogroup"
        aria-label="Durée de l'entretien"
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

    <div
      v-if="selectedIntervieweurs.length > 0"
      class="schedule-step__intervieweurs"
    >
      <span class="schedule-step__label">Disponibilités de</span>
      <span
        v-for="int in selectedIntervieweurs"
        :key="int.id"
        class="schedule-step__int-name"
      >
        {{ int.prenom }} {{ int.nom }}
      </span>
    </div>

    <div class="schedule-step__calendar-wrap">
      <ScheduleXCalendar :calendar-app="calendar" />
    </div>

    <div class="schedule-step__slots">
      <div class="schedule-step__slots-title">
        Créneaux libres disponibles
      </div>

      <div
        v-if="groupedDates.length === 0"
        class="schedule-step__no-slots"
      >
        Aucun créneau disponible dans les 2 prochaines semaines.
      </div>

      <div
        v-for="[date, slots] in groupedDates.slice(0, 5)"
        :key="date"
        class="schedule-step__day-group"
      >
        <div class="schedule-step__day-label">
          {{ slots[0].label }}
        </div>
        <div class="schedule-step__day-slots">
          <Button
            v-for="slot in slots"
            :key="`${slot.date}-${slot.heure}`"
            type="button"
            :variant="isSelected(slot.date, slot.heure) ? 'primary' : 'tertiary'"
            size="sm"
            :aria-pressed="isSelected(slot.date, slot.heure)"
            @click="selectSlot(slot.date, slot.heure)"
          >
            {{ slot.heure }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-step {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-5);
}

.schedule-step__label {
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-mention-grey);
  margin-bottom: var(--csplab-space-2);
  display: block;
}

.schedule-step__duree {
  display: flex;
  flex-direction: column;
}

.schedule-step__duree-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.schedule-step__intervieweurs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
}

.schedule-step__int-name {
  font-weight: 500;
  color: var(--text-default-grey);
  background: var(--background-alt-grey);
  border-radius: var(--csplab-radius-sm);
  padding: 2px var(--csplab-space-2);
}

.schedule-step__calendar-wrap {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  overflow: hidden;
  height: 340px;
}

.schedule-step__calendar-wrap :deep(.sx__calendar) {
  height: 100%;
}

.schedule-step__slots {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.schedule-step__slots-title {
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-mention-grey);
}

.schedule-step__no-slots {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  text-align: center;
  padding: var(--csplab-space-4);
}

.schedule-step__day-group {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.schedule-step__day-label {
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  color: var(--text-default-grey);
  text-transform: capitalize;
}

.schedule-step__day-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}
</style>
