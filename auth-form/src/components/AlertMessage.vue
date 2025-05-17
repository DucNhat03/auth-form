<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'danger', 'warning', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const visible = ref(!!props.message)
let timer = null

watch(() => props.message, (newVal) => {
  visible.value = !!newVal
  
  if (props.autoClose && newVal) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})

const dismiss = () => {
  visible.value = false
  if (timer) clearTimeout(timer)
}

const alertClasses = computed(() => {
  const baseClasses = 'border-l-4 p-4 rounded-md'
  
  switch (props.type) {
    case 'success':
      return `${baseClasses} bg-green-50 border-green-500 text-green-800`
    case 'danger':
      return `${baseClasses} bg-red-50 border-red-500 text-red-800`
    case 'warning':
      return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-800`
    case 'info':
    default:
      return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`
  }
})
</script>

<template>
  <div v-if="visible && message" :class="alertClasses" role="alert">
    <div class="flex justify-between items-center">
      <div>{{ message }}</div>
      <button
        v-if="dismissible"
        type="button"
        class="text-gray-400 hover:text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        aria-label="Close"
        @click="dismiss"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template> 