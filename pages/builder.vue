<template>
    <div class="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            Form Builder
          </h1>
          <InputText
            v-model="formName"
            placeholder="Form name"
            class="w-64"
            @update:model-value="updateFormName"
          />
        </div>
        <div class="flex items-center gap-2">
          <ClientOnly>
            <Button
              :label="darkMode ? 'Light' : 'Dark'"
              text
              @click="toggleDarkMode()"
            >
              <template #icon>
                <Icon name="heroicons:moon" />
              </template>
            </Button>
          </ClientOnly>
          <Button
            label="Import"
            outlined
            @click="showImportDialog = true"
          >
            <template #icon>
              <Icon name="heroicons:arrow-up-tray" />
            </template>
          </Button>
          <Button
            label="Export"
            outlined
            @click="exportSchema()"
          >
            <template #icon>
              <Icon name="heroicons:arrow-down-tray" />
            </template>
          </Button>
          <Button
            label="Preview"
            @click="navigateToPreview"
          >
            <template #icon>
              <Icon name="heroicons:eye" />
            </template>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- Toolbox -->
      <Toolbox />

      <ClientOnly>
        <!-- Field List -->
        <FieldList />

        <!-- Preview Panel -->
        <div class="preview-panel flex-1 overflow-y-auto p-6 min-h-0">
          <div class="max-w-3xl mx-auto">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Live Preview
              </h2>
              <Button
                label="Clear Preview"
                size="small"
                outlined
                @click="clearPreview"
              >
                <template #icon>
                  <Icon name="heroicons:arrow-path" />
                </template>
              </Button>
            </div>

            <!-- Form Preview -->
            <Card :key="`preview-${previewKey}-${selectedStepId}`">
              <template #title>
                {{ schema.name || 'Untitled Form' }}
              </template>
              <template #subtitle v-if="schema.description">
                {{ schema.description }}
              </template>
              <template #content>
                <DynamicFieldRenderer
                  :key="previewKey"
                  :fields="currentFields"
                  v-model="previewData"
                  :errors="previewErrors"
                  :selectable="true"
                  @field-click="handlePreviewFieldClick"
                />
              </template>
            </Card>

            <!-- Preview Data (for debugging) -->
            <Card v-if="showPreviewData" class="mt-4">
              <template #title>Preview Data</template>
              <template #content>
                <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{{ JSON.stringify(previewData, null, 2) }}</pre>
              </template>
            </Card>
          </div>
        </div>

        <!-- Field Editor -->
        <FieldEditor />
      </ClientOnly>
    </div>

    <!-- Import Dialog -->
    <Dialog
      v-model:visible="showImportDialog"
      modal
      header="Import Form Schema"
      :style="{ width: '50rem' }"
    >
      <div class="space-y-4">
        <Textarea
          v-model="importJson"
          placeholder="Paste JSON schema here..."
          rows="10"
          class="w-full font-mono text-sm"
        />
        <div class="flex gap-2 justify-end">
          <Button
            label="Cancel"
            severity="secondary"
            outlined
            @click="showImportDialog = false"
          />
          <Button
            label="Import"
            @click="handleImport"
          />
        </div>
      </div>
    </Dialog>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { schema, selectedStepId, selectedFieldId, darkMode, currentFields } = storeToRefs(useFormBuilderStore())
const { updateSchema, exportSchema, loadSchema, toggleDarkMode } = useFormBuilderStore()
const toast = useToastMessage()

// Initialize dark mode on mount
onMounted(() => {
  if (typeof document !== 'undefined') {
    if (darkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

const formName = computed({
  get: () => schema.value.name,
  set: (value: string) => {
    updateSchema({ name: value })
  }
})

const previewData = ref<Record<string, any>>({})
const previewErrors = ref<Record<string, string>>({})
const showPreviewData = ref(false)
const showImportDialog = ref(false)
const importJson = ref('')
const previewKey = ref(0)

const updateFormName = (value: string | undefined) => {
  if (value !== undefined) {
    formName.value = value
  }
}

const clearPreview = () => {
  previewData.value = {}
  previewErrors.value = {}
  showPreviewData.value = false
  // Also clear the selected field when clearing preview
  selectedFieldId.value = null
  // Force re-render by incrementing key
  previewKey.value++
}

const navigateToPreview = () => {
  navigateTo('/preview')
}

const handlePreviewFieldClick = (fieldId: string) => {
  selectedFieldId.value = fieldId
}

const handleImport = () => {
  if (!importJson.value.trim()) {
    toast.warn('Validation Error', 'Please paste a JSON schema')
    return
  }

  const {success} = loadSchema(importJson.value)
  if (success) {
    // Clear preview data to prevent recursive updates
    previewData.value = {}
    previewErrors.value = {}
    previewKey.value++
    
    // Clear the import text
    importJson.value = ''
    
    // Show success toast
    toast.success('Success', 'Schema imported successfully!')
    
    // Close dialog after state updates settle
    setTimeout(() => {
      showImportDialog.value = false
    }, 150)
  } else {
    // Show error toast (dialog stays open)
    toast.error('Invalid schema format')
  }
}
</script>

<style scoped>
.form-builder-container > div:last-of-type {
  min-height: 0;
}
</style>

