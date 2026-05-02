<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePageHeader } from '@/stores/pageHeader'
import { useToastStore } from '@/stores/toast'
import { mockApi } from '@/lib/mockApi'
import { seed } from '@/data/seed'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EvaluationForm from '@/components/evaluation/EvaluationForm.vue'
import type { CritereEvaluation, Entretien, Candidat, Candidature, Offre } from '@/types/domain'

const props = defineProps<{ id: string }>()

const router = useRouter()
const pageHeader = usePageHeader()
const toast = useToastStore()

type Notation = { critereId: string; valeur: 1 | 2 | 3 | 4; commentaire?: string }

// Data
const entretien = ref<Entretien | null>(null)
const candidature = ref<Candidature | null>(null)
const candidat = ref<Candidat | null>(null)
const offre = ref<Offre | null>(null)
const criteres = ref<CritereEvaluation[]>([])
const loading = ref(true)
const loadError = ref<string | null>(null)

// Form state
const notations = ref<Notation[]>([])
const recommandation = ref<'oui' | 'mitige' | 'non' | ''>('')
const commentaireGlobal = ref('')
const submitting = ref(false)
const savingDraft = ref(false)
const submitted = ref(false)

// Auto-save draft every 30s
let autoSaveTimer: ReturnType<typeof setInterval> | null = null

async function saveDraft(): Promise<void> {
  if (!entretien.value || notations.value.length === 0 || submitted.value) return
  savingDraft.value = true
  try {
    await mockApi.sauvegarderBrouillonEvaluation({
      entretienId: entretien.value.id,
      candidatureId: entretien.value.candidatureId,
      intervieweurId: 'user-1',
      notations: notations.value,
    })
  } finally {
    savingDraft.value = false
  }
}

onMounted(async () => {
  let found: Entretien | null = null
  try {
    found = await mockApi.getEntretien(props.id)
  } catch {
    loadError.value = 'Entretien introuvable.'
    loading.value = false
    return
  }

  entretien.value = found

  // Load candidature data
  try {
    const data = await mockApi.getCandidature(found.candidatureId)
    candidature.value = data.candidature
    candidat.value = data.candidat
    offre.value = data.offre
  } catch {
    loadError.value = 'Impossible de charger la candidature.'
    loading.value = false
    return
  }

  // Load modele evaluation critères
  const modele = seed.modelesEvaluation.find(m => m.id === found.modeleEvaluationId)
    ?? seed.modelesEvaluation[0]

  if (modele) {
    criteres.value = modele.criteres
  }

  pageHeader.setBreadcrumb([
    { label: 'Entretiens', to: '/entretiens' },
    { label: candidat.value ? `${candidat.value.prenom} ${candidat.value.nom}` : `Entretien` },
    { label: 'Évaluation' },
  ])

  loading.value = false

  autoSaveTimer = setInterval(() => { void saveDraft() }, 30_000)
})

onBeforeUnmount(() => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
})

// Validation
const notedCount = computed(() => notations.value.length)
const isValid = computed(() =>
  recommandation.value !== '' && notedCount.value >= 1,
)

const typeLabel: Record<Entretien['type'], string> = {
  rh: 'RH',
  technique: 'Technique',
  manager: 'Manager',
  jury: 'Jury',
}

const statutLabel: Record<Entretien['statut'], string> = {
  planifie: 'Planifié',
  realise: 'Réalisé',
  annule: 'Annulé',
}

