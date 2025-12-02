# Dynamic Form Builder

A powerful, feature-rich form builder application built with Nuxt 3, PrimeVue, TailwindCSS, and Pinia. Create dynamic forms with drag-and-drop interface, multi-step support, schema validation, and more.

## 🚀 Features

### Core Features
- **Drag & Drop Interface**: Intuitive field reordering with smooth animations
- **Multi-step Forms**: Create complex multi-step forms with step navigation
- **Field Types**: Support for 20+ PrimeVue field types including:
  - Text inputs (text, textarea, email, password)
  - Selection fields (select, multiselect, checkbox, radio, listbox)
  - Date & Time (date, time, datetime, calendar)
  - Advanced fields (slider, rating, color picker, file upload, autocomplete, chips, and more)
- **Field Configuration**: 
  - Custom labels and placeholders
  - Required field toggle
  - Default values
  - Validation rules (min/max, length, patterns)
  - Options management for select/radio fields
- **Live Preview**: Real-time preview of forms as you build them
- **Schema Export/Import**: 
  - Export forms as JSON schema
  - Import existing schemas to restore forms
  - LocalStorage persistence
- **Dark Mode**: Beautiful dark theme support
- **Schema Validation**: Zod-based schema validation for type safety

## 📦 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd dynamic-form
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
dynamic-form/
├── assets/
│   └── css/
│       └── main.css          # Global styles and Tailwind imports
├── components/
│   ├── DynamicFieldRenderer.vue  # Renders form fields dynamically
│   ├── FieldEditor.vue           # Field configuration panel
│   ├── FieldList.vue             # Field list with drag-and-drop
│   ├── Preview.vue               # Preview component
│   └── Toolbox.vue               # Field type toolbox
├── examples/
│   ├── contact-form.json         # Example contact form schema
│   └── survey-form.json           # Example multi-step survey schema
├── pages/
│   ├── index.vue                 # Landing page
│   ├── builder.vue               # Main form builder page
│   └── preview.vue               # Standalone preview page
├── plugins/
│   └── form-builder.client.ts    # Client-side plugin initialization
├── stores/
│   └── form-builder.ts            # Pinia store for state management
├── types/
│   └── form-builder.ts           # TypeScript types and Zod schemas
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
├── package.json                  # Dependencies
└── tailwind.config.js           # TailwindCSS configuration
```

## 🎯 Usage Guide

### Building a Form

1. **Start Building**:
   - Navigate to `/builder` page
   - Enter a form name in the header

2. **Add Fields**:
   - Click on field types in the Toolbox panel (left)
   - Fields are added to the current step

3. **Configure Fields**:
   - Click on a field in the Field List (middle-left)
   - Configure properties in the Field Editor (right):
     - Label and placeholder
     - Required toggle
     - Default values
     - Validation rules
     - Options (for select/radio fields)

4. **Reorder Fields**:
   - Drag fields by the handle (bars icon) to reorder
   - Changes are saved automatically

5. **Multi-step Forms**:
   - Click the "+" button next to step selector to add steps
   - Configure step title and description
   - Switch between steps to add fields

6. **Preview**:
   - See live preview in the preview panel
   - Click "Preview" button for full-screen preview

### Exporting and Importing

**Export Schema**:
1. Click "Export" button in the header
2. JSON file will be downloaded

**Import Schema**:
1. Click "Import" button
2. Paste JSON schema or upload a file
3. Form will be restored

### Example Schemas

Check the `examples/` directory for sample form schemas:
- `contact-form.json`: Simple contact form
- `survey-form.json`: Multi-step customer satisfaction survey

## 🔧 Configuration

### PrimeVue Theme

The app uses PrimeVue's Aura theme. To customize:

1. Edit `nuxt.config.ts`:
```typescript
primevue: {
  options: {
    theme: {
      preset: Aura,
      options: {
        // Customize theme options
      }
    }
  }
}
```

### TailwindCSS

Customize Tailwind in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your color palette
      }
    }
  }
}
```

## 📚 Component Documentation

### Toolbox Component

**Location**: `components/Toolbox.vue`

Displays available field types organized by category:
- Text Inputs
- Selection Fields
- Date & Time
- Advanced Fields

**Props**: None

**Events**: None

### FieldList Component

**Location**: `components/FieldList.vue`

