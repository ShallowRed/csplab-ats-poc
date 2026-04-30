import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createKanbanFlow, type CandidaturesStoreLike, type ToastLike } from './kanbanFlow'
import type { Etape } from '@/types/domain'

function makeEtape(id: string, libelle: string, overrides: Partial<Etape> = {}): Etape {
  return {
    id,
    pipelineId: 'pipeline-1',
    libelle,
    ordre: 1,
    couleur: 'csplab-status-submitted',
    estTerminale: false,
    visibleKanban: true,
    ...overrides,
  }
}

const REFUSED_ID = 'etape-refusee'

function makeStore(initial: Array<{ id: string; etapeId: string }>): CandidaturesStoreLike & {
  changerEtape: ReturnType<typeof vi.fn>
} {
  const candidatures = initial.map(c => ({ ...c }))
  const changerEtape = vi.fn(async (id: string, etapeId: string) => {
    const c = candidatures.find(x => x.id === id)
    if (c) c.etapeId = etapeId
    return true
  })
  return { candidatures, changerEtape }
}

function makeToast(): ToastLike & {
  success: ReturnType<typeof vi.fn>
  error: ReturnType<typeof vi.fn>
} {
  return {
    success: vi.fn(),
    error: vi.fn(),
  }
}

function makeFlow(store: CandidaturesStoreLike, toast: ToastLike) {
  const etapesById = new Map<string, Etape>([
    ['etape-1', makeEtape('etape-1', 'Soumise')],
    ['etape-2', makeEtape('etape-2', 'Présélection')],
    [REFUSED_ID, makeEtape(REFUSED_ID, 'Refusée', { estTerminale: true, couleur: 'csplab-status-rejected' })],
  ])
  return createKanbanFlow({
    candidaturesStore: store,
    toast,
    etapesById,
    refusedEtapeId: REFUSED_ID,
  })
}

describe('kanbanFlow', () => {
  let store: ReturnType<typeof makeStore>
  let toast: ReturnType<typeof makeToast>

  beforeEach(() => {
    store = makeStore([{ id: 'cand-1', etapeId: 'etape-1' }])
    toast = makeToast()
  })

  it('handles a standard transition with optimistic update + undo toast', async () => {
    const flow = makeFlow(store, toast)

    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: 'etape-2' })

    expect(store.changerEtape).toHaveBeenCalledWith('cand-1', 'etape-2', undefined, { toast: false })
    expect(toast.success).toHaveBeenCalledTimes(1)
    const [message, opts] = toast.success.mock.calls[0]
    expect(message).toContain('Présélection')
    expect(typeof opts?.undo).toBe('function')
  })

  it('does not change etape when dropped on refused; sets pendingRefusal', async () => {
    const flow = makeFlow(store, toast)

    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: REFUSED_ID })

    expect(store.changerEtape).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
    expect(flow.pendingRefusal.value).toEqual({
      candidatureId: 'cand-1',
      fromEtapeId: 'etape-1',
      toEtapeId: REFUSED_ID,
    })
  })

  it('confirmRefusal calls changerEtape with motif and clears pendingRefusal', async () => {
    const flow = makeFlow(store, toast)
    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: REFUSED_ID })

    await flow.confirmRefusal({ motif: 'Profil non aligné', commentaire: 'Détail' })

    expect(store.changerEtape).toHaveBeenCalledWith(
      'cand-1',
      REFUSED_ID,
      'Profil non aligné — Détail',
      { toast: false },
    )
    expect(flow.pendingRefusal.value).toBeNull()
    expect(toast.success).toHaveBeenCalledWith('Candidat rejeté')
  })

  it('cancelRefusal resets pendingRefusal without changing etape', async () => {
    const flow = makeFlow(store, toast)
    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: REFUSED_ID })

    flow.cancelRefusal()

    expect(flow.pendingRefusal.value).toBeNull()
    expect(store.changerEtape).not.toHaveBeenCalled()
  })

  it('handleDrop is a no-op when target etape equals current etape', async () => {
    const flow = makeFlow(store, toast)

    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: 'etape-1' })

    expect(store.changerEtape).not.toHaveBeenCalled()
    expect(toast.success).not.toHaveBeenCalled()
    expect(flow.pendingRefusal.value).toBeNull()
  })

  it('undo callback rolls back the etape change', async () => {
    const flow = makeFlow(store, toast)

    await flow.handleDrop({ candidatureId: 'cand-1', toEtapeId: 'etape-2' })

    const [, opts] = toast.success.mock.calls[0]
    store.changerEtape.mockClear()

    await opts!.undo!()

    expect(store.changerEtape).toHaveBeenCalledWith('cand-1', 'etape-1', 'Annulation', { toast: false })
  })
})
