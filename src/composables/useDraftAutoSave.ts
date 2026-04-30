import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

const drafts = new Map<string, unknown>()

export function useDraftAutoSave<T>(
  data: Ref<T>,
  key: string,
  intervalMs = 30_000,
): {
  lastSavedAt: Ref<number | null>
  saveNow: () => void
  loadDraft: () => T | undefined
  clearDraft: () => void
} {
  const lastSavedAt = ref<number | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null

  function saveNow(): void {
    drafts.set(key, JSON.parse(JSON.stringify(data.value)))
    lastSavedAt.value = Date.now()
  }

  function loadDraft(): T | undefined {
    return drafts.get(key) as T | undefined
  }

  function clearDraft(): void {
    drafts.delete(key)
    lastSavedAt.value = null
  }

  let dirty = false
  const stopWatch = watch(data, () => { dirty = true }, { deep: true })

  timer = setInterval(() => {
    if (dirty) {
      saveNow()
      dirty = false
    }
  }, intervalMs)

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
    stopWatch()
  })

  return { lastSavedAt, saveNow, loadDraft, clearDraft }
}
