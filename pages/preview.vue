<template>
    <div class="preview-page min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between max-w-4xl mx-auto">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Form Preview
          </h1>
          <div class="flex items-center gap-2">
            <Button
              :label="darkMode ? 'Light' : 'Dark'"
              text
              @click="toggleDarkMode()"
            >
              <template #icon>
                <Icon name="heroicons:moon" />
              </template>
            </Button>
            <Button
              label="Back to Builder"
              outlined
              @click="navigateToBuilder"
            >
              <template #icon>
                <Icon name="heroicons:arrow-left" />
              </template>
            </Button>
          </div>
        </div>
      </header>

      <!-- Preview Content -->
      <Preview />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { darkMode } = storeToRefs(useFormBuilderStore())
const { toggleDarkMode } = useFormBuilderStore()

const navigateToBuilder = () => {
  navigateTo('/builder')
}
</script>

