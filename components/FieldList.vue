<template>
  <div class="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto h-full p-4">
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Fields
        </h2>
        <Button
          v-if="currentFields.length > 0"
          severity="danger"
          text
          rounded
          size="small"
          title="Delete all fields"
          @click="removeAllFields"
        >
          <Icon name="heroicons:trash" />
        </Button>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ currentFields.length }} field(s) in current step
      </p>
    </div>

    <!-- Step Navigation -->
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {{ isMultiStep ? 'Current Step:' : 'Step:' }}
        </label>
        <Select
          v-if="isMultiStep"
          v-model="selectedStepId"
          :options="schema.steps"
          option-label="title"
          option-value="id"
          class="flex-1"
          @update:model-value="handleStepChange"
        />
        <div v-else class="flex-1 text-sm text-gray-600 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
          {{ currentStep?.title || 'Step 1' }}
        </div>
        <Button
          size="small"
          rounded
          :title="isMultiStep ? 'Add New Step' : 'Add Step to create multi-step form'"
          @click="handleAddStep"
        >
          <Icon name="heroicons:plus" />
          <span v-if="!isMultiStep" class="ml-1 text-xs">Add Step</span>
        </Button>
      </div>
      <p v-if="!isMultiStep" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Click "Add Step" to create a multi-step form
      </p>
    </div>

    <!-- Step Info -->
    <Card v-if="currentStep" :key="currentStep.id" class="mb-4">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ stepTitle }}</span>
          <Button
            v-if="isMultiStep"
            severity="danger"
            text
            rounded
            size="small"
            title="Delete Step"
            @click="removeStep"
          >
            <Icon name="heroicons:trash" />
          </Button>
        </div>
      </template>
      <template #content>
        <InputText
          :model-value="stepTitle"
          placeholder="Step title"
          class="w-full mb-2"
          @update:model-value="updateStepTitle"
        />
        <Textarea
          :model-value="stepDescription"
          placeholder="Step description (optional)"
          rows="2"
          class="w-full"
          @update:model-value="updateStepDescription"
        />
      </template>
    </Card>

    <!-- Fields List -->
    <div v-if="currentFields.length > 0" class="space-y-2">
      <VueDraggable
        v-model="fieldsList"
        :animation="200"
        handle=".drag-handle"
      >
        <div
          v-for="field in fieldsList"
          :key="field.id"
          :class="[
            'field-item cursor-pointer',
            selectedFieldId === field.id ? 'field-item-selected' : ''
          ]"
          @click="selectField(field.id)"
        >
          <div class="flex items-center gap-2">
            <!-- Drag Handle -->
            <div 
              class="drag-handle flex-shrink-0 flex items-center justify-center w-6 h-6 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 rounded cursor-move transition-colors" 
              style="min-width: 24px; min-height: 24px;"
              @click.stop
              title="Drag to reorder"
            >
              <Icon name="heroicons:bars-3" class="text-gray-600 dark:text-gray-300" style="font-size: 14px;" />
            </div>
            <!-- Field Content with Edit Icon -->
            <div class="flex-1 min-w-0 flex items-center gap-2" @click.stop="selectField(field.id)">
              <Icon 
                name="heroicons:pencil"
                class="flex-shrink-0 transition-colors"
                :class="selectedFieldId === field.id ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400'"
                style="font-size: 12px;"
                title="Click to edit"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {{ field.label || 'Unnamed Field' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getFieldTypeLabel(field.type) }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </div>
              </div>
            </div>
            <!-- Delete Button -->
            <Button
              severity="danger"
              text
              rounded
              size="small"
              @click.stop="removeField(field.id)"
            >
              <Icon name="heroicons:trash" />
            </Button>
          </div>
        </div>
      </VueDraggable>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center p-8 text-gray-500 dark:text-gray-400">
      <Icon name="heroicons:inbox" class="text-4xl mb-2" />
      <p>No fields yet. Add fields from the toolbox.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { getFieldTypeLabel, type FormField } from '~/types/form-builder'

const { currentStep, currentFields, selectedFieldId, isMultiStep, isImporting, schema, selectedStepId } = storeToRefs(useFormBuilderStore())
const { reorderFields, updateStep, removeField: removeFieldAction, resetStore, removeStep: removeStepAction, addStep } = useFormBuilderStore()
const confirm = useConfirmDialog()
const toast = useToastMessage()

const fieldsList = ref<FormField[]>([])
const isUpdatingFromStore = ref(false)
const isUpdatingFromDrag = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  if (currentFields.value && currentFields.value.length > 0) {
    fieldsList.value = [...currentFields.value]
  }
})

