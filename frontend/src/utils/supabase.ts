import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface User {
  id: string
  email: string
  display_name?: string
  avatar_url?: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string
  category: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export interface RiskProfile {
  id: string
  user_id: string
  score: number
  category: 'conservative' | 'moderate' | 'aggressive'
  description: string
  recommendations: string[]
  assessed_at: string
}
