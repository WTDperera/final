import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowLeft, UserPlus, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useAuth } from '../hooks/useStore'

const RegisterPage = ({ onNavigate }) => {
  const { register, isLoading, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  // Password strength meter
  const passwordStrength = useMemo(() => {
    const pwd = formData.password || ''
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const levels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent']
    return { score, label: levels[score] }
  }, [formData.password])

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    clearError()
    setErrors({})

    try {
      // Only send the fields that the backend expects
      const { confirmPassword: _, ...registrationData } = formData
      const success = await register(registrationData)
      if (success) {
        onNavigate('dashboard')
      }
    } catch (error) {
      if (error.message && error.message.includes('email')) {
        setErrors({ email: error.message })
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' })
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation for better UX
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }))
      }
    } else if (name === 'confirmPassword' && value && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }))
      }
    } else if (errors[name]) {
      // Clear other errors when user starts typing
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl animate-float" />
        <div className="absolute bottom-[-60px] right-[-60px] h-[26rem] w-[26rem] rounded-full bg-blue-500/20 blur-3xl animate-float-delayed" />
      </div>

  <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        {/* Left/branding panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="hidden flex-1 items-center justify-center p-8 md:flex"
        >
          <div className="relative w-full max-w-xl">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 opacity-40 blur-2xl" />
            <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-purple-500 opacity-30 blur-2xl" />

            <div className="glass-strong relative rounded-3xl p-10">
              <div className="mb-6 inline-flex items-center space-x-3 rounded-full bg-white/10 px-4 py-2 text-white">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Get started in under a minute</span>
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-4xl font-extrabold leading-tight text-transparent">
                Create your SnapCart account
              </h1>
              <p className="mb-6 text-sm leading-6 text-indigo-100/80">
                Track your spending, upload receipts, and unlock insights with AI-powered parsing and analytics.
              </p>
              <div className="mt-6 flex items-center space-x-3 text-indigo-100/80">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Your data is encrypted and protected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right/form panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="flex min-h-screen flex-1 items-center justify-center p-6 md:p-10"
        >
          <div className="relative z-20 w-full max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('landing')}
              className="absolute -top-2 -left-2 text-white/80 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="ml-2">Back</span>
            </Button>

            <Card variant="glass" className="glass-strong border-white/10 bg-white/10 shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
                <p className="mt-2 text-sm text-indigo-100/80">Start your expense tracking journey</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200"
                    >
                      {errors.general}
                    </motion.div>
                  )}

                  <Input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={User}
                    variant="glass"
                    error={errors.name}
                    required
                  />

                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    variant="glass"
                    error={errors.email}
                    required
                  />

                  <div className="space-y-2">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      icon={Lock}
                      variant="glass"
                      error={errors.password}
                      required
                    />
                    {/* Strength meter */}
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.score <= 1
                              ? 'w-1/5 bg-red-400'
                              : passwordStrength.score === 2
                              ? 'w-2/5 bg-orange-400'
                              : passwordStrength.score === 3
                              ? 'w-3/5 bg-yellow-400'
                              : passwordStrength.score === 4
                              ? 'w-4/5 bg-emerald-400'
                              : 'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-indigo-100/80">Strength: {passwordStrength.label}</p>
                    </div>
                  </div>

                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={Lock}
                    variant="glass"
                    error={errors.confirmPassword}
                    required
                  />

                  <div className="flex items-start gap-3 pt-2 text-indigo-100/80">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-white/30 bg-transparent"
                      required
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <button type="button" className="text-white hover:underline">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-white hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <Button type="submit" className="w-full" loading={isLoading}>
                    {isLoading ? 'Creating Account…' : 'Create Account'}
                  </Button>

                  <div className="pt-1 text-center text-sm text-indigo-100/80">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('login')}
                      className="font-medium text-white hover:underline"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage