<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  open: boolean
  candidatLabel: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm', payload: { motif: string; commentaire?: string }): void
  (e: 'update:open', value: boolean): void
}>()

const motifs = [
  'Profil non aligné avec le poste',
  "Manque d'expérience requise",
  'Niveau de rémunération non aligné',
  'Indisponibilité',
] as const

const selectedMotif = ref<(typeof motifs)[number]>(motifs[0])
const commentaire = ref('')

watch(
  () => props.open,
  (value) => {
    if (!value) return
    selectedMotif.value = motifs[0]
    commentaire.value = ''
  },
)

const modelOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

function onCancel(): void {
  emit('cancel')
  emit('update:open', false)
}

function onConfirm(): void {
  emit('confirm', {
    motif: selectedMotif.value,
    commentaire: commentaire.value || undefined,
  })
  emit('update:open', false)
}
</script>

<template>
  <Dialog v-model:open="modelOpen">
    <DialogContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Motif de refus</DialogTitle>
        <DialogDescription>
          Vous allez refuser {{ candidatLabel }}. Sélectionnez un motif.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4">
        <RadioGroup
          v-model="selectedMotif"
          class="grid gap-2"
        >
          <div
            v-for="motif in motifs"
            :key="motif"
            class="flex items-center gap-2"
          >
            <RadioGroupItem
              :id="`motif-${motif}`"
              :value="motif"
            />
            <Label :for="`motif-${motif}`">{{ motif }}</Label>
          </div>
        </RadioGroup>

        <div class="grid gap-2">
          <Label for="commentaire">Commentaire interne (optionnel)</Label>
          <Textarea
            id="commentaire"
            v-model="commentaire"
            placeholder="Ajouter un contexte interne…"
            rows="3"
          />
        </div>
      </div>

      <DialogFooter class="gap-2">
        <Button
          type="button"
          variant="outline"
          @click="onCancel"
        >
          Annuler
        </Button>
        <Button
          type="button"
          variant="destructive"
          @click="onConfirm"
        >
          Confirmer le rejet
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
