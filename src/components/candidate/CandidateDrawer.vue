<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  X, Maximize2, ChevronLeft, ChevronRight, ExternalLink,
  ChevronDown,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CandidateTimeline from './CandidateTimeline.vue'
import NoteEditor from './NoteEditor.vue'
import EvaluationsAggregate from './EvaluationsAggregate.vue'
import { useDrawerStore } from '@/stores/drawer'
import { useCandidaturesStore } from '@/stores/candidatures'
import { useToastStore } from '@/stores/toast'
import { mockApi } from '@/lib/mockApi'
import { seed } from '@/data/seed'
import type { Candidat, Candidature, Entretien, Etape, EvenementTimeline, Evaluation, Offre } from '@/types/domain'

const props = defineProps<{
  orderedIds: string[]
}>()

const drawer = useDrawerStore()
const candidaturesStore = useCandidaturesStore()
const toast = useToastStore()
const router = useRouter()

type DrawerData = {
  candidature: Candidature
  candidat: Candidat
  offre: Offre
  etape: Etape
  evenements: EvenementTimeline[]
  entretiens: Entretien[]
  evaluations: Evaluation[]
}

const data = ref<DrawerData | null>(null)
const loading = ref(false)
const noteContent = ref('')
const savingNote = ref(false)

const etapesVisibles = computed(() => seed.etapes.filter(e => !e.estTerminale))

async function load(id: string): Promise<void> {
  loading.value = true
  data.value = null
  try {
    data.value = await mockApi.getCandidature(id)
    noteContent.value = ''
  } finally {
    loading.value = false
  }
}

watch(() => drawer.candidatureIdOuvert, (id) => {
  if (id) load(id)
})

onMounted(() => {
  if (drawer.candidatureIdOuvert) load(drawer.candidatureIdOuvert)
})

const isOpen = computed(() => drawer.candidatureIdOuvert !== null)

const currentIndex = computed(() =>
  drawer.candidatureIdOuvert ? props.orderedIds.indexOf(drawer.candidatureIdOuvert) : -1,
)
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.orderedIds.length - 1)

function prev(): void {
  drawer.naviguerPrecedent(props.orderedIds)
}

function next(): void {
  drawer.naviguerSuivant(props.orderedIds)
}

function goFullPage(): void {
  if (data.value) {
    router.push(`/candidatures/${data.value.candidature.id}`)
    drawer.fermer()
  }
}

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

