<script setup>
import { computed, watch, onMounted } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  required: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number],
    default: ''
  }
})

// Important: Use the field with the proper context to connect it to the form
const { value: inputValue, errorMessage, handleBlur, handleChange } = useField(props.name, undefined, {
  initialValue: props.value
})

// Add this back to catch initial value changes
watch(() => props.value, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue;
  }
}, { immediate: true });
</script>

<template>
  <div class="mb-4">
    <label :for="name" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} {{ required ? '*' : '' }}
    </label>
    <input
      :id="name"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      v-model="inputValue"
      @input="handleChange"
      @blur="handleBlur"
      class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      :class="{ 'border-red-500': errorMessage }"
    />
    <p v-if="errorMessage" class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
  </div>
</template>