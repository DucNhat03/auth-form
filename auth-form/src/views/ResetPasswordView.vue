<script setup>
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'
import FormInput from '../components/FormInput.vue'
import AlertMessage from '../components/AlertMessage.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const token = ref('')
const userId = ref('')

onMounted(() => {
  token.value = route.query.token
  userId.value = route.query.id
  
  if (!token.value || !userId.value) {
    errorMessage.value = 'Invalid password reset link'
  }
})

// Form validation schema
const schema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match')
})

const { handleSubmit } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.resetPassword(values.password, token.value, userId.value)
    successMessage.value = 'Password reset successful'
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <h2 class="fw-bold">Reset Password</h2>
            <p class="text-muted">Create a new password for your account</p>
          </div>

          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="danger"
          />
          
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
          />

          <form @submit.prevent="onSubmit" v-if="!successMessage && !errorMessage">
            <FormInput
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              autocomplete="new-password"
              :required="true"
            />

            <FormInput
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              autocomplete="new-password"
              :required="true"
            />

            <div class="d-grid gap-2 mt-4">
              <button
                type="submit"
                class="btn btn-primary btn-lg"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                Reset Password
              </button>
            </div>
          </form>
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