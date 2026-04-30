<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CritereEvaluation } from '@/types/domain'

type Notation = {
  critereId: string
  valeur: 1 | 2 | 3 | 4
  commentaire?: string
}

const props = defineProps<{
  criteres: CritereEvaluation[]
  notations: Notation[]
  recommandation: 'oui' | 'mitige' | 'non' | ''
  commentaireGlobal: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:notations', value: Notation[]): void
  (e: 'update:recommandation', value: 'oui' | 'mitige' | 'non' | ''): void
  (e: 'update:commentaireGlobal', value: string): void
}>()

const niveaux: Array<{ valeur: 1 | 2 | 3 | 4; label: string; shortLabel: string; color: string }> = [
  { valeur: 1, label: 'Fort non', shortLabel: 'Fort\nnon', color: 'level--1' },
  { valeur: 2, label: 'Non', shortLabel: 'Non', color: 'level--2' },
  { valeur: 3, label: 'Oui', shortLabel: 'Oui', color: 'level--3' },
  { valeur: 4, label: 'Fort oui', shortLabel: 'Fort\noui', color: 'level--4' },
]

const recOptions: Array<{ value: 'oui' | 'mitige' | 'non'; label: string; color: string }> = [
  { value: 'oui', label: 'Favorable', color: 'rec--oui' },
  { value: 'mitige', label: 'Mitigé', color: 'rec--mitige' },
  { value: 'non', label: 'Défavorable', color: 'rec--non' },
]

const notationsById = computed(() =>
  new Map(props.notations.map(n => [n.critereId, n])),
)

const notedCount = computed(() =>
  props.criteres.filter(c => notationsById.value.has(c.id)).length,
)

function setValeur(critereId: string, valeur: 1 | 2 | 3 | 4): void {
  const existing = props.notations.find(n => n.critereId === critereId)
  const next = existing
    ? props.notations.map(n => n.critereId === critereId ? { ...n, valeur } : n)
    : [...props.notations, { critereId, valeur }]
  emit('update:notations', next)
}

function setCommentaire(critereId: string, commentaire: string): void {
  const existing = props.notations.find(n => n.critereId === critereId)
  if (!existing) return
  emit('update:notations', props.notations.map(n =>
    n.critereId === critereId ? { ...n, commentaire: commentaire || undefined } : n,
  ))
}

defineExpose({ notedCount })
</script>

<template>
  <div class="eval-form">
    <!-- Critères -->
    <section class="eval-form__section">
      <h2 class="eval-form__section-title">
        Critères d'évaluation
        <span class="eval-form__counter">{{ notedCount }} / {{ criteres.length }}</span>
      </h2>

      <div class="eval-form__criteria-list">
        <div
          v-for="critere in criteres"
          :key="critere.id"
          class="eval-criterion"
        >
          <div class="eval-criterion__header">
            <div class="eval-criterion__label">
              {{ critere.libelle }}
            </div>
            <div
              v-if="critere.description"
              class="eval-criterion__desc"
            >
              {{ critere.description }}
            </div>
          </div>

          <RadioGroup
            :model-value="notationsById.get(critere.id)?.valeur?.toString() ?? ''"
            class="eval-criterion__levels"
            :disabled="disabled"
            :aria-label="`Notation — ${critere.libelle}`"
            @update:model-value="(v) => setValeur(critere.id, Number(v) as 1 | 2 | 3 | 4)"
          >
            <div
              v-for="niveau in niveaux"
              :key="niveau.valeur"
              class="eval-level"
              :class="[
                niveau.color,
                notationsById.get(critere.id)?.valeur === niveau.valeur && 'eval-level--active',
              ]"
            >
              <RadioGroupItem
                :id="`${critere.id}-${niveau.valeur}`"
                :value="String(niveau.valeur)"
                class="sr-only"
              />
              <Label
                :for="`${critere.id}-${niveau.valeur}`"
                class="eval-level__label"
              >
                {{ niveau.label }}
              </Label>
            </div>
          </RadioGroup>

          <div
            v-if="notationsById.get(critere.id)"
            class="eval-criterion__comment"
          >
            <Textarea
              :model-value="notationsById.get(critere.id)?.commentaire ?? ''"
              :disabled="disabled"
              placeholder="Commentaire sur ce critère (optionnel)…"
              rows="2"
              :aria-label="`Commentaire — ${critere.libelle}`"
              @update:model-value="(v) => setCommentaire(critere.id, v as string)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Recommandation globale -->
    <section class="eval-form__section">
      <h2 class="eval-form__section-title">
        Recommandation globale
        <span
          v-if="!recommandation"
          class="eval-form__required"
          aria-hidden="true"
        >*</span>
      </h2>

      <RadioGroup
        :model-value="recommandation"
        class="eval-form__rec-options"
        :disabled="disabled"
        aria-label="Recommandation globale"
        aria-required="true"
        @update:model-value="(v) => emit('update:recommandation', v as 'oui' | 'mitige' | 'non')"
      >
        <div
          v-for="opt in recOptions"
          :key="opt.value"
          class="eval-rec-card"
          :class="[opt.color, recommandation === opt.value && 'eval-rec-card--active']"
        >
          <RadioGroupItem
            :id="`rec-${opt.value}`"
            :value="opt.value"
            class="sr-only"
          />
          <Label
            :for="`rec-${opt.value}`"
            class="eval-rec-card__label"
          >
            {{ opt.label }}
          </Label>
        </div>
      </RadioGroup>
    </section>

    <!-- Commentaire global -->
    <section class="eval-form__section">
      <h2 class="eval-form__section-title">
        Commentaire général
      </h2>
      <Textarea
        :model-value="commentaireGlobal"
        :disabled="disabled"
        placeholder="Votre appréciation globale du candidat…"
        rows="4"
        aria-label="Commentaire général"
        @update:model-value="(v) => emit('update:commentaireGlobal', v as string)"
      />
    </section>
  </div>
