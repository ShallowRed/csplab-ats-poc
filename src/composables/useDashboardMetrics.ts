import { computed, type ComputedRef } from 'vue'
import { useOffresStore } from '@/stores/offres'
import { useEntretiensStore } from '@/stores/entretiens'
import { seed } from '@/data/seed'

export type TodoItem = {
  id: string
  title: string
  subtitle?: string
  badge?: string
  to: string
  icon?: string
}

export type DelaiEtape = {
  etapeId: string
  etape: string
  delaiMoyen: number
  points: number[]
}

export type DashboardKpis = {
  offresOuvertes: number
  offresOuvertesNouvelles7j: number
  candidaturesATraiter: number
  candidaturesATraiterRetard: number
  entretiens7j: number
  entretiensAujourdhui: number
  evaluationsEnAttente: number
  evaluationsEnAttenteRetard: number
}

export type DashboardMetrics = {
  kpis: ComputedRef<DashboardKpis>
  todos: ComputedRef<TodoItem[]>
  delaisParEtape: ComputedRef<DelaiEtape[]>
}

const MS_DAY = 24 * 60 * 60 * 1000

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_DAY)
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

// Hash de chaîne (FNV-1a 32-bit) pour générer des sparklines déterministes
function hashString(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h
}

function mulberry32(seedValue: number): () => number {
  let s = seedValue >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function sparklinePoints(seedKey: string, count = 10): number[] {
  const rng = mulberry32(hashString(seedKey))
  return Array.from({ length: count }, () => Math.round(rng() * 100))
}

export function useDashboardMetrics(referenceDate: Date = new Date()): DashboardMetrics {
  const offresStore = useOffresStore()
  const entretiensStore = useEntretiensStore()

  const candidatById = new Map(seed.candidats.map(c => [c.id, c]))
  const candidatureById = new Map(seed.candidatures.map(c => [c.id, c]))
  const evaluationsByEntretien = new Map(seed.evaluations.map(e => [e.entretienId, e]))

  const kpis = computed<DashboardKpis>(() => {
    const offresOuvertes = offresStore.offres.filter(o => o.statut === 'ouverte').length

    const offresOuvertesNouvelles7j = offresStore.offres.filter(o => {
      if (o.statut !== 'ouverte') return false
      const d = new Date(o.dateOuverture)
      return daysBetween(referenceDate, d) <= 7 && daysBetween(referenceDate, d) >= 0
    }).length

    const aTraiter = seed.candidatures.filter(c => c.etapeId === 'etape-1')
    const candidaturesATraiterRetard = aTraiter.filter(c => {
      const d = new Date(c.dateCandidat)
      return daysBetween(referenceDate, d) >= 2
    }).length

    const entretiensSemaine = entretiensStore.entretiens.filter(e => {
      if (e.statut !== 'planifie') return false
      const d = new Date(e.date)
      const diff = daysBetween(d, referenceDate)
      return diff >= 0 && diff <= 7
    })
    const entretiensAujourdhui = entretiensSemaine.filter(e =>
      isSameDay(new Date(e.date), referenceDate),
    ).length

    const evalsEnAttenteList = entretiensStore.entretiens.filter(e =>
      e.statut === 'realise' && !evaluationsByEntretien.has(e.id),
    )
    const evaluationsEnAttenteRetard = evalsEnAttenteList.filter(e =>
      daysBetween(referenceDate, new Date(e.date)) >= 3,
    ).length

    return {
      offresOuvertes,
      offresOuvertesNouvelles7j,
      candidaturesATraiter: aTraiter.length,
      candidaturesATraiterRetard,
      entretiens7j: entretiensSemaine.length,
      entretiensAujourdhui,
      evaluationsEnAttente: evalsEnAttenteList.length,
      evaluationsEnAttenteRetard,
    }
  })

  const todos = computed<TodoItem[]>(() => {
    const items: Array<TodoItem & { _urgency: number }> = []

    // 1. Évaluations en attente > 3j
    entretiensStore.entretiens
      .filter(e => e.statut === 'realise' && !evaluationsByEntretien.has(e.id))
      .forEach(e => {
        const days = daysBetween(referenceDate, new Date(e.date))
        if (days < 3) return
        const candidature = candidatureById.get(e.candidatureId)
        const candidat = candidature ? candidatById.get(candidature.candidatId) : undefined
        const nom = candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'
        items.push({
          _urgency: 100 + days,
          id: `eval-${e.id}`,
          title: `Évaluer l'entretien de ${nom}`,
          subtitle: `Réalisé il y a ${days} jour${days > 1 ? 's' : ''}`,
          badge: 'Retard',
          to: `/entretiens/${e.id}/evaluation`,
          icon: 'ri:clipboard-line',
        })
      })

    // 2. Entretiens planifiés aujourd'hui (à confirmer)
    entretiensStore.entretiens
      .filter(e => e.statut === 'planifie' && isSameDay(new Date(e.date), referenceDate))
      .forEach(e => {
        const candidature = candidatureById.get(e.candidatureId)
        const candidat = candidature ? candidatById.get(candidature.candidatId) : undefined
        const nom = candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'
        const heure = new Date(e.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        items.push({
          _urgency: 80,
          id: `ent-${e.id}`,
          title: `Entretien avec ${nom}`,
          subtitle: `Aujourd'hui à ${heure}`,
          to: `/candidatures/${e.candidatureId}`,
          icon: 'ri:calendar-event-line',
        })
      })

    // 3. Candidatures non triées > 48h
    seed.candidatures
      .filter(c => c.etapeId === 'etape-1')
      .forEach(c => {
        const days = daysBetween(referenceDate, new Date(c.dateCandidat))
        if (days < 2) return
        const candidat = candidatById.get(c.candidatId)
        const nom = candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat'
        items.push({
          _urgency: 60 + Math.min(days, 30),
          id: `cand-${c.id}`,
          title: `Trier la candidature de ${nom}`,
          subtitle: `Reçue il y a ${days} jours`,
          to: `/candidatures/${c.id}`,
          icon: 'ri:user-search-line',
        })
      })

    return items
      .sort((a, b) => b._urgency - a._urgency)
      .slice(0, 8)
      .map(({ _urgency, ...item }) => item)
  })

  const delaisParEtape = computed<DelaiEtape[]>(() => {
    return seed.etapes
      .filter(e => e.visibleKanban && !e.estTerminale)
      .map(e => {
        const points = sparklinePoints(e.libelle)
        const delaiMoyen = Math.round(2 + (hashString(e.libelle) % 8))
        return {
          etapeId: e.id,
          etape: e.libelle,
          delaiMoyen,
          points,
        }
      })
  })

  return { kpis, todos, delaisParEtape }
}
