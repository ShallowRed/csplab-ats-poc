import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '../types/domain'
import { seed } from '../data/seed'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>(seed.templates.map(t => ({ ...t })))
  const snapshot: Template[] = seed.templates.map(t => ({ ...t }))

  function load(): void {
    templates.value = seed.templates.map(t => ({ ...t }))
  }

  function nextId(): string {
    const nums = templates.value
      .map(t => Number.parseInt(t.id.replace(/^tpl-/, ''), 10))
      .filter(n => !Number.isNaN(n))
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `tpl-${max + 1}`
  }

  function creer(nom = 'Nouveau template', sujet = '', corps = ''): Template {
    const template: Template = { id: nextId(), nom, sujet, corps }
    templates.value.push(template)
    return template
  }

  function modifier(id: string, patch: Partial<Template>): void {
    const template = templates.value.find(t => t.id === id)
    if (!template) return
    Object.assign(template, patch)
  }

  function supprimer(id: string): void {
    const index = templates.value.findIndex(t => t.id === id)
    if (index === -1) return
    templates.value.splice(index, 1)
  }

  function reinitialiser(id: string): void {
    const original = snapshot.find(t => t.id === id)
    const current = templates.value.find(t => t.id === id)
    if (!original || !current) return
    current.nom = original.nom
    current.sujet = original.sujet
    current.corps = original.corps
  }

  function isOriginal(id: string): boolean {
    return snapshot.some(t => t.id === id)
  }

  return { templates, load, creer, modifier, supprimer, reinitialiser, isOriginal }
})
