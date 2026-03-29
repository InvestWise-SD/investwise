'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Lightbulb, Trash2 } from 'lucide-react'
import { Message } from '@/hooks/useChat'
import clsx from 'clsx'

// Chat Container
interface ChatContainerProps {
  children: React.ReactNode
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
      {children}
    </div>
  )
}

// Chat Header
interface ChatHeaderProps {
  onClear: () => void
}

export function ChatHeader({ onClear }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">InvestWise</h2>
          <p className="text-sm text-slate-500">Your friendly investing guide</p>
        </div>
      </div>
      <button
        onClick={onClear}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        title="Clear chat"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

// Chat Messages Area
interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && (
        <WelcomeMessage />
      )}
      
      <AnimatePresence>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </AnimatePresence>

      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  )
}

// Welcome Message
function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Lightbulb className="w-8 h-8 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        Hey there! 👋
      </h3>
      <p className="text-slate-600 max-w-md mx-auto">
        I'm here to help you understand investing without the confusing jargon. 
        Ask me anything - no question is too basic!
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          "What's a stock?",
          "How do I start investing?",
          "What's an ETF?",
        ].map((q) => (
          <span
            key={q}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-full"
          >
            {q}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// Chat Bubble
interface ChatBubbleProps {
  message: Message
}

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={clsx(
          'max-w-[80%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-slate-100 text-slate-800 rounded-bl-md'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {/* Jargon tooltips */}
        {message.jargon && message.jargon.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/50">
            <p className="text-xs text-slate-500 mb-2">📚 Terms explained:</p>
            <div className="space-y-1">
              {message.jargon.map((j) => (
                <div key={j.term} className="text-xs">
                  <span className="font-medium">{j.term}:</span>{' '}
                  <span className="text-slate-600">{j.explanation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Typing Indicator
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 bg-slate-400 rounded-full" />
          <span className="w-2 h-2 bg-slate-400 rounded-full" />
          <span className="w-2 h-2 bg-slate-400 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}

// Chat Input
interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  suggestions?: string[]
}

export function ChatInput({ onSend, isLoading, suggestions = [] }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSend(input)
      setInput('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSend(suggestion)
    }
  }

  return (
    <div className="border-t border-slate-100 p-4">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestionClick(s)}
              disabled={isLoading}
              className="flex-shrink-0 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full hover:bg-primary-100 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about investing..."
          className="input flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary px-4"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}
