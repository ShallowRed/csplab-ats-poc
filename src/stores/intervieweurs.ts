import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Intervieweur } from '../types/domain'
import { seed } from '../data/seed'
import { useOffresStore } from './offres'

export const useIntervieweursStore = defineStore('intervieweurs', () => {
  const intervieweurs = ref<Intervieweur[]>(seed.intervieweurs.map(i => ({ ...i })))

  function load(): void {
    intervieweurs.value = seed.intervieweurs.map(i => ({ ...i }))
  }

  function nextId(): string {
    const nums = intervieweurs.value
      .map(i => Number.parseInt(i.id.replace(/^int-/, ''), 10))
      .filter(n => !Number.isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `int-${max + 1}`
  }

  function creer(payload: Omit<Intervieweur, 'id'>): Intervieweur {
    const intervieweur: Intervieweur = { id: nextId(), ...payload }
    intervieweurs.value.push(intervieweur)
    return intervieweur
  }

  function modifier(id: string, patch: Partial<Intervieweur>): void {
    const intervieweur = intervieweurs.value.find(i => i.id === id)
    if (!intervieweur) return
    Object.assign(intervieweur, patch)
  }

  function supprimer(id: string): void {
    const index = intervieweurs.value.findIndex(i => i.id === id)
    if (index === -1) return
    intervieweurs.value.splice(index, 1)
  }

  function getById(id: string): Intervieweur | undefined {
    return intervieweurs.value.find(i => i.id === id)
  }

  function isUsedByOffre(id: string): boolean {
    const offresStore = useOffresStore()
    return offresStore.offres.some(o =>
      o.responsableId === id || (o.intervieweursDefautIds?.includes(id) ?? false),
    )
  }

  const initiales = computed(() => (intervieweur: Intervieweur): string => {
    const a = intervieweur.prenom?.charAt(0) ?? ''
    const b = intervieweur.nom?.charAt(0) ?? ''
    return `${a}${b}`.toUpperCase() || '??'
  })

  return {
    intervieweurs,
    initiales,
    load,
    creer,
    modifier,
    supprimer,
    getById,
    isUsedByOffre,
  }
})
