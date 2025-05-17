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
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
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
    
    await authStore.register(values)
    successMessage.value = 'Registration successful! Please check your email to verify your account.'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.'
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
            <h2 class="text-2xl font-bold">Create an Account</h2>
            <p class="text-gray-600">Fill out the form to get started</p>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  autocomplete="given-name"
                  :required="true"
                />
              </div>
              <div>
                <FormInput
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  autocomplete="family-name"
                  :required="true"
                />
              </div>
            </div>

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              autocomplete="email"
              :required="true"
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              autocomplete="new-password"
              :required="true"
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              autocomplete="new-password"
              :required="true"
            />

            <div class="flex items-center mb-6">
              <input
                class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                type="checkbox"
                id="termsCheck"
                required
              />
              <label class="ml-2 text-sm text-gray-700" for="termsCheck">
                I agree to the <a href="#" class="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" class="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                style="background-color: var(--color-primary)"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="inline-block animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Create Account
              </button>
            </div>
          </form>

          <div v-if="!successMessage" class="mt-6">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-4">or sign up with</p>
              <div>
                <a href="/api/auth/google" 
                   class="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                  <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </a>
              </div>
            </div>
          </div>

          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Already have an account?
              <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Keeping the same card styling */
</style>