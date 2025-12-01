import { z } from 'zod'

/**
 * Supported field types in the form builder
 */
export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'switch'
  | 'slider'
  | 'rating'
  | 'color'
  | 'file'
  | 'autocomplete'
  | 'calendar'
  | 'chips'
  | 'inputmask'
  | 'inputnumber'
  | 'knob'
  | 'listbox'
  | 'togglebutton'
  | 'treeselect'

/**
 * Field option for select, radio, and similar field types
 */
export interface FieldOption {
  label: string
  value: string | number
}

/**
 * Base field configuration
 */
export interface BaseField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: string
  }
}

/**
 * Field with options (select, radio, etc.)
 */
export interface FieldWithOptions extends BaseField {
  options: FieldOption[]
}

/**
 * Union type for all field configurations
 */
export type FormField = BaseField | FieldWithOptions

/**
 * Form step configuration
 */
export interface FormStep {
  id: string
  title: string
  description?: string
  fields: FormField[]
}

/**
 * Complete form schema
 */
export interface FormSchema {
  id: string
  name: string
  description?: string
  steps: FormStep[]
  createdAt: string
  updatedAt: string
}

/**
 * Zod schema for form field validation
 */
export const FieldOptionSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.union([z.string(), z.number()])
})

export const BaseFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string().min(1, 'Label is required'),
  placeholder: z.string().optional(),
  required: z.boolean(),
  defaultValue: z.any().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    custom: z.string().optional()
  }).optional(),
  // Allow options as optional for all fields (will be validated in superRefine)
  options: z.array(FieldOptionSchema).optional()
})

export const FieldWithOptionsSchema = BaseFieldSchema.extend({
  options: z.array(FieldOptionSchema).min(1, 'At least one option is required')
})

// Field types that require options
const FIELDS_WITH_OPTIONS: string[] = ['select', 'multiselect', 'radio', 'listbox', 'treeselect']

// Custom schema that validates based on field type
export const FormFieldSchema = BaseFieldSchema.superRefine((data, ctx) => {
  // If field type requires options, validate options exist and are valid
  if (FIELDS_WITH_OPTIONS.includes(data.type)) {
    if (!data.options || !Array.isArray(data.options) || data.options.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Field type '${data.type}' requires at least one option`,
        path: ['options']
      })
    } else {
      // Validate each option structure
      data.options.forEach((option, index) => {
        const optionResult = FieldOptionSchema.safeParse(option)
        if (!optionResult.success) {
          optionResult.error.issues.forEach(issue => {
            ctx.addIssue({
              ...issue,
              path: ['options', index, ...issue.path]
            })
          })
        }
      })
    }
  }
  // Note: We allow other field types to have options (like autocomplete) without error
})

export const FormStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema)
})

export const FormSchemaSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  steps: z.array(FormStepSchema).min(1, 'At least one step is required'),
  createdAt: z.string(),
  updatedAt: z.string()
})

/**
 * Helper function to check if field has options
 */
export function hasOptions(field: FormField): field is FieldWithOptions {
  return 'options' in field && Array.isArray(field.options)
}

/**
 * Helper function to get field type label
 */
export function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Text Input',
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
    color: 'Color Picker',
    file: 'File Upload',
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
  return labels[type] || type
}

/**
 * Helper function to get PrimeVue component name for field type
 */
export function getPrimeVueComponent(type: FieldType): string {
  const components: Record<FieldType, string> = {
    text: 'InputText',
    textarea: 'Textarea',
    number: 'InputNumber',
    email: 'InputText',
    password: 'Password',
    select: 'Select',
    multiselect: 'MultiSelect',
    checkbox: 'Checkbox',
    radio: 'RadioButton',
    date: 'Calendar',
    time: 'Calendar',
    datetime: 'Calendar',
    switch: 'ToggleSwitch',
    slider: 'Slider',
    rating: 'Rating',
    color: 'ColorPicker',
    file: 'FileUpload',
    autocomplete: 'AutoComplete',
    calendar: 'Calendar',
    chips: 'Chips',
    inputmask: 'InputMask',
    inputnumber: 'InputNumber',
    knob: 'Knob',
    listbox: 'Listbox',
    togglebutton: 'ToggleButton',
    treeselect: 'TreeSelect'
  }
  return components[type] || 'InputText'
}

