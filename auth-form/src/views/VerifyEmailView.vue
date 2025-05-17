<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import AlertMessage from '../components/AlertMessage.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const token = ref('')
const userId = ref('')

onMounted(async () => {
  token.value = route.query.token
  userId.value = route.query.id
  
  if (!token.value || !userId.value) {
    errorMessage.value = 'Invalid verification link'
    isLoading.value = false
    return
  }
  
  try {
    await authStore.verifyEmail(token.value, userId.value)
    successMessage.value = 'Email verified successfully! You can now log in to your account.'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Email verification failed. Please try again.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow">
        <div class="card-body p-5 text-center">
          <div v-if="isLoading" class="my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Verifying your email...</p>
          </div>
          
          <div v-else-if="successMessage" class="my-5">
            <div class="verification-success mb-4">
              <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
            </div>
            <h2 class="fw-bold">Email Verified!</h2>
            <p class="text-muted mb-4">{{ successMessage }}</p>
            <div class="d-grid gap-2">
              <RouterLink to="/login" class="btn btn-primary btn-lg">
                Go to Login
              </RouterLink>
            </div>
          </div>
          
          <div v-else-if="errorMessage" class="my-5">
            <div class="verification-error mb-4">
              <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
            </div>
            <h2 class="fw-bold">Verification Failed</h2>
            <AlertMessage
              :message="errorMessage"
              type="danger"
            />
            <div class="mt-4">
              <RouterLink to="/" class="btn btn-outline-primary">
                Back to Home
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