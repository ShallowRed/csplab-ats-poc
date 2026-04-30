import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSelectionStore } from '../../../src/stores/selection'

describe('Selection Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize empty', () => {
    const store = useSelectionStore()
    
    expect(store.count).toBe(0)
    expect(store.selectAllMatching).toBe(false)
  })

  it('should toggle selection', () => {
    const store = useSelectionStore()
    
    store.toggle('id-1')
    expect(store.isSelected('id-1')).toBe(true)
    expect(store.count).toBe(1)
    
    store.toggle('id-1')
    expect(store.isSelected('id-1')).toBe(false)
    expect(store.count).toBe(0)
  })

  it('should select multiple items', () => {
    const store = useSelectionStore()
    
    store.toggle('id-1')
    store.toggle('id-2')
    store.toggle('id-3')
    
    expect(store.count).toBe(3)
    expect(store.isSelected('id-1')).toBe(true)
    expect(store.isSelected('id-2')).toBe(true)
    expect(store.isSelected('id-3')).toBe(true)
  })

  it('should select range (Shift-click simulation)', () => {
    const store = useSelectionStore()
    const allIds = ['id-1', 'id-2', 'id-3', 'id-4', 'id-5']
    
    store.selectRange('id-2', 'id-4', allIds)
    
    expect(store.isSelected('id-1')).toBe(false)
    expect(store.isSelected('id-2')).toBe(true)
    expect(store.isSelected('id-3')).toBe(true)
    expect(store.isSelected('id-4')).toBe(true)
    expect(store.isSelected('id-5')).toBe(false)
    expect(store.count).toBe(3)
  })

  it('should select range in reverse order', () => {
    const store = useSelectionStore()
    const allIds = ['id-1', 'id-2', 'id-3', 'id-4', 'id-5']
    
    store.selectRange('id-4', 'id-2', allIds)
    
    expect(store.isSelected('id-2')).toBe(true)
    expect(store.isSelected('id-3')).toBe(true)
    expect(store.isSelected('id-4')).toBe(true)
    expect(store.count).toBe(3)
  })

  it('should select all visible items', () => {
    const store = useSelectionStore()
    const visibleIds = ['id-1', 'id-2', 'id-3']
    
    store.selectAllVisible(visibleIds)
    
    expect(store.count).toBe(3)
    expect(store.isAllVisibleSelected(visibleIds)).toBe(true)
  })

  it('should detect when all visible are selected', () => {
    const store = useSelectionStore()
    const visibleIds = ['id-1', 'id-2', 'id-3']
    
    expect(store.isAllVisibleSelected(visibleIds)).toBe(false)
    
    store.toggle('id-1')
    store.toggle('id-2')
    expect(store.isAllVisibleSelected(visibleIds)).toBe(false)
    
    store.toggle('id-3')
    expect(store.isAllVisibleSelected(visibleIds)).toBe(true)
  })

  it('should handle empty visible list', () => {
    const store = useSelectionStore()
    
    expect(store.isAllVisibleSelected([])).toBe(false)
  })

  it('should set selectAllMatching flag', () => {
    const store = useSelectionStore()
    
    store.selectAllMatchingAction()
    expect(store.selectAllMatching).toBe(true)
  })

  it('should clear all selections', () => {
    const store = useSelectionStore()
    
    store.toggle('id-1')
    store.toggle('id-2')
    store.selectAllMatchingAction()
    
    expect(store.count).toBe(2)
    expect(store.selectAllMatching).toBe(true)
    
    store.clear()
    
    expect(store.count).toBe(0)
    expect(store.selectAllMatching).toBe(false)
  })

  it('should reset selectAllMatching on toggle', () => {
    const store = useSelectionStore()
    
    store.selectAllMatchingAction()
    expect(store.selectAllMatching).toBe(true)
    
    store.toggle('id-1')
    expect(store.selectAllMatching).toBe(false)
  })

  it('should reset selectAllMatching on selectRange', () => {
    const store = useSelectionStore()
    const allIds = ['id-1', 'id-2', 'id-3']
    
    store.selectAllMatchingAction()
    expect(store.selectAllMatching).toBe(true)
    
    store.selectRange('id-1', 'id-2', allIds)
    expect(store.selectAllMatching).toBe(false)
  })
})
