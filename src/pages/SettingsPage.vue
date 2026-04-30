<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/ui/empty-state'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useEtapesStore } from '@/stores/etapes'
import { useMotifsRefusStore } from '@/stores/motifsRefus'
import { useTemplatesStore } from '@/stores/templates'
import { useIntervieweursStore } from '@/stores/intervieweurs'
import { useToastStore } from '@/stores/toast'
import type { Intervieweur } from '@/types/domain'

type TabKey = 'etapes' | 'motifs' | 'templates' | 'intervieweurs'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const etapesStore = useEtapesStore()
const motifsStore = useMotifsRefusStore()
const templatesStore = useTemplatesStore()
const intervieweursStore = useIntervieweursStore()

const activeTab = computed<TabKey>({
  get() {
    const tab = route.query.tab
    if (tab === 'motifs' || tab === 'templates' || tab === 'intervieweurs') return tab
    return 'etapes'
  },
  set(value) {
    void router.replace({ path: route.path, query: { ...route.query, tab: value === 'etapes' ? undefined : value } })
  },
})

// ===== Étapes =====
function ajouterEtape(): void {
  etapesStore.ajouter()
}

function supprimerEtape(id: string): void {
  if (window.confirm('Supprimer cette étape ?')) {
    etapesStore.supprimer(id)
  }
}

function onLibelleChange(id: string, libelle: string): void {
  const current = etapesStore.etapes.find(e => e.id === id)
  if (!current) return
  const previousAutoCode = current.code === undefined || current.code === etapesStore.slugify(current.libelle)
  etapesStore.modifier(id, {
    libelle,
    code: previousAutoCode ? etapesStore.slugify(libelle) : current.code,
  })
}

function onCodeChange(id: string, code: string): void {
  etapesStore.modifier(id, { code: etapesStore.slugify(code) })
}

function onVisibleKanbanChange(id: string, visible: boolean): void {
  etapesStore.modifier(id, { visibleKanban: visible })
}

function deplacerHaut(id: string): void {
  etapesStore.deplacer(id, 'up')
}

function deplacerBas(id: string): void {
  etapesStore.deplacer(id, 'down')
}

// ===== Motifs =====
function ajouterMotif(): void {
  motifsStore.ajouter()
}

function supprimerMotif(id: string): void {
  if (window.confirm('Supprimer ce motif ?')) {
    motifsStore.supprimer(id)
  }
}

// ===== Templates =====
const selectedTemplateId = ref<string | null>(templatesStore.templates[0]?.id ?? null)
const draftTemplate = ref<{ nom: string; sujet: string; corps: string } | null>(null)

const selectedTemplate = computed(() => {
  if (!selectedTemplateId.value) return null
  return templatesStore.templates.find(t => t.id === selectedTemplateId.value) ?? null
})

function selectTemplate(id: string): void {
  selectedTemplateId.value = id
  const tpl = templatesStore.templates.find(t => t.id === id)
  draftTemplate.value = tpl ? { nom: tpl.nom, sujet: tpl.sujet, corps: tpl.corps } : null
}

function ensureDraft(): void {
  if (!selectedTemplate.value) return
  if (!draftTemplate.value) {
    draftTemplate.value = {
      nom: selectedTemplate.value.nom,
      sujet: selectedTemplate.value.sujet,
      corps: selectedTemplate.value.corps,
    }
  }
}

function enregistrerTemplate(): void {
  if (!selectedTemplate.value || !draftTemplate.value) return
  templatesStore.modifier(selectedTemplate.value.id, { ...draftTemplate.value })
  toast.success('Template enregistré')
}

function reinitialiserTemplate(): void {
  if (!selectedTemplate.value) return
  templatesStore.reinitialiser(selectedTemplate.value.id)
  draftTemplate.value = {
    nom: selectedTemplate.value.nom,
    sujet: selectedTemplate.value.sujet,
    corps: selectedTemplate.value.corps,
  }
  toast.success('Template réinitialisé')
}

