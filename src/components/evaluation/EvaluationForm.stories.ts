import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import EvaluationForm from '@/components/evaluation/EvaluationForm.vue'
import { seed } from '@/data/seed'

const modele = seed.modelesEvaluation[0]

const meta = {
  title: '06 — Sections ATS/Evaluation/EvaluationForm',
  component: EvaluationForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Formulaire d\'évaluation post-entretien : grille de critères (4 niveaux) + recommandation + commentaire global. Voir DDR-007.',
      },
    },
  },
} satisfies Meta<typeof EvaluationForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vide: Story = {
  render: () => ({
    components: { EvaluationForm },
    setup: () => ({
      criteres: modele.criteres,
      notations: ref([]),
      recommandation: ref<'oui' | 'mitige' | 'non' | ''>(''),
      commentaireGlobal: ref(''),
    }),
    template: `
      <div style="max-width: 720px; padding: var(--csplab-space-4);">
        <EvaluationForm
          :criteres="criteres"
          :notations="notations"
          :recommandation="recommandation"
          :commentaire-global="commentaireGlobal"
          @update:notations="(v) => notations = v"
          @update:recommandation="(v) => recommandation = v"
          @update:commentaire-global="(v) => commentaireGlobal = v"
        />
      </div>
    `,
  }),
}

export const PreRempli: Story = {
  render: () => ({
    components: { EvaluationForm },
    setup: () => ({
      criteres: modele.criteres,
      notations: ref(modele.criteres.map((c, i) => ({ critereId: c.id, valeur: ((i % 4) + 1) as 1 | 2 | 3 | 4 }))),
      recommandation: ref<'oui' | 'mitige' | 'non' | ''>('oui'),
      commentaireGlobal: ref('Candidate très solide techniquement, bon esprit d\'équipe.'),
    }),
    template: `
      <div style="max-width: 720px; padding: var(--csplab-space-4);">
        <EvaluationForm
          :criteres="criteres"
          :notations="notations"
          :recommandation="recommandation"
          :commentaire-global="commentaireGlobal"
          @update:notations="(v) => notations = v"
          @update:recommandation="(v) => recommandation = v"
          @update:commentaire-global="(v) => commentaireGlobal = v"
        />
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { EvaluationForm },
    setup: () => ({
      criteres: modele.criteres,
      notations: ref(modele.criteres.map(c => ({ critereId: c.id, valeur: 3 as 1 | 2 | 3 | 4 }))),
      recommandation: ref<'oui' | 'mitige' | 'non' | ''>('oui'),
      commentaireGlobal: ref('Évaluation soumise — lecture seule.'),
    }),
    template: `
      <div style="max-width: 720px; padding: var(--csplab-space-4);">
        <EvaluationForm
          :criteres="criteres"
          :notations="notations"
          :recommandation="recommandation"
          :commentaire-global="commentaireGlobal"
          disabled
          @update:notations="(v) => notations = v"
          @update:recommandation="(v) => recommandation = v"
          @update:commentaire-global="(v) => commentaireGlobal = v"
        />
      </div>
    `,
  }),
}
