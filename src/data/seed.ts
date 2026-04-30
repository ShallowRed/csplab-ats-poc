import {
  createCandidat,
  createCandidature,
  createEntretien,
  createEtape,
  createEvaluation,
  createEvenement,
  createIntervieweur,
  createModeleEvaluation,
  createOffre,
  createPipeline,
  createSeededFaker,
} from './factories'
import type {
  Candidat,
  Candidature,
  Entretien,
  Etape,
  Evaluation,
  EvenementTimeline,
  Intervieweur,
  ModeleEvaluation,
  Offre,
  Pipeline,
} from '../types/domain'

const SEED = 42
const fake = createSeededFaker(SEED)

const services = ['DGAFP', 'DGFiP', 'INSEE', 'Beta.gouv', 'DINUM']
const localisations = ['Paris 7e', 'Paris 15e', 'Bercy', 'Lyon Part-Dieu', 'Montreuil']
const tagOptions = ['junior', 'senior', 'bilingue', 'mobilité', 'télétravail', 'handicap', 'reconversion']

function generatePipeline(): { pipeline: Pipeline; etapes: Etape[] } {
  const pipelineId = 'pipe-1'
  const etapes: Etape[] = [
    createEtape('etape-1', pipelineId, 'Candidature reçue', 1, 'csplab-status-submitted', false, true),
    createEtape('etape-2', pipelineId, 'Présélection', 2, 'csplab-status-screening', false, true),
    createEtape('etape-3', pipelineId, 'Entretien RH', 3, 'csplab-status-interview', false, true),
    createEtape('etape-4', pipelineId, 'Entretien manager', 4, 'csplab-status-interview', false, true),
    createEtape('etape-5', pipelineId, 'Décision', 5, 'csplab-status-offer', false, true),
    createEtape('etape-6', pipelineId, 'Recrutée', 6, 'csplab-status-offer', true, true),
    createEtape('etape-7', pipelineId, 'Refusée', 7, 'csplab-status-rejected', true, false),
    createEtape('etape-8', pipelineId, 'Archivée', 8, 'csplab-status-archived', true, false),
  ]
  const pipeline = createPipeline(pipelineId, 'Pipeline recrutement standard', etapes.map(e => e.id))
  return { pipeline, etapes }
}

function generateOffres(pipelineId: string): Offre[] {
  return Array.from({ length: 5 }, (_, i) =>
    createOffre(fake, `offre-${i + 1}`, pipelineId, services, localisations)
  )
}

function generateCandidats(): Candidat[] {
  return Array.from({ length: 60 }, (_, i) => createCandidat(fake, `cand-${i + 1}`))
}

function generateCandidatures(offres: Offre[], candidats: Candidat[]): Candidature[] {
  const distribution = [
    { etapeId: 'etape-1', count: 25 },
    { etapeId: 'etape-2', count: 15 },
    { etapeId: 'etape-3', count: 10 },
    { etapeId: 'etape-4', count: 5 },
    { etapeId: 'etape-5', count: 3 },
    { etapeId: 'etape-6', count: 1 },
    { etapeId: 'etape-7', count: 1 },
  ]

  const candidatures: Candidature[] = []
  let candidatIndex = 0

  distribution.forEach(({ etapeId, count }) => {
    for (let i = 0; i < count; i++) {
      const tags = fake.helpers.arrayElements(tagOptions, fake.number.int({ min: 0, max: 3 }))
      const candidature = createCandidature(
        fake,
        `candid-${candidatIndex + 1}`,
        fake.helpers.arrayElement(offres).id,
        candidats[candidatIndex].id,
        etapeId,
        tags
      )

      if (['etape-3', 'etape-4', 'etape-5', 'etape-6', 'etape-7'].includes(etapeId)) {
        candidature.score = fake.number.int({ min: 0, max: 4 })
      }

      candidatures.push(candidature)
      candidatIndex++
    }
  })

  return candidatures
}

function generateIntervieweurs(): Intervieweur[] {
  return [
    createIntervieweur(fake, 'int-1', 'rh'),
    createIntervieweur(fake, 'int-2', 'rh'),
    createIntervieweur(fake, 'int-3', 'manager'),
    createIntervieweur(fake, 'int-4', 'manager'),
    createIntervieweur(fake, 'int-5', 'manager'),
    createIntervieweur(fake, 'int-6', 'manager'),
    createIntervieweur(fake, 'int-7', 'expert'),
    createIntervieweur(fake, 'int-8', 'expert'),
  ]
}

function generateModelesEvaluation(): ModeleEvaluation[] {
  return [
    createModeleEvaluation('modele-rh', 'Entretien RH', [
      { id: 'crit-rh-1', libelle: 'Motivation', description: 'Intérêt pour le poste et le service public' },
      { id: 'crit-rh-2', libelle: 'Communication', description: 'Clarté et capacité d\'expression' },
      { id: 'crit-rh-3', libelle: 'Fit culture', description: 'Adéquation avec les valeurs du service public' },
    ]),
    createModeleEvaluation('modele-technique', 'Entretien technique', [
      { id: 'crit-tech-1', libelle: 'Compétences techniques', description: 'Maîtrise des technologies requises' },
      { id: 'crit-tech-2', libelle: 'Résolution de problèmes', description: 'Capacité d\'analyse et de résolution' },
      { id: 'crit-tech-3', libelle: 'Méthodologie', description: 'Approche structurée et rigueur' },
      { id: 'crit-tech-4', libelle: 'Communication technique', description: 'Capacité à expliquer des concepts techniques' },
    ]),
    createModeleEvaluation('modele-manager', 'Entretien manager', [
      { id: 'crit-mgr-1', libelle: 'Leadership', description: 'Capacité à prendre des initiatives et guider' },
      { id: 'crit-mgr-2', libelle: 'Vision stratégique', description: 'Compréhension des enjeux et perspectives' },
      { id: 'crit-mgr-3', libelle: 'Fit équipe', description: 'Adéquation avec l\'équipe et le management' },
    ]),
  ]
}