function creerTemplate(): void {
  const tpl = templatesStore.creer()
  selectTemplate(tpl.id)
}

function supprimerTemplate(): void {
  if (!selectedTemplate.value) return
  if (!window.confirm('Supprimer ce template ?')) return
  const id = selectedTemplate.value.id
  templatesStore.supprimer(id)
  selectedTemplateId.value = templatesStore.templates[0]?.id ?? null
  draftTemplate.value = null
  if (selectedTemplateId.value) selectTemplate(selectedTemplateId.value)
}

if (selectedTemplateId.value) selectTemplate(selectedTemplateId.value)

// ===== Intervieweurs =====
const intervieweurDialogOpen = ref(false)
const intervieweurEditId = ref<string | null>(null)
const intervieweurForm = ref<{
  prenom: string
  nom: string
  email: string
  role: Intervieweur['role']
  equipe: string
  avatarUrl: string
}>({ prenom: '', nom: '', email: '', role: 'rh', equipe: '', avatarUrl: '' })

function openCreateIntervieweur(): void {
  intervieweurEditId.value = null
  intervieweurForm.value = { prenom: '', nom: '', email: '', role: 'rh', equipe: '', avatarUrl: '' }
  intervieweurDialogOpen.value = true
}

function openEditIntervieweur(intervieweur: Intervieweur): void {
  intervieweurEditId.value = intervieweur.id
  intervieweurForm.value = {
    prenom: intervieweur.prenom,
    nom: intervieweur.nom,
    email: intervieweur.email,
    role: intervieweur.role,
    equipe: intervieweur.equipe ?? '',
    avatarUrl: intervieweur.avatarUrl ?? '',
  }
  intervieweurDialogOpen.value = true
}

function submitIntervieweur(): void {
  const payload: Omit<Intervieweur, 'id'> = {
    prenom: intervieweurForm.value.prenom.trim(),
    nom: intervieweurForm.value.nom.trim(),
    email: intervieweurForm.value.email.trim(),
    role: intervieweurForm.value.role,
    equipe: intervieweurForm.value.equipe.trim() || undefined,
    avatarUrl: intervieweurForm.value.avatarUrl.trim() || undefined,
  }
  if (!payload.prenom || !payload.nom) {
    toast.error('Le prénom et le nom sont requis')
    return
  }
  if (intervieweurEditId.value) {
    intervieweursStore.modifier(intervieweurEditId.value, payload)
    toast.success('Intervieweur modifié')
  } else {
    intervieweursStore.creer(payload)
    toast.success('Intervieweur ajouté')
  }
  intervieweurDialogOpen.value = false
}

function supprimerIntervieweur(intervieweur: Intervieweur): void {
  if (intervieweursStore.isUsedByOffre(intervieweur.id)) {
    toast.error('Cet intervieweur est utilisé sur une offre — impossible de le supprimer')
    return
  }
  if (!window.confirm(`Supprimer ${intervieweur.prenom} ${intervieweur.nom} ?`)) return
  intervieweursStore.supprimer(intervieweur.id)
  toast.success('Intervieweur supprimé')
}

function getInitiales(intervieweur: Intervieweur): string {
  return intervieweursStore.initiales(intervieweur)
}

const roleOptions: { value: Intervieweur['role']; label: string }[] = [
  { value: 'rh', label: 'RH' },
  { value: 'manager', label: 'Manager' },
  { value: 'expert', label: 'Expert' },
]

function roleLabel(role: Intervieweur['role']): string {
  return roleOptions.find(r => r.value === role)?.label ?? role
}
</script>

