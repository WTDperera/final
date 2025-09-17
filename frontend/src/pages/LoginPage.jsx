import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, ShieldCheck, Sparkles, LogIn } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useAuth } from '../hooks/useStore'

const LoginPage = ({ onNavigate }) => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    try {
      const success = await login(formData)
      if (success) {
        onNavigate('dashboard')
      }
    } catch (error) {
      // Error is handled by the store, but we can add additional handling here if needed
      console.error('Login error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
                <span className="text-sm">AI-powered receipt scanning</span>
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-4xl font-extrabold leading-tight text-transparent">
                Welcome to SnapCart
              </h1>
              <p className="mb-6 text-sm leading-6 text-indigo-100/80">
                Scan, organize, and analyze your receipts effortlessly. Turn your daily purchases into powerful insights with a streamlined experience.
              </p>
              <div className="mt-6 flex items-center space-x-3 text-indigo-100/80">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="text-sm">Secure authentication • Privacy first</span>
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
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Sign in</CardTitle>
                <p className="mt-2 text-sm text-indigo-100/80">Continue to your SnapCart dashboard</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    variant="glass"
                    required
                  />

                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    variant="glass"
                    required
                  />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-indigo-100/80">
                      <input type="checkbox" className="mr-2 rounded border-white/30 bg-transparent" />
                      Remember me
                    </label>
                    <button type="button" className="text-indigo-200 hover:text-white transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    loading={isLoading}
                    disabled={!formData.email || !formData.password}
                  >
                    {isLoading ? 'Signing in…' : 'Sign In'}
                  </Button>

                  <div className="relative py-2 text-center text-xs text-indigo-100/60">
                    <span className="relative bg-white/10 px-2 py-1 rounded-full">or continue with</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button type="button" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors">Google</button>
                    <button type="button" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors">GitHub</button>
                    <button type="button" className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/20 transition-colors">Email</button>
                  </div>

                  <div className="pt-1 text-center text-sm text-indigo-100/80">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('register')}
                      className="font-medium text-white hover:underline"
                    >
                      Sign up
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

export default LoginPage