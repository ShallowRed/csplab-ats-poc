<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import OffreStatusBadge from '@/components/offres/OffreStatusBadge.vue'
import { useOffresStore } from '@/stores/offres'
import { seed } from '@/data/seed'
import type { Etape } from '@/types/domain'

const props = defineProps<{ id: string }>()

const router = useRouter()
const offresStore = useOffresStore()

const intervieweursById = new Map(seed.intervieweurs.map(i => [i.id, i]))
const etapesById = new Map<string, Etape>(seed.etapes.map(e => [e.id, e]))

const offre = computed(() => offresStore.getById(props.id))

const responsable = computed(() => {
  const id = offre.value?.responsableId
  return id ? intervieweursById.get(id) : undefined
})

const intervieweursDefaut = computed(() => {
  const ids = offre.value?.intervieweursDefautIds ?? []
  return ids.map(id => intervieweursById.get(id)).filter((i): i is NonNullable<typeof i> => Boolean(i))
})

const pipeline = computed(() =>
  offre.value ? seed.pipelines.find(p => p.id === offre.value!.pipelineId) : undefined,
)

const etapes = computed<Etape[]>(() => {
  if (!offre.value) return []
  const ids = offre.value.etapesIds ?? pipeline.value?.etapeIds ?? []
  return ids.map(id => etapesById.get(id)).filter((e): e is Etape => Boolean(e))
})

const candidatsParEtape = computed<Map<string, number>>(() => {
  const map = new Map<string, number>()
  if (!offre.value) return map
  seed.candidatures
    .filter(c => c.offreId === offre.value!.id)
    .forEach(c => {
      map.set(c.etapeId, (map.get(c.etapeId) ?? 0) + 1)
    })
  return map
})

