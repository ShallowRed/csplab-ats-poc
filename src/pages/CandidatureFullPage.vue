<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import CandidateTimeline from '@/components/candidate/CandidateTimeline.vue'
import NoteEditor from '@/components/candidate/NoteEditor.vue'
import EvaluationsAggregate from '@/components/candidate/EvaluationsAggregate.vue'
import { mockApi } from '@/lib/mockApi'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useToastStore } from '@/stores/toast'
import { usePageHeader } from '@/stores/pageHeader'
import { seed } from '@/data/seed'
import type { Candidat, Candidature, Entretien, Etape, EvenementTimeline, Evaluation, Offre } from '@/types/domain'

const props = defineProps<{ id: string }>()

const router = useRouter()
const candidaturesStore = useCandidaturesStore()
const toast = useToastStore()
const pageHeader = usePageHeader()

type PageData = {
  candidature: Candidature
  candidat: Candidat
  offre: Offre
  etape: Etape
  evenements: EvenementTimeline[]
  entretiens: Entretien[]
  evaluations: Evaluation[]
}

const data = ref<PageData | null>(null)
const loading = ref(false)
const noteContent = ref('')
const savingNote = ref(false)

const etapesVisibles = computed(() => seed.etapes.filter(e => !e.estTerminale))

const scoreAggrege = computed(() => {
  if (!data.value || data.value.evaluations.length === 0) return null
  const total = data.value.evaluations.reduce((sum, ev) => {
    const avg = ev.notations.reduce((s, n) => s + n.valeur, 0) / Math.max(1, ev.notations.length)
    return sum + avg
  }, 0)
  return (total / data.value.evaluations.length).toFixed(1)
})