Shows fields in the current step with drag-and-drop reordering.

**Features**:
- Step navigation (for multi-step forms)
- Step configuration
- Field selection
- Drag-and-drop reordering

### FieldEditor Component

**Location**: `components/FieldEditor.vue`

Configures selected field properties.

**Sections**:
- Basic Settings (label, placeholder, required, default value)
- Options Editor (for fields with options)
- Validation Settings (min/max, length constraints)

### DynamicFieldRenderer Component

**Location**: `components/DynamicFieldRenderer.vue`

Dynamically renders form fields based on field type.

**Props**:
- `fields`: Array of FormField objects
- `modelValue`: Form data object
- `errors`: Validation errors object

**Events**:
- `update:modelValue`: Emitted when form data changes

### Preview Component

**Location**: `components/Preview.vue`

Full preview of the form with validation and step navigation.

**Features**:
- Multi-step navigation
- Form validation
- Submit handling
- Form data display

## 🗄️ Store API

### FormBuilderStore

**Location**: `stores/form-builder.ts`

**State**:
- `schema`: Current form schema
- `selectedFieldId`: ID of selected field
- `selectedStepId`: ID of current step
- `darkMode`: Dark mode toggle
- `previewMode`: Preview mode flag

**Getters**:
- `currentStep`: Current step object
- `currentFields`: Fields in current step
- `selectedField`: Selected field object
- `isMultiStep`: Whether form has multiple steps
- `schemaJson`: Schema as JSON string

**Actions**:
- `init()`: Initialize store from localStorage
- `addField(type)`: Add new field
- `removeField(id)`: Remove field
- `updateField(id, updates)`: Update field properties
- `reorderFields(newOrder)`: Reorder fields
- `addStep()`: Add new step
- `removeStep(id)`: Remove step
- `updateStep(id, updates)`: Update step properties
- `loadSchema(json)`: Load schema from JSON
- `exportSchema()`: Export schema as file
- `toggleDarkMode()`: Toggle dark mode
- `saveToLocalStorage()`: Save to localStorage

## 🎨 Styling

The app uses TailwindCSS utility classes with custom styles in `assets/css/main.css`.

**Key Classes**:
- `.form-builder-container`: Main container
- `.toolbox-panel`: Toolbox panel styling
- `.editor-panel`: Field editor panel
- `.preview-panel`: Preview panel
- `.field-item`: Field list item
- `.field-item-selected`: Selected field styling

## 🔍 Type Safety

The project uses TypeScript with strict mode enabled. Types are defined in `types/form-builder.ts`:

- `FieldType`: Supported field types
- `FormField`: Field configuration
- `FormStep`: Step configuration
- `FormSchema`: Complete form schema

Zod schemas are provided for runtime validation.

## 🧪 Validation

Form validation uses:
1. **Zod schemas** for schema validation
2. **Runtime validation** in preview component
3. **Field-level validation** rules (min/max, length, required)

## 🌙 Dark Mode

Dark mode is implemented using:
- TailwindCSS dark mode classes
- PrimeVue dark theme
- LocalStorage persistence

Toggle via the moon icon in the header.

## 📝 Field Types Reference

### Text Inputs
- `text`: Single-line text input
- `textarea`: Multi-line text input
- `email`: Email input with validation
- `password`: Password input with toggle
- `inputmask`: Masked input
- `inputnumber`: Number input with controls

### Selection
- `select`: Dropdown select
- `multiselect`: Multi-select dropdown
- `checkbox`: Checkbox input
- `radio`: Radio button group
- `listbox`: List selection
- `togglebutton`: Toggle button
- `treeselect`: Tree selection

### Date & Time
- `date`: Date picker
- `time`: Time picker
- `datetime`: Date and time picker
- `calendar`: Calendar component

### Advanced
- `switch`: Toggle switch
- `slider`: Range slider
- `rating`: Star rating
- `color`: Color picker
- `file`: File upload
- `autocomplete`: Autocomplete input
- `chips`: Chips input
- `knob`: Knob control

## 🚧 Future Enhancements

Potential features for future versions:
- Form templates library
- Conditional field visibility
- Field dependencies
- Custom validation functions
- Form analytics
- Collaborative editing
- Form versioning
- API integration

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Nuxt 3, PrimeVue, TailwindCSS, and Pinia

