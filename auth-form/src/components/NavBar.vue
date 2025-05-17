<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.getUser)
const isMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white shadow-md py-4 mb-8">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink class="flex items-center" to="/">
        <div class="text-2xl mr-2" style="color: var(--color-primary)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="text-xl font-bold" style="background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">DucNhatDev</span>
      </RouterLink>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="text-gray-700 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex md:items-center">
        <RouterLink class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors" to="/">Home</RouterLink>
        
        <template v-if="isAuthenticated">
          <div class="relative ml-4">
            <div class="group relative">
              <button class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2 flex items-center justify-center">
                  <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-sm font-medium">
                    {{ user?.firstName?.charAt(0) || 'U' }}
                  </span>
                </div>
                <span>{{ user?.firstName || 'User' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block cursor-pointer">
                <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/profile">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </RouterLink>
                <div class="border-t border-gray-100"></div>
                <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors" to="/login">Login</RouterLink>
          <RouterLink class="ml-2 px-5 py-2 text-white rounded-md hover:bg-blue-600 transition-colors" 
                    style="background-color: var(--color-primary)" 
                    to="/register">Register</RouterLink>
        </template>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div v-show="isMenuOpen" class="md:hidden mt-4 pb-4 bg-white">
      <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/">Home</RouterLink>
      
      <template v-if="isAuthenticated">
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/profile">Profile</RouterLink>
        <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
      </template>
      <template v-else>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/login">Login</RouterLink>
        <RouterLink class="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/register">Register</RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 0.8rem 1rem;
  margin-bottom: 2rem;
}

.navbar-brand {
  font-weight: 600;
}

.brand-icon {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.brand-text {
  font-size: 1.3rem;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  font-weight: 500;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  transition: var(--transition);
}

.nav-link:hover, 
.nav-link:focus {
  color: var(--primary-color);
}

.avatar-wrapper {
  position: relative;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-color);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 600;
}

.dropdown-menu {
  border: none;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.dropdown-item {
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: var(--transition);
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
}

.dropdown-divider {
  margin: 0.5rem 0;
}

.btn-sm {
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style> 