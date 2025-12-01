# How to Create Forms - Step-by-Step Guide

This guide will walk you through creating both simple and complex forms using the Dynamic Form Builder.

---

## 📝 Simple Form: Contact Form

### Step 1: Open the Form Builder
1. Start the development server: `pnpm dev`
2. Navigate to `/builder` in your browser
3. You'll see the form builder interface

### Step 2: Set Form Name
1. In the header, click on the form name input
2. Enter "Contact Form" as the form name

### Step 3: Add Fields from Toolbox

#### Add Name Field:
1. In the **Toolbox** panel (left), find **Text Inputs** section
2. Click the **"Text Field"** button
3. The field appears in the **Field List** panel (middle-left)
4. Click on the field to select it
5. In the **Field Editor** panel (right):
   - Set **Label** to: "Full Name"
   - Set **Placeholder** to: "Enter your full name"
   - Enable **Required Field** toggle
   - Set **Min Length** to: 2
   - Set **Max Length** to: 100

#### Add Email Field:
1. Click **"Email"** button in Toolbox
2. Select the field in Field List
3. In Field Editor:
   - **Label**: "Email Address"
   - **Placeholder**: "your.email@example.com"
   - **Required**: Yes

#### Add Phone Field (Optional):
1. Click **"Input Mask"** button in Toolbox
2. Select the field
3. In Field Editor:
   - **Label**: "Phone Number"
   - **Placeholder**: "+1 (555) 123-4567"
   - **Required**: No

#### Add Subject Field:
1. Click **"Select"** button in Toolbox (under Selection section)
2. Select the field
3. In Field Editor:
   - **Label**: "Subject"
   - **Placeholder**: "Select a subject"
   - **Required**: Yes
   - In **Options** section, click **"Add Option"**:
     - Option 1: Label: "General Inquiry", Value: "general"
     - Option 2: Label: "Support Request", Value: "support"
     - Option 3: Label: "Sales Question", Value: "sales"
     - Option 4: Label: "Partnership", Value: "partnership"
     - Option 5: Label: "Other", Value: "other"

#### Add Message Field:
1. Click **"Textarea"** button in Toolbox
2. Select the field
3. In Field Editor:
   - **Label**: "Message"
   - **Placeholder**: "Enter your message here..."
   - **Required**: Yes
   - **Min Length**: 10
   - **Max Length**: 1000

#### Add Newsletter Checkbox:
1. Click **"Checkbox"** button in Toolbox
2. Select the field
3. In Field Editor:
   - **Label**: "Subscribe to our newsletter"
   - **Required**: No

### Step 4: Reorder Fields (Optional)
1. In the **Field List** panel, drag fields by the drag handle (bars icon) to reorder
2. Suggested order: Name → Email → Phone → Subject → Message → Newsletter

### Step 5: Update Step Information
1. In the **Field List** panel, you'll see the **Step Info** card
2. Update **Step Title** to: "Contact Information"
3. Add **Step Description**: "Please fill out the form below and we'll get back to you soon."

### Step 6: Preview Your Form
1. Click the **"Preview"** button in the header to see full-screen preview
2. Or use the **Live Preview** panel (middle-right) to see changes in real-time
3. Test filling out the form

### Step 7: Export Your Form
1. Click **"Export"** button in the header
2. A JSON file will download with your form schema
3. Save it for future use or sharing

### Step 8: Import (Optional)
To load a saved form:
1. Click **"Import"** button
2. Paste your JSON schema or upload the file
3. Your form will be restored

---

## 🛒 Complex Form: Checkout Flow (Multi-Step)

### Step 1: Set Up Form
1. Open form builder
2. Set form name to: "E-commerce Checkout Flow"
3. Set form description: "Complete multi-step checkout process"

### Step 2: Create First Step - Shipping Information

#### Add Step Title:
1. In **Step Info** card, set title to: "Shipping Information"
2. Set description: "Where should we ship your order?"

#### Add Shipping Fields:
1. **Full Name** (Text) - Required, Min: 2, Max: 100
2. **Email Address** (Email) - Required
3. **Phone Number** (Input Mask) - Required, Placeholder: "+1 (555) 123-4567"
4. **Street Address** (Textarea) - Required, Min: 5, Max: 200
5. **City** (Text) - Required
6. **State/Province** (Select) - Required, Add options:
   - Alabama (AL)
   - Alaska (AK)
   - California (CA)
   - Florida (FL)
   - New York (NY)
   - Texas (TX)
   - (Add more as needed)
7. **ZIP Code** (Text) - Required, Min: 5, Max: 10
8. **Country** (Select) - Required, Options:
   - United States (US)
   - Canada (CA)
   - United Kingdom (UK)
   - Australia (AU)
9. **Shipping Method** (Radio) - Required, Options:
   - Standard Shipping (5-7 days) - Free
   - Express Shipping (2-3 days) - $15.99
   - Overnight Shipping (1 day) - $29.99

### Step 3: Add Second Step - Payment Information

#### Create New Step:
1. Click the **"Add Step"** button (plus icon) in the Step Navigation
2. A new step "Step 2" is created and selected

