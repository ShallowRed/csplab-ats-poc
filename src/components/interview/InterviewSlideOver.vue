<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import ScheduleStep from './ScheduleStep.vue'
import { useInterviewStore } from '@/stores/interview'
import { useToastStore } from '@/stores/toast'
import { mockApi } from '@/lib/mockApi'
import { seed } from '@/data/seed'
import type { Candidat, Candidature, Entretien, Intervieweur, Offre } from '@/types/domain'

type InterviewType = Entretien['type']
type Step = 1 | 2 | 3 | 4

const interviewStore = useInterviewStore()
const toast = useToastStore()

const isOpen = computed(() => interviewStore.candidatureIdOuvert !== null)

// Loaded data
const candidature = ref<Candidature | null>(null)
const candidat = ref<Candidat | null>(null)
const offre = ref<Offre | null>(null)
const loading = ref(false)

// Wizard state
const step = ref<Step>(1)
const selectedType = ref<InterviewType>('rh')
const selectedIntervieweurIds = ref<string[]>([])
const selectedSlot = ref<{ date: string; heure: string; duree: number } | null>(null)
const submitting = ref(false)

const allIntervieweurs = seed.intervieweurs

const typeOptions: Array<{ value: InterviewType; label: string; description: string }> = [
  { value: 'rh', label: 'Entretien RH', description: 'Adéquation culturelle, motivations, parcours' },
  { value: 'technique', label: 'Entretien technique', description: 'Compétences métier et techniques' },
  { value: 'manager', label: 'Entretien manager', description: 'Évaluation par le futur manager' },
  { value: 'jury', label: 'Jury', description: 'Panel de décision final' },
]

const defaultModeleId = computed(() => seed.modelesEvaluation[0]?.id ?? 'modele-1')

watch(isOpen, (val) => {
  if (val && interviewStore.candidatureIdOuvert) {
    reset()
    load(interviewStore.candidatureIdOuvert)
  }
})

async function load(id: string): Promise<void> {
  loading.value = true
  try {
    const data = await mockApi.getCandidature(id)
    candidature.value = data.candidature
    candidat.value = data.candidat
    offre.value = data.offre
  } finally {
    loading.value = false
  }
}

function reset(): void {
  step.value = 1
  selectedType.value = 'rh'
  selectedIntervieweurIds.value = []
  selectedSlot.value = null
  submitting.value = false
  candidature.value = null
  candidat.value = null
  offre.value = null
}

function canProceed(s: Step): boolean {
  if (s === 1) return true
  if (s === 2) return selectedIntervieweurIds.value.length > 0
  if (s === 3) return selectedSlot.value !== null
  return true
}

function goTo(target: Step): void {
  if (target < step.value || canProceed(step.value)) {
    step.value = target
  }
}

function next(): void {
  if (step.value < 4 && canProceed(step.value)) {
    step.value = (step.value + 1) as Step
  }
}

function prev(): void {
  if (step.value > 1) step.value = (step.value - 1) as Step
}

function toggleIntervieweur(id: string): void {
  const idx = selectedIntervieweurIds.value.indexOf(id)
  if (idx === -1) {
    selectedIntervieweurIds.value = [...selectedIntervieweurIds.value, id]
  } else {
    selectedIntervieweurIds.value = selectedIntervieweurIds.value.filter(i => i !== id)
  }
}

const confirmLabel = computed(() => {
  if (!selectedSlot.value) return ''
  const d = new Date(`${selectedSlot.value.date}T${selectedSlot.value.heure}`)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) +
    ' à ' + selectedSlot.value.heure +
    ` (${selectedSlot.value.duree} min)`
})

const selectedIntervieweurObjects = computed(() =>
  selectedIntervieweurIds.value
    .map(id => allIntervieweurs.find(i => i.id === id))
    .filter(Boolean) as Intervieweur[],
)

const typeLabel = computed(() => typeOptions.find(t => t.value === selectedType.value)?.label ?? '')

