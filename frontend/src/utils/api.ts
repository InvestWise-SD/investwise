const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: any
  token?: string
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

// Chat API
export const chatApi = {
  sendMessage: (message: string, token: string, context?: string) =>
    api<{
      message: string
      suggestions: string[]
      jargon_detected: Array<{ term: string; explanation: string }>
    }>('/chat/', {
      method: 'POST',
      body: { message, context },
      token,
    }),

  getHistory: (token: string) =>
    api<{ messages: Array<{ role: string; content: string; created_at: string }> }>(
      '/chat/history',
      { token }
    ),

  clearHistory: (token: string) =>
    api<{ message: string }>('/chat/history', { method: 'DELETE', token }),
}

// Goals API
export const goalsApi = {
  getAll: (token: string) =>
    api<{
      total_goals: number
      completed_goals: number
      total_target: number
      total_saved: number
      overall_progress: number
      goals: Array<{
        id: string
        name: string
        target_amount: number
        current_amount: number
        target_date?: string
        category: string
      }>
    }>('/goals/', { token }),

  create: (
    goal: {
      name: string
      target_amount: number
      category: string
      target_date?: string
    },
    token: string
  ) => api<any>('/goals/', { method: 'POST', body: goal, token }),

  update: (goalId: string, data: any, token: string) =>
    api<any>(`/goals/${goalId}`, { method: 'PATCH', body: data, token }),

  delete: (goalId: string, token: string) =>
    api<void>(`/goals/${goalId}`, { method: 'DELETE', token }),

  contribute: (goalId: string, amount: number, token: string) =>
    api<any>(`/goals/${goalId}/contribute?amount=${amount}`, {
      method: 'POST',
      token,
    }),
}

// Risk Assessment API
export const riskApi = {
  getQuestions: () =>
    api<
      Array<{
        id: string
        question: string
        options: Array<{ value: number; label: string }>
        category: string
      }>
    >('/risk/questions'),

  submitAssessment: (answers: Record<string, number>, token: string) =>
    api<{
      score: number
      category: 'conservative' | 'moderate' | 'aggressive'
      description: string
      recommendations: string[]
    }>('/risk/assess', { method: 'POST', body: { answers }, token }),

  getProfile: (token: string) =>
    api<{
      score: number
      category: 'conservative' | 'moderate' | 'aggressive'
      description: string
      recommendations: string[]
    }>('/risk/profile', { token }),
}
