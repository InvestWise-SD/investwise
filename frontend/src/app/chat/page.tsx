'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { ChatContainer, ChatHeader, ChatMessages, ChatInput } from '@/components/Chat'
import { supabase } from '@/utils/supabase'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { messages, isLoading: chatLoading, suggestions, sendMessage, clearChat } = useChat({ token })

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        setToken(session.access_token)
      } else {
        // For demo: create anonymous session or redirect to login
        // For now, we'll use a demo token
        setToken('demo-token')
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">Chat with InvestWise</h1>
        </div>
      </header>

      {/* Chat */}
      <div className="max-w-4xl mx-auto p-4">
        <ChatContainer>
          <ChatHeader onClear={clearChat} />
          <ChatMessages messages={messages} isLoading={chatLoading} />
          <ChatInput onSend={sendMessage} isLoading={chatLoading} suggestions={suggestions} />
        </ChatContainer>
      </div>
    </div>
  )
}
