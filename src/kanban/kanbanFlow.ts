import { ref } from 'vue'
import type { Etape } from '@/types/domain'

export type ToastLike = {
  success: (message: string, options?: { undo?: () => void | Promise<void> }) => void
  error: (message: string) => void
}

export type CandidaturesStoreLike = {
  candidatures: Array<{ id: string; etapeId: string }>
  changerEtape: (
    candidatureId: string,
    etapeId: string,
    motif?: string,
    options?: { toast?: boolean },
  ) => Promise<boolean>
}

export type PendingRefusal = {
  candidatureId: string
  fromEtapeId: string
  toEtapeId: string
} | null

type Deps = {
  candidaturesStore: CandidaturesStoreLike
  toast: ToastLike
  etapesById: ReadonlyMap<string, Etape>
  refusedEtapeId: string
}

export function createKanbanFlow(deps: Deps) {
  const pendingRefusal = ref<PendingRefusal>(null)

  async function handleDrop(input: { candidatureId: string; toEtapeId: string }): Promise<void> {
    const candidature = deps.candidaturesStore.candidatures.find(c => c.id === input.candidatureId)
    if (!candidature) return

    const fromEtapeId = candidature.etapeId
    const toEtapeId = input.toEtapeId

    if (!toEtapeId || toEtapeId === fromEtapeId) return

    if (toEtapeId === deps.refusedEtapeId) {
      pendingRefusal.value = {
        candidatureId: input.candidatureId,
        fromEtapeId,
        toEtapeId,
      }
      return
    }

    const ok = await deps.candidaturesStore.changerEtape(input.candidatureId, toEtapeId, undefined, { toast: false })
    if (!ok) {
      deps.toast.error("Échec du changement d'étape")
      return
    }

    const etapeLabel = deps.etapesById.get(toEtapeId)?.libelle ?? 'nouvelle étape'
    deps.toast.success(`Candidat déplacé vers ${etapeLabel}`, {
      undo: async () => {
        await deps.candidaturesStore.changerEtape(input.candidatureId, fromEtapeId, 'Annulation', { toast: false })
      },
    })
  }

  async function confirmRefusal(input: { motif: string; commentaire?: string }): Promise<void> {
    if (!pendingRefusal.value) return

    const candidatureId = pendingRefusal.value.candidatureId
    const toEtapeId = pendingRefusal.value.toEtapeId
    pendingRefusal.value = null

    const motifFinal = input.commentaire?.trim()
      ? `${input.motif} — ${input.commentaire.trim()}`
      : input.motif

    const ok = await deps.candidaturesStore.changerEtape(candidatureId, toEtapeId, motifFinal, { toast: false })
    if (!ok) {
      deps.toast.error("Échec du rejet du candidat")
      return
    }

    deps.toast.success('Candidat rejeté')
  }

  function cancelRefusal(): void {
    pendingRefusal.value = null
  }

  return {
    pendingRefusal,
    handleDrop,
    confirmRefusal,
    cancelRefusal,
  }
}
