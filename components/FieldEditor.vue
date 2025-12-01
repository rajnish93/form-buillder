<template>
  <div class="editor-panel p-4">
    <div v-if="selectedField" class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Field Settings
        </h2>
        <Button
          text
          rounded
          severity="secondary"
          @click="clearSelection"
        >
          <Icon name="heroicons:x-mark" />
        </Button>
      </div>

      <!-- Field Type Display -->
      <div class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div class="text-sm text-gray-600 dark:text-gray-400">Field Type</div>
        <div class="font-semibold text-gray-800 dark:text-gray-200">
          {{ getFieldTypeLabel(selectedField.type) }}
        </div>
      </div>

      <!-- Basic Settings -->
      <Card>
        <template #title>Basic Settings</template>
        <template #content>
          <div class="space-y-4">
            <!-- Label -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Label *
              </label>
              <InputText
                v-model="fieldData.label"
                placeholder="Field label"
                class="w-full"
                @update:model-value="updateField('label', $event)"
              />
            </div>

            <!-- Placeholder -->
            <div v-if="supportsPlaceholder(selectedField.type)">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Placeholder
              </label>
              <InputText
                v-model="fieldData.placeholder"
                placeholder="Placeholder text"
                class="w-full"
                @update:model-value="updateField('placeholder', $event)"
              />
            </div>

            <!-- Required Toggle -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Field
              </label>
              <ToggleSwitch
                v-model="fieldData.required"
                @update:model-value="updateField('required', $event)"
              />
            </div>

            <!-- Default Value -->
            <div v-if="supportsDefaultValue(selectedField.type)">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Value
              </label>
              <InputText
                v-model="fieldData.defaultValue"
                placeholder="Default value"
                class="w-full"
                @update:model-value="updateField('defaultValue', $event)"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Options Editor (for select, radio, etc.) -->
      <Card v-if="hasOptions(selectedField)">
        <template #title>Options</template>
        <template #content>
          <div class="space-y-3">
            <div
              v-for="(option, index) in selectedField.options"
              :key="index"
              class="flex gap-2 items-center"
            >
              <InputText
                v-model="option.label"
                placeholder="Option label"
                class="flex-1"
                @update:model-value="updateOption(index, 'label', $event)"
              />
              <InputText
                :model-value="String(option.value)"
                placeholder="Value"
                class="flex-1"
                @update:model-value="updateOption(index, 'value', $event)"
              />
              <Button
                severity="danger"
                text
                rounded
                @click="removeOption(index)"
              >
                <Icon name="heroicons:trash" />
              </Button>
            </div>
            <Button
              label="Add Option"
              size="small"
              outlined
              class="w-full"
              @click="addOption"
            >
              <template #icon>
                <Icon name="heroicons:plus" />
              </template>
            </Button>
          </div>
        </template>
      </Card>

      <!-- Validation Settings -->
      <Card>
        <template #title>Validation</template>
        <template #content>
          <div class="space-y-4">
            <div v-if="supportsMinMax(selectedField.type)" class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min
                </label>
                <InputNumber
                  v-model="validationData.min"
                  class="w-full"
                  @update:model-value="updateValidation('min', $event)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max
                </label>
                <InputNumber
                  v-model="validationData.max"
                  class="w-full"
                  @update:model-value="updateValidation('max', $event)"
                />
              </div>
            </div>

            <div v-if="supportsLength(selectedField.type)" class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Length
                </label>
                <InputNumber
                  v-model="validationData.minLength"
                  class="w-full"
                  @update:model-value="updateValidation('minLength', $event)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Length
                </label>
                <InputNumber
                  v-model="validationData.maxLength"
                  class="w-full"
                  @update:model-value="updateValidation('maxLength', $event)"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Delete Field -->
      <Button
        label="Delete Field"
        severity="danger"
        outlined
        class="w-full"
        @click="deleteField"
      >
        <template #icon>
          <Icon name="heroicons:trash" />
        </template>
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-full text-center p-8">
      <Icon name="heroicons:cog-6-tooth" class="text-4xl text-gray-400 mb-4" />
      <p class="text-gray-600 dark:text-gray-400">
        Select a field to edit its properties
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFieldTypeLabel, hasOptions } from '~/types/form-builder'

