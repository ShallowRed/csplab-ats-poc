import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem } from '@/components/ui/combobox'
import { ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxViewport } from 'radix-vue'
import { Label } from '@/components/ui/label'

const meta = {
  title: '02 — Atomes/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Combobox headless basé sur Radix Vue. Utilisé pour les sélections autocomplétables (intervieweurs, tags, étapes). Voir aussi `OffreSelector` (composant métier).',
      },
    },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const PROFILS = ['Frontend Senior', 'Frontend Junior', 'Backend Node', 'Data Engineer', 'Product Manager', 'UX Designer']

export const Default: Story = {
  render: () => ({
    components: { Combobox, ComboboxAnchor, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty, ComboboxGroup, ComboboxViewport, Label },
    setup: () => ({ value: ref(''), profils: PROFILS }),
    template: `
      <div style="max-width: 320px; display: flex; flex-direction: column; gap: var(--csplab-space-2);">
        <Label>Chercher un poste</Label>
        <Combobox v-model="value">
          <ComboboxAnchor>
            <ComboboxInput placeholder="Tapez un mot-clé…" />
          </ComboboxAnchor>
          <ComboboxContent>
            <ComboboxViewport>
              <ComboboxEmpty>Aucun résultat</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="p in profils" :key="p" :value="p">{{ p }}</ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxContent>
        </Combobox>
      </div>
    `,
  }),
}