// Watch for changes in currentFields and update fieldsList (only if not from drag)
watch(currentFields, (newFields) => {
  // Skip updates during import to prevent recursive loops
  if (isImporting.value) {
    fieldsList.value = [...newFields]
    return
  }
  
  if (!isMounted.value) return

  if (!isUpdatingFromDrag.value) {
    // Check if the order actually changed by comparing IDs
    const currentIds = fieldsList.value.map(f => f.id).join(',')
    const newIds = newFields.map(f => f.id).join(',')
    if (currentIds !== newIds) {
      isUpdatingFromStore.value = true
      fieldsList.value = [...newFields]
      nextTick(() => {
        isUpdatingFromStore.value = false
      })
    }
  }
}, { deep: true })

// Watch for changes in fieldsList and update store (only when user drags)
watch(fieldsList, (newOrder, oldOrder) => {
  // Skip updates during import to prevent recursive loops
  if (isImporting.value) {
    return
  }
  
  // Only update if:
  // 1. Not currently updating from store
  // 2. Length matches
  // 3. Order actually changed (user dragged)
  // 4. oldOrder exists (not initial load)
  if (!isUpdatingFromStore.value && 
      oldOrder &&
      newOrder.length === currentFields.value.length &&
      newOrder.length === oldOrder.length) {
    // Compare IDs to see if order changed
    const newIds = newOrder.map(f => f.id).join(',')
    const oldIds = oldOrder.map(f => f.id).join(',')
    
    if (newIds !== oldIds) {
      isUpdatingFromDrag.value = true
      reorderFields(newOrder)
      nextTick(() => {
        setTimeout(() => {
          isUpdatingFromDrag.value = false
        }, 300)
      })
    }
  }
}, { deep: false }) // Use shallow watch to avoid deep comparison issues

const stepTitle = ref('')
const stepDescription = ref('')

// Watch currentStep and update refs (skip during import to prevent loops)
watch(currentStep, (step) => {
  // Skip updates during import - will be handled after import completes
  if (isImporting.value) {
    return
  }
  
  if (step) {
    stepTitle.value = step.title || ''
    stepDescription.value = step.description || ''
  } else {
    stepTitle.value = ''
    stepDescription.value = ''
  }
}, { immediate: true })

// Watch for import completion and sync step title/description
watch(isImporting, (importing) => {
  if (!importing && currentStep.value) {
    // Import completed, sync the refs
    stepTitle.value = currentStep.value.title || ''
    stepDescription.value = currentStep.value.description || ''
  }
})

const updateStepTitle = (value: string | undefined) => {
  if (value !== undefined && currentStep.value && currentStep.value.title !== value) {
    stepTitle.value = value
    updateStep(currentStep.value.id, { title: value })
  }
}

const updateStepDescription = (value: string | undefined) => {
  if (value !== undefined && currentStep.value && currentStep.value.description !== value) {
    stepDescription.value = value
    updateStep(currentStep.value.id, { description: value })
  }
}

const selectField = (fieldId: string) => {
  selectedFieldId.value = fieldId
}

const removeField = (fieldId: string) => {
  confirm.delete(
    'Are you sure you want to delete this field?',
    () => {
      removeFieldAction(fieldId)
      toast.success('Field Deleted', 'Field has been removed successfully.')
    }
  )
}

const removeAllFields = () => {
  if (currentFields.value.length === 0) return
  
  const count = currentFields.value.length
  confirm.delete(
    `Are you sure you want to delete all ${count} field(s) and reset the form to its original state?`,
    () => {
      resetStore()
      toast.success('Form Reset', 'All fields have been removed and form has been reset.')
    }
  )
}

const removeStep = () => {
  if (!currentStep.value) return
  
  confirm.delete(
    'Are you sure you want to delete this step?',
    () => {
      const result = removeStepAction(currentStep.value!.id)
      if (!result.success) {
        toast.warn('Cannot Remove Step', result.error || 'Cannot remove the last step')
      } else {
        toast.success('Step Deleted', 'Step has been removed successfully.')
      }
    }
  )
}

const handleAddStep = () => {
  addStep()
  // Clear selected field when switching steps
  selectedFieldId.value = null
}

const handleStepChange = () => {
  // Clear selected field when switching steps
  selectedFieldId.value = null
}

</script>


