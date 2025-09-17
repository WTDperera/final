import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, receiptAPI } from '../services/api'

// Auth store
export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authAPI.login(credentials)
          
          if (response.success && response.data) {
            const { user, accessToken } = response.data
            set({
              user: user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return response
          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error) {
          set({
            error: error.message || 'Login failed',
            isLoading: false
          })
          throw error
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authAPI.register(userData)
          
          if (response.success && response.data) {
            const { user, accessToken } = response.data
            set({
              user: user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
            return response
          } else {
            throw new Error(response.message || 'Registration failed')
          }
        } catch (error) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
          })
        }
      },

      updateProfile: async (userData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authAPI.updateProfile(userData)
          
          if (response.success && response.data?.user) {
            set({
              user: response.data.user,
              isLoading: false,
              error: null
            })
            return response
          } else {
            throw new Error(response.message || 'Profile update failed')
          }
        } catch (error) {
          set({
            error: error.message || 'Profile update failed',
            isLoading: false
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          try {
            set({
              token,
              user: JSON.parse(user),
              isAuthenticated: true
            })
          } catch (error) {
            console.error('Failed to parse user data:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Receipt store
export const useReceiptStore = create((set, get) => ({
  // State
  receipts: [],
  currentReceipt: null,
  analytics: null,
  isLoading: false,
  error: null,
  uploadProgress: 0,

  // Actions
  uploadReceipt: async (file) => {
    try {
      set({ isLoading: true, error: null, uploadProgress: 0 })
      
      const formData = new FormData()
      formData.append('receipt', file)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        set(state => ({ 
          uploadProgress: Math.min(state.uploadProgress + 10, 90) 
        }))
      }, 200)
      
      const response = await receiptAPI.uploadReceipt(formData)
      
      clearInterval(progressInterval)
      set({ uploadProgress: 100 })
      
      if (response.success && response.data) {
        // Add new receipt to the list
        const currentReceipts = get().receipts
        set({
          receipts: [response.data, ...currentReceipts],
          currentReceipt: response.data,
          isLoading: false,
          error: null,
          uploadProgress: 0
        })
      }
      
      return response
    } catch (error) {
      set({
        error: error.message || 'Upload failed',
        isLoading: false,
        uploadProgress: 0
      })
      throw error
    }
  },

  fetchReceipts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null })
      const response = await receiptAPI.getReceipts(params)
      set({
        receipts: response.success ? response.data : [],
        isLoading: false,
        error: null
      })
      return response
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch receipts',
        isLoading: false
      })
      throw error
    }
  },

  fetchReceipt: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const response = await receiptAPI.getReceipt(id)
      set({
        currentReceipt: response?.data || null,
        isLoading: false,
        error: null
      })
      return response
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch receipt',
        isLoading: false
      })
      throw error
    }
  },

  updateReceipt: async (id, updateData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await receiptAPI.updateReceipt(id, updateData)
      
      // Update receipt in the list
      const currentReceipts = get().receipts
      const updatedReceipts = currentReceipts.map(receipt => 
        receipt._id === id ? (response?.data || receipt) : receipt
      )
      
      set({
        receipts: updatedReceipts,
        currentReceipt: response?.data || null,
        isLoading: false,
        error: null
      })
      
      return response
    } catch (error) {
      set({
        error: error.message || 'Failed to update receipt',
        isLoading: false
      })
      throw error
    }
  },

  deleteReceipt: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await receiptAPI.deleteReceipt(id)
      
      // Remove receipt from the list
      const currentReceipts = get().receipts
      const updatedReceipts = currentReceipts.filter(receipt => receipt._id !== id)
      
      set({
        receipts: updatedReceipts,
        currentReceipt: null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      set({
        error: error.message || 'Failed to delete receipt',
        isLoading: false
      })
      throw error
    }
  },

  fetchAnalytics: async (params = {}) => {
    try {
      set({ isLoading: true, error: null })
      const response = await receiptAPI.getAnalytics(params)
      set({
        analytics: response?.data || null,
        isLoading: false,
        error: null
      })
      return response
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch analytics',
        isLoading: false
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentReceipt: () => set({ currentReceipt: null })
}))

// UI store for global UI state
export const useUIStore = create((set) => ({
  // State
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  loading: false,

  // Actions
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  addNotification: (notification) => set(state => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      ...notification
    }]
  })),
  
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
  setLoading: (loading) => set({ loading })
}))