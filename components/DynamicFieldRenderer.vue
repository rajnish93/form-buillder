<template>
  <div class="dynamic-field-renderer">
    <div
      v-for="field in fields"
      :key="field.id"
      :class="[
        'mb-4',
        selectable ? 'cursor-pointer transition-all rounded-lg p-2 -m-2 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border hover:border-primary-200 dark:hover:border-primary-800' : ''
      ]"
      @click="selectable ? handleFieldClick(field.id) : undefined"
    >
      <!-- Text Input -->
      <div v-if="field.type === 'text'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputText
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Textarea -->
      <div v-else-if="field.type === 'textarea'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Textarea
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          :rows="5"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Number -->
      <div v-else-if="field.type === 'number' || field.type === 'inputnumber'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputNumber
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          :min="field.validation?.min !== undefined && field.validation?.min !== null ? getNumericValue(field.validation.min, 0) : undefined"
          :max="field.validation?.max !== undefined && field.validation?.max !== null ? getNumericValue(field.validation.max, 100) : undefined"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Email -->
      <div v-else-if="field.type === 'email'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputText
          :id="field.id"
          v-model="formData[field.id]"
          type="email"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Password -->
      <div v-else-if="field.type === 'password'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Password
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder"
          :required="field.required"
          :feedback="false"
          toggle-mask
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Input Mask -->
      <div v-else-if="field.type === 'inputmask'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputMask
          :id="field.id"
          v-model="formData[field.id]"
          :mask="field.validation?.pattern || '99-999999'"
          :placeholder="field.placeholder || field.validation?.pattern || '99-999999'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Select -->
      <div v-else-if="field.type === 'select' && hasOptions(field)">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Select
          :id="field.id"
          v-model="formData[field.id]"
          :options="field.options"
          option-label="label"
          option-value="value"
          :placeholder="field.placeholder || 'Select an option'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- MultiSelect -->
      <div v-else-if="field.type === 'multiselect' && hasOptions(field)">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <MultiSelect
          :id="field.id"
          v-model="formData[field.id]"
          :options="field.options"
          option-label="label"
          option-value="value"
          :placeholder="field.placeholder || 'Select options'"
          :required="field.required"
          class="w-full"
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'">
        <div class="flex items-center">
          <Checkbox
            :id="field.id"
            v-model="formData[field.id]"
            :binary="true"
            :required="field.required"
          />
          <label :for="field.id" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
        </div>
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Radio -->
      <div v-else-if="field.type === 'radio' && hasValidOptions(field)" @click.stop>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <div class="space-y-2" @click.stop>
          <div
            v-for="option in getFieldOptions(field)"
            :key="option.value"
            class="flex items-center"
            @click.stop
          >
            <RadioButton
              :id="`${field.id}-${option.value}`"
              v-model="formData[field.id]"
              :value="option.value"
              :required="field.required"
              @click.stop
            />
            <label :for="`${field.id}-${option.value}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer" @click.stop>
              {{ option.label }}
            </label>
          </div>
        </div>
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Date -->
      <div v-else-if="field.type === 'date'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <DatePicker
          :id="field.id"
          v-model="formData[field.id]"
          date-format="yy-mm-dd"
          :placeholder="field.placeholder || 'Select date'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Time -->
      <div v-else-if="field.type === 'time'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <DatePicker
          :id="field.id"
          v-model="formData[field.id]"
          time-only
          :placeholder="field.placeholder || 'Select time'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Date & Time -->
      <div v-else-if="field.type === 'datetime'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <DatePicker
          :id="field.id"
          v-model="formData[field.id]"
          show-time
          :placeholder="field.placeholder || 'Select date and time'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Calendar -->
      <div v-else-if="field.type === 'calendar'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <DatePicker
          :id="field.id"
          v-model="formData[field.id]"
          :show-time="false"
          :placeholder="field.placeholder || 'Select date'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Switch -->
      <div v-else-if="field.type === 'switch'">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ field.label }}
            <span v-if="field.required" class="text-red-500">*</span>
          </label>
          <ToggleSwitch
            :id="field.id"
            v-model="formData[field.id]"
            :required="field.required"
          />
        </div>
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Slider -->
      <div v-else-if="field.type === 'slider'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Slider
          :id="field.id"
          v-model="formData[field.id]"
          :min="getNumericValue(field.validation?.min, 0)"
          :max="getNumericValue(field.validation?.max, 100)"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Rating -->
      <div v-else-if="field.type === 'rating'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Rating
          :id="field.id"
          v-model="formData[field.id]"
          :stars="getNumericValue(field.validation?.max, 5)"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Knob -->
      <div v-else-if="field.type === 'knob'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Knob
          :id="field.id"
          v-model="formData[field.id]"
          :min="getNumericValue(field.validation?.min, 0)"
          :max="getNumericValue(field.validation?.max, 100)"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Color Picker -->
      <div v-else-if="field.type === 'color'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <ColorPicker
          :id="field.id"
          v-model="formData[field.id]"
          :required="field.required"
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- File Upload -->
      <div v-else-if="field.type === 'file'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <FileUpload
          :id="field.id"
          mode="basic"
          :required="field.required"
          @select="(event) => handleFileSelect(field.id, event)"
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Autocomplete -->
      <div v-else-if="field.type === 'autocomplete'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <AutoComplete
          :id="field.id"
          v-model="formData[field.id]"
          :suggestions="hasOptions(field) ? field.options.map(opt => opt.label) : []"
          typeahead
          :placeholder="field.placeholder || 'Start typing...'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Chips -->
      <div v-else-if="field.type === 'chips'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputChips
          :id="field.id"
          :model-value="getChipsValue(field.id)"
          @update:model-value="(val) => setChipsValue(field.id, val)"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Listbox -->
      <div v-else-if="field.type === 'listbox' && hasValidOptions(field)">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <Listbox
          :id="field.id"
          v-model="formData[field.id]"
          :options="getFieldOptions(field)"
          option-label="label"
          option-value="value"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Toggle Button -->
      <div v-else-if="field.type === 'togglebutton'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <ToggleButton
          :id="field.id"
          v-model="formData[field.id]"
          :required="field.required"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Tree Select -->
      <div v-else-if="field.type === 'treeselect' && hasOptions(field)">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <TreeSelect
          :id="field.id"
          v-model="formData[field.id]"
          :options="convertToTreeNodes(field.options)"
          :placeholder="field.placeholder || 'Select item'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>

      <!-- Default fallback -->
      <div v-else>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <InputText
          :id="field.id"
          v-model="formData[field.id]"
          :placeholder="field.placeholder || 'Field type not fully supported'"
          :required="field.required"
          class="w-full"
          @click.stop
        />
        <small v-if="errors[field.id]" class="text-red-500">
          {{ errors[field.id] }}
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hasOptions, type FormField, type FieldOption } from '~/types/form-builder'
import type { TreeNode } from 'primevue/treenode'

