import { seed } from '../data/seed'
import type {
  Candidature,
  Entretien,
  Evaluation,
  EvenementTimeline,
  Etape,
  FiltreCandidatures,
  Intervieweur,
  Offre,
  Candidat,
} from '../types/domain'

let inMemoryData = {
  candidatures: [...seed.candidatures],
  evenements: [...seed.evenements],
  entretiens: [...seed.entretiens],
  evaluations: [...seed.evaluations],
}

let shouldFailNext = false
let nextEventId = seed.evenements.length + 1
let nextEntretienId = seed.entretiens.length + 1
let nextEvaluationId = seed.evaluations.length + 1

async function delay<T>(value: T, min = 50, max = 300): Promise<T> {
  const ms = Math.floor(Math.random() * (max - min) + min)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFailNext) {
        shouldFailNext = false
        reject(new Error('Simulated API error'))
      } else {
        resolve(value)
      }
    }, ms)
  })
}

export const mockApi = {
  failNext() {
    shouldFailNext = true
  },

  reset() {
    inMemoryData = {
      candidatures: [...seed.candidatures],
      evenements: [...seed.evenements],
      entretiens: [...seed.entretiens],
      evaluations: [...seed.evaluations],
    }
    shouldFailNext = false
  },

  async listCandidatures(filtre?: FiltreCandidatures): Promise<Candidature[]> {
    let results = [...inMemoryData.candidatures]

    if (filtre) {
      if (filtre.offreId) {
        results = results.filter(c => c.offreId === filtre.offreId)
      }
      if (filtre.etapeIds.length > 0) {
        results = results.filter(c => filtre.etapeIds.includes(c.etapeId))
      }
      if (filtre.scoreMin !== null) {
        results = results.filter(c => c.score !== undefined && c.score >= filtre.scoreMin!)
      }
      if (filtre.dateDebut) {
        results = results.filter(c => c.dateCandidat >= filtre.dateDebut!)
      }
      if (filtre.dateFin) {
        results = results.filter(c => c.dateCandidat <= filtre.dateFin!)
      }
      if (filtre.intervieweurIds.length > 0) {
        const candidatureIdsWithInterviewer = new Set(
          inMemoryData.entretiens
            .filter(e => e.intervieweurIds.some(id => filtre.intervieweurIds.includes(id)))
            .map(e => e.candidatureId)
        )
        results = results.filter(c => candidatureIdsWithInterviewer.has(c.id))
      }
      if (filtre.recherche) {
        const search = filtre.recherche.toLowerCase()
        results = results.filter(c => {
          const candidat = seed.candidats.find(cand => cand.id === c.candidatId)
          if (!candidat) return false
          return (
            candidat.nom.toLowerCase().includes(search) ||
            candidat.prenom.toLowerCase().includes(search) ||
            candidat.email.toLowerCase().includes(search)
          )
        })
      }
    }

    return delay(results)
  },

  async getCandidature(id: string): Promise<{
    candidature: Candidature
    candidat: Candidat
    offre: Offre
    etape: Etape
    evenements: EvenementTimeline[]
    entretiens: Entretien[]
    evaluations: Evaluation[]
  }> {
    const candidature = inMemoryData.candidatures.find(c => c.id === id)
    if (!candidature) throw new Error('Candidature not found')

    const candidat = seed.candidats.find(c => c.id === candidature.candidatId)!
    const offre = seed.offres.find(o => o.id === candidature.offreId)!
    const etape = seed.etapes.find(e => e.id === candidature.etapeId)!
    const evenements = inMemoryData.evenements.filter(e => e.candidatureId === id)
    const entretiens = inMemoryData.entretiens.filter(e => e.candidatureId === id)
    const evaluations = inMemoryData.evaluations.filter(e => e.candidatureId === id)

    return delay({ candidature, candidat, offre, etape, evenements, entretiens, evaluations })
  },

  async changerEtape(candidatureId: string, etapeId: string, motif?: string): Promise<Candidature> {
    const candidature = inMemoryData.candidatures.find(c => c.id === candidatureId)
    if (!candidature) throw new Error('Candidature not found')

    const ancienneEtapeId = candidature.etapeId
    candidature.etapeId = etapeId
    candidature.derniereActivite = new Date().toISOString()

    const event: EvenementTimeline = {
      id: `evt-${nextEventId++}`,
      candidatureId,
      type: 'changement-etape',
      auteurId: 'user-1',
      date: new Date().toISOString(),
      donnees: { etapeId, ancienneEtapeId, motif },
    }
    inMemoryData.evenements.push(event)

    return delay(candidature)
  },

  async ajouterNote(candidatureId: string, contenuMd: string, auteurId: string): Promise<EvenementTimeline> {
    const candidature = inMemoryData.candidatures.find(c => c.id === candidatureId)
    if (!candidature) throw new Error('Candidature not found')

    const event: EvenementTimeline = {
      id: `evt-${nextEventId++}`,
      candidatureId,
      type: 'note',
      auteurId,
      date: new Date().toISOString(),
      donnees: { contenu: contenuMd },
    }
    inMemoryData.evenements.push(event)
    candidature.derniereActivite = event.date

    return delay(event)
  },

  async planifierEntretien(input: {
    candidatureId: string
    type: Entretien['type']
    date: string
    duree: number
    intervieweurIds: string[]
    modeleEvaluationId: string
  }): Promise<Entretien> {
    const entretien: Entretien = {
      id: `ent-${nextEntretienId++}`,
      candidatureId: input.candidatureId,
      type: input.type,
      date: input.date,
      duree: input.duree,
      intervieweurIds: input.intervieweurIds,
      statut: 'planifie',
      modeleEvaluationId: input.modeleEvaluationId,
    }
    inMemoryData.entretiens.push(entretien)

    const event: EvenementTimeline = {
      id: `evt-${nextEventId++}`,
      candidatureId: input.candidatureId,
      type: 'entretien-planifie',
      auteurId: 'user-1',
      date: new Date().toISOString(),
      donnees: { entretienId: entretien.id, type: input.type },
    }
    inMemoryData.evenements.push(event)

    const candidature = inMemoryData.candidatures.find(c => c.id === input.candidatureId)
    if (candidature) {
      candidature.derniereActivite = event.date
    }

    return delay(entretien)
  },

  async soumettreEvaluation(input: {
    entretienId: string
    candidatureId: string
    intervieweurId: string
    notations: Evaluation['notations']
    recommandation: Evaluation['recommandation']
    commentaireGlobal?: string
  }): Promise<Evaluation> {
    const evaluation: Evaluation = {
      id: `eval-${nextEvaluationId++}`,
      entretienId: input.entretienId,
      candidatureId: input.candidatureId,
      intervieweurId: input.intervieweurId,
      notations: input.notations,
      recommandation: input.recommandation,
      commentaireGlobal: input.commentaireGlobal,
      dateSoumission: new Date().toISOString(),
    }
    inMemoryData.evaluations.push(evaluation)

    const event: EvenementTimeline = {
      id: `evt-${nextEventId++}`,
      candidatureId: input.candidatureId,
      type: 'evaluation-soumise',
      auteurId: input.intervieweurId,
      date: evaluation.dateSoumission,
      donnees: { evaluationId: evaluation.id, recommandation: input.recommandation },
    }
    inMemoryData.evenements.push(event)

    const candidature = inMemoryData.candidatures.find(c => c.id === input.candidatureId)
    if (candidature) {
      candidature.derniereActivite = event.date
    }

    return delay(evaluation)
  },

  async sauvegarderBrouillonEvaluation(input: {
    entretienId: string
    candidatureId: string
    intervieweurId: string
    notations: Evaluation['notations']
  }): Promise<Partial<Evaluation>> {
    return delay({
      entretienId: input.entretienId,
      candidatureId: input.candidatureId,
      intervieweurId: input.intervieweurId,
      notations: input.notations,
    })
  },

  async listIntervieweurs(): Promise<Intervieweur[]> {
    return delay([...seed.intervieweurs])
  },

  async listOffres(): Promise<Offre[]> {
    return delay([...seed.offres])
  },

  async listEtapes(pipelineId: string): Promise<Etape[]> {
    return delay(seed.etapes.filter(e => e.pipelineId === pipelineId))
  },

  async getEntretien(id: string): Promise<Entretien> {
    const entretien = inMemoryData.entretiens.find(e => e.id === id)
    if (!entretien) throw new Error(`Entretien ${id} introuvable`)
    return delay({ ...entretien })
  },

  async ajouterTag(candidatureId: string, tag: string): Promise<Candidature> {
    const candidature = inMemoryData.candidatures.find(c => c.id === candidatureId)
    if (!candidature) throw new Error('Candidature not found')

    if (!candidature.tags.includes(tag)) {
      candidature.tags.push(tag)
      candidature.derniereActivite = new Date().toISOString()

      const event: EvenementTimeline = {
        id: `evt-${nextEventId++}`,
        candidatureId,
        type: 'tag-ajoute',
        auteurId: 'user-1',
        date: new Date().toISOString(),
        donnees: { tag },
      }
      inMemoryData.evenements.push(event)
    }

    return delay(candidature)
  },

  async retirerTag(candidatureId: string, tag: string): Promise<Candidature> {
    const candidature = inMemoryData.candidatures.find(c => c.id === candidatureId)
    if (!candidature) throw new Error('Candidature not found')

    const index = candidature.tags.indexOf(tag)
    if (index !== -1) {
      candidature.tags.splice(index, 1)
      candidature.derniereActivite = new Date().toISOString()
    }

    return delay(candidature)
  },
}
