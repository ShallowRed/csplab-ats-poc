import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import NoteEditor from '@/components/candidate/NoteEditor.vue'

const meta = {
  title: '06 — Sections ATS/Candidatures/NoteEditor',
  component: NoteEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Éditeur Tiptap pour les notes internes (gras, italique, listes). Cmd+Entrée pour soumettre.',
      },
    },
  },
} satisfies Meta<typeof NoteEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Vide: Story = {
  render: () => ({
    components: { NoteEditor },
    setup: () => ({ value: ref('') }),
    template: '<div style="max-width: 520px;"><NoteEditor v-model="value" /></div>',
  }),
}

export const PreRempli: Story = {
  render: () => ({
    components: { NoteEditor },
    setup: () => ({ value: ref('<p>Premier échange téléphonique <strong>très positif</strong>. À rappeler la semaine prochaine pour préciser ses contraintes de mobilité.</p>') }),
    template: '<div style="max-width: 520px;"><NoteEditor v-model="value" /></div>',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NoteEditor },
    setup: () => ({ value: ref('<p>Note en lecture seule</p>') }),
    template: '<div style="max-width: 520px;"><NoteEditor v-model="value" disabled /></div>',
  }),
}