const counts = computed(() =>
  offre.value
    ? offresStore.compterCandidaturesParOffre(offre.value.id)
    : { total: 0, aTraiter: 0 },
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function goEdit(): void {
  if (!offre.value) return
  void router.push(`/offres/${offre.value.id}/edition`)
}

function goPipeline(): void {
  if (!offre.value) return
  void router.push(`/pipeline/${offre.value.id}`)
}

function goBack(): void {
  void router.push('/offres')
}
</script>

<template>
  <div class="offre-detail csplab-page-surface">
    <div
      v-if="!offre"
      class="offre-detail__missing"
    >
      <EmptyState
        icon="ri:error-warning-line"
        title="Offre introuvable"
        description="L'offre demandée n'existe pas ou a été supprimée."
        size="md"
      >
        <Button
          type="button"
          variant="primary"
          class="mt-3"
          @click="goBack"
        >
          Retour aux offres
        </Button>
      </EmptyState>
    </div>

    <template v-else>
      <div class="offre-detail__toolbar">
        <div class="offre-detail__heading">
          <h2 class="offre-detail__titre">
            {{ offre.titre }}
          </h2>
          <OffreStatusBadge :statut="offre.statut" />
        </div>
        <div class="offre-detail__actions">
          <Button
            type="button"
            variant="secondary"
            @click="goEdit"
          >
            Modifier
          </Button>
          <Button
            type="button"
            variant="primary"
            @click="goPipeline"
          >
            <RiIcon
              name="ri:layout-column-line"
              :size="16"
            />
            Ouvrir le pipeline
          </Button>
        </div>
      </div>

      <div class="offre-detail__scroll">
        <div class="offre-detail__container csplab-page-content">
          <header class="offre-detail__header">
            <ul class="offre-detail__meta">
              <li>{{ offre.direction }}</li>
              <li class="offre-detail__meta-type">
                {{ offre.typeContrat }}
              </li>
              <li>{{ offre.localisation }}</li>
              <li>Ouverte le {{ formatDate(offre.dateOuverture) }}</li>
              <li
                v-if="offre.dateFermeture"
              >
                Fermée le {{ formatDate(offre.dateFermeture) }}
              </li>
            </ul>

            <div class="offre-detail__counter">
              <div class="offre-detail__counter-text">
                <span class="offre-detail__counter-num">{{ counts.total }}</span>
                <span class="offre-detail__counter-label"> candidatures</span>
                <span class="offre-detail__counter-sep">·</span>
                <span class="offre-detail__counter-num">{{ counts.aTraiter }}</span>
                <span class="offre-detail__counter-label"> à traiter</span>
              </div>
            </div>
          </header>

          <div class="offre-detail__grid">
            <div class="offre-detail__main">
              <Card>
                <CardHeader>
                  <CardTitle>Descriptif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    v-if="offre.descriptif"
                    class="offre-detail__prose"
                  >
                    <p
                      v-for="(paragraph, idx) in offre.descriptif.split(/\n\n+/).filter(Boolean)"
                      :key="idx"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                  <p
                    v-else
                    class="offre-detail__muted"
                  >
                    Aucun descriptif renseigné.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Étapes du pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol
                    v-if="etapes.length > 0"
                    class="offre-detail__steps"
                  >
                    <li
                      v-for="etape in etapes"
                      :key="etape.id"
                      class="offre-detail__step"
                    >
                      <span
                        class="offre-detail__step-dot"
                        :style="{ background: `var(--${etape.couleur})` }"
                        aria-hidden="true"
                      />
                      <span class="offre-detail__step-label">{{ etape.libelle }}</span>
                      <Badge
                        variant="secondary"
                        class="offre-detail__step-count"
                      >
                        {{ candidatsParEtape.get(etape.id) ?? 0 }}
                      </Badge>
                    </li>
                  </ol>
                  <p
                    v-else
                    class="offre-detail__muted"
                  >
                    Aucune étape définie.
                  </p>
                </CardContent>
              </Card>
            </div>

            <aside class="offre-detail__side">
              <section class="offre-detail__block">
                <h3 class="offre-detail__block-title">
                  Critères
                </h3>
                <dl class="offre-detail__dl">
                  <div class="offre-detail__dl-row">
                    <dt>Type de contrat</dt>
                    <dd class="offre-detail__type">
                      {{ offre.typeContrat }}
                    </dd>
                  </div>
                  <div
                    v-if="offre.corps"
                    class="offre-detail__dl-row"
                  >
                    <dt>Corps</dt>
                    <dd>{{ offre.corps }}</dd>
                  </div>
                  <div
                    v-if="offre.grade"
                    class="offre-detail__dl-row"
                  >
                    <dt>Grade</dt>
                    <dd>{{ offre.grade }}</dd>
                  </div>
                  <div class="offre-detail__dl-row">
                    <dt>Lieu</dt>
                    <dd>{{ offre.localisation }}</dd>
                  </div>
                  <div class="offre-detail__dl-row">
                    <dt>Direction</dt>
                    <dd>{{ offre.direction }}</dd>
                  </div>
                </dl>
              </section>

              <section class="offre-detail__block">
                <h3 class="offre-detail__block-title">
                  Responsable
                </h3>
                <div
                  v-if="responsable"
                  class="offre-detail__person"
                >
                  <Avatar class="h-9 w-9">
                    <AvatarImage
                      :src="responsable.avatarUrl ?? ''"
                      :alt="`${responsable.prenom} ${responsable.nom}`"
                    />
                    <AvatarFallback>
                      {{ responsable.prenom.charAt(0) }}{{ responsable.nom.charAt(0) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="offre-detail__person-name">
                      {{ responsable.prenom }} {{ responsable.nom }}
                    </div>
                    <div class="offre-detail__muted">
                      {{ responsable.role === 'manager' ? 'Manager' : responsable.role === 'rh' ? 'RH' : 'Expert' }}
                    </div>
                  </div>
                </div>
                <p
                  v-else
                  class="offre-detail__muted"
                >
                  Aucun responsable assigné.
                </p>
              </section>

              <section class="offre-detail__block">
                <h3 class="offre-detail__block-title">
                  Intervieweurs par défaut
                </h3>
                <ul
                  v-if="intervieweursDefaut.length > 0"
                  class="offre-detail__people"
                >
                  <li
                    v-for="i in intervieweursDefaut"
                    :key="i.id"
                    class="offre-detail__person"
                  >
                    <Avatar class="h-7 w-7">
                      <AvatarImage
                        :src="i.avatarUrl ?? ''"
                        :alt="`${i.prenom} ${i.nom}`"
                      />
                      <AvatarFallback class="text-xs">
                        {{ i.prenom.charAt(0) }}{{ i.nom.charAt(0) }}
                      </AvatarFallback>
                    </Avatar>
                    <span>{{ i.prenom }} {{ i.nom }}</span>
                  </li>
                </ul>
                <p
                  v-else
                  class="offre-detail__muted"
                >
                  Aucun intervieweur par défaut.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.offre-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.offre-detail__missing {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.offre-detail__toolbar {
  flex: 0 0 auto;
  padding: var(--csplab-space-4);
  border-bottom: 1px solid var(--border-default-grey);
  background: var(--background-default-grey);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--csplab-space-4);
}

.offre-detail__heading {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  min-width: 0;
}

.offre-detail__titre {
  font-size: var(--csplab-font-size-lg);
  font-weight: 600;
  color: var(--text-title-grey);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offre-detail__actions {
  display: flex;
  gap: var(--csplab-space-2);
}

.offre-detail__scroll {
  flex: 1;
  overflow: auto;
}

.offre-detail__container {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-6);
}

.offre-detail__header {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.offre-detail__meta {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2) var(--csplab-space-3);
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.offre-detail__meta li {
  display: inline-flex;
  align-items: center;
}

.offre-detail__meta li + li::before {
  content: '·';
  margin-right: var(--csplab-space-3);
  color: var(--border-default-grey);
}

.offre-detail__meta-type {
  text-transform: capitalize;
}

.offre-detail__counter {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--csplab-space-3) var(--csplab-space-4);
}

.offre-detail__counter-text {
  font-size: var(--csplab-font-size-lg);
  color: var(--text-default-grey);
}

.offre-detail__counter-num {
  font-weight: 700;
  color: var(--text-title-grey);
}

.offre-detail__counter-label {
  color: var(--text-mention-grey);
  font-weight: 400;
}

.offre-detail__counter-sep {
  margin: 0 var(--csplab-space-2);
  color: var(--border-default-grey);
}

.offre-detail__counter-link {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--csplab-font-size-sm);
  color: var(--text-action-high-blue-france);
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.offre-detail__counter-link:hover {
  text-decoration: underline;
}

.offre-detail__grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: var(--csplab-space-6);
  align-items: start;
}

.offre-detail__main,
.offre-detail__side {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-6);
}

.offre-detail__block {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.offre-detail__block-title {
  margin: 0;
  font-size: var(--csplab-font-size-sm);
  font-weight: 600;
  color: var(--text-mention-grey);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding-bottom: var(--csplab-space-2);
  border-bottom: 1px solid var(--border-default-grey);
}

.offre-detail__prose p {
  margin: 0 0 var(--csplab-space-2);
  line-height: 1.6;
  color: var(--text-default-grey);
}

.offre-detail__prose p:last-child {
  margin-bottom: 0;
}

.offre-detail__muted {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
  margin: 0;
}

.offre-detail__type {
  text-transform: capitalize;
}

.offre-detail__dl {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
  margin: 0;
}

.offre-detail__dl-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
}

.offre-detail__dl-row dt {
  color: var(--text-mention-grey);
  margin: 0;
}

.offre-detail__dl-row dd {
  margin: 0;
  color: var(--text-default-grey);
}

.offre-detail__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.offre-detail__step {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  background: var(--background-alt-grey);
}

.offre-detail__step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.offre-detail__step-label {
  color: var(--text-default-grey);
  flex: 1;
}

.offre-detail__step-count {
  flex-shrink: 0;
}

.offre-detail__people {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.offre-detail__person {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
  font-size: var(--csplab-font-size-sm);
}

.offre-detail__person-name {
  font-weight: 500;
  color: var(--text-default-grey);
}

@media (max-width: 900px) {
  .offre-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
