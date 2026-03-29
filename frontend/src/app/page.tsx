'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Target, Shield, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-30" />
        
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Investment Education
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Investing made
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"> simple</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              No confusing jargon. No intimidating charts. Just friendly guidance 
              that helps you understand investing at your own pace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat" className="btn-primary text-lg px-8 py-4">
                Start Chatting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/risk" className="btn-secondary text-lg px-8 py-4">
                Take Risk Quiz
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to start
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              InvestWise combines AI-powered conversations with practical tools
              to help you build confidence in investing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'AI Chat Assistant',
                description: 'Ask any question and get clear, jargon-free explanations. No question is too basic!',
                color: 'primary',
                href: '/chat',
              },
              {
                icon: Target,
                title: 'Goal Tracking',
                description: 'Set financial goals and track your progress. See your savings grow over time.',
                color: 'accent',
                href: '/goals',
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Discover your investment style with a quick quiz. Get personalized recommendations.',
                color: 'purple',
                href: '/risk',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={feature.href} className="card block h-full hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '81.5%', label: 'Feel intimidated by investing' },
              { value: '100%', label: 'Free to use' },
              { value: '24/7', label: 'AI assistance available' },
              { value: '5 min', label: 'To complete risk quiz' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your investing journey?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Join thousands of people learning to invest with confidence.
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
            <TrendingUp className="w-5 h-5" />
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm">
            InvestWise is for educational purposes only. Always consult a financial advisor for personal investment decisions.
          </p>
          <p className="text-sm mt-2">
            Built with ❤️ to make investing less scary
          </p>
        </div>
      </footer>
    </div>
  )
}
