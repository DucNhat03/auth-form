<script setup>
import { ref, computed, reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../stores/auth'
import FormInput from '../components/FormInput.vue'
import AlertMessage from '../components/AlertMessage.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.getUser)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const activeTab = ref('profile')

// Create a reactive form state
const formState = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || ''
})

// Profile form validation schema
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
})

// Password form validation schema
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

// Initialize form with validation schema but don't use handleSubmit wrapper
const { errors } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    firstName: user.value?.firstName || '',
    lastName: user.value?.lastName || ''
  }
})

// Direct submit handler 
const onProfileSubmit = async () => {
  try {
    // Validate form data against schema
    await profileSchema.validate(formState, { abortEarly: false });
    
    console.log('Form submitted with values:', formState);
    isLoading.value = true;
    errorMessage.value = '';
    
    await authStore.updateProfile({
      firstName: formState.firstName,
      lastName: formState.lastName
    });
    successMessage.value = 'Profile updated successfully';
  } catch (error) {
    if (error.name === 'ValidationError') {
      errorMessage.value = error.errors[0];
    } else {
      errorMessage.value = error.response?.data?.message || 'Failed to update profile. Please try again.';
    }
    console.error('Error during form submission:', error);
  } finally {
    isLoading.value = false;
  }
}

// handle firstName change
const handleFirstNameChange = (e) => {
  formState.firstName = e.target.value;
}

// handle lastName change
const handleLastNameChange = (e) => {
  formState.lastName = e.target.value;
}

const { handleSubmit: handlePasswordSubmit } = useForm({
  validationSchema: passwordSchema
})

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    await authStore.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    })
    successMessage.value = 'Password changed successfully'
    
    // Reset form fields
    values.currentPassword = ''
    values.newPassword = ''
    values.confirmPassword = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to change password. Please try again.'
  } finally {
    isLoading.value = false
  }
})

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select an image file'
    return
  }
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Image size should be less than 5MB'
    return
  }
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    await authStore.uploadAvatar(formData)
    successMessage.value = 'Avatar uploaded successfully'
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to upload avatar. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 px-4">
    <!-- Profile Sidebar -->
    <div class="w-full md:w-1/3 lg:w-1/4">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6 text-center">
          <div class="avatar-container mx-auto mb-4">
            <img
              :src="user?.avatar || 'https://via.placeholder.com/150'"
              alt="Profile Avatar"
              class="avatar-img rounded-full object-cover"
            />
            <div class="avatar-overlay">
              <label for="avatar-upload" class="avatar-upload-label">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                class="avatar-upload-input"
                @change="handleAvatarChange"
              />
            </div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-800">{{ user?.firstName || 'User' }} {{ user?.lastName || '' }}</h3>
          <p class="text-gray-600 text-sm mb-3">{{ user?.email || 'user@example.com' }}</p>
          
          <div>
            <span 
              v-if="user?.isVerified" 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Verified
            </span>
            <span 
              v-else 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
            >
              <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Not Verified
            </span>
          </div>
        </div>
        
        <div class="border-t border-gray-100">
          <nav class="flex flex-col">
            <button
              class="flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50 text-blue-600 cursor-pointer': activeTab === 'profile', 'text-gray-700': activeTab !== 'profile' }"
              @click="switchTab('profile')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Information
            </button>
            <button
              class="flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 cursor-pointer"
              :class="{ 'bg-blue-50 text-blue-600 cursor-pointer': activeTab === 'security', 'text-gray-700': activeTab !== 'security' }"
              @click="switchTab('security')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </button>
          </nav>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="w-full md:w-2/3 lg:w-3/4">
      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 md:p-8">
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
            :auto-close="true"
          />
          
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 class="text-xl font-bold text-gray-800">Profile Information</h3>
            </div>
            
            <form @submit.prevent="onProfileSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="mb-4">
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    autocomplete="given-name"
                    required
                    v-model="formState.firstName"
                    class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
                </div>
                <div class="mb-4">
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    autocomplete="family-name"
                    required
                    v-model="formState.lastName"
                    class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
                </div>
              </div>
              
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm focus:outline-none"
                    :value="user?.email"
                    disabled
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>
              
              <div class="mt-8 flex justify-end">
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
                  :disabled="isLoading"
                  @click="console.log('Submit button clicked')"
                >
                  <span v-if="isLoading" class="inline-block animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full "></span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
          
          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 class="text-xl font-bold text-gray-800">Change Password</h3>
            </div>
            
            <form @submit.prevent="onPasswordSubmit">
              <div class="space-y-6">
                <FormInput
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  placeholder="Enter your current password"
                  autocomplete="current-password"
                  :required="true"
                />
                
                <FormInput
                  name="newPassword"
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
              </div>
              
              <div class="mt-8 flex justify-end">
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="inline-block animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-overlay:hover {
  background: rgba(0, 0, 0, 0.8);
}

.avatar-upload-label {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-upload-input {
  display: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>