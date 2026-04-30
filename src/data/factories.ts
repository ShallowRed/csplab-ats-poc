import { faker } from '@faker-js/faker'
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

export function createSeededRng(seed: number) {
  let state = seed
  return function mulberry32() {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSeededFaker(seed: number) {
  const fakeInstance = faker
  fakeInstance.seed(seed)
  return fakeInstance
}

export function createPipeline(id: string, libelle: string, etapeIds: string[]): Pipeline {
  return { id, libelle, etapeIds }
}

export function createEtape(
  id: string,
  pipelineId: string,
  libelle: string,
  ordre: number,
  couleur: Etape['couleur'],
  estTerminale: boolean,
  visibleKanban: boolean
): Etape {
  return { id, pipelineId, libelle, ordre, couleur, estTerminale, visibleKanban }
}

export function createOffre(
  fake: typeof faker,
  id: string,
  pipelineId: string,
  servicesList: string[],
  localisationsList: string[],
  options: {
    statut?: Offre['statut']
    typeContrat?: Offre['typeContrat']
    responsableId?: string
    intervieweursDefautIds?: string[]
    etapesIds?: string[]
    descriptif?: string
    corps?: string
    grade?: string
  } = {}
): Offre {
  const service = fake.helpers.arrayElement(servicesList)
  return {
    id,
    titre: fake.person.jobTitle(),
    service,
    direction: service,
    localisation: fake.helpers.arrayElement(localisationsList),
    statut: options.statut ?? 'ouverte',
    dateOuverture: fake.date.past({ years: 0.5 }).toISOString().split('T')[0],
    pipelineId,
    etapesIds: options.etapesIds,
    responsableId: options.responsableId,
    intervieweursDefautIds: options.intervieweursDefautIds,
    descriptif: options.descriptif,
    typeContrat: options.typeContrat ?? 'contractuel',
    corps: options.corps,
    grade: options.grade,
  }
}

export function createCandidat(fake: typeof faker, id: string): Candidat {
  const prenom = fake.person.firstName()
  const nom = fake.person.lastName()
  return {
    id,
    nom,
    prenom,
    email: fake.internet.email({ firstName: prenom, lastName: nom }).toLowerCase(),
    telephone: fake.helpers.maybe(() => fake.phone.number(), { probability: 0.7 }),
    photoUrl: `https://i.pravatar.cc/150?u=${id}`,
  }
}

export function createCandidature(
  fake: typeof faker,
  id: string,
  offreId: string,
  candidatId: string,
  etapeId: string,
  tags: string[]
): Candidature {
  const dateCandidat = fake.date.recent({ days: 60 }).toISOString()
  return {
    id,
    offreId,
    candidatId,
    etapeId,
    dateCandidat,
    score: undefined,
    assigneA: fake.helpers.maybe(() => `int-${fake.number.int({ min: 1, max: 8 })}`, { probability: 0.5 }),
    tags,
    estUrgent: fake.helpers.maybe(() => true, { probability: 0.1 }),
    derniereActivite: dateCandidat,
  }
}

export function createIntervieweur(
  fake: typeof faker,
  id: string,
  role: Intervieweur['role']
): Intervieweur {
  const prenom = fake.person.firstName()
  const nom = fake.person.lastName()
  return {
    id,
    nom,
    prenom,
    email: fake.internet.email({ firstName: prenom, lastName: nom }).toLowerCase(),
    avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
    role,
  }
}

export function createModeleEvaluation(id: string, libelle: string, criteres: { id: string; libelle: string; description?: string }[]): ModeleEvaluation {
  return { id, libelle, criteres }
}

export function createEntretien(
  fake: typeof faker,
  id: string,
  candidatureId: string,
  type: Entretien['type'],
  statut: Entretien['statut'],
  intervieweurIds: string[],
  modeleEvaluationId: string,
  dateOffset: number
): Entretien {
  const date = statut === 'planifie'
    ? fake.date.soon({ days: 30 }).toISOString()
    : fake.date.recent({ days: dateOffset }).toISOString()
  return {
    id,
    candidatureId,
    type,
    date,
    duree: fake.helpers.arrayElement([30, 45, 60]),
    intervieweurIds,
    statut,
    modeleEvaluationId,
  }
}

export function createEvaluation(
  fake: typeof faker,
  id: string,
  entretienId: string,
  candidatureId: string,
  intervieweurId: string,
  critereIds: string[]
): Evaluation {
  return {
    id,
    entretienId,
    candidatureId,
    intervieweurId,
    notations: critereIds.map(critereId => ({
      critereId,
      valeur: fake.helpers.arrayElement([1, 2, 3, 4]) as 1 | 2 | 3 | 4,
      commentaire: fake.helpers.maybe(() => fake.lorem.sentence(), { probability: 0.5 }),
    })),
    recommandation: fake.helpers.arrayElement(['oui', 'mitige', 'non']) as 'oui' | 'mitige' | 'non',
    commentaireGlobal: fake.helpers.maybe(() => fake.lorem.paragraph(), { probability: 0.7 }),
    dateSoumission: fake.date.recent({ days: 7 }).toISOString(),
  }
}

export function createEvenement(
  id: string,
  candidatureId: string,
  type: EvenementTimeline['type'],
  auteurId: string,
  date: string,
  donnees: Record<string, unknown>
): EvenementTimeline {
  return {
    id,
    candidatureId,
    type,
    auteurId,
    date,
    donnees,
  }
}
