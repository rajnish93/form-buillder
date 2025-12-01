import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-27',
  devtools: { enabled: true },
  
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt'
  ],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: false
        }
      },
      ripple: true,
      inputStyle: 'filled'
    },
    components: {
      include: ['*']
    },
    directives: {
      include: ['*']
    },
    // Composables configuration - explicitly include Toast and Confirm
    composables: {
      include: ['useToast', 'useConfirm']
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Dynamic Form Builder',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  pinia: {
    storesDirs: ['./stores', './types'],
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
})