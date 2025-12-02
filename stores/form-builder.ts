import { defineStore } from 'pinia'
import type { FormSchema, FormStep, FormField, FieldType } from '~/types/form-builder'
import { FormSchemaSchema } from '~/types/form-builder'

/**
 * Form Builder Store
 * Manages the state of the form builder including fields, steps, and schema persistence
 */
export const useFormBuilderStore = defineStore('formBuilder', () => {
  // State
  const schema = ref<FormSchema>({
    id: '',
    name: 'Untitled Form',
    description: '',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1',
        description: '',
        fields: []
      }
    ] as FormStep[],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const selectedFieldId = ref<string | null>(null)
  const selectedStepId = ref('step-1')
  const darkMode = ref(false)
  const isImporting = ref(false)

  // Getters
  const currentStep = computed((): FormStep | undefined => {
    return schema.value.steps.find(step => step.id === selectedStepId.value)
  })

  const currentFields = computed((): FormField[] => {
    return currentStep.value?.fields || []
  })

  // Reset selected field when step changes
  watch(selectedStepId, () => {
    selectedFieldId.value = null
  })

  const selectedField = computed((): FormField | undefined => {
    if (!selectedFieldId.value) return undefined
    return currentFields.value.find(field => field.id === selectedFieldId.value)
  })

  const isMultiStep = computed((): boolean => {
    return schema.value.steps.length > 1
  })

  const schemaJson = computed((): string => {
    return JSON.stringify(schema.value, null, 2)
  })

  // Actions
  const addField = (type: FieldType) => {
    const step = currentStep.value
    if (!step) return

    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      label: getDefaultLabel(type),
      required: false,
      ...(needsOptions(type) && {
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ]
      })
    }

    step.fields.push(newField)
    selectedFieldId.value = newField.id
    updateTimestamp()
  }

  const removeField = (fieldId: string) => {
    const step = currentStep.value
    if (!step) return

    // Create a new array to avoid direct mutation issues
    const updatedFields = step.fields.filter(field => field.id !== fieldId)
    step.fields = updatedFields

    if (selectedFieldId.value === fieldId) {
      selectedFieldId.value = null
    }
    updateTimestamp()
  }

  const resetStore = () => {
    schema.value = {
      id: '',
      name: 'Untitled Form',
      description: '',
      steps: [
        {
          id: 'step-1',
          title: 'Step 1',
          description: '',
          fields: []
        }
      ] as FormStep[],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as FormSchema
    selectedFieldId.value = null
    selectedStepId.value = 'step-1'
    updateTimestamp()
  }

  const updateFieldValue = (fieldId: string, updates: Partial<FormField>) => {
    const step = currentStep.value
    if (!step) return

    const fieldIndex = step.fields.findIndex(f => f.id === fieldId)
    if (fieldIndex === -1) return

    const currentField = step.fields[fieldIndex]
    step.fields[fieldIndex] = { ...currentField, ...updates } as FormField
    updateTimestamp()
  }

  const reorderFields = (newOrder: FormField[]) => {
    const step = currentStep.value
    if (!step) return

    step.fields = newOrder
    updateTimestamp()
  }

  const addFieldOption = (fieldId: string, option: { label: string; value: string | number }) => {
    const field = currentFields.value.find(f => f.id === fieldId)
    if (!field || !('options' in field)) return

    field.options.push(option)
    updateTimestamp()
  }

  const removeFieldOption = (fieldId: string, optionIndex: number) => {
    const field = currentFields.value.find(f => f.id === fieldId)
    if (!field || !('options' in field)) return

    field.options.splice(optionIndex, 1)
    updateTimestamp()
  }

  const updateFieldOption = (fieldId: string, optionIndex: number, updates: Partial<{ label: string; value: string | number }>) => {
    const field = currentFields.value.find(f => f.id === fieldId)
    if (!field || !('options' in field)) return

    const currentOption = field.options[optionIndex]
    if (!currentOption) return

    field.options[optionIndex] = {
      label: updates.label ?? currentOption.label,
      value: updates.value ?? currentOption.value
    }
    updateTimestamp()
  }

  const addStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      title: `Step ${schema.value.steps.length + 1}`,
      description: '',
      fields: []
    }
    schema.value.steps.push(newStep)
    selectedStepId.value = newStep.id
    updateTimestamp()
  }

  const removeStep = (stepId: string): { success: boolean; error?: string } => {
    if (schema.value.steps.length <= 1) {
      return { success: false, error: 'Cannot remove the last step' }
    }

    const stepIndex = schema.value.steps.findIndex(step => step.id === stepId)
    if (stepIndex === -1) {
      return { success: false, error: 'Step not found' }
    }

    // Clear selected field if it belongs to the step being removed
    if (selectedFieldId.value) {
      const step = schema.value.steps[stepIndex]
      if (step) {
        const fieldExists = step.fields.some(field => field.id === selectedFieldId.value)
        if (fieldExists) {
          selectedFieldId.value = null
        }
      }
    }

    schema.value.steps = schema.value.steps.filter(step => step.id !== stepId)

    // If the removed step was selected, select another step
    if (selectedStepId.value === stepId) {
      // Try to select the step at the same index, or the previous one, or the first one
      const newIndex = Math.min(stepIndex, schema.value.steps.length - 1)
      const newStep = schema.value.steps[newIndex] || schema.value.steps[0]
      if (newStep) {
        selectedStepId.value = newStep.id
      }
    }

    updateTimestamp()
    return { success: true }
  }

  const updateStep = (stepId: string, updates: Partial<FormStep>) => {
    const step = schema.value.steps.find(s => s.id === stepId)
    if (!step) return

    Object.assign(step, updates)
    updateTimestamp()
  }

  const updateSchema = (updates: Partial<FormSchema>) => {
    Object.assign(schema.value, updates)
    updateTimestamp()
  }

  const loadSchema = (json: string) => {
    try {
      isImporting.value = true
      const parsed = JSON.parse(json)

      // Validate schema with Zod
      const validated = FormSchemaSchema.parse(parsed) as FormSchema

      schema.value = validated
      selectedStepId.value = validated.steps[0]?.id || 'step-1'
      selectedFieldId.value = null
      updateTimestamp()

      // Reset flag after reactive updates settle
      // Use requestAnimationFrame to ensure DOM updates complete
      requestAnimationFrame(() => {
        setTimeout(() => {
          isImporting.value = false
        }, 200)
      })

      return { success: true }
    } catch (error: any) {
      isImporting.value = false
      return {
        success: false,
        error: error.message || 'Invalid schema format'
      }
    }
  }

  const exportSchema = () => {
    if (typeof document === 'undefined') return

    try {
      const json = schemaJson.value
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${schema.value.name || 'form'}-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export schema:', error)
    }
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    if (typeof document !== 'undefined') {
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const updateTimestamp = () => {
    schema.value.updatedAt = new Date().toISOString()
  }

  const getDefaultLabel = (type: FieldType): string => {
    const labels: Record<FieldType, string> = {
      text: 'Text Field',
      textarea: 'Textarea',
      number: 'Number',
      email: 'Email',
      password: 'Password',
      select: 'Select',
      multiselect: 'Multi Select',
      checkbox: 'Checkbox',
      radio: 'Radio',
      date: 'Date',
      time: 'Time',
      datetime: 'Date & Time',
      switch: 'Switch',
      slider: 'Slider',
      rating: 'Rating',
      color: 'Color',
      file: 'File',
      autocomplete: 'Autocomplete',
      calendar: 'Calendar',
      chips: 'Chips',
      inputmask: 'Input Mask',
      inputnumber: 'Input Number',
      knob: 'Knob',
      listbox: 'Listbox',
      togglebutton: 'Toggle Button',
      treeselect: 'Tree Select'
    }
    return labels[type] || 'Field'
  }

  const needsOptions = (type: FieldType): boolean => {
    return ['select', 'multiselect', 'radio', 'listbox', 'treeselect'].includes(type)
  }

  return {
    // State
    schema,
    selectedFieldId,
    selectedStepId,
    darkMode,
    isImporting,
    // Getters
    currentStep,
    currentFields,
    selectedField,
    isMultiStep,
    schemaJson,
    // Actions
    addField,
    removeField,
    resetStore,
    updateFieldValue,
    reorderFields,
    addFieldOption,
    removeFieldOption,
    updateFieldOption,
    addStep,
    removeStep,
    updateStep,
    updateSchema,
    loadSchema,
    exportSchema,
    toggleDarkMode,
    updateTimestamp,
    getDefaultLabel,
    needsOptions
  }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['schema', 'selectedFieldId', 'selectedStepId', 'darkMode'], // Only persist these fields
  },
})
