/**
 * Confirm Dialog Plugin
 * Installs PrimeVue ConfirmationService globally
 * Must run before components that use confirm dialogs
 */
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin({
  name: 'confirm-service',
  enforce: 'pre', // Run before other plugins
  parallel: false, // Run synchronously
  setup(nuxtApp) {
    // Install ConfirmationService immediately
    nuxtApp.vueApp.use(ConfirmationService)
  }
})

