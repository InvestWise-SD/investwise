'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

interface RiskQuestion {
  id: string
  question: string
  options: Array<{ value: number; label: string }>
  category: string
}

interface RiskQuizProps {
  questions: RiskQuestion[]
  onComplete: (answers: Record<string, number>) => void
}

export function RiskQuiz({ questions, onComplete }: RiskQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isLastQuestion = currentIndex === questions.length - 1
  const canGoNext = answers[currentQuestion?.id] !== undefined

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (isLastQuestion) onComplete(answers)
    else setCurrentIndex((prev) => prev + 1)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Risk Assessment</h2>
          <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
      </div>

      <div className="h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
        <motion.div className="h-full bg-purple-500 rounded-full" animate={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <h3 className="text-xl font-medium text-slate-900 mb-6">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={clsx(
                  'w-full text-left px-5 py-4 rounded-xl border-2 transition-all',
                  answers[currentQuestion.id] === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))} disabled={currentIndex === 0} className="btn-secondary">
          <ChevronLeft className="w-4 h-4 mr-1" />Back
        </button>
        <button onClick={handleNext} disabled={!canGoNext} className="btn-primary">
          {isLastQuestion ? 'See Results' : 'Next'}<ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

interface RiskProfileProps {
  score: number
  category: 'conservative' | 'moderate' | 'aggressive'
  description: string
  recommendations: string[]
  onRetake: () => void
}

export function RiskProfileResult({ score, category, description, recommendations, onRetake }: RiskProfileProps) {
  const config = {
    conservative: { emoji: '🛡️', title: 'Conservative', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    moderate: { emoji: '⚖️', title: 'Moderate', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
    aggressive: { emoji: '🚀', title: 'Aggressive', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  }[category]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-2xl mx-auto text-center">
      <div className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4', config.bgColor)}>
        <span className="text-xl">{config.emoji}</span>
        <span className={clsx('font-semibold', config.textColor)}>{config.title} Investor (Score: {score}/10)</span>
      </div>
      <p className="text-slate-600 mb-6">{description}</p>
      <div className="text-left bg-slate-50 rounded-xl p-6 mb-6">
        <h4 className="font-semibold mb-4">💡 Recommendations</h4>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onRetake} className="btn-secondary">Retake Assessment</button>
    </motion.div>
  )
}

export function RiskAssessmentStart({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-xl mx-auto text-center">
      <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-3">Discover Your Risk Profile</h2>
      <p className="text-slate-600 mb-6">Answer 5 quick questions to understand your investment style.</p>
      <button onClick={onStart} className="btn-primary">Start Assessment<ChevronRight className="w-4 h-4 ml-1" /></button>
    </motion.div>
  )
}