<template>
  <div class="csplab-settings">
    <Tabs
      :model-value="activeTab"
      @update:model-value="(v) => (activeTab = v as TabKey)"
    >
      <!-- Onglets rendus dans le header global via meta.viewSwitcher -->

      <!-- ===== Étapes ===== -->
      <TabsContent value="etapes" class="csplab-settings__tab">
        <div class="csplab-settings__tab-header">
          <p class="csplab-settings__help">
            Configurez les étapes du pipeline. Décochez « Visible kanban » pour masquer une étape de la vue kanban.
          </p>
          <Button type="button" variant="primary" @click="ajouterEtape">
            <RiIcon name="ri:add-line" :size="16" />
            Ajouter une étape
          </Button>
        </div>

        <div v-if="etapesStore.etapesTriees.length === 0">
          <EmptyState
            icon="ri:flow-chart"
            title="Aucune étape configurée"
            description="Ajoutez votre première étape pour commencer."
          />
        </div>

        <div v-else class="csplab-settings__table-wrap">
          <table class="csplab-settings__table">
            <thead>
              <tr>
                <th class="csplab-settings__th-narrow">Ordre</th>
                <th>Libellé</th>
                <th>Code</th>
                <th class="csplab-settings__th-narrow">Visible kanban</th>
                <th class="csplab-settings__th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(etape, index) in etapesStore.etapesTriees"
                :key="etape.id"
              >
                <td>
                  <div class="csplab-settings__order">
                    <span class="csplab-settings__ordre-num">{{ etape.ordre }}</span>
                    <button
                      type="button"
                      class="csplab-settings__icon-btn"
                      :disabled="index === 0"
                      :aria-label="`Monter ${etape.libelle}`"
                      @click="deplacerHaut(etape.id)"
                    >
                      <RiIcon name="ri:arrow-up-s-line" :size="14" />
                    </button>
                    <button
                      type="button"
                      class="csplab-settings__icon-btn"
                      :disabled="index === etapesStore.etapesTriees.length - 1"
                      :aria-label="`Descendre ${etape.libelle}`"
                      @click="deplacerBas(etape.id)"
                    >
                      <RiIcon name="ri:arrow-down-s-line" :size="14" />
                    </button>
                  </div>
                </td>
                <td>
                  <Input
                    :model-value="etape.libelle"
                    :aria-label="`Libellé de l'étape ${etape.ordre}`"
                    @update:model-value="(v) => onLibelleChange(etape.id, String(v))"
                  />
                </td>
                <td>
                  <Input
                    :model-value="etape.code ?? etapesStore.slugify(etape.libelle)"
                    :aria-label="`Code de l'étape ${etape.ordre}`"
                    @update:model-value="(v) => onCodeChange(etape.id, String(v))"
                  />
                </td>
                <td>
                  <div class="csplab-settings__check">
                    <Checkbox
                      :id="`etape-vis-${etape.id}`"
                      :checked="etape.visibleKanban"
                      :aria-label="`Visible kanban pour ${etape.libelle}`"
                      @update:checked="(v) => onVisibleKanbanChange(etape.id, Boolean(v))"
                    />
                  </div>
                </td>
                <td>
                  <Button
                    type="button"
                    variant="tertiary"
                    size="sm"
                    :aria-label="`Supprimer ${etape.libelle}`"
                    @click="supprimerEtape(etape.id)"
                  >
                    <RiIcon name="ri:delete-bin-line" :size="14" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      <!-- ===== Motifs de refus ===== -->
      <TabsContent value="motifs" class="csplab-settings__tab">
        <div class="csplab-settings__tab-header">
          <p class="csplab-settings__help">
            Ces motifs apparaissent dans la modale de refus côté kanban.
          </p>
          <Button type="button" variant="primary" @click="ajouterMotif">
            <RiIcon name="ri:add-line" :size="16" />
            Ajouter un motif
          </Button>
        </div>

        <div v-if="motifsStore.motifs.length === 0">
          <EmptyState
            icon="ri:close-circle-line"
            title="Aucun motif configuré"
            description="Ajoutez un premier motif de refus."
          />
        </div>

        <div v-else class="csplab-settings__cards">
          <div
            v-for="motif in motifsStore.motifs"
            :key="motif.id"
            class="csplab-settings__card"
          >
            <div class="csplab-settings__card-header">
              <Input
                :model-value="motif.libelle"
                aria-label="Libellé du motif"
                placeholder="Libellé du motif"
                @update:model-value="(v) => motifsStore.modifier(motif.id, { libelle: String(v) })"
              />
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                :aria-label="`Supprimer ${motif.libelle}`"
                @click="supprimerMotif(motif.id)"
              >
                <RiIcon name="ri:delete-bin-line" :size="14" />
              </Button>
            </div>
            <Textarea
              :model-value="motif.texteType"
              :rows="4"
              aria-label="Texte type du motif"
              placeholder="Texte type envoyé au candidat"
              @update:model-value="(v) => motifsStore.modifier(motif.id, { texteType: String(v) })"
            />
          </div>
        </div>
      </TabsContent>

      <!-- ===== Templates ===== -->
      <TabsContent value="templates" class="csplab-settings__tab">
        <div class="csplab-settings__tab-header">
          <div class="csplab-settings__help">
            <p>Variables disponibles :</p>
            <ul class="csplab-settings__var-list">
              <li><code>{candidat.prenom}</code></li>
              <li><code>{candidat.nom}</code></li>
              <li><code>{offre.intitule}</code></li>
              <li><code>{lien.entretien}</code></li>
            </ul>
          </div>
          <Button type="button" variant="primary" @click="creerTemplate">
            <RiIcon name="ri:add-line" :size="16" />
            Nouveau template
          </Button>
        </div>

        <div v-if="templatesStore.templates.length === 0">
          <EmptyState
            icon="ri:mail-line"
            title="Aucun template"
            description="Créez votre premier template email."
          />
        </div>

        <div v-else class="csplab-settings__templates">
          <aside class="csplab-settings__templates-list">
            <button
              v-for="template in templatesStore.templates"
              :key="template.id"
              type="button"
              class="csplab-settings__template-item"
              :class="{ 'csplab-settings__template-item--active': selectedTemplateId === template.id }"
              @click="selectTemplate(template.id)"
            >
              <span class="csplab-settings__template-name">{{ template.nom || 'Sans nom' }}</span>
              <span class="csplab-settings__template-subject">{{ template.sujet || '—' }}</span>
            </button>
          </aside>

          <section
            v-if="selectedTemplate && draftTemplate"
            class="csplab-settings__template-editor"
            @input="ensureDraft"
          >
            <div class="csplab-settings__field">
              <Label :for="`tpl-nom-${selectedTemplate.id}`">Nom</Label>
              <Input
                :id="`tpl-nom-${selectedTemplate.id}`"
                v-model="draftTemplate.nom"
              />
            </div>
            <div class="csplab-settings__field">
              <Label :for="`tpl-sujet-${selectedTemplate.id}`">Sujet</Label>
              <Input
                :id="`tpl-sujet-${selectedTemplate.id}`"
                v-model="draftTemplate.sujet"
              />
            </div>
            <div class="csplab-settings__field">
              <Label :for="`tpl-corps-${selectedTemplate.id}`">Corps</Label>
              <Textarea
                :id="`tpl-corps-${selectedTemplate.id}`"
                v-model="draftTemplate.corps"
                :rows="12"
              />
            </div>
            <div class="csplab-settings__template-actions">
              <Button
                type="button"
                variant="tertiary"
                :disabled="!templatesStore.isOriginal(selectedTemplate.id)"
                @click="reinitialiserTemplate"
              >
                Réinitialiser
              </Button>
              <Button
                type="button"
                variant="tertiary"
                @click="supprimerTemplate"
              >
                Supprimer
              </Button>
              <Button type="button" variant="primary" @click="enregistrerTemplate">
                Enregistrer
              </Button>
            </div>
          </section>
        </div>
      </TabsContent>

      <!-- ===== Intervieweurs ===== -->
      <TabsContent value="intervieweurs" class="csplab-settings__tab">
        <div class="csplab-settings__tab-header">
          <p class="csplab-settings__help">
            Liste des intervieweurs disponibles pour les entretiens.
          </p>
          <Button type="button" variant="primary" @click="openCreateIntervieweur">
            <RiIcon name="ri:add-line" :size="16" />
            Ajouter un intervieweur
          </Button>
        </div>

        <div v-if="intervieweursStore.intervieweurs.length === 0">
          <EmptyState
            icon="ri:user-follow-line"
            title="Aucun intervieweur"
            description="Ajoutez votre premier intervieweur."
          />
        </div>

        <div v-else class="csplab-settings__table-wrap">
          <table class="csplab-settings__table">
            <thead>
              <tr>
                <th class="csplab-settings__th-narrow">Avatar</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Équipe</th>
                <th class="csplab-settings__th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="intervieweur in intervieweursStore.intervieweurs"
                :key="intervieweur.id"
              >
                <td>
                  <Avatar class="csplab-settings__avatar">
                    <AvatarImage v-if="intervieweur.avatarUrl" :src="intervieweur.avatarUrl" />
                    <AvatarFallback>{{ getInitiales(intervieweur) }}</AvatarFallback>
                  </Avatar>
                </td>
                <td>
                  <div class="csplab-settings__person">
                    <strong>{{ intervieweur.prenom }} {{ intervieweur.nom }}</strong>
                    <span class="csplab-settings__muted">{{ intervieweur.email }}</span>
                  </div>
                </td>
                <td>{{ roleLabel(intervieweur.role) }}</td>
                <td>{{ intervieweur.equipe ?? '—' }}</td>
                <td>
                  <div class="csplab-settings__row-actions">
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      :aria-label="`Modifier ${intervieweur.prenom} ${intervieweur.nom}`"
                      @click="openEditIntervieweur(intervieweur)"
                    >
                      <RiIcon name="ri:pencil-line" :size="14" />
                    </Button>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      :aria-label="`Supprimer ${intervieweur.prenom} ${intervieweur.nom}`"
                      @click="supprimerIntervieweur(intervieweur)"
                    >
                      <RiIcon name="ri:delete-bin-line" :size="14" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="intervieweurDialogOpen">
      <DialogContent class="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {{ intervieweurEditId ? 'Modifier l\'intervieweur' : 'Ajouter un intervieweur' }}
          </DialogTitle>
          <DialogDescription>
            Renseignez les informations principales.
          </DialogDescription>
        </DialogHeader>

        <div class="csplab-settings__dialog-grid">
          <div class="csplab-settings__field">
            <Label for="int-prenom">Prénom</Label>
            <Input id="int-prenom" v-model="intervieweurForm.prenom" />
          </div>
          <div class="csplab-settings__field">
            <Label for="int-nom">Nom</Label>
            <Input id="int-nom" v-model="intervieweurForm.nom" />
          </div>
          <div class="csplab-settings__field csplab-settings__field--span-2">
            <Label for="int-email">Email</Label>
            <Input id="int-email" v-model="intervieweurForm.email" type="email" />
          </div>
          <div class="csplab-settings__field">
            <Label for="int-role">Rôle</Label>
            <select
              id="int-role"
              v-model="intervieweurForm.role"
              class="csplab-settings__select"
            >
              <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="csplab-settings__field">
            <Label for="int-equipe">Équipe</Label>
            <Input id="int-equipe" v-model="intervieweurForm.equipe" placeholder="Ex. Pôle data" />
          </div>
          <div class="csplab-settings__field csplab-settings__field--span-2">
            <Label for="int-avatar">URL avatar (optionnel)</Label>
            <Input id="int-avatar" v-model="intervieweurForm.avatarUrl" placeholder="https://..." />
          </div>
        </div>

        <DialogFooter class="gap-2">
          <Button type="button" variant="tertiary" @click="intervieweurDialogOpen = false">
            Annuler
          </Button>
          <Button type="button" variant="primary" @click="submitIntervieweur">
            {{ intervieweurEditId ? 'Enregistrer' : 'Ajouter' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.csplab-settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--csplab-space-6);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.csplab-settings__tab {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-4);
}

