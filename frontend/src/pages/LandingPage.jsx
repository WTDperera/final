import { motion } from 'framer-motion'
import {
  Camera,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

const LandingPage = ({ onNavigate }) => {
  const features = [
    {
      icon: Zap,
      title: "Instant Scanning",
      description: "AI-powered OCR extracts data from receipts in seconds",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Beautiful insights into your spending patterns and trends",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and stored with bank-level security",
      color: "from-purple-400 to-pink-500"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "SnapCart has revolutionized how I track my business expenses. The OCR is incredibly accurate!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Freelancer",
      content: "I love the analytics dashboard. It helps me understand my spending patterns like never before.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Student",
      content: "Perfect for tracking my monthly budget. The interface is so intuitive and beautiful.",
      rating: 5
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl animate-float" />
        <div className="absolute bottom-[-60px] right-[-60px] h-[26rem] w-[26rem] rounded-full bg-blue-500/20 blur-3xl animate-float-delayed" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SnapCart</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button onClick={() => onNavigate('login')} variant="ghost" className="text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button onClick={() => onNavigate('register')} variant="primary">
              Get Started
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-white to-indigo-200 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-7xl"
          >
            Scan receipts. Track spending. Gain clarity.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-indigo-100/90"
          >
            AI-powered OCR and smart analytics—turn everyday purchases into actionable insights with zero effort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button onClick={() => onNavigate('upload')} size="lg" className="text-white group">
              <Camera className="h-5 w-5 transition-transform group-hover:rotate-6" />
              Start Scanning
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              View Demo
            </Button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-6 text-indigo-100/70"
          >
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Secure by design</div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Privacy first</div>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Blazing fast</div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="card-glass group text-center"
            >
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.color} group-hover:rotate-3 transition-transform`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-indigo-100/90">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center text-3xl font-bold text-white md:text-4xl"
        >
          Loved by people who care about their money
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} variant="glass" className="h-full text-center">
              <CardContent>
                <div className="mb-3 flex justify-center">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-indigo-100/90">"{t.content}"</p>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-indigo-200/80">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass mx-auto max-w-3xl p-8"
        >
          <h3 className="mb-3 text-3xl font-bold text-white">Ready to get started?</h3>
          <p className="mx-auto mb-6 max-w-2xl text-indigo-100/90">
            Join thousands who are already tracking expenses the smart way.
          </p>
          <Button onClick={() => onNavigate('register')} size="lg" className="text-white">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage