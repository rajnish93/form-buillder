/**
 * Toast Composable
 * Provides a global toast utility that can be used anywhere in the app
 * Based on PrimeVue ToastService
 */

interface ToastOptions {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  summary?: string
  detail?: string
  life?: number
  group?: string
  closable?: boolean
}

/**
 * Global toast utility
 * Usage:
 * - toast.success('Operation completed')
 * - toast.error('Something went wrong', 'Error details')
 * - toast.info('Info message', 'Details', 5000)
 */
export const useToastMessage = () => {
  // Get the toast service (auto-imported by Nuxt)
  // Ensure we're on client side
  if (process.server) {
    // Return a no-op implementation for SSR
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      warn: () => {},
      show: () => {},
      clear: () => {},
      raw: null
    }
  }

  // Get the toast service (auto-imported by Nuxt)
  // Use try-catch to handle cases where service isn't available yet
  let toast
  try {
    toast = useToast()
  } catch (error) {
    // If toast service isn't available, return no-op
    console.warn('Toast service not available:', error)
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      warn: () => {},
      show: () => {},
      clear: () => {},
      raw: null
    }
  }

  return {
    /**
     * Show a success toast
     */
    success: (message: string, detail?: string, life?: number) => {
      toast.add({
        severity: 'success',
        summary: message,
        detail,
        life: life || 3000
      })
    },

    /**
     * Show an error toast
     */
    error: (message: string, detail?: string, life?: number) => {
      toast.add({
        severity: 'error',
        summary: message,
        detail,
        life: life || 5000
      })
    },

    /**
     * Show an info toast
     */
    info: (message: string, detail?: string, life?: number) => {
      toast.add({
        severity: 'info',
        summary: message,
        detail,
        life: life || 3000
      })
    },

    /**
     * Show a warning toast
     */
    warn: (message: string, detail?: string, life?: number) => {
      toast.add({
        severity: 'warn',
        summary: message,
        detail,
        life: life || 3000
      })
    },

    /**
     * Show a custom toast with full options
     */
    show: (options: ToastOptions) => {
      toast.add(options)
    },

    /**
     * Clear all toasts
     */
    clear: () => {
      toast.removeAllGroups()
    },

    /**
     * Get the raw toast service (for advanced usage)
     */
    raw: toast
  }
}

