# Quick Start Guide

Get up and running with the Dynamic Form Builder in minutes!

## Prerequisites

- Node.js 20.x or newer
- npm, yarn, or pnpm

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser**:
Navigate to `http://localhost:3000`

## First Form

### Step 1: Create a Simple Contact Form

1. Navigate to `/builder`
2. Enter form name: "Contact Form"
3. Add fields:
   - Click "Text Input" → Name field appears
   - Click "Email" → Email field appears
   - Click "Textarea" → Message field appears

4. Configure fields:
   - Click on "Text Field" in field list
   - In editor panel:
     - Label: "Full Name"
     - Placeholder: "Enter your name"
     - Toggle "Required Field" ON
   - Repeat for email and message fields

5. Preview:
   - Click "Preview" button
   - Test the form
   - Navigate back to builder

6. Export:
   - Click "Export" button
   - JSON file downloads
   - Save for later use

### Step 2: Create Multi-step Form

1. In Field List panel, click "+" next to step selector
2. New step "Step 2" is created
3. Switch to Step 2 using dropdown
4. Add fields to Step 2
5. Configure step titles:
   - Step 1: "Personal Information"
   - Step 2: "Additional Details"

6. Preview:
   - Click "Preview"
   - Navigate between steps
   - Test form submission

## Common Tasks

### Adding a Select Field

1. Click "Select" in toolbox
2. Field appears in list
3. Click field to edit
4. In Options section:
   - Click "Add Option"
   - Enter label and value
   - Repeat for each option

### Reordering Fields

1. Click and hold the bars icon (⋮⋮) on a field
2. Drag to new position
3. Release to drop

### Deleting a Field

1. Click field in list
2. Click trash icon on field card
3. OR click "Delete Field" in editor panel

### Importing a Form

1. Click "Import" button
2. Paste JSON schema OR
3. Click to upload file
4. Form loads automatically

## Tips

- **Auto-save**: Changes save automatically to localStorage
- **Dark Mode**: Toggle via moon icon in header
- **Validation**: Set min/max values in Validation section
- **Multi-step**: Use for long forms to improve UX

## Example Schemas

Check `examples/` directory:
- `contact-form.json` - Simple contact form
- `survey-form.json` - Multi-step survey

Import these to see examples!

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [FEATURES.md](./docs/FEATURES.md) for feature details
- See [API.md](./docs/API.md) for API reference

## Troubleshooting

**Fields not appearing?**
- Check if correct step is selected
- Verify field was added (check field count)

**Import not working?**
- Verify JSON is valid
- Check browser console for errors

**Preview not updating?**
- Refresh preview panel
- Check for validation errors

---

Happy building! 🚀

