<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Entretien, Evaluation } from '@/types/domain'
import { EmptyState } from '@/components/ui/empty-state'
import { seed } from '@/data/seed'

const props = defineProps<{
  entretiens: Entretien[]
  evaluations: Evaluation[]
}>()

const intervieweursById = new Map(seed.intervieweurs.map(i => [i.id, i]))
const criteresById = new Map(
  seed.modelesEvaluation.flatMap(m => m.criteres).map(c => [c.id, c]),
)

const recLabel: Record<Evaluation['recommandation'], string> = {
  oui: 'Favorable',
  mitige: 'Mitigé',
  non: 'Défavorable',
}

const recVariant: Record<Evaluation['recommandation'], 'status-active' | 'status-pending' | 'status-rejected'> = {
  oui: 'status-active',
  mitige: 'status-pending',
  non: 'status-rejected',
}

const valeurLabel = ['', 'Fort non', 'Non', 'Oui', 'Fort oui']

type EvaluationRow = {
  evaluation: Evaluation
  entretien: Entretien
  intervieweurLabel: string
  intervieweurAvatar: string | undefined
}

const rows = computed<EvaluationRow[]>(() =>
  props.evaluations.map(ev => {
    const entretien = props.entretiens.find(e => e.id === ev.entretienId)!
    const intervieweur = intervieweursById.get(ev.intervieweurId)
    return {
      evaluation: ev,
      entretien,
      intervieweurLabel: intervieweur ? `${intervieweur.prenom} ${intervieweur.nom}` : ev.intervieweurId,
      intervieweurAvatar: intervieweur?.avatarUrl,
    }
  }),
)

const scoreAggrege = computed(() => {
  if (props.evaluations.length === 0) return null
  const total = props.evaluations.reduce((sum, ev) => {
    const avg = ev.notations.reduce((s, n) => s + n.valeur, 0) / Math.max(1, ev.notations.length)
    return sum + avg
  }, 0)
  return (total / props.evaluations.length).toFixed(1)
})
</script>

<template>
  <div class="eval-aggregate">
    <EmptyState
      v-if="rows.length === 0"
      icon="ri:check-double-line"
      title="Aucune évaluation soumise"
      size="sm"
    />

    <template v-else>
      <div
        v-if="scoreAggrege"
        class="eval-aggregate__summary"
      >
        <span class="eval-aggregate__score">★ {{ scoreAggrege }} / 4</span>
        <span class="eval-aggregate__count">{{ rows.length }} évaluation{{ rows.length > 1 ? 's' : '' }}</span>
      </div>

      <div class="eval-aggregate__list">
        <div
          v-for="row in rows"
          :key="row.evaluation.id"
          class="eval-card"
        >
          <div class="eval-card__header">
            <div class="eval-card__interviewer">
              <Avatar class="h-6 w-6">
                <AvatarImage
                  :src="row.intervieweurAvatar ?? ''"
                  :alt="row.intervieweurLabel"
                />
                <AvatarFallback class="text-xs">
                  {{ row.intervieweurLabel.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <span class="eval-card__name">{{ row.intervieweurLabel }}</span>
            </div>
            <Badge :variant="recVariant[row.evaluation.recommandation]">
              {{ recLabel[row.evaluation.recommandation] }}
            </Badge>
          </div>

          <div
            v-if="row.evaluation.notations.length > 0"
            class="eval-card__criteria"
          >
            <div
              v-for="notation in row.evaluation.notations"
              :key="notation.critereId"
              class="eval-card__criterion"
            >
              <span class="eval-card__criterion-label">
                {{ criteresById.get(notation.critereId)?.libelle ?? notation.critereId }}
              </span>
              <span class="eval-card__criterion-value">
                {{ valeurLabel[notation.valeur] }}
              </span>
            </div>
          </div>

          <div
            v-if="row.evaluation.commentaireGlobal"
            class="eval-card__comment"
          >
            {{ row.evaluation.commentaireGlobal }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.eval-aggregate__summary {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-3);
  padding: var(--csplab-space-3) 0;
  border-bottom: 1px solid var(--border-default-grey);
  margin-bottom: var(--csplab-space-4);
}

.eval-aggregate__score {
  font-size: var(--csplab-font-size-xl);
  font-weight: 700;
  color: var(--text-title-grey);
}

.eval-aggregate__count {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-mention-grey);
}

.eval-aggregate__list {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.eval-card {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  padding: var(--csplab-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.eval-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eval-card__interviewer {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-2);
}

.eval-card__name {
  font-weight: 500;
  font-size: var(--csplab-font-size-sm);
}

.eval-card__criteria {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.eval-card__criterion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--csplab-font-size-sm);
}

.eval-card__criterion-label {
  color: var(--text-default-grey);
}

.eval-card__criterion-value {
  font-weight: 500;
  color: var(--text-mention-grey);
}

.eval-card__comment {
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  background: var(--background-alt-grey);
  border-radius: var(--csplab-radius-sm);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  font-style: italic;
}
</style>
