import { useState, useRef, useEffect } from 'react'
import type { ThemeSettings } from '../utils/settings'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  settings: ThemeSettings
}

export default function ChatInput({ onSend, isLoading, settings }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (settings.sendOnEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <div className="relative bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] focus-within:border-[var(--primary)] transition-colors shadow-lg shadow-black/20">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Nexus AI..."
          rows={1}
          className="w-full bg-transparent text-white placeholder-[#666] px-5 py-4 pr-14 resize-none outline-none"
          style={{ fontSize: 'var(--chat-font-size, 16px)' }}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'text-white hover:scale-110'
                : 'text-[#555] cursor-not-allowed'
            }`}
            style={input.trim() && !isLoading ? { background: 'var(--primary, #7c3aed)' } : {}}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <p className="text-center text-[11px] text-[#555] mt-2">Nexus AI can make mistakes. Check important info.</p>
    </div>
  )
}
