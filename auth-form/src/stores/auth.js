import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'
import { jwtDecode } from 'jwt-decode'

// Create axios instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false, // Set to true if your backend requires cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isVerified: (state) => state.user?.isVerified || false,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    getUser: (state) => state.user
  },
  
  actions: {
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/register', userData)
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        
        // Redirect to home or intended page
        const redirectPath = router.currentRoute.value.query.redirect || '/'
        router.push(redirectPath)
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return
      
      this.loading = true
      
      try {
        const response = await api.get('/users/me')
        this.user = response.data.user
        return this.user
      } catch (error) {
        console.error('Fetch user error:', error)
        // Token might be expired or invalid
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async forgotPassword(email) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to send password reset email'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async resetPassword(password, token, userId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post(`/auth/reset-password?token=${token}&userId=${userId}`, {
          password,
          confirmPassword: password
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Password reset failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async verifyEmail(token, userId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.get(`/auth/verify-email?token=${token}&userId=${userId}`)
        
        // If user is logged in, update the user object
        if (this.user) {
          this.user.isVerified = true
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Email verification failed'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateProfile(profileData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('API Request - Profile Data:', JSON.stringify(profileData))
        const response = await api.put('/users/profile', profileData)
        
        // Update local user data
        this.user = response.data.user
        console.log('API Response - Updated User:', JSON.stringify(this.user))
        return response.data
      } catch (error) {
        console.error('Update profile error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async changePassword(passwordData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.put('/users/change-password', passwordData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to change password'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async uploadAvatar(formData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.post('/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        // Update user with new avatar
        if (response.data.user) {
          this.user = response.data.user
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to upload avatar'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async handleGoogleCallback(token) {
      this.token = token
      localStorage.setItem('token', token)
      
      // Fetch user info
      await this.fetchCurrentUser()
      
      // Redirect to home
      router.push('/')
    },
    
    async logout() {
      try {
        // Optional: Call to backend logout endpoint if needed
        // await api.post('/auth/logout')
        
        // Clear user data
        this.token = null
        this.user = null
        
        // Remove from local storage
        localStorage.removeItem('token')
        
        router.push('/login')
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },
    
    checkTokenExpiration() {
      if (!this.token) return
      
      try {
        const decoded = jwtDecode(this.token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp < currentTime) {
          // Token has expired
          this.logout()
        }
      } catch (error) {
        console.error('Invalid token', error)
        this.logout()
      }
    },
    
    initAuth() {
      // Check if token exists and is valid
      if (this.token) {
        this.checkTokenExpiration()
        this.fetchCurrentUser()
      }
    }
  }
})