async function load(): Promise<void> {
  loading.value = true
  data.value = null
  try {
    data.value = await mockApi.getCandidature(props.id)
    const nom = `${data.value.candidat.prenom} ${data.value.candidat.nom}`
    pageHeader.setTitle(nom)
    pageHeader.setBreadcrumb([
      { label: 'Candidatures' },
      { label: 'Toutes les candidatures', to: '/candidatures' },
      { label: nom },
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

async function changerEtape(etapeId: string): Promise<void> {
  if (!data.value) return
  const ok = await candidaturesStore.changerEtape(data.value.candidature.id, etapeId, undefined, { toast: true })
  if (ok && data.value) {
    const newEtape = seed.etapes.find(e => e.id === etapeId)
    if (newEtape) {
      data.value = { ...data.value, etape: newEtape, candidature: { ...data.value.candidature, etapeId } }
    }
  }
}

async function submitNote(): Promise<void> {
  if (!noteContent.value.trim() || !data.value) return
  savingNote.value = true
  try {
    const evt = await mockApi.ajouterNote(data.value.candidature.id, noteContent.value, 'user-1')
    data.value.evenements = [...data.value.evenements, evt]
    noteContent.value = ''
    toast.success('Note enregistrée')
  } finally {
    savingNote.value = false
  }
}
</script>

<template>
  <div class="cfp">
    <!-- ── Hero header ─────────────────────────────────── -->
    <header class="cfp__hero">
      <Button
        type="button"
        variant="tertiary"
        size="sm"
        class="cfp__back"
        @click="router.back()"
      >
        <RiIcon
          name="ri:arrow-left-line"
          :size="16"
        />
        Retour
      </Button>

      <div
        v-if="loading"
        class="cfp__hero-skeleton"
      >
        <Skeleton class="h-16 w-16 rounded-full" />
        <div class="cfp__hero-skeleton-text">
          <Skeleton class="h-6 w-48" />
          <Skeleton class="h-4 w-36 mt-1" />
        </div>
      </div>

      <template v-else-if="data">
        <div class="cfp__hero-identity">
          <Avatar class="cfp__avatar">
            <AvatarImage
              :src="data.candidat.photoUrl ?? ''"
              :alt="`${data.candidat.prenom} ${data.candidat.nom}`"
            />
            <AvatarFallback class="cfp__avatar-fallback">
              {{ data.candidat.prenom.charAt(0) }}{{ data.candidat.nom.charAt(0) }}
            </AvatarFallback>
          </Avatar>

          <div class="cfp__hero-info">
            <h1 class="cfp__name">
              {{ data.candidat.prenom }} {{ data.candidat.nom }}
            </h1>
            <p class="cfp__offre">
              {{ data.offre.titre }}
              <span class="cfp__offre-meta">· {{ data.offre.service }}</span>
            </p>
          </div>
        </div>

        <div class="cfp__hero-actions">
          <!-- Stage dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                type="button"
                variant="secondary"
                size="sm"
              >
                <span
                  class="cfp__etape-dot"
                  :style="{ background: `var(--${data.etape.couleur})` }"
                  aria-hidden="true"
                />
                {{ data.etape.libelle }}
                <RiIcon
                  name="ri:arrow-down-s-line"
                  :size="12"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                v-for="etape in etapesVisibles"
                :key="etape.id"
                :aria-current="etape.id === data.etape.id ? 'true' : undefined"
                @click="changerEtape(etape.id)"
              >
                <span
                  class="cfp__etape-dot"
                  :style="{ background: `var(--${etape.couleur})` }"
                  aria-hidden="true"
                />
                {{ etape.libelle }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="primary"
            size="sm"
            @click="router.push(`/entretiens/nouveau?candidatureId=${data.candidature.id}`)"
          >
            <RiIcon
              name="ri:calendar-line"
              :size="14"
            />
            Planifier un entretien
          </Button>
        </div>
      </template>
    </header>

    <!-- ── Body: 2 colonnes ───────────────────────────── -->
    <div class="cfp__body">
      <!-- Sidebar profil -->
      <aside class="cfp__sidebar">
        <div
          v-if="loading"
          class="cfp__sidebar-skeleton"
        >
          <Skeleton
            v-for="i in 5"
            :key="i"
            class="h-6 w-full"
          />
        </div>

        <template v-else-if="data">
          <section class="cfp__section">
            <h2 class="cfp__section-title">
              Contact
            </h2>
            <div class="cfp__field">
              <span class="cfp__field-label">Email</span>
              <a
                :href="`mailto:${data.candidat.email}`"
                class="cfp__field-link"
              >{{ data.candidat.email }}</a>
            </div>
            <div
              v-if="data.candidat.telephone"
              class="cfp__field"
            >
              <span class="cfp__field-label">Téléphone</span>
              <span class="cfp__field-value">{{ data.candidat.telephone }}</span>
            </div>
          </section>

          <section class="cfp__section">
            <h2 class="cfp__section-title">
              Candidature
            </h2>
            <div class="cfp__field">
              <span class="cfp__field-label">Candidaté le</span>
              <span class="cfp__field-value">
                {{ new Date(data.candidature.dateCandidat).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) }}
              </span>
            </div>
            <div
              v-if="scoreAggrege"
              class="cfp__field"
            >
              <span class="cfp__field-label">Score agrégé</span>
              <span class="cfp__field-value cfp__score">★ {{ scoreAggrege }} / 4</span>
            </div>
            <div
              v-else-if="data.candidature.score !== undefined"
              class="cfp__field"
            >
              <span class="cfp__field-label">Score</span>
              <span class="cfp__field-value cfp__score">★ {{ data.candidature.score }} / 4</span>
            </div>
            <div
              v-if="data.candidature.estUrgent"
              class="cfp__field"
            >
              <span class="cfp__field-value cfp__urgent">
                <RiIcon
                  name="ri:alarm-warning-line"
                  :size="14"
                />
                Urgent
              </span>
            </div>
          </section>

          <section
            v-if="data.candidature.tags.length > 0"
            class="cfp__section"
          >
            <h2 class="cfp__section-title">
              Tags
            </h2>
            <div class="cfp__tags">
              <Tag
                v-for="tag in data.candidature.tags"
                :key="tag"
                size="sm"
              >
                {{ tag }}
              </Tag>
            </div>
          </section>

          <section class="cfp__section">
            <h2 class="cfp__section-title">
              Offre
            </h2>
            <div class="cfp__field">
              <span class="cfp__field-label">Intitulé</span>
              <span class="cfp__field-value">{{ data.offre.titre }}</span>
            </div>
            <div class="cfp__field">
              <span class="cfp__field-label">Direction</span>
              <span class="cfp__field-value">{{ data.offre.direction }}</span>
            </div>
            <div class="cfp__field">
              <span class="cfp__field-label">Localisation</span>
              <span class="cfp__field-value">{{ data.offre.localisation }}</span>
            </div>
            <div class="cfp__field">
              <span class="cfp__field-label">Contrat</span>
              <span class="cfp__field-value cfp__contrat">{{ data.offre.typeContrat }}</span>
            </div>
          </section>
        </template>
      </aside>

      <!-- Contenu principal : onglets -->
      <main class="cfp__main">
        <div
          v-if="loading"
          class="cfp__main-skeleton"
        >
          <Skeleton class="h-10 w-full" />
          <Skeleton
            v-for="i in 6"
            :key="i"
            class="h-14 w-full"
          />
        </div>

        <Tabs
          v-else-if="data"
          default-value="activite"
          class="cfp__tabs"
        >
          <TabsList
            variant="segment"
            class="cfp__tabs-list"
          >
            <TabsTrigger
              value="activite"
              variant="segment"
            >
              <RiIcon name="ri:time-line" :size="14" aria-hidden="true" />
              Activité
              <Tag
                v-if="data.evenements.length > 0"
                size="sm"
              >
                {{ data.evenements.length }}
              </Tag>
            </TabsTrigger>
            <TabsTrigger
              value="entretiens"
              variant="segment"
            >
              <RiIcon name="ri:calendar-line" :size="14" aria-hidden="true" />
              Entretiens
              <Tag
                v-if="data.entretiens.length > 0"
                size="sm"
              >
                {{ data.entretiens.length }}
              </Tag>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              variant="segment"
            >
              <RiIcon name="ri:file-line" :size="14" aria-hidden="true" />
              Documents
            </TabsTrigger>
          </TabsList>

          <!-- Activité -->
          <TabsContent
            value="activite"
            class="cfp__tab-content"
          >
            <div class="cfp__note-section">
              <NoteEditor
                v-model="noteContent"
                :disabled="savingNote"
              />
              <div class="cfp__note-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  :disabled="!noteContent.trim() || savingNote"
                  @click="submitNote"
                >
                  Enregistrer la note
                </Button>
              </div>
            </div>

            <CandidateTimeline :evenements="data.evenements" />
          </TabsContent>

          <!-- Entretiens -->
          <TabsContent
            value="entretiens"
            class="cfp__tab-content"
          >
            <div
              v-if="data.entretiens.length > 0"
              class="cfp__entretiens-list"
            >
              <div
                v-for="entretien in data.entretiens"
                :key="entretien.id"
                class="cfp__entretien-row"
              >
                <div class="cfp__entretien-info">
                  <span class="cfp__entretien-type">
                    {{ { rh: 'RH', technique: 'Technique', manager: 'Manager', jury: 'Jury' }[entretien.type] }}
                  </span>
                  <span class="cfp__entretien-date">
                    {{ new Date(entretien.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
                  </span>
                  <span
                    class="cfp__entretien-statut"
                    :class="`cfp__entretien-statut--${entretien.statut}`"
                  >
                    {{ { planifie: 'Planifié', realise: 'Réalisé', annule: 'Annulé' }[entretien.statut] }}
                  </span>
                </div>
                <Button
                  v-if="entretien.statut === 'realise' || entretien.statut === 'planifie'"
                  type="button"
                  variant="tertiary"
                  size="sm"
                  @click="router.push(`/entretiens/${entretien.id}/evaluation`)"
                >
                  Évaluer
                </Button>
              </div>
            </div>

            <EvaluationsAggregate
              :entretiens="data.entretiens"
              :evaluations="data.evaluations"
            />
          </TabsContent>

          <!-- Documents -->
          <TabsContent
            value="documents"
            class="cfp__tab-content"
          >
            <EmptyState
              icon="ri:file-line"
              title="Aucun document"
              description="Bientôt disponible"
            />
          </TabsContent>
        </Tabs>

        <!-- Erreur / not found -->
        <EmptyState
          v-else-if="!loading"
          icon="ri:error-warning-line"
          title="Candidature introuvable"
          description="Cette candidature n'existe pas ou a été supprimée."
        >
          <template #actions>
            <Button
              type="button"
              variant="primary"
              @click="router.push('/candidatures')"
            >
              Retour aux candidatures
            </Button>
          </template>
        </EmptyState>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── Conteneur global ───────────────────────────────── */
.cfp {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  max-width: var(--width-content-wide);
  margin-inline: auto;
  width: 100%;
}

/* ── Hero header ─────────────────────────────────────── */
.cfp__hero {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-4);
  padding: var(--csplab-space-4) var(--csplab-space-6);
  border-bottom: 1px solid var(--border-default-grey);
  background: var(--background-default-grey);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.cfp__back {
  flex-shrink: 0;
}

.cfp__hero-identity {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  flex: 1;
  min-width: 0;
}

.cfp__avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.cfp__avatar-fallback {
  font-size: var(--csplab-font-size-base);
  font-weight: 600;
}

.cfp__hero-info {
  min-width: 0;
}

.cfp__name {
  font-size: var(--csplab-font-size-xl);
  font-weight: 700;
  color: var(--text-title-grey);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cfp__offre {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  margin: 2px 0 0;
}

.cfp__offre-meta {
  color: var(--text-mention-grey);
}

.cfp__hero-actions {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  flex-shrink: 0;
}

.cfp__etape-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
  display: inline-block;
}

.cfp__hero-skeleton {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  flex: 1;
}

.cfp__hero-skeleton-text {
  flex: 1;
}

/* ── Body ────────────────────────────────────────────── */
.cfp__body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────────────────── */
.cfp__sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-default-grey);
  overflow-y: auto;
  padding: var(--csplab-space-5) var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-5);
}

.cfp__sidebar-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.cfp__section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.cfp__section-title {
  font-size: var(--csplab-font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-mention-grey);
  margin: 0;
}

.cfp__field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cfp__field-label {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
}

.cfp__field-value {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
}

.cfp__field-link {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-action-high-blue-france);
  text-decoration: underline;
  word-break: break-all;
}

.cfp__score {
  font-weight: 600;
  color: var(--text-default-grey);
}

.cfp__urgent {
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
  font-size: var(--csplab-font-size-sm);
  color: var(--csplab-status-rejected);
  font-weight: 500;
}

.cfp__contrat {
  text-transform: capitalize;
}

.cfp__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-1);
}

/* ── Main tabs ───────────────────────────────────────── */
.cfp__main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.cfp__main-skeleton {
  padding: var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.cfp__tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cfp__tabs-list {
  flex-shrink: 0;
  padding: var(--csplab-space-3) var(--csplab-space-4);
}

.cfp__tab-content {
  flex: 1;
  padding: var(--csplab-space-5) var(--csplab-space-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

/* ── Note section ────────────────────────────────────── */
.cfp__note-section {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  padding: var(--csplab-space-3);
  background: var(--background-alt-grey);
}

.cfp__note-actions {
  display: flex;
  justify-content: flex-end;
}

/* ── Entretiens ──────────────────────────────────────── */
.cfp__entretiens-list {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
  margin-bottom: var(--csplab-space-4);
}

.cfp__entretien-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--csplab-space-3) var(--csplab-space-4);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  background: var(--background-default-grey);
}

.cfp__entretien-info {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
}

.cfp__entretien-type {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  min-width: 72px;
}

.cfp__entretien-date {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.cfp__entretien-statut {
  font-size: var(--csplab-font-size-xs);
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 9999px;
}

.cfp__entretien-statut--planifie {
  background: var(--background-contrast-blue-france);
  color: var(--text-action-high-blue-france);
}

.cfp__entretien-statut--realise {
  background: color-mix(in srgb, var(--csplab-status-active) 12%, transparent);
  color: var(--csplab-status-active);
}

.cfp__entretien-statut--annule {
  background: color-mix(in srgb, var(--csplab-status-rejected) 12%, transparent);
  color: var(--csplab-status-rejected);
}

@media (width <= 768px) {
  .cfp__body {
    flex-direction: column;
    overflow-y: auto;
  }

  .cfp__sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-default-grey);
    overflow-y: visible;
  }

  .cfp__main {
    overflow-y: visible;
    flex: none;
  }
}
</style>
