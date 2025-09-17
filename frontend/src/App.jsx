import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import Dashboard from './pages/Dashboard'
import { useAuth } from './hooks/useStore'

function App() {
  // Initialize view based on authentication status and localStorage
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      // Prefer URL hash for deep-link/back support; fallback to localStorage
      const hash = window.location.hash?.replace('#', '')
      const savedView = localStorage.getItem('currentView')
      const token = localStorage.getItem('token')

      const allowed = ['landing', 'login', 'register', 'dashboard', 'upload']
      const candidate = hash && allowed.includes(hash) ? hash : savedView

      if (token && candidate === 'dashboard') return 'dashboard'
      if (candidate && allowed.includes(candidate)) return candidate
    }
    return 'landing'
  }
  
  const [currentView, setCurrentView] = useState(getInitialView())
  const { isAuthenticated, initializeAuth, user } = useAuth()
  
  // Enhanced navigation function with localStorage persistence
  const handleNavigation = (view) => {
    setCurrentView(view)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentView', view)
      // Update URL hash and push history state for back/forward support
      const newHash = `#${view}`
      if (window.location.hash !== newHash) {
        history.pushState({ view }, '', newHash)
      }
    }
  }

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isAuthenticated && user) {
      handleNavigation('dashboard')
    } else if (!isAuthenticated && currentView !== 'landing' && currentView !== 'login' && currentView !== 'register') {
      handleNavigation('landing')
    }
  }, [isAuthenticated, user, currentView])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const stateView = event.state?.view
      const hashView = window.location.hash?.replace('#', '')
      const nextView = stateView || hashView || 'landing'
      // If unauthenticated and trying to reach protected view, send to landing
      if (!isAuthenticated && ['dashboard', 'upload'].includes(nextView)) {
        setCurrentView('landing')
        return
      }
      setCurrentView(nextView)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isAuthenticated])

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <LandingPage 
            key="landing" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'login' && (
          <LoginPage 
            key="login" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'register' && (
          <RegisterPage 
            key="register" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'dashboard' && (
          <Dashboard 
            key="dashboard" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'upload' && (
          <UploadPage 
            key="upload" 
            onNavigate={handleNavigation}
          />
        )}
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App