interface Props {
  fields: FormField[]
  modelValue?: Record<string, any>
  errors?: Record<string, string>
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  errors: () => ({}),
  selectable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'field-click': [fieldId: string]
}>()

const formData = ref<Record<string, any>>({ ...props.modelValue })
const isCleared = ref(false)

// Helper function to get chips value as array
const getChipsValue = (fieldId: string): string[] => {
  const value = formData.value[fieldId]
  if (Array.isArray(value)) {
    return value
  }
  if (value === null || value === undefined || value === '') {
    return []
  }
  return [String(value)]
}

// Helper function to set chips value
const setChipsValue = (fieldId: string, value: string[]) => {
  formData.value[fieldId] = value
}

// Helper function to ensure numeric values are valid (not NaN)
const getNumericValue = (value: any, defaultValue: number): number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue
  }
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

// Helper function to check if field has valid options (for template use)
// This works better in Vue templates than the type guard
const hasValidOptions = (field: FormField): boolean => {
  return 'options' in field && 
         field.options !== undefined && 
         field.options !== null && 
         Array.isArray(field.options) && 
         field.options.length > 0
}

// Helper function to get options safely (for template use)
const getFieldOptions = (field: FormField): FieldOption[] => {
  if ('options' in field && Array.isArray(field.options)) {
    return field.options
  }
  return []
}

// Helper function to convert FieldOption[] to TreeNode[] for TreeSelect
const convertToTreeNodes = (options: FieldOption[]): TreeNode[] => {
  return options.map(opt => ({
    key: String(opt.value),
    label: opt.label
  }))
}

// Watch for modelValue changes to reset form data
watch(() => props.modelValue, (newValue) => {
  // If modelValue is explicitly empty (cleared), reset formData
  if (newValue && Object.keys(newValue).length === 0) {
    if (Object.keys(formData.value).length > 0) {
      formData.value = {}
      isCleared.value = true
    }
  } else if (newValue) {
    // Check if values are actually different to avoid infinite loops
    const isDifferent = JSON.stringify(newValue) !== JSON.stringify(formData.value)
    if (isDifferent) {
      formData.value = { ...newValue }
      isCleared.value = false
    }
  }
}, { deep: true })

// Initialize form data with default values (only if not cleared)
watch(() => props.fields, (fields) => {
  if (!isCleared.value) {
    fields.forEach(field => {
      if (!(field.id in formData.value)) {
        if (field.type === 'chips') {
          formData.value[field.id] = Array.isArray(field.defaultValue) ? field.defaultValue : []
        } else if (field.type === 'slider' || field.type === 'knob') {
          // Ensure numeric fields have valid default values
          const min = getNumericValue(field.validation?.min, 0)
          const defaultValue = field.defaultValue !== undefined ? getNumericValue(field.defaultValue, min) : min
          formData.value[field.id] = defaultValue
        } else if (field.type === 'rating') {
          formData.value[field.id] = field.defaultValue !== undefined ? getNumericValue(field.defaultValue, 0) : 0
        } else {
          formData.value[field.id] = field.defaultValue || (field.type === 'checkbox' || field.type === 'switch' ? false : '')
        }
      } else if (field.type === 'chips' && !Array.isArray(formData.value[field.id])) {
        // Ensure existing chips values are arrays
        const value = formData.value[field.id]
        formData.value[field.id] = value ? [String(value)] : []
      } else if ((field.type === 'slider' || field.type === 'knob' || field.type === 'rating') && 
                 (formData.value[field.id] === undefined || formData.value[field.id] === null || isNaN(Number(formData.value[field.id])))) {
        // Ensure numeric fields have valid values
        const min = getNumericValue(field.validation?.min, 0)
        formData.value[field.id] = min
      }
    })
  }
}, { immediate: true })

watch(formData, (newData) => {
  emit('update:modelValue', newData)
}, { deep: true })

const handleFileSelect = (fieldId: string, event: any) => {
  formData.value[fieldId] = event.files
}

const handleFieldClick = (fieldId: string) => {
  if (props.selectable) {
    emit('field-click', fieldId)
  }
}
</script>


