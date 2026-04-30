<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight,
  MessageSquare,
  Calendar,
  ClipboardCheck,
  Mail,
  Tag,
} from 'lucide-vue-next'
import type { EvenementTimeline } from '@/types/domain'
import { seed } from '@/data/seed'

const props = defineProps<{
  evenements: EvenementTimeline[]
}>()

const auteurById = new Map([
  ...seed.intervieweurs.map(i => [i.id, `${i.prenom} ${i.nom}`] as const),
  ['user-1', 'Vous'],
])

type Config = {
  label: (e: EvenementTimeline) => string
  color: string
  icon: unknown
}

const etapesById = new Map(seed.etapes.map(e => [e.id, e.libelle]))

const configs: Record<EvenementTimeline['type'], Config> = {
  'changement-etape': {
    label: (e) => {
      const to = etapesById.get(e.donnees.etapeId as string) ?? 'une étape'
      const from = etapesById.get(e.donnees.ancienneEtapeId as string)
      return from ? `Passage de ${from} → ${to}` : `Déplacé vers ${to}`
    },
    color: 'timeline-item--blue',
    icon: ArrowRight,
  },
  'note': {
    label: () => 'Note ajoutée',
    color: 'timeline-item--grey',
    icon: MessageSquare,
  },
  'entretien-planifie': {
    label: (e) => {
      const types: Record<string, string> = { rh: 'RH', technique: 'technique', manager: 'manager', jury: 'jury' }
      return `Entretien ${types[e.donnees.type as string] ?? ''} planifié`
    },
    color: 'timeline-item--orange',
    icon: Calendar,
  },
  'evaluation-soumise': {
    label: (e) => {
      const rec: Record<string, string> = { oui: 'Favorable', mitige: 'Mitigé', non: 'Défavorable' }
      return `Évaluation soumise — ${rec[e.donnees.recommandation as string] ?? ''}`
    },
    color: 'timeline-item--green',
    icon: ClipboardCheck,
  },
  'email-envoye': {
    label: () => 'Email envoyé',
    color: 'timeline-item--grey',
    icon: Mail,
  },
  'tag-ajoute': {
    label: (e) => `Tag ajouté : ${e.donnees.tag as string}`,
    color: 'timeline-item--grey',
    icon: Tag,
  },
}

const items = computed(() =>
  [...props.evenements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(e => ({
      ...e,
      config: configs[e.type],
      auteur: auteurById.get(e.auteurId) ?? 'Système',
      dateDisplay: new Date(e.date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
    })),
)
</script>

<template>
  <ol
    class="candidate-timeline"
    aria-label="Historique d'activité"
  >
    <li
      v-if="items.length === 0"
      class="candidate-timeline__empty"
    >
      Aucune activité enregistrée.
    </li>

    <li
      v-for="item in items"
      :key="item.id"
      class="candidate-timeline__item timeline-item"
      :class="item.config.color"
    >
      <div
        class="timeline-item__icon"
        aria-hidden="true"
      >
        <component
          :is="item.config.icon"
          class="h-3 w-3"
        />
      </div>

      <div class="timeline-item__body">
        <div class="timeline-item__label">
          {{ item.config.label(item) }}
        </div>
        <div class="timeline-item__meta">
          <span>{{ item.auteur }}</span>
          <span aria-hidden="true">·</span>
          <time :datetime="item.date">{{ item.dateDisplay }}</time>
        </div>
        <div
          v-if="item.type === 'note' && item.donnees.contenu"
          class="timeline-item__note"
        >
          {{ item.donnees.contenu as string }}
        </div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.candidate-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.candidate-timeline__empty {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
  text-align: center;
  padding: var(--csplab-space-6);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: var(--csplab-space-2);
  padding: var(--csplab-space-3) 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-default-grey);
}

.timeline-item:first-child::before {
  top: 50%;
}

.timeline-item:last-child::before {
  bottom: 50%;
}

.timeline-item:first-child:last-child::before {
  display: none;
}

.timeline-item__icon {
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  z-index: 1;
  border: 2px solid var(--background-default-grey);
}

.timeline-item--blue .timeline-item__icon {
  background: var(--background-action-high-blue-france);
  color: white;
}

.timeline-item--green .timeline-item__icon {
  background: var(--text-default-success);
  color: white;
}

.timeline-item--orange .timeline-item__icon {
  background: var(--text-default-warning);
  color: white;
}

.timeline-item--grey .timeline-item__icon {
  background: var(--background-contrast-grey);
  color: var(--text-mention-grey);
}

.timeline-item__body {
  padding-top: 4px;
  min-width: 0;
}

.timeline-item__label {
  font-size: var(--csplab-font-size-sm);
  font-weight: 500;
  color: var(--text-default-grey);
}

.timeline-item__meta {
  display: flex;
  gap: var(--csplab-space-1);
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  margin-top: 2px;
}

.timeline-item__note {
  margin-top: var(--csplab-space-1);
  font-size: var(--csplab-font-size-sm);
  color: var(--text-default-grey);
  background: var(--background-alt-grey);
  border-left: 3px solid var(--border-default-grey);
  padding: var(--csplab-space-2) var(--csplab-space-3);
  border-radius: 0 var(--csplab-radius-sm) var(--csplab-radius-sm) 0;
  white-space: pre-wrap;
}
</style>
