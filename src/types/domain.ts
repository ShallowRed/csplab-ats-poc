export type Offre = {
  id: string
  titre: string
  service: string
  localisation: string
  statut: 'ouverte' | 'fermee' | 'archivee'
  dateOuverture: string
  pipelineId: string
}

export type Etape = {
  id: string
  pipelineId: string
  libelle: string
  ordre: number
  couleur: 'csplab-status-draft' | 'csplab-status-submitted' | 'csplab-status-screening' | 'csplab-status-interview' | 'csplab-status-offer' | 'csplab-status-rejected' | 'csplab-status-archived'
  estTerminale: boolean
  visibleKanban: boolean
}

export type Candidat = {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  photoUrl?: string
}

export type Candidature = {
  id: string
  offreId: string
  candidatId: string
  etapeId: string
  dateCandidat: string
  score?: number
  assigneA?: string
  tags: string[]
  estUrgent?: boolean
  derniereActivite: string
}

export type Intervieweur = {
  id: string
  nom: string
  prenom: string
  email: string
  avatarUrl?: string
  role: 'rh' | 'manager' | 'expert'
}

export type Entretien = {
  id: string
  candidatureId: string
  type: 'rh' | 'technique' | 'manager' | 'jury'
  date: string
  duree: number
  intervieweurIds: string[]
  statut: 'planifie' | 'realise' | 'annule'
  modeleEvaluationId: string
}

export type CritereEvaluation = {
  id: string
  libelle: string
  description?: string
}

export type ModeleEvaluation = {
  id: string
  libelle: string
  criteres: CritereEvaluation[]
}

export type Evaluation = {
  id: string
  entretienId: string
  candidatureId: string
  intervieweurId: string
  notations: { critereId: string; valeur: 1 | 2 | 3 | 4; commentaire?: string }[]
  recommandation: 'oui' | 'mitige' | 'non'
  commentaireGlobal?: string
  dateSoumission: string
}

export type EvenementTimeline = {
  id: string
  candidatureId: string
  type: 'changement-etape' | 'note' | 'entretien-planifie' | 'evaluation-soumise' | 'email-envoye' | 'tag-ajoute'
  auteurId: string
  date: string
  donnees: Record<string, unknown>
}

export type Pipeline = {
  id: string
  libelle: string
  etapeIds: string[]
}

export type DensiteAffichage = 'compact' | 'default' | 'comfortable'

export type FiltreCandidatures = {
  offreId: string | null
  etapeIds: string[]
  scoreMin: number | null
  dateDebut: string | null
  dateFin: string | null
  intervieweurIds: string[]
  recherche: string
}