</template>

<style scoped>
.eval-form {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-8);
}

.eval-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.eval-form__section-title {
  font-size: var(--csplab-font-size-lg);
  font-weight: 700;
  color: var(--text-title-grey);
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  margin: 0;
}

.eval-form__counter {
  font-size: var(--csplab-font-size-sm);
  font-weight: 400;
  color: var(--text-mention-grey);
}

.eval-form__required {
  color: var(--text-default-error);
}

.eval-form__criteria-list {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-5);
}

.eval-criterion {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-4);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  background: var(--background-default-grey);
}

.eval-criterion__label {
  font-weight: 600;
  font-size: var(--csplab-font-size-base);
}

.eval-criterion__desc {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.eval-criterion__levels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--csplab-space-2);
}

.eval-level {
  border: 2px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  cursor: pointer;
  transition: all 100ms ease;
}

.eval-level__label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  white-space: pre-line;
}

.eval-level--1.eval-level--active { border-color: var(--border-plain-error); background: var(--background-contrast-error); }
.eval-level--2.eval-level--active { border-color: var(--border-plain-warning); background: var(--background-contrast-warning); }
.eval-level--3.eval-level--active { border-color: var(--border-default-success); background: var(--background-contrast-success); }
.eval-level--4.eval-level--active { border-color: var(--text-default-success); background: var(--background-contrast-success); }

.eval-level:hover:not(.eval-level--active) {
  background: var(--background-alt-grey);
}

.eval-criterion__comment {
  margin-top: var(--csplab-space-1);
}

.eval-form__rec-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--csplab-space-3);
}

.eval-rec-card {
  border: 2px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  cursor: pointer;
  transition: all 100ms ease;
}

.eval-rec-card__label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  font-weight: 600;
  cursor: pointer;
}

.eval-rec-card--oui.eval-rec-card--active { border-color: var(--text-default-success); background: var(--background-contrast-success); }
.eval-rec-card--mitige.eval-rec-card--active { border-color: var(--border-plain-warning); background: var(--background-contrast-warning); }
.eval-rec-card--non.eval-rec-card--active { border-color: var(--border-plain-error); background: var(--background-contrast-error); }

.eval-rec-card:hover:not(.eval-rec-card--active) {
  background: var(--background-alt-grey);
}

@media (prefers-reduced-motion: reduce) {
  .eval-level, .eval-rec-card { transition: none; }
}
</style>
