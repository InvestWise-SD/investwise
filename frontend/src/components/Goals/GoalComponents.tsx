'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Plus, Trash2, TrendingUp, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

// Goal Card
interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string
  category: string
}

interface GoalCardProps {
  goal: Goal
  onContribute: (goalId: string, amount: number) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onContribute, onDelete }: GoalCardProps) {
  const [contributionAmount, setContributionAmount] = useState('')
  const progress = Math.min(100, (goal.current_amount / goal.target_amount) * 100)
  const isComplete = progress >= 100

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount)
    if (amount > 0) {
      onContribute(goal.id, amount)
      setContributionAmount('')
    }
  }

  const categoryIcons: Record<string, string> = {
    emergency_fund: '🛡️',
    retirement: '🏖️',
    house: '🏠',
    education: '📚',
    vacation: '✈️',
    car: '🚗',
    debt_payoff: '💳',
    other: '🎯',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'card relative overflow-hidden',
        isComplete && 'ring-2 ring-primary-500/20'
      )}
    >
      {isComplete && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-6 h-6 text-primary-500" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="text-3xl">{categoryIcons[goal.category] || '🎯'}</div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{goal.name}</h3>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">
                ${goal.current_amount.toLocaleString()} of ${goal.target_amount.toLocaleString()}
              </span>
              <span className="font-medium text-primary-600">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {goal.target_date && (
            <p className="text-xs text-slate-500 mt-2">
              Target: {new Date(goal.target_date).toLocaleDateString()}
            </p>
          )}

          {/* Contribution input */}
          {!isComplete && (
            <div className="flex gap-2 mt-4">
              <input
                type="number"
                placeholder="Add $"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="input py-2 px-3 text-sm flex-1"
              />
              <button
                onClick={handleContribute}
                disabled={!contributionAmount}
                className="btn-primary py-2 px-3 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Goals Summary
interface GoalsSummaryProps {
  totalGoals: number
  completedGoals: number
  totalSaved: number
  totalTarget: number
  overallProgress: number
}

export function GoalsSummary({
  totalGoals,
  completedGoals,
  totalSaved,
  totalTarget,
  overallProgress,
}: GoalsSummaryProps) {
  return (
    <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Target className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Your Goals</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-primary-100 text-sm">Total Saved</p>
          <p className="text-2xl font-bold">${totalSaved.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-primary-100 text-sm">Target</p>
          <p className="text-2xl font-bold">${totalTarget.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-primary-100">Overall Progress</span>
          <span className="font-medium">{overallProgress.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-primary-100">
        <TrendingUp className="w-4 h-4" />
        <span>
          {completedGoals} of {totalGoals} goals completed
        </span>
      </div>
    </div>
  )
}

// Create Goal Form
interface CreateGoalFormProps {
  onSubmit: (goal: {
    name: string
    target_amount: number
    category: string
    target_date?: string
  }) => void
  onCancel: () => void
}

export function CreateGoalForm({ onSubmit, onCancel }: CreateGoalFormProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [category, setCategory] = useState('other')
  const [targetDate, setTargetDate] = useState('')

  const categories = [
    { value: 'emergency_fund', label: '🛡️ Emergency Fund' },
    { value: 'retirement', label: '🏖️ Retirement' },
    { value: 'house', label: '🏠 House' },
    { value: 'education', label: '📚 Education' },
    { value: 'vacation', label: '✈️ Vacation' },
    { value: 'car', label: '🚗 Car' },
    { value: 'debt_payoff', label: '💳 Debt Payoff' },
    { value: 'other', label: '🎯 Other' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && targetAmount) {
      onSubmit({
        name,
        target_amount: parseFloat(targetAmount),
        category,
        target_date: targetDate || undefined,
      })
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Create New Goal 🎯
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Trip to Japan"
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Amount ($)
          </label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="5000"
            className="input"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target Date (optional)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="btn-primary flex-1">
          Create Goal
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </motion.form>
  )
}
