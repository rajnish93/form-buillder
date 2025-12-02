# API Documentation

## Store API

### FormBuilderStore

The main Pinia store managing form builder state.

#### State

```typescript
{
  schema: FormSchema
  selectedFieldId: string | null
  selectedStepId: string
  darkMode: boolean
  previewMode: boolean
}
```

#### Getters

##### `currentStep: FormStep | undefined`
Returns the currently selected step.

##### `currentFields: FormField[]`
Returns fields in the current step.

##### `selectedField: FormField | undefined`
Returns the currently selected field.

##### `isMultiStep: boolean`
Returns true if form has multiple steps.

##### `schemaJson: string`
Returns schema as formatted JSON string.

#### Actions

##### `init(): void`
Initializes the store from localStorage.

##### `addField(type: FieldType): void`
Adds a new field to the current step.

**Parameters:**
- `type`: FieldType - The type of field to add

**Example:**
```typescript
store.addField('text')
```

##### `removeField(fieldId: string): void`
Removes a field from the current step.

**Parameters:**
- `fieldId`: string - ID of field to remove

##### `updateField(fieldId: string, updates: Partial<FormField>): void`
Updates field properties.

**Parameters:**
- `fieldId`: string - ID of field to update
- `updates`: Partial<FormField> - Properties to update

**Example:**
```typescript
store.updateField('field-1', {
  label: 'New Label',
  required: true
})
```

##### `reorderFields(newOrder: FormField[]): void`
Reorders fields in current step.

**Parameters:**
- `newOrder`: FormField[] - New field order

##### `addFieldOption(fieldId: string, option: FieldOption): void`
Adds an option to a field.

**Parameters:**
- `fieldId`: string - ID of field
- `option`: FieldOption - Option to add

**Example:**
```typescript
store.addFieldOption('field-1', {
  label: 'Option 1',
  value: 'opt1'
})
```

##### `removeFieldOption(fieldId: string, optionIndex: number): void`
Removes an option from a field.

**Parameters:**
- `fieldId`: string - ID of field
- `optionIndex`: number - Index of option to remove

##### `updateFieldOption(fieldId: string, optionIndex: number, updates: Partial<FieldOption>): void`
Updates a field option.

**Parameters:**
- `fieldId`: string - ID of field
- `optionIndex`: number - Index of option
- `updates`: Partial<FieldOption> - Updates to apply

##### `addStep(): void`
Adds a new step to the form.

##### `removeStep(stepId: string): void`
Removes a step from the form.

**Parameters:**
- `stepId`: string - ID of step to remove

##### `updateStep(stepId: string, updates: Partial<FormStep>): void`
Updates step properties.

**Parameters:**
- `stepId`: string - ID of step
- `updates`: Partial<FormStep> - Updates to apply

##### `updateSchema(updates: Partial<FormSchema>): void`
Updates form schema properties.

**Parameters:**
- `updates`: Partial<FormSchema> - Updates to apply

##### `loadSchema(json: string): { success: boolean; error?: string }`
Loads schema from JSON string.

**Parameters:**
- `json`: string - JSON schema string

**Returns:**
- `{ success: boolean; error?: string }` - Result object

**Example:**
```typescript
const result = store.loadSchema(jsonString)
if (result.success) {
  console.log('Schema loaded')
} else {
  console.error(result.error)
}
```

##### `exportSchema(): void`
Exports schema as downloadable JSON file.

##### `toggleDarkMode(): void`
Toggles dark mode on/off.

##### `updateDarkMode(): void`
Updates dark mode class on document.

##### `saveToLocalStorage(): void`
Saves schema to localStorage.

---

## Type Definitions

### FieldType

```typescript
type FieldType = 
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
```

### FormField

```typescript
interface BaseField {
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

interface FieldWithOptions extends BaseField {
  options: FieldOption[]
}

type FormField = BaseField | FieldWithOptions
```

### FormStep

```typescript
interface FormStep {
  id: string
  title: string
  description?: string
  fields: FormField[]
}
```

### FormSchema

```typescript
interface FormSchema {
  id: string
  name: string
  description?: string
  steps: FormStep[]
  createdAt: string
  updatedAt: string
}
```

### FieldOption

```typescript
interface FieldOption {
  label: string
  value: string | number
}
```

---

## Component Props

### DynamicFieldRenderer

```typescript
interface Props {
  fields: FormField[]
  modelValue?: Record<string, any>
  errors?: Record<string, string>
}
```

**Events:**
- `update:modelValue`: Emitted when form data changes

**Example:**
```vue
<DynamicFieldRenderer
  :fields="fields"
  v-model="formData"
  :errors="errors"
/>
```

---

## Utility Functions

### `getFieldTypeLabel(type: FieldType): string`
Returns human-readable label for field type.

### `getPrimeVueComponent(type: FieldType): string`
Returns PrimeVue component name for field type.

### `hasOptions(field: FormField): field is FieldWithOptions`
Type guard to check if field has options.

---

## Zod Schemas

### FieldOptionSchema

```typescript
z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.union([z.string(), z.number()])
})
```

### FormFieldSchema

```typescript
z.union([
  BaseFieldSchema,
  FieldWithOptionsSchema
])
```

### FormStepSchema

```typescript
z.object({
  id: z.string(),
  title: z.string().min(1, 'Step title is required'),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema)
})
```

### FormSchemaSchema

```typescript
z.object({
  id: z.string(),
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  steps: z.array(FormStepSchema).min(1, 'At least one step is required'),
  createdAt: z.string(),
  updatedAt: z.string()
})
```

---

## Examples

### Creating a Form Programmatically

```typescript
import { useFormBuilderStore } from '~/stores/form-builder'

const store = useFormBuilderStore()

// Add a text field
store.addField('text')
store.updateField(store.currentFields[0].id, {
  label: 'Name',
  placeholder: 'Enter your name',
  required: true
})

// Add a select field
store.addField('select')
store.updateField(store.currentFields[1].id, {
  label: 'Country',
  required: true
})
store.addFieldOption(store.currentFields[1].id, {
  label: 'United States',
  value: 'us'
})
store.addFieldOption(store.currentFields[1].id, {
  label: 'Canada',
  value: 'ca'
})
```

### Loading a Schema

```typescript
const schemaJson = `{
  "id": "form-1",
  "name": "My Form",
  "steps": [{
    "id": "step-1",
    "title": "Step 1",
    "fields": [{
      "id": "field-1",
      "type": "text",
      "label": "Name",
      "required": true
    }]
  }],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}`

const result = store.loadSchema(schemaJson)
if (result.success) {
  console.log('Schema loaded successfully')
} else {
  console.error('Failed to load schema:', result.error)
}
```

### Exporting Schema

```typescript
// Export to file
store.exportSchema()

// Or get JSON string
const json = store.schemaJson
console.log(json)
```

---

For more information, see the main [README.md](../README.md) and [FEATURES.md](./FEATURES.md).