async function confirm(): Promise<void> {
  if (!candidature.value || !selectedSlot.value || submitting.value) return
  submitting.value = true
  try {
    const [h, m] = selectedSlot.value.heure.split(':').map(Number)
    const dateObj = new Date(`${selectedSlot.value.date}T00:00:00`)
    dateObj.setHours(h, m ?? 0)

    await mockApi.planifierEntretien({
      candidatureId: candidature.value.id,
      type: selectedType.value,
      date: dateObj.toISOString(),
      duree: selectedSlot.value.duree,
      intervieweurIds: selectedIntervieweurIds.value,
      modeleEvaluationId: defaultModeleId.value,
    })

    toast.success(`Entretien ${typeLabel.value} planifié pour ${confirmLabel.value}`)
    interviewStore.fermer()
  } catch {
    toast.error('Erreur lors de la planification')
  } finally {
    submitting.value = false
  }
}

function onEscape(e: KeyboardEvent): void {
  if (e.key === 'Escape') interviewStore.fermer()
}
onMounted(() => document.addEventListener('keydown', onEscape))
onUnmounted(() => document.removeEventListener('keydown', onEscape))

const slideEl = ref<HTMLElement | null>(null)

watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      slideEl.value?.querySelector<HTMLElement>('button, [tabindex="0"]')?.focus()
    }, 250)
  }
})

