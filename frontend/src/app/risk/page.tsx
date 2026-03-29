'use client'

import { useState, useEffect } from 'react'
import { RiskQuiz, RiskProfileResult, RiskAssessmentStart } from '@/components/Risk'
import { riskApi } from '@/utils/api'
import { supabase } from '@/utils/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Stage = 'start' | 'quiz' | 'result'

interface RiskQuestion {
  id: string
  question: string
  options: Array<{ value: number; label: string }>
  category: string
}

interface RiskProfile {
  score: number
  category: 'conservative' | 'moderate' | 'aggressive'
  description: string
  recommendations: string[]
}

export default function RiskPage() {
  const [token, setToken] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('start')
  const [questions, setQuestions] = useState<RiskQuestion[]>([])
  const [profile, setProfile] = useState<RiskProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || 'demo-token'
      setToken(accessToken)

      // Load questions
      const q = await riskApi.getQuestions()
      setQuestions(q)

      // Check for existing profile
      try {
        const existingProfile = await riskApi.getProfile(accessToken)
        setProfile(existingProfile)
        setStage('result')
      } catch {
        // No existing profile
      }

      setIsLoading(false)
    }
    init()
  }, [])

  const handleComplete = async (answers: Record<string, number>) => {
    if (!token) return
    try {
      const result = await riskApi.submitAssessment(answers, token)
      setProfile(result)
      setStage('result')
    } catch (err) {
      console.error('Failed to submit assessment:', err)
    }
  }

  const handleRetake = () => {
    setProfile(null)
    setStage('start')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50/30">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Risk Assessment</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {stage === 'start' && <RiskAssessmentStart onStart={() => setStage('quiz')} />}
        {stage === 'quiz' && <RiskQuiz questions={questions} onComplete={handleComplete} />}
        {stage === 'result' && profile && (
          <RiskProfileResult
            score={profile.score}
            category={profile.category}
            description={profile.description}
            recommendations={profile.recommendations}
            onRetake={handleRetake}
          />
        )}
      </div>
    </div>
  )
}
