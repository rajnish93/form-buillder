import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFormBuilderStore } from '~/stores/form-builder'

describe('Form Builder Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes with default state', () => {
        const store = useFormBuilderStore()
        expect(store.schema.name).toBe('Untitled Form')
        expect(store.schema.steps).toHaveLength(1)
        expect(store.currentFields).toEqual([])
    })

    it('adds a field', () => {
        const store = useFormBuilderStore()
        store.addField('text')
        expect(store.currentFields).toHaveLength(1)
        expect(store.currentFields[0]?.type).toBe('text')
        expect(store.selectedFieldId).toBe(store.currentFields[0]?.id)
    })

    it('removes a field', () => {
        const store = useFormBuilderStore()
        store.addField('text')
        const fieldId = store.currentFields[0]?.id
        if (!fieldId) throw new Error('Field not created')
        store.removeField(fieldId)
        expect(store.currentFields).toHaveLength(0)
        expect(store.selectedFieldId).toBeNull()
    })

    it('adds a step', () => {
        const store = useFormBuilderStore()
        store.addStep()
        expect(store.schema.steps).toHaveLength(2)
        expect(store.isMultiStep).toBe(true)
    })

    it('removes a step', () => {
        const store = useFormBuilderStore()
        store.addStep()
        const stepId = store.schema.steps[1]?.id
        if (!stepId) throw new Error('Step not created')
        const result = store.removeStep(stepId)
        expect(result.success).toBe(true)
        expect(store.schema.steps).toHaveLength(1)
    })

    it('cannot remove the last step', () => {
        const store = useFormBuilderStore()
        const stepId = store.schema.steps[0]?.id
        if (!stepId) throw new Error('Step not found')
        const result = store.removeStep(stepId)
        expect(result.success).toBe(false)
        expect(store.schema.steps).toHaveLength(1)
    })

    it('resets the store', () => {
        const store = useFormBuilderStore()
        store.addField('text')
        store.addStep()
        store.resetStore()
        expect(store.schema.steps).toHaveLength(1)
        expect(store.currentFields).toHaveLength(0)
        expect(store.schema.name).toBe('Untitled Form')
    })
})
