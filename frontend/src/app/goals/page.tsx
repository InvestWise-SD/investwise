'use client'

import { useState, useEffect } from 'react'
import { GoalCard, GoalsSummary, CreateGoalForm } from '@/components/Goals'
import { goalsApi } from '@/utils/api'
import { supabase } from '@/utils/supabase'
import { ArrowLeft, Plus } from 'lucide-react'
import Link from 'next/link'

interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string
  category: string
}

export default function GoalsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [summary, setSummary] = useState({
    total_goals: 0,
    completed_goals: 0,
    total_saved: 0,
    total_target: 0,
    overall_progress: 0,
  })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token || 'demo-token'
      setToken(accessToken)
      await loadGoals(accessToken)
      setIsLoading(false)
    }
    init()
  }, [])

  const loadGoals = async (accessToken: string) => {
    try {
      const data = await goalsApi.getAll(accessToken)
      setGoals(data.goals)
      setSummary({
        total_goals: data.total_goals,
        completed_goals: data.completed_goals,
        total_saved: data.total_saved,
        total_target: data.total_target,
        overall_progress: data.overall_progress,
      })
    } catch (err) {
      console.error('Failed to load goals:', err)
    }
  }

  const handleCreateGoal = async (goal: { name: string; target_amount: number; category: string; target_date?: string }) => {
    if (!token) return
    try {
      await goalsApi.create(goal, token)
      await loadGoals(token)
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create goal:', err)
    }
  }

  const handleContribute = async (goalId: string, amount: number) => {
    if (!token) return
    try {
      await goalsApi.contribute(goalId, amount, token)
      await loadGoals(token)
    } catch (err) {
      console.error('Failed to contribute:', err)
    }
  }

  const handleDelete = async (goalId: string) => {
    if (!token) return
    if (!confirm('Are you sure you want to delete this goal?')) return
    try {
      await goalsApi.delete(goalId, token)
      await loadGoals(token)
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">Your Goals</h1>
          </div>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary py-2 px-4">
            <Plus className="w-4 h-4 mr-1" /> New Goal
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <GoalsSummary {...summary} />

        {showCreateForm && (
          <CreateGoalForm onSubmit={handleCreateGoal} onCancel={() => setShowCreateForm(false)} />
        )}

        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onContribute={handleContribute} onDelete={handleDelete} />
          ))}
          {goals.length === 0 && !showCreateForm && (
            <div className="card text-center py-12">
              <p className="text-slate-500 mb-4">No goals yet. Create your first goal!</p>
              <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                <Plus className="w-4 h-4 mr-1" /> Create Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