.csplab-settings__tab-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--csplab-space-4);
}

.csplab-settings__help {
  margin: 0;
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-sm);
}

.csplab-settings__var-list {
  margin: var(--csplab-space-1) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--csplab-space-2);
}

.csplab-settings__var-list code {
  background: var(--background-alt-grey);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: var(--csplab-font-size-xs);
}

.csplab-settings__table-wrap {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-sm);
  overflow: hidden;
  background: var(--background-default-grey);
}

.csplab-settings__table {
  width: 100%;
  border-collapse: collapse;
}

.csplab-settings__table thead th {
  text-align: left;
  padding: var(--csplab-space-3);
  background: var(--background-alt-grey);
  font-size: var(--csplab-font-size-xs);
  font-weight: 600;
  color: var(--text-default-grey);
  border-bottom: 1px solid var(--border-default-grey);
}

.csplab-settings__table tbody td {
  padding: var(--csplab-space-2) var(--csplab-space-3);
  border-bottom: 1px solid var(--border-default-grey);
  vertical-align: middle;
}

.csplab-settings__table tbody tr:last-child td {
  border-bottom: 0;
}

.csplab-settings__th-narrow {
  width: 110px;
}

.csplab-settings__th-actions {
  width: 120px;
  text-align: right;
}

.csplab-settings__order {
  display: flex;
  align-items: center;
  gap: var(--csplab-space-1);
}