function generateEntretiens(candidatures: Candidature[]): Entretien[] {
  const eligibles = candidatures.filter(c => ['etape-3', 'etape-4', 'etape-5', 'etape-6', 'etape-7'].includes(c.etapeId))
  const entretiens: Entretien[] = []
  let entretienId = 1

  eligibles.forEach((cand, i) => {
    const nombreEntretiens = i < 10 ? 2 : 1
    
    for (let j = 0; j < nombreEntretiens; j++) {
      if (entretienId > 30) break
      
      const statut = entretienId <= 20 ? 'realise' : 'planifie'
      const type = j === 0 ? 'rh' : 'technique'
      const modeleId = type === 'rh' ? 'modele-rh' : 'modele-technique'
      const intervieweurIds = type === 'rh' ? ['int-1'] : ['int-3', 'int-7']

      entretiens.push(
        createEntretien(fake, `ent-${entretienId}`, cand.id, type, statut, intervieweurIds, modeleId, 30)
      )
      entretienId++
    }
  })

  return entretiens
}

function generateEvaluations(entretiens: Entretien[], modeles: ModeleEvaluation[]): Evaluation[] {
  const realises = entretiens.filter(e => e.statut === 'realise')
  const evaluations: Evaluation[] = []

  realises.slice(0, 20).forEach((ent, i) => {
    const modele = modeles.find(m => m.id === ent.modeleEvaluationId)
    if (!modele) return

    const intervieweurId = ent.intervieweurIds[0]
    evaluations.push(
      createEvaluation(
        fake,
        `eval-${i + 1}`,
        ent.id,
        ent.candidatureId,
        intervieweurId,
        modele.criteres.map(c => c.id)
      )
    )
  })

  return evaluations
}

function generateEvenements(
  candidatures: Candidature[],
  entretiens: Entretien[],
  evaluations: Evaluation[]
): EvenementTimeline[] {
  const evenements: EvenementTimeline[] = []
  let eventId = 1

  candidatures.forEach(cand => {
    const baseDate = new Date(cand.dateCandidat)

    evenements.push(
      createEvenement(
        `evt-${eventId++}`,
        cand.id,
        'changement-etape',
        'system',
        baseDate.toISOString(),
        { etapeId: 'etape-1', ancienneEtapeId: null }
      )
    )

    const eventsCount = fake.number.int({ min: 1, max: 4 })
    for (let i = 0; i < eventsCount; i++) {
      const offsetDays = fake.number.int({ min: 1, max: 30 })
      const eventDate = new Date(baseDate.getTime() + offsetDays * 24 * 60 * 60 * 1000)
      const type = fake.helpers.arrayElement(['note', 'changement-etape', 'tag-ajoute', 'email-envoye'] as const)

      evenements.push(
        createEvenement(
          `evt-${eventId++}`,
          cand.id,
          type,
          fake.helpers.arrayElement(['int-1', 'int-2', 'int-3', 'int-4']),
          eventDate.toISOString(),
          type === 'note' ? { contenu: fake.lorem.paragraph() } : {}
        )
      )
    }
  })

  entretiens.forEach(ent => {
    evenements.push(
      createEvenement(
        `evt-${eventId++}`,
        ent.candidatureId,
        'entretien-planifie',
        'int-1',
        new Date(ent.date).toISOString(),
        { entretienId: ent.id, type: ent.type }
      )
    )
  })

  evaluations.forEach(evaluation => {
    evenements.push(
      createEvenement(
        `evt-${eventId++}`,
        evaluation.candidatureId,
        'evaluation-soumise',
        evaluation.intervieweurId,
        evaluation.dateSoumission,
        { evaluationId: evaluation.id, recommandation: evaluation.recommandation }
      )
    )
  })

  return evenements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateSeed() {
  const { pipeline, etapes } = generatePipeline()
  const offres = generateOffres(pipeline.id)
  const candidats = generateCandidats()
  const candidatures = generateCandidatures(offres, candidats)
  const intervieweurs = generateIntervieweurs()
  const modelesEvaluation = generateModelesEvaluation()
  const entretiens = generateEntretiens(candidatures)
  const evaluations = generateEvaluations(entretiens, modelesEvaluation)
  const evenements = generateEvenements(candidatures, entretiens, evaluations)

  return {
    pipelines: [pipeline],
    etapes,
    offres,
    candidats,
    candidatures,
    intervieweurs,
    modelesEvaluation,
    entretiens,
    evaluations,
    evenements,
  }
}

export const seed = generateSeed()

export type Seed = typeof seed
