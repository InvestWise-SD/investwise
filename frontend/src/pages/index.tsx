'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  MessageCircle,
  Target,
  Shield,
  ChevronRight,
  Check,
  ArrowRight,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">InvestWise</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                Log in
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Investment Education
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Investing made
              <span className="text-primary-600"> simple</span>
              <br />
              for everyone
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Stop feeling intimidated by investing jargon. Our AI chatbot explains 
              everything in plain English and helps you build confidence to start your 
              investment journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-4">
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Demo Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">InvestWise</p>
                  <p className="text-sm text-slate-500">Your friendly investing guide</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-primary-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                    What's an ETF?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md px-4 py-3 max-w-md">
                    <p>
                      Think of an ETF like a <strong>sampler platter</strong> at a restaurant! 🍽️
                    </p>
                    <p className="mt-2">
                      Instead of buying one stock, you get a basket of many stocks in one 
                      purchase. It's a simple way to diversify without picking individual 
                      companies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to start investing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              No confusing jargon. No intimidating charts. Just friendly guidance 
              tailored to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'AI Chat Assistant',
                description:
                  'Ask anything about investing in plain English. No question is too basic.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Target,
                title: 'Goal Tracking',
                description:
                  'Set and track your financial goals. See your progress and stay motivated.',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description:
                  'Discover your investment style with a quick quiz. Get personalized advice.',
                color: 'from-amber-500 to-amber-600',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Why 81% of people avoid investing
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Investment platforms focus on products and jargon instead of your goals. 
                The result? People feel overwhelmed and intimidated before they even start.
              </p>

              <ul className="space-y-4">
                {[
                  'Confusing financial jargon',
                  'Information overload',
                  'Fear of making mistakes',
                  'No personalized guidance',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-500">✕</span>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">InvestWise is different</h3>
              <ul className="space-y-4">
                {[
                  'Plain English explanations',
                  'Personalized to your goals',
                  'Learn at your own pace',
                  'AI that never judges your questions',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to demystify investing?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of people learning to invest with confidence.
            It's completely free.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-8 py-4">
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">InvestWise</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} InvestWise. Making investing less scary.
          </p>
        </div>
      </footer>
    </div>
  )
}
