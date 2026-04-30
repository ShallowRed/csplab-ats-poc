import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSelectionStore = defineStore('selection', () => {
  const selectedIds = ref<Set<string>>(new Set())
  const selectAllMatching = ref(false)

  const count = computed(() => selectedIds.value.size)

  function isSelected(id: string): boolean {
    return selectedIds.value.has(id)
  }

  function toggle(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
    selectAllMatching.value = false
  }

  function selectRange(fromId: string, toId: string, allIdsInOrder: string[]) {
    const fromIndex = allIdsInOrder.indexOf(fromId)
    const toIndex = allIdsInOrder.indexOf(toId)
    
    if (fromIndex === -1 || toIndex === -1) return

    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)

    for (let i = start; i <= end; i++) {
      selectedIds.value.add(allIdsInOrder[i])
    }
    selectAllMatching.value = false
  }

  function selectAllVisible(visibleIds: string[]) {
    visibleIds.forEach(id => selectedIds.value.add(id))
    selectAllMatching.value = false
  }

  function selectAllMatchingAction() {
    selectAllMatching.value = true
  }

  function isAllVisibleSelected(visibleIds: string[]): boolean {
    if (visibleIds.length === 0) return false
    return visibleIds.every(id => selectedIds.value.has(id))
  }

  function clear() {
    selectedIds.value.clear()
    selectAllMatching.value = false
  }

  return {
    selectedIds,
    selectAllMatching,
    count,
    isSelected,
    toggle,
    selectRange,
    selectAllVisible,
    selectAllMatchingAction,
    isAllVisibleSelected,
    clear,
  }
})