// Keyboard navigation: J/K when editor not focused
function onKeydown(event: KeyboardEvent): void {
  const tag = (event.target as HTMLElement | null)?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || (event.target as HTMLElement | null)?.isContentEditable) return

  if (event.key === 'j' || event.key === 'J') {
    event.preventDefault()
    next()
  } else if (event.key === 'k' || event.key === 'K') {
    event.preventDefault()
    prev()
  } else if (event.key === 'Escape') {
    drawer.fermer()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

// Focus trap
const drawerEl = ref<HTMLElement | null>(null)

watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      drawerEl.value?.querySelector<HTMLElement>('[autofocus], button, [tabindex="0"]')?.focus()
    }, 250)
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="drawer-overlay"
      aria-hidden="true"
      @click="drawer.fermer()"
    />

    <aside
      v-if="isOpen"
      ref="drawerEl"
      class="candidate-drawer"
      :class="drawer.pleinEcran && 'candidate-drawer--fullscreen'"
      role="complementary"
      :aria-label="data ? `Fiche de ${data.candidat.prenom} ${data.candidat.nom}` : 'Chargement…'"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="candidate-drawer__header">
        <div
          v-if="loading || !data"
          class="candidate-drawer__header-skeleton"
        >
          <Skeleton class="h-10 w-10 rounded-full" />
          <div class="flex-1 space-y-1">
            <Skeleton class="h-4 w-32" />
            <Skeleton class="h-3 w-24" />
          </div>
        </div>

        <template v-else>
          <Avatar class="h-10 w-10 flex-shrink-0">
            <AvatarImage
              :src="data.candidat.photoUrl ?? ''"
              :alt="`${data.candidat.prenom} ${data.candidat.nom}`"
            />
            <AvatarFallback>
              {{ data.candidat.prenom.charAt(0) }}{{ data.candidat.nom.charAt(0) }}
            </AvatarFallback>
          </Avatar>

          <div class="candidate-drawer__header-info">
            <div class="candidate-drawer__name">
              {{ data.candidat.prenom }} {{ data.candidat.nom }}
            </div>
            <div class="candidate-drawer__offre">
              {{ data.offre.titre }}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                class="candidate-drawer__etape-btn"
              >
                <span
                  class="candidate-drawer__etape-dot"
                  :style="{ background: `var(--${data.etape.couleur})` }"
                  aria-hidden="true"
                />
                {{ data.etape.libelle }}
                <ChevronDown
                  class="h-3 w-3 ml-1"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                v-for="etape in etapesVisibles"
                :key="etape.id"
                :aria-current="etape.id === data.etape.id ? 'true' : undefined"
                @click="changerEtape(etape.id)"
              >
                {{ etape.libelle }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>

        <div class="candidate-drawer__header-actions">
          <Button
            type="button"
            variant="tertiary-no-outline"
            size="icon"
            class="h-8 w-8"
            aria-label="Ouvrir en plein écran"
            @click="goFullPage"
          >
            <ExternalLink
              class="h-4 w-4"
              aria-hidden="true"
            />
          </Button>
          <Button
            type="button"
            variant="tertiary-no-outline"
            size="icon"
            class="h-8 w-8"
            :aria-label="drawer.pleinEcran ? 'Réduire' : 'Agrandir'"
            @click="drawer.togglePleinEcran()"
          >
            <Maximize2
              class="h-4 w-4"
              aria-hidden="true"
            />
          </Button>
          <Button
            type="button"
            variant="tertiary-no-outline"
            size="icon"
            class="h-8 w-8"
            aria-label="Fermer la fiche"
            autofocus
            @click="drawer.fermer()"
          >
            <X
              class="h-4 w-4"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>

      <!-- Body -->
      <div class="candidate-drawer__body">
        <div
          v-if="loading"
          class="candidate-drawer__loading"
        >
          <Skeleton
            v-for="i in 4"
            :key="i"
            class="h-8 w-full"
          />
        </div>

        <Tabs
          v-else-if="data"
          :model-value="drawer.ongletActif"
          class="candidate-drawer__tabs"
          @update:model-value="drawer.setOnglet($event as 'profil' | 'activite' | 'entretiens' | 'documents')"
        >
          <TabsList class="candidate-drawer__tabs-list">
            <TabsTrigger value="profil">
              Profil
            </TabsTrigger>
            <TabsTrigger value="activite">
              Activité
              <Badge
                v-if="data.evenements.length > 0"
                variant="secondary"
                class="ml-1"
              >
                {{ data.evenements.length }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="entretiens">
              Entretiens
              <Badge
                v-if="data.entretiens.length > 0"
                variant="secondary"
                class="ml-1"
              >
                {{ data.entretiens.length }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documents
            </TabsTrigger>
          </TabsList>

          <!-- Profil -->
          <TabsContent
            value="profil"
            class="candidate-drawer__tab-content"
          >
            <div class="candidate-drawer__profil">
              <div class="candidate-drawer__field">
                <span class="candidate-drawer__field-label">Email</span>
                <a
                  :href="`mailto:${data.candidat.email}`"
                  class="candidate-drawer__field-value"
                >{{ data.candidat.email }}</a>
              </div>
              <div
                v-if="data.candidat.telephone"
                class="candidate-drawer__field"
              >
                <span class="candidate-drawer__field-label">Téléphone</span>
                <span class="candidate-drawer__field-value">{{ data.candidat.telephone }}</span>
              </div>
              <div class="candidate-drawer__field">
                <span class="candidate-drawer__field-label">Candidaté le</span>
                <span class="candidate-drawer__field-value">
                  {{ new Date(data.candidature.dateCandidat).toLocaleDateString('fr-FR') }}
                </span>
              </div>
              <div
                v-if="data.candidature.score !== undefined"
                class="candidate-drawer__field"
              >
                <span class="candidate-drawer__field-label">Score</span>
                <span class="candidate-drawer__field-value">★ {{ data.candidature.score }} / 4</span>
              </div>
              <div
                v-if="data.candidature.tags.length > 0"
                class="candidate-drawer__field"
              >
                <span class="candidate-drawer__field-label">Tags</span>
                <div class="candidate-drawer__tags">
                  <Badge
                    v-for="tag in data.candidature.tags"
                    :key="tag"
                    variant="secondary"
                  >
                    {{ tag }}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Activité -->
          <TabsContent
            value="activite"
            class="candidate-drawer__tab-content"
          >
            <div class="candidate-drawer__note-section">
              <NoteEditor
                v-model="noteContent"
                :disabled="savingNote"
              />
              <div class="candidate-drawer__note-actions">
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
            class="candidate-drawer__tab-content"
          >
            <EvaluationsAggregate
              :entretiens="data.entretiens"
              :evaluations="data.evaluations"
            />
          </TabsContent>

          <!-- Documents -->
          <TabsContent
            value="documents"
            class="candidate-drawer__tab-content"
          >
            <div class="candidate-drawer__empty">
              Aucun document — fonctionnalité phase 2.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <!-- Footer prev/next -->
      <div class="candidate-drawer__footer">
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          :disabled="!hasPrev"
          aria-label="Candidature précédente (K)"
          @click="prev"
        >
          <ChevronLeft
            class="h-4 w-4"
            aria-hidden="true"
          />
          Précédent
        </Button>

        <span
          v-if="currentIndex >= 0"
          class="candidate-drawer__position"
        >
          {{ currentIndex + 1 }} / {{ orderedIds.length }}
        </span>

        <Button
          type="button"
          variant="tertiary"
          size="sm"
          :disabled="!hasNext"
          aria-label="Candidature suivante (J)"
          @click="next"
        >
          Suivant
          <ChevronRight
            class="h-4 w-4"
            aria-hidden="true"
          />
        </Button>
      </div>
    </aside>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 40;
}

.candidate-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 520px;
  max-width: 100vw;
  z-index: 50;
  background: var(--background-default-grey);
  border-left: 1px solid var(--border-default-grey);
  display: flex;
  flex-direction: column;
  animation: drawer-slide-in 250ms ease;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
}

.candidate-drawer--fullscreen {
  width: 100vw;
  border-left: none;
}

@keyframes drawer-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.candidate-drawer__header {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-4);
  border-bottom: 1px solid var(--border-default-grey);
  flex-shrink: 0;
}

