<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { RouterLink } from 'vue-router'
import FormInput from '../components/FormInput.vue'
import AlertMessage from '../components/AlertMessage.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form validation schema
const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email')
})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.forgotPassword(values.email)
    successMessage.value = 'Password reset link has been sent to your email'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to send password reset email. Please try again.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex justify-center">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 md:p-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold">Forgot Password</h2>
            <p class="text-gray-600">Enter your email to reset your password</p>
          </div>

          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="danger"
            :auto-close="true"
          />
          
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
          />

          <form @submit.prevent="onSubmit" v-if="!successMessage">
            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              :required="true"
            />

            <div class="mt-6">
              <button
                type="submit"
                class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                style="background-color: var(--color-primary)"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="inline-block animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Send Reset Link
              </button>
            </div>
          </form>

          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Remember your password?
              <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
                Back to Login
              </RouterLink>
            </p>
          </div>
          
          <!-- Optional illustration for empty state when success message is shown -->
          <div v-if="successMessage" class="mt-6 flex flex-col items-center">
            <div class="rounded-full bg-green-100 p-3 mb-4">
              <svg class="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 text-center">
              Please check your inbox and spam folder. The reset link will expire after 1 hour.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>