const { selectedFieldId, currentFields} = storeToRefs(useFormBuilderStore())
const { updateFieldValue, addFieldOption, removeFieldOption, updateFieldOption, removeField } = useFormBuilderStore()
const confirm = useConfirmDialog()
const toast = useToastMessage()

// Create a computed property for selectedFieldId that's reactive
// const selectedFieldId = computed({
//   get: () => store.selectedFieldId,
//   set: (value: string | null) => {
//     store.selectedFieldId = value
//   }
// })        

// Compute selectedField with explicit reactivity to both selectedFieldId and currentFields
// const currentFields = computed(() => store.currentFields)

// Watch selectedFieldId and currentFields to ensure reactivity
const selectedField = computed(() => {
  const fieldId = selectedFieldId.value
  if (!fieldId) return undefined
  
  // Access currentFields to ensure reactivity tracking
  const fields = currentFields.value
  return fields.find(field => field.id === fieldId)
})

const fieldData = computed({
  get: () => ({
    label: selectedField.value?.label || '',
    placeholder: selectedField.value?.placeholder || '',
    required: selectedField.value?.required || false,
    defaultValue: selectedField.value?.defaultValue || ''
  }),
  set: () => {}
})

const validationData = computed({
  get: () => ({
    min: selectedField.value?.validation?.min,
    max: selectedField.value?.validation?.max,
    minLength: selectedField.value?.validation?.minLength,
    maxLength: selectedField.value?.validation?.maxLength
  }),
  set: () => {}
})

const updateField = (key: string, value: any) => {
  if (!selectedField.value) return
  updateFieldValue(selectedField.value.id, { [key]: value })
}

const updateValidation = (key: string, value: any) => {
  if (!selectedField.value) return
  const validation = {
    ...selectedField.value.validation,
    [key]: value
  }
  updateFieldValue(selectedField.value.id, { validation })
}

const addOption = () => {
  if (!selectedField.value || !hasOptions(selectedField.value)) return
  addFieldOption(selectedField.value.id, {
    label: `Option ${selectedField.value.options.length + 1}`,
    value: `option${selectedField.value.options.length + 1}`
  })
}

const removeOption = (index: number) => {
  if (!selectedField.value || !hasOptions(selectedField.value)) return
  removeFieldOption(selectedField.value.id, index)
}

const updateOption = (index: number, key: 'label' | 'value', value: any) => {
  if (!selectedField.value || !hasOptions(selectedField.value)) return
  const updates: Partial<{ label: string; value: string | number }> = {}
  if (key === 'value') {
    // Try to preserve number type if it was originally a number
    const currentOption = selectedField.value.options[index]
    const numValue = Number(value)
    updates.value = (!isNaN(numValue) && String(numValue) === String(value)) ? numValue : value
  } else {
    updates[key] = value
  }
  updateFieldOption(selectedField.value.id, index, updates)
}

const clearSelection = () => {
  selectedFieldId.value = null
}

const deleteField = () => {
  if (!selectedField.value) return
  confirm.delete(
    'Are you sure you want to delete this field?',
    () => {
      removeField(selectedField.value!.id)
      toast.success('Field Deleted', 'Field has been removed successfully.')
    }
  )
}

const supportsPlaceholder = (type: string) => {
  return ['text', 'textarea', 'email', 'password', 'number', 'inputmask', 'inputnumber'].includes(type)
}

const supportsDefaultValue = (type: string) => {
  return !['file'].includes(type)
}

const supportsMinMax = (type: string) => {
  return ['number', 'inputnumber', 'slider', 'rating'].includes(type)
}

const supportsLength = (type: string) => {
  return ['text', 'textarea', 'email', 'password'].includes(type)
}
</script>

