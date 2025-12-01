<template>
  <div class="toolbox-panel p-4">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Field Types
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Click to add fields
      </p>
    </div>

    <div class="space-y-2">
      <!-- Text Inputs -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Text Inputs
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="type in textInputTypes"
            :key="type"
            :label="getFieldTypeLabel(type)"
            size="small"
            outlined
            class="justify-start text-xs"
            @click="handleAddField(type)"
          >
            <template #icon>
              <Icon name="heroicons:plus" />
            </template>
          </Button>
        </div>
      </div>

      <!-- Selection Fields -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Selection
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="type in selectionTypes"
            :key="type"
            :label="getFieldTypeLabel(type)"
            size="small"
            outlined
            class="justify-start text-xs"
            @click="handleAddField(type)"
          >
            <template #icon>
              <Icon name="heroicons:list-bullet" />
            </template>
          </Button>
        </div>
      </div>

      <!-- Date & Time -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Date & Time
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="type in dateTimeTypes"
            :key="type"
            :label="getFieldTypeLabel(type)"
            size="small"
            outlined
            class="justify-start text-xs"
            @click="handleAddField(type)"
          >
            <template #icon>
              <Icon name="heroicons:calendar" />
            </template>
          </Button>
        </div>
      </div>

      <!-- Advanced Fields -->
      <div class="mb-4">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Advanced
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="type in advancedTypes"
            :key="type"
            :label="getFieldTypeLabel(type)"
            size="small"
            outlined
            class="justify-start text-xs"
            @click="handleAddField(type)"
          >
            <template #icon>
              <Icon name="heroicons:cog-6-tooth" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getFieldTypeLabel, type FieldType } from '~/types/form-builder'

const { addField } = useFormBuilderStore()

const textInputTypes: FieldType[] = [
  'text',
  'textarea',
  'email',
  'password',
  'inputmask',
  'inputnumber'
]

const selectionTypes: FieldType[] = [
  'select',
  'multiselect',
  'checkbox',
  'radio',
  'listbox',
  'togglebutton',
  'treeselect'
]

const dateTimeTypes: FieldType[] = [
  'date',
  'time',
  'datetime',
  'calendar'
]

const advancedTypes: FieldType[] = [
  'switch',
  'slider',
  'rating',
  'color',
  'file',
  'autocomplete',
  'chips',
  'knob'
]

const handleAddField = (type: FieldType) => {
  addField(type)
}
</script>

