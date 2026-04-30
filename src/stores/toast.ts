import { defineStore } from 'pinia'
import { toast as sonnerToast } from 'vue-sonner'

type ToastOptions = {
  undo?: () => void | Promise<void>
}

export const useToastStore = defineStore('toast', () => {
  function success(message: string, options?: ToastOptions) {
    const duration = options?.undo ? 8000 : 5000
    sonnerToast.success(message, {
      duration,
      action: options?.undo
        ? {
            label: 'Annuler',
            onClick: () => {
              void options.undo?.()
            },
          }
        : undefined,
    })
  }

  function error(message: string) {
    sonnerToast.error(message, {
      duration: 5000,
    })
  }

  function info(message: string) {
    sonnerToast.info(message, {
      duration: 5000,
    })
  }

  return {
    success,
    error,
    info,
  }
})
