# Features Documentation

## Overview

The Dynamic Form Builder is a comprehensive application for creating, editing, and managing dynamic forms. This document provides detailed information about each feature.

## Table of Contents

1. [Form Builder UI](#form-builder-ui)
2. [Field Types](#field-types)
3. [Field Configuration](#field-configuration)
4. [Multi-step Forms](#multi-step-forms)
5. [Schema Management](#schema-management)
6. [Preview System](#preview-system)
7. [Dark Mode](#dark-mode)
8. [Validation](#validation)
9. [Drag and Drop](#drag-and-drop)

---

## Form Builder UI

### Layout

The builder interface consists of four main panels:

1. **Toolbox Panel** (Left)
   - Displays all available field types
   - Organized by category
   - Click to add fields to current step

2. **Field List Panel** (Middle-Left)
   - Shows fields in current step
   - Drag-and-drop reordering
   - Step navigation for multi-step forms
   - Step configuration

3. **Preview Panel** (Middle-Right)
   - Live preview of form
   - Updates in real-time
   - Shows form as users will see it

4. **Field Editor Panel** (Right)
   - Configure selected field
   - Edit properties
   - Manage options
   - Set validation rules

### Header Actions

- **Form Name**: Edit form name inline
- **Dark Mode Toggle**: Switch between light/dark themes
- **Import**: Load form schema from JSON
- **Export**: Download form schema as JSON
- **Preview**: Open full-screen preview

---

## Field Types

### Text Inputs

#### Text (`text`)
- Single-line text input
- Supports placeholder, default value
- Validation: min/max length

#### Textarea (`textarea`)
- Multi-line text input
- Configurable rows
- Supports placeholder, default value
- Validation: min/max length

#### Email (`email`)
- Email input with built-in validation
- Supports placeholder, default value
- Browser-native email validation

#### Password (`password`)
- Password input with show/hide toggle
- Supports placeholder
- Secure input masking

#### Input Mask (`inputmask`)
- Masked input for formatted data
- Supports patterns (phone, date, etc.)
- Customizable mask

#### Input Number (`inputnumber`)
- Number input with increment/decrement buttons
- Supports min/max values
- Decimal precision control

### Selection Fields

#### Select (`select`)
- Dropdown selection
- Single selection
- Requires options array
- Supports placeholder

#### Multi Select (`multiselect`)
- Multiple selection dropdown
- Chip display for selected items
- Requires options array

#### Checkbox (`checkbox`)
- Binary checkbox
- True/false value
- No options required

#### Radio (`radio`)
- Radio button group
- Single selection from options
- Requires options array
- Horizontal or vertical layout

#### Listbox (`listbox`)
- List-based selection
- Single or multiple selection
- Requires options array
- Customizable height

#### Toggle Button (`togglebutton`)
- Toggle button control
- Binary state
- Customizable labels

#### Tree Select (`treeselect`)
- Hierarchical selection
- Tree structure
- Requires tree-structured options

### Date & Time

#### Date (`date`)
- Date picker
- Calendar interface
- Date format customization

#### Time (`time`)
- Time picker
- Hour/minute/second selection

#### Date & Time (`datetime`)
- Combined date and time picker
- Full calendar and time selection

#### Calendar (`calendar`)
- Advanced calendar component
- Multiple selection modes
- Range selection support

### Advanced Fields

#### Switch (`switch`)
- Toggle switch
- Binary state
- Customizable colors

#### Slider (`slider`)
- Range slider
- Min/max value support
- Step increments
- Customizable range

#### Rating (`rating`)
- Star rating component
- Configurable number of stars
- Half-star support

#### Color Picker (`color`)
- Color selection
- Multiple color formats
- Preset colors

#### File Upload (`file`)
- File upload component
- Multiple file support
- File type restrictions
- Drag-and-drop upload

#### Autocomplete (`autocomplete`)
- Autocomplete input
- Suggestions from options
- Custom filtering

#### Chips (`chips`)
- Tag/chip input
- Multiple values
- Add/remove chips

#### Knob (`knob`)
- Circular knob control
- Value selection
- Customizable range

---

## Field Configuration

### Basic Settings

Every field supports these basic properties:

- **Label**: Display name for the field
- **Placeholder**: Hint text shown when empty
- **Required**: Whether field is mandatory
- **Default Value**: Initial value (if applicable)

### Options Management

Fields with options (select, radio, multiselect, etc.) support:

- **Add Option**: Add new option with label and value
- **Edit Option**: Modify option label or value
- **Remove Option**: Delete option from list
- **Reorder Options**: Drag to reorder (future enhancement)

### Validation Rules

Supported validation rules:

- **Min Value**: Minimum numeric value
- **Max Value**: Maximum numeric value
- **Min Length**: Minimum character length
- **Max Length**: Maximum character length
- **Pattern**: Regular expression pattern
- **Custom**: Custom validation function (future)

---

## Multi-step Forms

### Creating Multi-step Forms

1. Click the "+" button next to step selector
2. New step is created automatically
3. Switch between steps using dropdown
4. Add fields to each step independently

### Step Configuration

Each step supports:

- **Title**: Step name displayed to users
- **Description**: Optional step description
- **Fields**: List of fields in the step

### Step Navigation

In preview mode:

- **Previous Button**: Navigate to previous step
- **Next Button**: Navigate to next step (validates current step)
- **Step Indicator**: Shows current step and progress

### Step Validation

- Each step validates independently
- Cannot proceed to next step if current step has errors
- Validation errors displayed inline

---

## Schema Management

### Schema Structure

```typescript
{
  id: string
  name: string
  description?: string
  steps: FormStep[]
  createdAt: string
  updatedAt: string
}
```

### LocalStorage Persistence

- Forms automatically save to localStorage
- Persists across browser sessions
- Loads automatically on app start

### Export Schema

1. Click "Export" button
2. JSON file downloads automatically
3. File name: `{form-name}-{timestamp}.json`

### Import Schema

**Method 1: Paste JSON**
1. Click "Import" button
2. Paste JSON in dialog
3. Click "Import"

**Method 2: Upload File**
1. Click "Import" button
2. Click file upload area
3. Select JSON file
4. Schema loads automatically

### Schema Validation

- Uses Zod schemas for validation
- Validates on import
- Shows error messages for invalid schemas
- Ensures type safety

---

## Preview System

### Live Preview

- Updates in real-time as you build
- Shows form exactly as users will see it
- Includes all styling and validation

### Full-screen Preview

- Accessible via "Preview" button
- Standalone preview page
- Multi-step navigation
- Form submission handling

### Preview Features

- **Real-time Updates**: Changes reflect immediately
- **Validation Display**: Shows validation errors
- **Step Navigation**: Navigate between steps
- **Form Data Display**: View submitted data (debug mode)

---

## Dark Mode

### Toggle Dark Mode

- Click moon/sun icon in header
- Toggles between light and dark themes
- Preference saved to localStorage

### Theme Support

- **PrimeVue**: Dark theme variant
- **TailwindCSS**: Dark mode classes
- **Custom Styles**: Dark mode variants

### Automatic Detection

- Respects system preference (future)
- Manual toggle always available
- Persists across sessions

---

## Validation

### Field-level Validation

- **Required**: Field must have value
- **Min/Max**: Numeric constraints
- **Length**: String length constraints
- **Pattern**: Regular expression matching

### Step Validation

- Validates all fields in step
- Prevents progression if errors exist
- Shows all errors at once

### Form Validation

- Validates entire form on submit
- Shows summary of all errors
- Prevents submission if invalid

### Error Display

- Inline error messages
- Red text below fields
- Clear error descriptions
- Accessibility-friendly

---

## Drag and Drop

### Field Reordering

- Drag fields by handle (bars icon)
- Smooth animation
- Updates order immediately
- Saves automatically

### Implementation

- Uses `vue-draggable-plus` library
- Touch-friendly
- Keyboard accessible (future)
- Visual feedback during drag

### Limitations

- Currently only field reordering
- Option reordering (future)
- Step reordering (future)

---

## Best Practices

### Form Design

1. **Clear Labels**: Use descriptive field labels
2. **Helpful Placeholders**: Provide examples in placeholders
3. **Logical Order**: Arrange fields logically
4. **Group Related Fields**: Use steps for grouping
5. **Progressive Disclosure**: Use multi-step for long forms

### Validation

1. **Required Fields**: Mark essential fields as required
2. **Appropriate Constraints**: Set realistic min/max values
3. **Clear Messages**: Write clear error messages
4. **Validate Early**: Show errors as user types (future)

### Performance

1. **Limit Fields**: Keep forms manageable
2. **Optimize Steps**: Don't create too many steps
3. **Test Performance**: Test with many fields

---

## Troubleshooting

### Fields Not Appearing

- Check if field is added to correct step
- Verify step is selected
- Check browser console for errors

### Import Not Working

- Verify JSON is valid
- Check schema structure matches expected format
- Ensure all required fields are present

### Preview Not Updating

- Refresh preview panel
- Check for JavaScript errors
- Verify field configuration is valid

### Drag and Drop Not Working

- Ensure you're dragging by the handle icon
- Check browser compatibility
- Try refreshing the page

---

## Future Enhancements

Planned features for future versions:

- Conditional field visibility
- Field dependencies
- Custom validation functions
- Form templates
- Collaborative editing
- Form analytics
- API integration
- Export to PDF
- Form versioning
- Field groups/sections

---

For more information, see the main [README.md](../README.md).

