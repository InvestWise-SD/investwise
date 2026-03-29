'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import { useChat } from '@/hooks/useChat'
import { Layout } from '@/components/Layout'
import {
  ChatContainer,
  ChatHeader,
  ChatMessages,
  ChatInput,
} from '@/components/Chat'

interface ChatPageProps {
  user: any
  loading: boolean
}

export default function ChatPage({ user, loading }: ChatPageProps) {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Get session token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token)
      }
    })
  }, [user])

  const { messages, isLoading, suggestions, sendMessage, clearChat } = useChat({
    token,
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto">
        <ChatContainer>
          <ChatHeader onClear={clearChat} />
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            suggestions={suggestions}
          />
        </ChatContainer>
      </div>
    </Layout>
  )
}