const stepLabels: Record<Step, string> = {
  1: 'Type',
  2: 'Intervieweurs',
  3: 'Créneau',
  4: 'Confirmation',
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="slideover-overlay"
      aria-hidden="true"
      @click="interviewStore.fermer()"
    />

    <aside
      v-if="isOpen"
      ref="slideEl"
      class="interview-slideover"
      role="dialog"
      aria-modal="true"
      :aria-label="`Planifier un entretien${candidat ? ` — ${candidat.prenom} ${candidat.nom}` : ''}`"
    >
      <!-- Header -->
      <div class="slideover-header">
        <div class="slideover-header__info">
          <div class="slideover-header__title">
            Planifier un entretien
          </div>
          <div
            v-if="candidat && offre"
            class="slideover-header__sub"
          >
            {{ candidat.prenom }} {{ candidat.nom }} — {{ offre.titre }}
          </div>
          <div
            v-else-if="loading"
            class="slideover-header__sub"
          >
            <Skeleton class="h-4 w-48" />
          </div>
        </div>
        <Button
          type="button"
          variant="tertiary-no-outline"
          size="icon"
          class="h-8 w-8"
          aria-label="Fermer"
          @click="interviewStore.fermer()"
        >
          <RiIcon
            name="ri:close-line"
            :size="16"
          />
        </Button>
      </div>

      <!-- Step breadcrumb -->
      <nav
        class="slideover-steps"
        aria-label="Étapes"
      >
        <button
          v-for="(label, s) in stepLabels"
          :key="s"
          type="button"
          class="slideover-step"
          :class="{
            'slideover-step--active': step === Number(s),
            'slideover-step--done': step > Number(s),
            'slideover-step--disabled': !canProceed((Number(s) - 1) as Step) && step < Number(s),
          }"
          :aria-current="step === Number(s) ? 'step' : undefined"
          @click="goTo(Number(s) as Step)"
        >
          <span class="slideover-step__number">
            <RiIcon
              v-if="step > Number(s)"
              name="ri:check-line"
              :size="12"
            />
            <span
              v-else
              aria-hidden="true"
            >{{ s }}</span>
          </span>
          <span class="slideover-step__label">{{ label }}</span>
        </button>
      </nav>

      <!-- Body -->
      <div class="slideover-body">
        <!-- Step 1: Type -->
        <div
          v-if="step === 1"
          class="slideover-step-content"
        >
          <div class="slideover-step-content__title">
            Quel type d'entretien ?
          </div>
          <RadioGroup
            v-model="selectedType"
            class="slideover-type-grid"
          >
            <div
              v-for="opt in typeOptions"
              :key="opt.value"
              class="slideover-type-card"
              :class="selectedType === opt.value && 'slideover-type-card--active'"
            >
              <RadioGroupItem
                :id="`type-${opt.value}`"
                :value="opt.value"
                class="sr-only"
              />
              <Label
                :for="`type-${opt.value}`"
                class="slideover-type-card__label"
              >
                <span class="slideover-type-card__name">{{ opt.label }}</span>
                <span class="slideover-type-card__desc">{{ opt.description }}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <!-- Step 2: Intervieweurs -->
        <div
          v-if="step === 2"
          class="slideover-step-content"
        >
          <div class="slideover-step-content__title">
            Sélectionner les intervieweurs
          </div>
          <div class="slideover-intervieweurs">
            <div
              v-for="int in allIntervieweurs"
              :key="int.id"
              class="slideover-int-row"
              :class="selectedIntervieweurIds.includes(int.id) && 'slideover-int-row--selected'"
            >
              <Checkbox
                :id="`int-${int.id}`"
                :checked="selectedIntervieweurIds.includes(int.id)"
                @update:checked="toggleIntervieweur(int.id)"
              />
              <Avatar class="h-8 w-8">
                <AvatarImage
                  :src="int.avatarUrl ?? ''"
                  :alt="`${int.prenom} ${int.nom}`"
                />
                <AvatarFallback class="text-xs">
                  {{ int.prenom.charAt(0) }}{{ int.nom.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <Label
                :for="`int-${int.id}`"
                class="slideover-int-row__info"
              >
                <span class="slideover-int-row__name">{{ int.prenom }} {{ int.nom }}</span>
                <span class="slideover-int-row__role">{{ int.role }}</span>
              </Label>
            </div>
          </div>

          <div
            v-if="selectedIntervieweurIds.length === 0"
            class="slideover-error"
            role="alert"
          >
            Sélectionnez au moins un intervieweur.
          </div>
        </div>

        <!-- Step 3: Créneau -->
        <div
          v-if="step === 3"
          class="slideover-step-content"
        >
          <div class="slideover-step-content__title">
            Choisir un créneau
          </div>
          <ScheduleStep
            v-model="selectedSlot"
            :intervieweur-ids="selectedIntervieweurIds"
          />
          <div
            v-if="!selectedSlot"
            class="slideover-error"
            role="alert"
          >
            Sélectionnez un créneau dans la liste ci-dessous.
          </div>
        </div>

        <!-- Step 4: Récap -->
        <div
          v-if="step === 4"
          class="slideover-step-content"
        >
          <div class="slideover-step-content__title">
            Récapitulatif
          </div>

          <div class="slideover-recap">
            <div class="slideover-recap__row">
              <span class="slideover-recap__label">Type</span>
              <Tag size="sm">{{ typeLabel }}</Tag>
            </div>

            <div class="slideover-recap__row">
              <span class="slideover-recap__label">Intervieweurs</span>
              <div class="slideover-recap__ints">
                <div
                  v-for="int in selectedIntervieweurObjects"
                  :key="int.id"
                  class="slideover-recap__int"
                >
                  <Avatar class="h-6 w-6">
                    <AvatarImage
                      :src="int.avatarUrl ?? ''"
                      :alt="`${int.prenom} ${int.nom}`"
                    />
                    <AvatarFallback class="text-xs">
                      {{ int.prenom.charAt(0) }}{{ int.nom.charAt(0) }}
                    </AvatarFallback>
                  </Avatar>
                  <span>{{ int.prenom }} {{ int.nom }}</span>
                </div>
              </div>
            </div>

            <div class="slideover-recap__row">
              <span class="slideover-recap__label">Créneau</span>
              <span class="slideover-recap__value">{{ confirmLabel }}</span>
            </div>

            <div
              v-if="candidat"
              class="slideover-recap__row"
            >
              <span class="slideover-recap__label">Candidat</span>
              <span class="slideover-recap__value">{{ candidat.prenom }} {{ candidat.nom }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="slideover-footer">
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          :disabled="step === 1"
          @click="prev"
        >
          Précédent
        </Button>

        <div class="slideover-footer__right">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            @click="interviewStore.fermer()"
          >
            Annuler
          </Button>

          <Button
            v-if="step < 4"
            type="button"
            variant="primary"
            size="sm"
            :disabled="!canProceed(step)"
            @click="next"
          >
            Suivant
          </Button>

          <Button
            v-else
            type="button"
            variant="primary"
            size="sm"
            :disabled="submitting"
            @click="confirm"
          >
            {{ submitting ? 'Planification…' : 'Confirmer l\'entretien' }}
          </Button>
        </div>
      </div>
    </aside>
  </Teleport>
</template>

<style scoped>
.slideover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 40;
}

.interview-slideover {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 640px;
  max-width: 100vw;
  z-index: 50;
  background: var(--background-default-grey);
  border-left: 1px solid var(--border-default-grey);
  display: flex;
  flex-direction: column;
  animation: slideover-in 250ms ease;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
}

@keyframes slideover-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.slideover-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--csplab-space-4);
  border-bottom: 1px solid var(--border-default-grey);
  flex-shrink: 0;
}

