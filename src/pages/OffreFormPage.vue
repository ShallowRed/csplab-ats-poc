<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useOffresStore } from '@/stores/offres'
import { useDraftAutoSave } from '@/composables/useDraftAutoSave'
import { seed } from '@/data/seed'
import type { OffreStatut, TypeContrat } from '@/types/domain'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const offresStore = useOffresStore()

const isEdit = computed(() => Boolean(props.id))
const existing = computed(() => (props.id ? offresStore.getById(props.id) : undefined))

const DIRECTIONS = ['DGAFP', 'DGFiP', 'INSEE', 'Beta.gouv', 'DINUM']
const LOCALISATIONS = ['Paris 7e', 'Paris 15e', 'Bercy', 'Lyon Part-Dieu', 'Montreuil']
const TYPES_CONTRAT: Array<{ value: TypeContrat; label: string }> = [
  { value: 'titulaire', label: 'Titulaire' },
  { value: 'contractuel', label: 'Contractuel' },
  { value: 'apprentissage', label: 'Apprentissage' },
  { value: 'stage', label: 'Stage' },
]
const CORPS = ['Administrateur civil', 'Attaché', 'Ingénieur', 'Inspecteur des finances publiques']
const GRADES = ['Grade A', 'Grade A+', 'Grade B', 'Grade B+']

const pipelineStandard = seed.pipelines[0]
const etapesAll = pipelineStandard
  ? pipelineStandard.etapeIds
      .map(id => seed.etapes.find(e => e.id === id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
  : []

const responsablesOptions = seed.intervieweurs.filter(i => i.role === 'manager')

type FormState = {
  titre: string
  direction: string
  localisation: string
  typeContrat: TypeContrat
  corps: string
  grade: string
  descriptif: string
  responsableId: string
  etapesIds: string[]
  intervieweursDefautIds: string[]
}

function makeInitial(): FormState {
  if (existing.value) {
    return {
      titre: existing.value.titre,
      direction: existing.value.direction,
      localisation: existing.value.localisation,
      typeContrat: existing.value.typeContrat,
      corps: existing.value.corps ?? '',
      grade: existing.value.grade ?? '',
      descriptif: existing.value.descriptif ?? '',
      responsableId: existing.value.responsableId ?? '',
      etapesIds: existing.value.etapesIds ? [...existing.value.etapesIds] : pipelineStandard?.etapeIds ?? [],
      intervieweursDefautIds: existing.value.intervieweursDefautIds
        ? [...existing.value.intervieweursDefautIds]
        : [],
    }
  }
  return {
    titre: '',
    direction: '',
    localisation: '',
    typeContrat: 'titulaire',
    corps: '',
    grade: '',
    descriptif: '',
    responsableId: '',
    etapesIds: pipelineStandard ? [...pipelineStandard.etapeIds] : [],
    intervieweursDefautIds: [],
  }
}

const form = reactive<FormState>(makeInitial())

watchEffect(() => {
  if (isEdit.value && existing.value) {
    Object.assign(form, makeInitial())
  }
})

const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  for (const key of Object.keys(errors)) delete errors[key]
  if (!form.titre.trim()) errors.titre = 'L\'intitulé est requis.'
  if (!form.direction) errors.direction = 'La direction est requise.'
  if (!form.typeContrat) errors.typeContrat = 'Le type de contrat est requis.'
  if (form.etapesIds.length === 0) errors.etapesIds = 'Sélectionnez au moins une étape.'
  return Object.keys(errors).length === 0
}

async function focusFirstError(): Promise<void> {
  await nextTick()
  const el = document.querySelector<HTMLElement>('.offre-form [data-error="true"]')
  el?.focus()
}

const draftKey = computed(() => (isEdit.value ? `offre:${props.id}` : 'offre:nouvelle'))
const formRef = computed(() => ({ ...form }))
const { lastSavedAt, saveNow } = useDraftAutoSave(formRef, draftKey.value, 30_000)

const isSubmitting = ref(false)

async function handleSubmit(action: 'brouillon' | 'publier' | 'enregistrer'): Promise<void> {
  if (!validate()) {
    await focusFirstError()
    return
  }
  isSubmitting.value = true
  try {
    const payload = {
      titre: form.titre.trim(),
      direction: form.direction,
      localisation: form.localisation,
      service: form.direction,
      typeContrat: form.typeContrat,
      corps: form.typeContrat === 'titulaire' && form.corps ? form.corps : undefined,
      grade: form.typeContrat === 'titulaire' && form.grade ? form.grade : undefined,
      descriptif: form.descriptif.trim() || undefined,
      responsableId: form.responsableId || undefined,
      etapesIds: [...form.etapesIds],
      intervieweursDefautIds: [...form.intervieweursDefautIds],
      pipelineId: existing.value?.pipelineId ?? pipelineStandard?.id ?? 'pipeline-std',
    }

    if (isEdit.value && existing.value) {
      offresStore.update(existing.value.id, payload)
      saveNow()
      void router.push(`/offres/${existing.value.id}`)
      return
    }

    const statutInit: OffreStatut = action === 'publier' ? 'ouverte' : 'brouillon'
    const created = offresStore.create({ ...payload, statut: statutInit })
    saveNow()
    void router.push(`/offres/${created.id}`)
  } finally {
    isSubmitting.value = false
  }
}

function onCancel(): void {
  if (isEdit.value && props.id) {
    void router.push(`/offres/${props.id}`)
  } else {
    void router.push('/offres')
  }
}

function toggleEtape(id: string): void {
  const idx = form.etapesIds.indexOf(id)
  if (idx >= 0) form.etapesIds.splice(idx, 1)
  else form.etapesIds.push(id)
}

function toggleIntervieweur(id: string): void {
  const idx = form.intervieweursDefautIds.indexOf(id)
  if (idx >= 0) form.intervieweursDefautIds.splice(idx, 1)
  else form.intervieweursDefautIds.push(id)
}

function formatLastSaved(): string {
  const ts = lastSavedAt.value
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  if (isEdit.value && !existing.value) {
    void router.replace('/offres')
  }
})
</script>