.csplab-settings__ordre-num {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  width: 24px;
}

.csplab-settings__icon-btn {
  appearance: none;
  border: 1px solid var(--border-default-grey);
  background: var(--background-default-grey);
  border-radius: 3px;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-default-grey);
}

.csplab-settings__icon-btn:hover:not(:disabled) {
  background: var(--background-alt-grey);
}

.csplab-settings__icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.csplab-settings__check {
  display: flex;
  justify-content: center;
}

.csplab-settings__row-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--csplab-space-1);
}

.csplab-settings__cards {
  display: grid;
  gap: var(--csplab-space-3);
}

.csplab-settings__card {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-sm);
  padding: var(--csplab-space-3);
  background: var(--background-default-grey);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-2);
}

.csplab-settings__card-header {
  display: flex;
  gap: var(--csplab-space-2);
  align-items: center;
}

.csplab-settings__card-header > :first-child {
  flex: 1;
}

.csplab-settings__templates {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--csplab-space-4);
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-sm);
  background: var(--background-default-grey);
  min-height: 480px;
}

.csplab-settings__templates-list {
  border-right: 1px solid var(--border-default-grey);
  padding: var(--csplab-space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: auto;
}

.csplab-settings__template-item {
  appearance: none;
  border: 0;
  background: transparent;
  text-align: left;
  padding: var(--csplab-space-2);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.csplab-settings__template-item:hover {
  background: var(--background-alt-grey);
}

.csplab-settings__template-item--active {
  background: var(--background-alt-blue-france);
  color: var(--text-action-high-blue-france);
}

.csplab-settings__template-name {
  font-weight: 600;
  font-size: var(--csplab-font-size-sm);
}

.csplab-settings__template-subject {
  font-size: var(--csplab-font-size-xs);
  color: var(--text-mention-grey);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.csplab-settings__template-editor {
  padding: var(--csplab-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-3);
}

.csplab-settings__field {
  display: flex;
  flex-direction: column;
  gap: var(--csplab-space-1);
}

.csplab-settings__template-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--csplab-space-2);
  padding-top: var(--csplab-space-2);
  border-top: 1px solid var(--border-default-grey);
}

.csplab-settings__avatar {
  width: 32px;
  height: 32px;
}

.csplab-settings__person {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.csplab-settings__muted {
  color: var(--text-mention-grey);
  font-size: var(--csplab-font-size-xs);
}

.csplab-settings__dialog-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--csplab-space-3);
}

.csplab-settings__field--span-2 {
  grid-column: 1 / -1;
}

.csplab-settings__select {
  height: 36px;
  padding: 0 var(--csplab-space-2);
  border: 1px solid var(--border-default-grey);
  border-radius: 3px;
  background: var(--background-default-grey);
  color: var(--text-default-grey);
  font-size: var(--csplab-font-size-sm);
}
</style>
