<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize authentication state
  authStore.initAuth()
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="container flex-grow py-8">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer class="bg-white shadow-md py-4 mt-8">
      <div class="container text-center text-gray-500">
        <span>© {{ new Date().getFullYear() }} Auth System. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<style>
/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