<template>
  <form
    class="offre-form"
    novalidate
    @submit.prevent="handleSubmit(isEdit ? 'enregistrer' : 'publier')"
  >
    <div class="offre-form__content">
      <Card>
        <CardHeader>
          <CardTitle>Identité</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="offre-form__grid">
            <label class="offre-form__field offre-form__field--full">
              <span class="offre-form__label">Intitulé du poste *</span>
              <Input
                v-model="form.titre"
                placeholder="Ex. Chargé de mission numérique"
                :data-error="Boolean(errors.titre) || undefined"
                :aria-invalid="Boolean(errors.titre)"
              />
              <span
                v-if="errors.titre"
                class="offre-form__error"
              >{{ errors.titre }}</span>
            </label>

            <label class="offre-form__field">
              <span class="offre-form__label">Direction *</span>
              <select
                v-model="form.direction"
                class="offre-form__select"
                :data-error="Boolean(errors.direction) || undefined"
                :aria-invalid="Boolean(errors.direction)"
              >
                <option value="">
                  Sélectionner…
                </option>
                <option
                  v-for="d in DIRECTIONS"
                  :key="d"
                  :value="d"
                >
                  {{ d }}
                </option>
              </select>
              <span
                v-if="errors.direction"
                class="offre-form__error"
              >{{ errors.direction }}</span>
            </label>

            <label class="offre-form__field">
              <span class="offre-form__label">Responsable</span>
              <select
                v-model="form.responsableId"
                class="offre-form__select"
              >
                <option value="">
                  Aucun
                </option>
                <option
                  v-for="r in responsablesOptions"
                  :key="r.id"
                  :value="r.id"
                >
                  {{ r.prenom }} {{ r.nom }}
                </option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Type de poste</CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset
            class="offre-form__fieldset"
            :data-error="Boolean(errors.typeContrat) || undefined"
          >
            <legend class="offre-form__label">
              Type de contrat *
            </legend>
            <div class="offre-form__radio-group">
              <label
                v-for="t in TYPES_CONTRAT"
                :key="t.value"
                class="offre-form__radio"
              >
                <input
                  v-model="form.typeContrat"
                  type="radio"
                  name="typeContrat"
                  :value="t.value"
                >
                <span>{{ t.label }}</span>
              </label>
            </div>
            <span
              v-if="errors.typeContrat"
              class="offre-form__error"
            >{{ errors.typeContrat }}</span>
          </fieldset>

          <div class="offre-form__grid offre-form__grid--mt">
            <label
              v-if="form.typeContrat === 'titulaire'"
              class="offre-form__field"
            >
              <span class="offre-form__label">Corps</span>
              <select
                v-model="form.corps"
                class="offre-form__select"
              >
                <option value="">
                  —
                </option>
                <option
                  v-for="c in CORPS"
                  :key="c"
                  :value="c"
                >
                  {{ c }}
                </option>
              </select>
            </label>

            <label
              v-if="form.typeContrat === 'titulaire'"
              class="offre-form__field"
            >
              <span class="offre-form__label">Grade</span>
              <select
                v-model="form.grade"
                class="offre-form__select"
              >
                <option value="">
                  —
                </option>
                <option
                  v-for="g in GRADES"
                  :key="g"
                  :value="g"
                >
                  {{ g }}
                </option>
              </select>
            </label>

            <label class="offre-form__field">
              <span class="offre-form__label">Lieu</span>
              <select
                v-model="form.localisation"
                class="offre-form__select"
              >
                <option value="">
                  Sélectionner…
                </option>
                <option
                  v-for="l in LOCALISATIONS"
                  :key="l"
                  :value="l"
                >
                  {{ l }}
                </option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descriptif</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            v-model="form.descriptif"
            class="offre-form__textarea"
            placeholder="Missions, contexte, profil recherché…"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset
            class="offre-form__fieldset"
            :data-error="Boolean(errors.etapesIds) || undefined"
          >
            <legend class="offre-form__label">
              Étapes utilisées pour cette offre *
            </legend>
            <ul class="offre-form__check-list">
              <li
                v-for="etape in etapesAll"
                :key="etape.id"
                class="offre-form__check-item"
              >
                <label class="offre-form__check">
                  <input
                    type="checkbox"
                    :checked="form.etapesIds.includes(etape.id)"
                    @change="toggleEtape(etape.id)"
                  >
                  <span
                    class="offre-form__step-dot"
                    :style="{ background: `var(--${etape.couleur})` }"
                    aria-hidden="true"
                  />
                  <span>{{ etape.libelle }}</span>
                </label>
              </li>
            </ul>
            <span
              v-if="errors.etapesIds"
              class="offre-form__error"
            >{{ errors.etapesIds }}</span>
          </fieldset>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intervieweurs par défaut</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="offre-form__check-list">
            <li
              v-for="i in seed.intervieweurs"
              :key="i.id"
              class="offre-form__check-item"
            >
              <label class="offre-form__check">
                <input
                  type="checkbox"
                  :checked="form.intervieweursDefautIds.includes(i.id)"
                  @change="toggleIntervieweur(i.id)"
                >
                <span>{{ i.prenom }} {{ i.nom }}</span>
                <span class="offre-form__role">
                  {{ i.role === 'rh' ? 'RH' : i.role === 'manager' ? 'Manager' : 'Expert' }}
                </span>
              </label>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <div class="offre-form__footer">
      <div class="offre-form__autosave">
        <RiIcon
          name="ri:save-line"
          :size="14"
        />
        <span v-if="lastSavedAt">Brouillon enregistré à {{ formatLastSaved() }}</span>
        <span v-else>Enregistrement automatique activé</span>
      </div>
      <div class="offre-form__footer-actions">
        <Button
          type="button"
          variant="tertiary-no-outline"
          :disabled="isSubmitting"
          @click="onCancel"
        >
          Annuler
        </Button>
        <template v-if="!isEdit">
          <Button
            type="button"
            variant="secondary"
            :disabled="isSubmitting"
            @click="handleSubmit('brouillon')"
          >
            Enregistrer en brouillon
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
          >
            Publier
          </Button>
        </template>
        <template v-else>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
          >
            Enregistrer
          </Button>
        </template>
      </div>
    </div>
  </form>
