<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <Card class="max-w-2xl w-full">
      <template #title>
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dynamic Form Builder
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Build powerful forms with drag-and-drop interface
          </p>
        </div>
      </template>
      <template #content>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateToBuilder">
              <template #title>
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:wrench-screwdriver" class="text-primary-500" />
                  Form Builder
                </div>
              </template>
              <template #content>
                <p class="text-gray-600 dark:text-gray-400">
                  Create and customize forms with our intuitive drag-and-drop builder
                </p>
              </template>
            </Card>

            <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateToPreview">
              <template #title>
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:eye" class="text-primary-500" />
                  Preview
                </div>
              </template>
              <template #content>
                <p class="text-gray-600 dark:text-gray-400">
                  Preview your forms in real-time and test form functionality
                </p>
              </template>
            </Card>
          </div>

          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">Drag & Drop Fields</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">Multi-step Forms</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">Schema Export/Import</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">Validation</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="heroicons:check-circle" class="text-green-500 mt-1" />
                <span class="text-gray-700 dark:text-gray-300">PrimeVue Components</span>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <Button
              label="Get Started"
              icon-pos="right"
              size="large"
              @click="navigateToBuilder"
            >
              <template #icon>
                <Icon name="heroicons:arrow-right" />
              </template>
            </Button>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const navigateToBuilder = () => {
  navigateTo('/builder')
}

const navigateToPreview = () => {
  navigateTo('/preview')
}
</script>

