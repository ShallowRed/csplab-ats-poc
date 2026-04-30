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
  MotifRefus,
  Offre,
  Pipeline,
  Template,
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
  const managerIds = ['int-3', 'int-4', 'int-5', 'int-6']
  const defaultPools = [
    ['int-1', 'int-7'],
    ['int-2', 'int-7'],
    ['int-1', 'int-8'],
    ['int-2', 'int-8'],
    ['int-1', 'int-7', 'int-3'],
  ]
  const typesContrat: Offre['typeContrat'][] = ['contractuel', 'titulaire', 'contractuel', 'apprentissage', 'titulaire']
  const descriptifs = [
    'Au sein d\'une équipe pluridisciplinaire, vous contribuerez aux projets de transformation numérique du service.\n\nVous serez en lien direct avec les usagers et les agents publics pour identifier les besoins, proposer des solutions et accompagner leur mise en œuvre.',
    'Le poste s\'inscrit dans une dynamique de modernisation de l\'administration. Vous interviendrez sur des dossiers stratégiques et opérationnels.\n\nUne expérience préalable dans le secteur public ou un fort intérêt pour les politiques publiques est souhaitée.',
    'Vous rejoindrez une équipe agile et bienveillante, engagée dans la création de produits numériques utiles aux citoyens.\n\nLe poste offre une grande autonomie et la possibilité de prendre des responsabilités rapidement.',
    'Mission orientée terrain : vous travaillerez en étroite collaboration avec les services déconcentrés et les opérateurs publics.\n\nDes déplacements ponctuels sont à prévoir. Le télétravail partiel est possible.',
    'Poste exigeant et valorisant, au cœur des enjeux de souveraineté numérique de l\'État.\n\nVous serez amené·e à piloter des projets complexes et à coordonner plusieurs acteurs internes et externes.',
  ]
  return Array.from({ length: 5 }, (_, i) => {
    const responsableId = managerIds[i % managerIds.length]
    const defaultInts = defaultPools[i].filter(id => id !== responsableId)
    const typeContrat = typesContrat[i]
    return createOffre(fake, `offre-${i + 1}`, pipelineId, services, localisations, {
      statut: i === 0 ? 'brouillon' : i === 4 ? 'fermee' : 'ouverte',
      responsableId,
      intervieweursDefautIds: defaultInts,
      descriptif: descriptifs[i],
      typeContrat,
      corps: typeContrat === 'titulaire' ? ['Attaché', 'Inspecteur', 'Ingénieur', 'Administrateur'][i % 4] : undefined,
      grade: typeContrat === 'titulaire' ? ['Classe normale', 'Hors classe', 'Principal'][i % 3] : undefined,
    })
  })
}

function generateCandidats(): Candidat[] {
  return Array.from({ length: 60 }, (_, i) => createCandidat(fake, `cand-${i + 1}`))
}

function generateCandidatures(offres: Offre[], candidats: Candidat[]): Candidature[] {
  const offresActives = offres.filter(o => o.statut !== 'brouillon' && o.statut !== 'archivee')
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
        fake.helpers.arrayElement(offresActives.length > 0 ? offresActives : offres).id,
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

function generateMotifsRefus(): MotifRefus[] {
  return [
    {
      id: 'motif-1',
      libelle: 'Profil non aligné avec le poste',
      texteType: 'Bonjour {candidat.prenom},\n\nNous vous remercions pour votre candidature à {offre.intitule}. Après analyse, nous estimons que votre profil ne correspond pas aux compétences recherchées pour ce poste.\n\nNous vous souhaitons plein succès dans vos recherches.',
    },
    {
      id: 'motif-2',
      libelle: 'Manque d\'expérience requise',
      texteType: 'Bonjour {candidat.prenom},\n\nMerci pour l\'intérêt porté à notre offre {offre.intitule}. Le niveau d\'expérience demandé pour ce poste ne correspond pas à votre parcours actuel.\n\nNous restons à votre écoute pour de futures opportunités.',
    },
    {
      id: 'motif-3',
      libelle: 'Niveau de rémunération non aligné',
      texteType: 'Bonjour {candidat.prenom},\n\nMalgré l\'intérêt de votre profil pour {offre.intitule}, nous ne pouvons pas répondre favorablement à vos prétentions salariales.\n\nNous vous souhaitons bonne continuation.',
    },
    {
      id: 'motif-4',
      libelle: 'Indisponibilité',
      texteType: 'Bonjour {candidat.prenom},\n\nVotre indisponibilité aux dates clés du processus de recrutement pour {offre.intitule} ne nous permet pas de poursuivre les échanges.\n\nNous restons attentifs à de futures collaborations.',
    },
  ]
}

function generateTemplates(): Template[] {
  return [
    {
      id: 'tpl-1',
      nom: 'Accusé de réception',
      sujet: 'Votre candidature à {offre.intitule}',
      corps: 'Bonjour {candidat.prenom} {candidat.nom},\n\nNous accusons réception de votre candidature pour le poste {offre.intitule}. Notre équipe va l\'étudier dans les meilleurs délais.\n\nVous serez recontacté·e prochainement.\n\nCordialement,\nL\'équipe recrutement',
    },
    {
      id: 'tpl-2',
      nom: 'Convocation entretien',
      sujet: 'Invitation à un entretien — {offre.intitule}',
      corps: 'Bonjour {candidat.prenom},\n\nVotre profil a retenu notre attention pour le poste {offre.intitule}. Nous souhaitons organiser un entretien.\n\nMerci de confirmer votre disponibilité via : {lien.entretien}\n\nÀ très bientôt,',
    },
    {
      id: 'tpl-3',
      nom: 'Proposition d\'embauche',
      sujet: 'Proposition pour le poste {offre.intitule}',
      corps: 'Bonjour {candidat.prenom},\n\nÀ l\'issue de notre processus, nous avons le plaisir de vous proposer le poste {offre.intitule}.\n\nVous trouverez les détails et les prochaines étapes en pièce jointe.\n\nDans l\'attente de votre retour,',
    },
  ]
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
  const motifsRefus = generateMotifsRefus()
  const templates = generateTemplates()

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
    motifsRefus,
    templates,
  }
}

export const seed = generateSeed()

export type Seed = typeof seed
