<template>
  <div class="not-found-container text-center">
    <div class="error-code">404</div>
    <h1 class="mb-4">Page Not Found</h1>
    <p class="lead mb-4">The page you are looking for doesn't exist or has been moved.</p>
    <RouterLink to="/" class="btn btn-primary btn-lg">
      Back to Home
    </RouterLink>
  </div>
</template>

<style scoped>
.not-found-container {
  padding: 5rem 0;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #f8f9fa;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
</style> 