.candidate-drawer__header-skeleton {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  flex: 1;
}

.candidate-drawer__header-info {
  flex: 1;
  min-width: 0;
}

.candidate-drawer__name {
  font-weight: 600;
  font-size: var(--csplab-font-size-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-drawer__offre {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-drawer__etape-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.candidate-drawer__etape-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  flex-shrink: 0;
}

.candidate-drawer__header-actions {
  display: flex;
  gap: var(--csplab-space-1);
  flex-shrink: 0;
}

.candidate-drawer__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.candidate-drawer__loading {
  padding: var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.candidate-drawer__tabs {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.candidate-drawer__tabs-list {
  flex-shrink: 0;
  margin: 0 var(--csplab-space-4);
  margin-top: var(--csplab-space-2);
}

.candidate-drawer__tab-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--csplab-space-4);
}

.candidate-drawer__profil {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.candidate-drawer__field {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--csplab-space-2);
  align-items: start;
}

.candidate-drawer__field-label {
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-mention-grey);
}

.candidate-drawer__field-value {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  word-break: break-all;
}

a.candidate-drawer__field-value {
  color: var(--text-action-high-blue-france);
}

.candidate-drawer__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-1);
}

.candidate-drawer__note-section {
  margin-bottom: var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.candidate-drawer__note-actions {
  display: flex;
  justify-content: flex-end;
}

.candidate-drawer__empty {
  text-align: center;
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
  padding: var(--csplab-space-8);
}

.candidate-drawer__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--csplab-space-3) var(--csplab-space-4);
  border-top: 1px solid var(--border-default-grey);
  flex-shrink: 0;
}

.candidate-drawer__position {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

@media (prefers-reduced-motion: reduce) {
  .candidate-drawer {
    animation: none;
  }
}
</style>
