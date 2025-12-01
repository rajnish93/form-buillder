/**
 * Confirm Dialog Composable
 * Provides a global confirm dialog utility that can be used anywhere in the app
 * Based on PrimeVue ConfirmationService
 */

interface ConfirmOptions {
  message?: string
  header?: string
  icon?: string
  acceptLabel?: string
  rejectLabel?: string
  accept?: () => void
  reject?: () => void
  acceptClass?: string
  rejectClass?: string
  acceptIcon?: string
  rejectIcon?: string
  blockScroll?: boolean
  dismissableMask?: boolean
  group?: string
  position?: string
}

/**
 * Global confirm dialog utility
 * Usage:
 * - confirm.require({ message: 'Are you sure?', accept: () => { ... } })
 * - confirm.delete('Delete this item?', () => { ... })
 */
export const useConfirmDialog = () => {
  // Ensure we're on client side
  if (process.server) {
    // Return a no-op implementation for SSR
    return {
      require: () => {},
      delete: () => {},
      destructive: () => {},
      confirm: () => {},
      raw: null
    }
  }

  // Get the confirm service (auto-imported by Nuxt)
  // Use try-catch to handle cases where service isn't available yet
  let confirm
  try {
    confirm = useConfirm()
  } catch (error) {
    // If confirm service isn't available, return no-op
    // This can happen if the plugin hasn't run yet
    console.warn('Confirmation service not available. Make sure ConfirmationService plugin is installed.', error)
    return {
      require: () => {},
      delete: () => {},
      destructive: () => {},
      confirm: () => {},
      raw: null
    }
  }

  return {
    /**
     * Show a confirmation dialog with custom options
     */
    require: (options: ConfirmOptions) => {
      confirm.require(options)
    },

    /**
     * Show a delete confirmation dialog
     */
    delete: (message: string, onAccept: () => void, onReject?: () => void) => {
      confirm.require({
        message: message || 'Are you sure you want to delete this item?',
        header: 'Delete Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: onAccept,
        reject: onReject
      })
    },

    /**
     * Show a confirmation dialog for destructive actions
     */
    destructive: (message: string, onAccept: () => void, onReject?: () => void) => {
      confirm.require({
        message: message || 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        acceptClass: 'p-button-danger',
        accept: onAccept,
        reject: onReject
      })
    },

    /**
     * Show a simple confirmation dialog
     */
    confirm: (message: string, onAccept: () => void, onReject?: () => void) => {
      confirm.require({
        message,
        header: 'Confirmation',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: onAccept,
        reject: onReject
      })
    },

    /**
     * Get the raw confirm service (for advanced usage)
     */
    raw: confirm
  }
}

