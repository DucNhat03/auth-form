<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AlertMessage from '../components/AlertMessage.vue'

const route = useRoute()
const authStore = useAuthStore()
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token
  const error = route.query.error
  
  if (error) {
    errorMessage.value = 'Google authentication failed. Please try again.'
    isLoading.value = false
    return
  }
  
  if (!token) {
    errorMessage.value = 'No authentication token received'
    isLoading.value = false
    return
  }
  
  try {
    await authStore.handleGoogleCallback(token)
  } catch (error) {
    errorMessage.value = 'Failed to process Google authentication'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 md:p-8 text-center">
          <div v-if="isLoading" class="my-8">
            <div class="inline-block animate-spin w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full" style="border-top-color: var(--color-primary)"></div>
            <p class="mt-4 text-gray-600">Processing Google authentication...</p>
          </div>
          
          <div v-else-if="errorMessage" class="my-8">
            <AlertMessage
              :message="errorMessage"
              type="danger"
            />
            <div class="mt-6">
              <RouterLink 
                to="/login" 
                class="inline-block px-6 py-3 rounded-md text-white transition-colors" 
                style="background-color: var(--color-primary)"
              >
                Back to Login
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  border: none;
}
</style> 