<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.getUser)
</script>

<template>
  <div class="py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Welcome to comeback</h1>
      <p class="text-xl text-gray-600">A secure authentication system with email verification</p>
    </div>

    <div class="max-w-4xl mx-auto">
      <div v-if="isAuthenticated" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 class="text-2xl font-bold mb-6">Welcome, {{ user?.lastName }}!</h2>
        
        <div class="mb-6">
          <img
            :src="user?.avatar || 'https://via.placeholder.com/150'"
            alt="Profile Avatar"
            class="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <h4 class="text-xl font-semibold">{{ user?.firstName }} {{ user?.lastName }}</h4>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
        
        <RouterLink to="/profile" class="btn btn-primary block w-full py-3">
          Manage Your Profile
        </RouterLink>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 class="text-2xl font-bold text-center mb-6">Get Started</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- New User Card -->
          <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-center">
            <div class="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" style="color: var(--color-primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">New User?</h3>
            <p class="text-gray-600 mb-6">Create an account to get started with our services</p>
            <RouterLink to="/register" class="btn btn-primary block w-full">
              Sign Up
            </RouterLink>
          </div>
          
          <!-- Existing User Card -->
          <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-center">
            <div class="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" style="color: var(--color-secondary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Existing User?</h3>
            <p class="text-gray-600 mb-6">Sign in to your account to access your profile</p>
            <RouterLink to="/login" class="btn btn-secondary block w-full">
              Sign In
            </RouterLink>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <h4 class="text-xl font-semibold mb-4">Features</h4>
          <ul class="bg-white rounded-lg overflow-hidden shadow-sm">
            <li class="py-3 px-4 border-b border-gray-100">Secure Authentication</li>
            <li class="py-3 px-4 border-b border-gray-100">Email Verification</li>
            <li class="py-3 px-4 border-b border-gray-100">Password Recovery</li>
            <li class="py-3 px-4 border-b border-gray-100">Google OAuth Integration</li>
            <li class="py-3 px-4">Profile Management</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem 0;
}

.avatar-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.card {
  border-radius: 10px;
  border: none;
  overflow: hidden;
}

.get-started-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.get-started-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.get-started-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.get-started-icon i {
  font-size: 2rem;
}

.get-started-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.get-started-content h3 {
  margin-bottom: 12px;
  font-weight: 600;
}

.get-started-content p {
  margin-bottom: 20px;
  color: #6c757d;
}

.get-started-content .btn {
  width: 100%;
  font-weight: 500;
}

.features-section {
  margin-top: 40px;
  text-align: center;
}

.features-section h4 {
  margin-bottom: 20px;
  font-weight: 600;
}

.feature-list {
  list-style: none;
  padding: 0;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-list li {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list li:last-child {
  border-bottom: none;
}

.bi-person-plus {
  color: var(--primary-color);
}

.bi-box-arrow-in-right {
  color: var(--success-color);
}
</style> 