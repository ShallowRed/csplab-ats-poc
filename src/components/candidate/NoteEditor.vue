<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import RiIcon from '@/components/ui/icon/RiIcon.vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: false, blockquote: false, code: false, codeBlock: false, horizontalRule: false }),
    Placeholder.configure({ placeholder: 'Ajouter une note interne…' }),
  ],
  content: props.modelValue,
  editable: !props.disabled,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getText().trim() ? editor.getHTML() : '')
  },
})

watch(() => props.disabled, (val) => {
  editor.value?.setEditable(!val)
})

watch(() => props.modelValue, (val) => {
  if (!editor.value) return
  const current = editor.value.getHTML()
  if (current !== val) {
    editor.value.commands.setContent(val || '', false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="note-editor">
    <div
      class="note-editor__toolbar"
      role="toolbar"
      aria-label="Mise en forme"
    >
      <Button
        type="button"
        variant="tertiary-no-outline"
        size="icon"
        class="h-7 w-7"
        :disabled="!editor || disabled"
        :aria-pressed="editor?.isActive('bold') ?? false"
        aria-label="Gras"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <RiIcon
          name="ri:bold"
          :size="14"
        />
      </Button>
      <Button
        type="button"
        variant="tertiary-no-outline"
        size="icon"
        class="h-7 w-7"
        :disabled="!editor || disabled"
        :aria-pressed="editor?.isActive('italic') ?? false"
        aria-label="Italique"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <RiIcon
          name="ri:italic"
          :size="14"
        />
      </Button>
      <Button
        type="button"
        variant="tertiary-no-outline"
        size="icon"
        class="h-7 w-7"
        :disabled="!editor || disabled"
        :aria-pressed="editor?.isActive('bulletList') ?? false"
        aria-label="Liste à puces"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <RiIcon
          name="ri:list-unordered"
          :size="14"
        />
      </Button>
      <Button
        type="button"
        variant="tertiary-no-outline"
        size="icon"
        class="h-7 w-7"
        :disabled="!editor || disabled"
        :aria-pressed="editor?.isActive('orderedList') ?? false"
        aria-label="Liste numérotée"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <RiIcon
          name="ri:list-ordered"
          :size="14"
        />
      </Button>
    </div>

    <EditorContent
      class="note-editor__content bg-background"
      :editor="editor"
    />
  </div>
</template>

<style scoped>
.note-editor {
  border: 1px solid var(--border-default-grey);
  border-radius: var(--csplab-radius-md);
  overflow: hidden;
}

.note-editor__toolbar {
  display: flex;
  gap: var(--csplab-space-1);
  padding: var(--csplab-space-1) var(--csplab-space-2);
  border-bottom: 1px solid var(--border-default-grey);
  background: var(--background-alt-grey);
}

.note-editor__content {
  padding: var(--csplab-space-3);
  min-height: 100px;
  font-size: var(--csplab-font-size-sm);
}

.note-editor__content :deep(.ProseMirror) {
  outline: none;
  min-height: 80px;
}

.note-editor__content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: var(--text-mention-grey);
  pointer-events: none;
  float: left;
  height: 0;
}

.note-editor__content :deep(.ProseMirror ul),
.note-editor__content :deep(.ProseMirror ol) {
  padding-left: var(--csplab-space-4);
}

.note-editor__content :deep(.ProseMirror strong) {
  font-weight: 700;
}
</style>
