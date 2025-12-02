/**
 * Toast Plugin
 * Installs PrimeVue ToastService globally
 * Must run before other plugins that use toast
 */
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin({
  name: 'toast-service',
  enforce: 'pre', // Run before other plugins
  parallel: false, // Run synchronously
  setup(nuxtApp) {
    nuxtApp.vueApp.use(ToastService)
  }
})