#### Update Step Info:
1. Set **Step Title** to: "Payment Information"
2. Set **Description** to: "Secure payment processing"

#### Add Payment Fields:
1. **Name on Card** (Text) - Required, Min: 2, Max: 100
2. **Card Number** (Input Mask) - Required, Placeholder: "1234 5678 9012 3456"
3. **Expiry Date** (Text) - Required, Placeholder: "MM/YY"
4. **CVV** (Input Mask) - Required, Placeholder: "123", Min: 3, Max: 4
5. **Billing Address Same** (Checkbox) - Label: "Billing address same as shipping address"

### Step 4: Add Third Step - Order Review

#### Create New Step:
1. Click **"Add Step"** again
2. Step 3 is created

#### Update Step Info:
1. **Step Title**: "Order Review"
2. **Description**: "Review your order details before submitting"

#### Add Review Fields:
1. **Special Instructions** (Textarea) - Optional, Max: 500, Placeholder: "Leave at front door..."
2. **Gift Checkbox** (Checkbox) - Label: "This is a gift"
3. **Gift Message** (Textarea) - Optional, Max: 200
4. **Promo Code** (Text) - Optional, Placeholder: "Enter promo code"
5. **Newsletter** (Checkbox) - Label: "Subscribe to our newsletter for exclusive deals"
6. **Terms Agreement** (Checkbox) - Required, Label: "I agree to the terms and conditions and privacy policy"

### Step 5: Navigate Between Steps
1. Use the **Step dropdown** in Field List panel to switch between steps
2. Each step maintains its own fields
3. You can edit any step at any time

### Step 6: Reorder Steps (If Needed)
Currently, steps are in order they were created. To reorder:
- Delete and recreate in desired order, OR
- Use the step dropdown to work on steps in any order

### Step 7: Preview Multi-Step Form
1. Click **"Preview"** button
2. You'll see step-by-step navigation
3. Use **"Previous"** and **"Next"** buttons to navigate
4. On the last step, you'll see **"Submit"** button
5. Test the complete flow

### Step 8: Test Validation
1. Try submitting without required fields
2. Test min/max length validations
3. Verify email format validation
4. Check that terms checkbox is required

---

## 💡 Pro Tips

### For Simple Forms:
- ✅ Keep it to one step
- ✅ Use clear, descriptive labels
- ✅ Add helpful placeholders
- ✅ Set appropriate validation
- ✅ Make important fields required

### For Complex Forms:
- ✅ Break into logical steps (Shipping → Payment → Review)
- ✅ Group related fields together
- ✅ Use progress indicators (shown in preview)
- ✅ Validate each step before allowing next
- ✅ Save user progress (if implementing backend)

### Field Selection Tips:
- **Text**: Names, addresses, short answers
- **Textarea**: Long messages, descriptions
- **Email**: Email addresses (auto-validates)
- **Select**: Single choice from many options
- **Radio**: Single choice from few options (better UX)
- **Checkbox**: Boolean, opt-ins
- **Input Mask**: Phone numbers, card numbers
- **Date/Calendar**: Dates, scheduling
- **Rating**: Satisfaction scores
- **Slider**: Range selection

### Validation Best Practices:
- Set **minLength** for text fields to prevent empty submissions
- Set **maxLength** to prevent database issues
- Use **required** for critical fields
- Set **min/max** for numbers (age, quantity, etc.)
- Test validation in preview mode

### Drag and Drop:
- Click and hold the **drag handle** (bars icon) on the left of each field
- Drag to reorder fields within a step
- Fields reorder instantly in preview

### Selecting Fields to Edit:
- Click on a field in the **Field List** panel
- OR click on a field in the **Live Preview** panel
- Field Editor panel opens on the right
- Make changes and see updates in real-time

---

## 🚀 Quick Start Checklist

### Simple Contact Form:
- [ ] Form name set
- [ ] Name field (text, required)
- [ ] Email field (email, required)
- [ ] Subject field (select with options)
- [ ] Message field (textarea, required)
- [ ] Newsletter checkbox (optional)
- [ ] Step title and description set
- [ ] Fields reordered logically
- [ ] Preview tested
- [ ] Form exported

### Checkout Flow:
- [ ] Form name and description set
- [ ] Step 1: Shipping info (9 fields)
- [ ] Step 2: Payment info (5 fields)
- [ ] Step 3: Order review (6 fields)
- [ ] All required fields marked
- [ ] Validation rules set
- [ ] Multi-step navigation tested
- [ ] Form exported

---

## 📚 Example Files

Two example JSON files are provided:
1. `examples/contact-form-detailed.json` - Simple contact form
2. `examples/checkout-flow.json` - Multi-step checkout

To use these:
1. Click **"Import"** button
2. Open the JSON file
3. Copy and paste the content
4. Click **"Import"** in the dialog
5. Form loads instantly!

---

## 🎯 Next Steps

After creating your forms:
1. **Export** the JSON schema
2. **Integrate** with your backend API
3. **Customize** styling if needed
4. **Deploy** to production
5. **Collect** form submissions
6. **Analyze** form data

---

*Happy form building! 🎉*