</template>

<style scoped>
.offre-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.offre-form__content {
  flex: 1;
  overflow: auto;
  padding: var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.offre-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--csplab-space-3);
}

.offre-form__grid--mt {
  margin-top: var(--csplab-space-3);
}

.offre-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
  font-size: var(--csplab-font-size-sm);
}

.offre-form__field--full {
  grid-column: 1 / -1;
}

.offre-form__label {
  font-weight: 500;
  color: var(--text-default-grey);
}

.offre-form__select {
  height: 36px;
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-sm);
  padding: 0 var(--csplab-space-2);
  background: var(--background-default-grey);
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
}

.offre-form__select[aria-invalid='true'],
[data-error='true'] > .offre-form__select {
  border-color: var(--text-default-error);
}

.offre-form__error {
  color: var(--text-default-error);
  font-size: var(--csplab-font-size-xs);
}

.offre-form__fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.offre-form__radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-3);
}

.offre-form__radio {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  font-size: var(--csplab-font-size-sm);
}

.offre-form__textarea {
  min-height: 200px;
}

.offre-form__check-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.offre-form__check-item {
  margin: 0;
}

.offre-form__check {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
  padding: var(--csplab-space-1) var(--csplab-space-2);
  border-radius: var(--csplab-radius-sm);
  width: 100%;
}

.offre-form__check:hover {
  background: var(--background-alt-grey);
}

.offre-form__step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.offre-form__role {
  margin-left: auto;
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  text-transform: uppercase;
}

.offre-form__footer {
  flex: 0 0 auto;
  position: sticky;
  bottom: 0;
  background: var(--background-default-grey);
  border-top: 1px solid var(--border-default-grey);
  padding: var(--csplab-space-3) var(--csplab-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-3);
}

.offre-form__autosave {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.offre-form__footer-actions {
  display: flex;
  gap: var(--csplab-space-2);
}

@media (max-width: 700px) {
  .offre-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