.slideover-header__title {
  font-weight: 700;
  font-size: var(--csplab-font-size-lg);
}

.slideover-header__sub {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  margin-top: 2px;
}

.slideover-steps {
  display: flex;
  align-items: center;
  padding: var(--csplab-space-3) var(--csplab-space-4);
  border-bottom: 1px solid var(--border-default-grey);
  gap: var(--csplab-space-1);
  flex-shrink: 0;
  overflow-x: auto;
}

.slideover-step {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-2);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  padding: var(--csplab-space-1) var(--csplab-space-2);
  border-radius: var(--csplab-radius-sm);
  white-space: nowrap;
}

.slideover-step--active {
  color: var(--text-action-high-blue-france);
  font-weight: 600;
}

.slideover-step--done {
  color: var(--text-default-success);
}

.slideover-step::after {
  content: '›';
  margin-left: var(--csplab-space-1);
  color: var(--border-default-grey);
}

.slideover-step:last-child::after {
  display: none;
}

.slideover-step__number {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid currentColor;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.slideover-step--active .slideover-step__number {
  background: var(--background-action-high-blue-france);
  color: white;
  border-color: var(--background-action-high-blue-france);
}

.slideover-step--done .slideover-step__number {
  background: var(--text-default-success);
  color: white;
  border-color: var(--text-default-success);
}

.slideover-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--csplab-space-5);
}

.slideover-step-content__title {
  font-weight: 600;
  font-size: var(--csplab-font-size-base);
  margin-bottom: var(--csplab-space-4);
}

.slideover-type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--csplab-space-3);
}

.slideover-type-card {
  border: 2px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  padding: var(--csplab-space-3);
  cursor: pointer;
  transition: border-color 150ms ease;
}

.slideover-type-card--active {
  border-color: var(--border-action-high-blue-france);
  background: var(--background-contrast-blue-france);
}

.slideover-type-card__label {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
  cursor: pointer;
}

.slideover-type-card__name {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
}

.slideover-type-card__desc {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  line-height: 1.4;
}

.slideover-intervieweurs {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.slideover-int-row {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  cursor: pointer;
  transition: background 100ms ease;
}

.slideover-int-row--selected {
  background: var(--background-contrast-blue-france);
  border-color: var(--border-action-high-blue-france);
}

.slideover-int-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.slideover-int-row__name {
  font-weight: 500;
  font-size: var(--csplab-font-size-sm);
}

.slideover-int-row__role {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  text-transform: capitalize;
}

.slideover-recap {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  padding: var(--csplab-space-4);
}

.slideover-recap__row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--csplab-space-3);
  align-items: start;
}

.slideover-recap__label {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.slideover-recap__value {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
}

.slideover-recap__ints {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.slideover-recap__int {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
}

.slideover-error {
  margin-top: var(--csplab-space-3);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  background: var(--background-contrast-error);
  border: 1px solid var(--border-plain-error);
  border-radius: var(--csplab-radius-md);
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-error);
}

.slideover-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--csplab-space-3) var(--csplab-space-4);
  border-top: 1px solid var(--border-default-grey);
  flex-shrink: 0;
}

.slideover-footer__right {
  display: flex;
  gap: var(--csplab-space-2);
}

@media (prefers-reduced-motion: reduce) {
  .interview-slideover {
    animation: none;
  }
  .slideover-type-card {
    transition: none;
  }
  .slideover-int-row {
    transition: none;
  }
}
</style>