const intervieweursDisplay = computed(() =>
  (entretien.value?.intervieweurIds ?? [])
    .map(id => seed.intervieweurs.find(i => i.id === id))
    .filter(Boolean),
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

async function submitEvaluation(): Promise<void> {
  if (!isValid.value || !entretien.value || submitting.value) return
  submitting.value = true
  try {
    await mockApi.soumettreEvaluation({
      entretienId: entretien.value.id,
      candidatureId: entretien.value.candidatureId,
      intervieweurId: 'user-1',
      notations: notations.value,
      recommandation: recommandation.value as 'oui' | 'mitige' | 'non',
      commentaireGlobal: commentaireGlobal.value || undefined,
    })

    submitted.value = true
    toast.success('Évaluation soumise')

    // Redirect to candidate sheet after short delay
    setTimeout(() => {
      router.push(`/candidatures/${entretien.value!.candidatureId}`)
    }, 1200)
  } catch {
    toast.error('Erreur lors de la soumission')
  } finally {
    submitting.value = false
  }
}

async function onSaveDraft(): Promise<void> {
  await saveDraft()
  toast.success('Brouillon sauvegardé')
}

// Watch notations to trigger auto-save hint
watch(notations, () => { /* side-effects handled by interval */ }, { deep: true })
</script>

<template>
  <div class="eval-page page-narrow">
    <!-- Loading -->
    <div
      v-if="loading"
      class="eval-page__loading"
    >
      <Skeleton
        v-for="i in 5"
        :key="i"
        class="h-16 w-full"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="loadError"
      class="eval-page__error"
      role="alert"
    >
      {{ loadError }}
    </div>

    <template v-else>
      <!-- Card récap entretien -->
      <div class="eval-page__header-card">
        <div class="eval-page__header-row">
          <div class="eval-page__header-meta">
            <Tag
              v-if="entretien"
              size="sm"
            >
              Entretien {{ typeLabel[entretien.type] }}
            </Tag>
            <Tag
              v-if="entretien"
              size="sm"
            >
              {{ statutLabel[entretien.statut] }}
            </Tag>
          </div>

          <div
            v-if="savingDraft"
            class="eval-page__autosave"
            aria-live="polite"
          >
            Sauvegarde automatique…
          </div>
        </div>

        <div
          v-if="candidat && offre"
          class="eval-page__candidat"
        >
          <Avatar class="h-10 w-10">
            <AvatarImage
              :src="candidat.photoUrl ?? ''"
              :alt="`${candidat.prenom} ${candidat.nom}`"
            />
            <AvatarFallback>
              {{ candidat.prenom.charAt(0) }}{{ candidat.nom.charAt(0) }}
            </AvatarFallback>
          </Avatar>
          <div class="eval-page__candidat-info">
            <div class="eval-page__candidat-name">
              {{ candidat.prenom }} {{ candidat.nom }}
            </div>
            <div class="eval-page__candidat-offre">
              {{ offre.titre }}
            </div>
          </div>
        </div>

        <div
          v-if="entretien"
          class="eval-page__details"
        >
          <div class="eval-page__detail">
            <span class="eval-page__detail-label">Date</span>
            <span>{{ formatDate(entretien.date) }}</span>
          </div>
          <div class="eval-page__detail">
            <span class="eval-page__detail-label">Durée</span>
            <span>{{ entretien.duree }} min</span>
          </div>
          <div
            v-if="intervieweursDisplay.length > 0"
            class="eval-page__detail"
          >
            <span class="eval-page__detail-label">Intervieweurs</span>
            <div class="eval-page__intervieweurs">
              <div
                v-for="int in intervieweursDisplay"
                :key="int!.id"
                class="eval-page__intervieweur"
              >
                <Avatar class="h-6 w-6">
                  <AvatarImage
                    :src="int!.avatarUrl ?? ''"
                    :alt="`${int!.prenom} ${int!.nom}`"
                  />
                  <AvatarFallback class="text-xs">
                    {{ int!.prenom.charAt(0) }}{{ int!.nom.charAt(0) }}
                  </AvatarFallback>
                </Avatar>
                <span>{{ int!.prenom }} {{ int!.nom }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="eval-page__form-area">
        <EvaluationForm
          v-model:notations="notations"
          v-model:recommandation="recommandation"
          v-model:commentaire-global="commentaireGlobal"
          :criteres="criteres"
          :disabled="submitted || submitting"
        />
      </div>

      <!-- Footer fixe -->
      <div
        class="eval-page__footer"
        role="contentinfo"
        aria-label="Actions du formulaire"
      >
        <div class="eval-page__footer-left">
          <span class="eval-page__progress">
            {{ notedCount }} / {{ criteres.length }} critère{{ criteres.length > 1 ? 's' : '' }} noté{{ notedCount > 1 ? 's' : '' }}
          </span>
          <span
            v-if="!recommandation"
            class="eval-page__progress eval-page__progress--warn"
          >
            · Recommandation requise
          </span>
        </div>

        <div class="eval-page__footer-actions">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            :disabled="submitting || submitted || notations.length === 0"
            @click="onSaveDraft"
          >
            Sauvegarder le brouillon
          </Button>

          <Button
            type="button"
            variant="primary"
            :disabled="!isValid || submitting || submitted"
            @click="submitEvaluation"
          >
            {{ submitted ? 'Soumis ✓' : submitting ? 'Soumission…' : 'Soumettre l\'évaluation' }}
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.eval-page {
  padding-bottom: 96px; /* space for sticky footer */
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-6);
}

.eval-page__loading {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.eval-page__error {
  padding: var(--csplab-space-6);
  text-align: center;
  color: var(--text-default-error);
}

.eval-page__header-card {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-lg);
  padding: var(--csplab-space-4);
  background: var(--background-alt-grey);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.eval-page__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.eval-page__header-meta {
  display: flex;
  gap: var(--csplab-space-2);
}

.eval-page__autosave {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  font-style: italic;
}

.eval-page__candidat {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}

.eval-page__candidat-name {
  font-weight: 700;
  font-size: var(--csplab-font-size-lg);
}

.eval-page__candidat-offre {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.eval-page__details {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
  border-top: 1px solid var(--border-default-grey);
  padding-top: var(--csplab-space-3);
}

.eval-page__detail {
  display: grid;
  grid-template-columns: 120px 1fr;
  font-size: var(--csplab-font-size-sm);
  gap: var(--csplab-space-2);
  align-items: start;
}

.eval-page__detail-label {
  font-weight: 600;
  color: var(--text-mention-grey);
}

.eval-page__intervieweurs {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.eval-page__intervieweur {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.eval-page__form-area {
  flex: 1;
}

.eval-page__footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--csplab-space-3) var(--csplab-space-6);
  background: var(--background-default-grey);
  border-top: 1px solid var(--border-default-grey);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.eval-page__footer-left {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.eval-page__progress--warn {
  color: var(--text-default-warning);
}

.eval-page__footer-actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}
</style>
