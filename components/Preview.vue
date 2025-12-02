<template>
  <div class="preview-panel">
    <div class="max-w-2xl mx-auto">
      <!-- Form Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ schema.name }}
        </h1>
        <p v-if="schema.description" class="text-gray-600 dark:text-gray-400">
          {{ schema.description }}
        </p>
      </div>

      <!-- Multi-step Progress -->
      <div v-if="isMultiStep" class="mb-6">
        <div class="flex items-center justify-center gap-2">
          <div
            v-for="(step, index) in steps"
            :key="step.index"
            class="flex items-center"
          >
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                index <= currentStepIndex
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              ]"
            >
              {{ index + 1 }}
            </div>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'w-16 h-1 mx-2',
                index < currentStepIndex
                  ? 'bg-primary-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              ]"
            ></div>
          </div>
        </div>
        <div class="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ currentStep?.title }}
        </div>
      </div>

      <!-- Step Content -->
      <Card>
        <template #title>
          {{ currentStep?.title }}
        </template>
        <template #subtitle v-if="currentStep?.description">
          {{ currentStep.description }}
        </template>
        <template #content>
          <DynamicFieldRenderer
            :fields="currentStep?.fields || []"
            v-model="formData"
            :errors="errors"
          />
        </template>
      </Card>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-6">
        <Button
          v-if="isMultiStep && currentStepIndex > 0"
          label="Previous"
          outlined
          @click="previousStep"
        >
          <template #icon>
            <Icon name="heroicons:arrow-left" />
          </template>
        </Button>
        <div></div>
        <Button
          v-if="isMultiStep && currentStepIndex < steps.length - 1"
          label="Next"
          icon-pos="right"
          @click="nextStep"
        >
          <template #icon>
            <Icon name="heroicons:arrow-right" />
          </template>
        </Button>
        <Button
          v-else
          label="Submit"
          @click="handleSubmit"
        >
          <template #icon>
            <Icon name="heroicons:check" />
          </template>
        </Button>
      </div>

      <!-- Form Data Display (for debugging) -->
      <!-- <Card v-if="showFormData" class="mt-6">
        <template #title>Form Data</template>
        <template #content>
          <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
        </template>
      </Card> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const { schema, isMultiStep } = storeToRefs(useFormBuilderStore())
const toast = useToastMessage()
const currentStepIndex = ref(0)
const formData = ref<Record<string, any>>({})
const errors = ref<Record<string, string>>({})
const showFormData = ref(false)

const steps = computed(() => {
  return schema.value.steps.map((step, index) => ({
    label: step.title,
    index
  }))
})

const currentStep = computed(() => {
  return schema.value.steps[currentStepIndex.value]
})

const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStepIndex.value < schema.value.steps.length - 1) {
      currentStepIndex.value++
    }
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const validateCurrentStep = () => {
  const step = currentStep.value
  if (!step) return true

  const stepErrors: Record<string, string> = {}

  step.fields.forEach(field => {
    const value = formData.value[field.id]

    if (field.required) {
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        stepErrors[field.id] = `${field.label} is required`
      }
    }

    // Additional validation
    if (value !== undefined && value !== null && value !== '') {
      if (field.validation) {
        if (field.validation.minLength && String(value).length < field.validation.minLength) {
          stepErrors[field.id] = `Minimum length is ${field.validation.minLength}`
        }
        if (field.validation.maxLength && String(value).length > field.validation.maxLength) {
          stepErrors[field.id] = `Maximum length is ${field.validation.maxLength}`
        }
        if (field.validation.min !== undefined && Number(value) < field.validation.min) {
          stepErrors[field.id] = `Minimum value is ${field.validation.min}`
        }
        if (field.validation.max !== undefined && Number(value) > field.validation.max) {
          stepErrors[field.id] = `Maximum value is ${field.validation.max}`
        }
      }
    }
  })

  errors.value = { ...errors.value, ...stepErrors }
  return Object.keys(stepErrors).length === 0
}

const handleSubmit = () => {
  if (validateCurrentStep()) {
    showFormData.value = true
    // In a real app, you would submit the data to a server
    toast.success('Form Submitted', 'Form submitted successfully! Check the Form Data section below.')
  } else {
    toast.error('Validation Error', 'Please fix the errors before submitting.')
  }
}
</script>

