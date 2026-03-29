import { useState, useCallback, useEffect } from 'react'
import { chatApi } from '@/utils/api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  jargon?: Array<{ term: string; explanation: string }>
}

interface UseChatOptions {
  token: string | null
}

export function useChat({ token }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Load chat history on mount
  useEffect(() => {
    if (token) {
      loadHistory()
    }
  }, [token])

  const loadHistory = async () => {
    if (!token) return

    try {
      const { messages: history } = await chatApi.getHistory(token)
      setMessages(
        history.map((msg, i) => ({
          id: `history-${i}`,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }))
      )
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  const sendMessage = useCallback(
    async (content: string, context?: string) => {
      if (!token || !content.trim()) return

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await chatApi.sendMessage(content, token, context)

        // Add assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          jargon: response.jargon_detected,
        }
        setMessages((prev) => [...prev, assistantMessage])
        setSuggestions(response.suggestions)
      } catch (err: any) {
        setError(err.message || 'Failed to send message')
        // Remove the user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
      } finally {
        setIsLoading(false)
      }
    },
    [token]
  )

  const clearChat = useCallback(async () => {
    if (!token) return

    try {
      await chatApi.clearHistory(token)
      setMessages([])
      setSuggestions([])
    } catch (err: any) {
      setError(err.message || 'Failed to clear chat')
    }
  }, [token])

  return {
    messages,
    isLoading,
    error,
    suggestions,
    sendMessage,
    clearChat,
  }
}
